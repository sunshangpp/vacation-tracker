import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';

// Helper to run promises with a concurrency limit
async function fetchInBatches<T, R>(
  items: T[],
  batchSize: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(worker));
    results.push(...batchResults);
  }
  return results;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Authenticate the Cron request in production
  const authHeader = req.headers.authorization;
  const isProd = process.env.NODE_ENV === 'production';
  const queryKey = req.query.key;
  
  if (isProd && authHeader !== `Bearer ${process.env.CRON_SECRET}` && (!queryKey || queryKey !== process.env.SERPAPI_KEY)) {
    return res.status(401).json({ 
      error: 'Unauthorized cron trigger. Pass your SerpApi key as a query parameter (?key=YOUR_KEY) to trigger manually in the browser.' 
    });
  }

  try {
    // 2. Load destinations config
    const configPath = path.join(process.cwd(), 'config', 'destinations.json');
    if (!fs.existsSync(configPath)) {
      return res.status(500).json({ error: 'destinations.json not found' });
    }
    const destinations = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const serpApiKey = process.env.SERPAPI_KEY;
    const allResults: Record<string, any> = {};

    // 3. For each destination, compile the date queries
    for (const dest of destinations) {
      const { from, to, name, nights, granularity } = dest;
      const keyName = `${from}-${to}-${nights}`;

      // Generate dates for the next 6 months
      const dates: string[] = [];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 6);

      let currentDate = new Date(startDate);
      // Determine step days based on granularity
      const stepDays = granularity === 'daily' ? 1 : granularity === 'twice-weekly' ? 3 : 7;

      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + stepDays);
      }

      console.log(`Scheduling ${dates.length} date checks for ${from} -> ${to} (${nights} nights)`);

      // Define our query worker for a single date
      const queryWorker = async (outboundDateStr: string) => {
        // Calculate return date
        const outboundDate = new Date(outboundDateStr);
        const returnDate = new Date(outboundDate);
        returnDate.setDate(returnDate.getDate() + nights);
        const returnDateStr = returnDate.toISOString().split('T')[0];

        // Default fallback mock price based on seasonality (sine wave)
        const dateObj = new Date(outboundDateStr);
        const dayOfYear = (dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24);
        // Peak price in summer (July - Day 180) and winter holidays (December - Day 350)
        const seasonality = Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 150 + Math.sin((dayOfYear - 330) * 2 * Math.PI / 365) * 80;
        const randomFactor = Math.floor(Math.random() * 40) - 20; // -20 to +20
        const distanceMultiplier = to === 'NRT' ? 950 : to === 'CDG' ? 650 : 450;
        const mockPrice = Math.round(distanceMultiplier + seasonality + randomFactor);

        if (!serpApiKey) {
          return {
            date: outboundDateStr,
            returnDate: returnDateStr,
            price: mockPrice,
            isMock: true,
            link: `https://www.google.com/travel/flights?q=Flights%20to%20${to}%20from%20${from}%20on%20${outboundDateStr}%20through%20${returnDateStr}`
          };
        }

        try {
          const response = await axios.get('https://serpapi.com/search.json', {
            params: {
              engine: 'google_flights',
              departure_id: from,
              arrival_id: to,
              outbound_date: outboundDateStr,
              return_date: returnDateStr,
              currency: 'USD',
              api_key: serpApiKey,
            },
            timeout: 5000 // 5 second timeout per call
          });

          let price = null;
          let flightLink = `https://www.google.com/travel/flights?q=Flights%20to%20${to}%20from%20${from}%20on%20${outboundDateStr}%20through%20${returnDateStr}`;

          if (response.data.best_flights && response.data.best_flights.length > 0) {
            price = response.data.best_flights[0].price;
          } else if (response.data.other_flights && response.data.other_flights.length > 0) {
            price = response.data.other_flights[0].price;
          }

          if (response.data.search_metadata && response.data.search_metadata.google_flights_url) {
            flightLink = response.data.search_metadata.google_flights_url;
          }

          const resolvedPrice = typeof price === 'number' ? price : parseInt(String(price || '').replace(/[^0-9]/g, '')) || mockPrice;

          return {
            date: outboundDateStr,
            returnDate: returnDateStr,
            price: resolvedPrice,
            isMock: false,
            link: flightLink
          };
        } catch (err: any) {
          console.error(`SerpApi failed for date ${outboundDateStr}: ${err.message}. Using mock fallback.`);
          return {
            date: outboundDateStr,
            returnDate: returnDateStr,
            price: mockPrice,
            isMock: true,
            link: `https://www.google.com/travel/flights?q=Flights%20to%20${to}%20from%20${from}%20on%20${outboundDateStr}%20through%20${returnDateStr}`
          };
        }
      };

      // Execute queries in batches of 5 to avoid overloading/timeouts
      const flightPrices = await fetchInBatches(dates, 5, queryWorker);

      // 4. Fetch destination weather recommendations and tourism highlights
      // We will do a simple scrape of wikipedia for the landmarks of the destination
      let highlights: string[] = ['Local museums', 'Historic old town', 'City parks', 'Famous food street'];
      try {
        const wikiRes = await axios.get(`https://en.wikipedia.org/w/api.php`, {
          params: {
            action: 'query',
            list: 'search',
            srsearch: `${name} tourism landmarks`,
            format: 'json',
            origin: '*'
          },
          timeout: 3000
        });
        if (wikiRes.data?.query?.search) {
          highlights = wikiRes.data.query.search.slice(0, 4).map((s: any) => {
            // Strip html tags
            return s.title.replace(/<\/?[^>]+(>|$)/g, "");
          });
        }
      } catch (err) {
        console.error(`Wiki scrape failed for ${name}:`, err);
      }

      allResults[keyName] = {
        destination: name,
        from,
        to,
        nights,
        prices: flightPrices,
        highlights,
        lastUpdated: new Date().toISOString()
      };
    }

    // 5. Store aggregated data in Vercel KV
    // Fallback: If KV credentials are not set (e.g. local testing without KV link), log it.
    let kvSuccess = false;
    if (process.env.KV_REST_API_URL) {
      await kv.set('flight_prices', JSON.stringify(allResults));
      kvSuccess = true;
    }

    return res.status(200).json({
      success: true,
      kvUpdated: kvSuccess,
      data: allResults
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return res.status(500).json({ error: error.message });
  }
}
