import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import * as path from 'path';
import * as fs from 'fs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // 1. Try to fetch from Vercel KV
    let cachedData = null;
    if (process.env.KV_REST_API_URL) {
      cachedData = await kv.get('flight_prices');
    }

    if (cachedData) {
      const parsed = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return res.status(200).json({
        success: true,
        source: 'database',
        data: parsed
      });
    }

    // 2. Fallback: If KV is empty or not configured, generate realistic data on-the-fly
    // This allows the app to be fully functional immediately in local development.
    const configPath = path.join(process.cwd(), 'config', 'destinations.json');
    if (!fs.existsSync(configPath)) {
      return res.status(500).json({ error: 'destinations.json not found' });
    }
    const destinations = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const fallbackData: Record<string, any> = {};

    for (const dest of destinations) {
      const { from, to, name, nights, granularity } = dest;
      const keyName = `${from}-${to}-${nights}`;

      const dates: string[] = [];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 6);

      let currentDate = new Date(startDate);
      const stepDays = granularity === 'daily' ? 1 : granularity === 'twice-weekly' ? 3 : 7;

      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + stepDays);
      }

      const flightPrices = dates.map((outboundDateStr) => {
        const outboundDate = new Date(outboundDateStr);
        const returnDate = new Date(outboundDate);
        returnDate.setDate(returnDate.getDate() + nights);
        const returnDateStr = returnDate.toISOString().split('T')[0];

        // Seasonality wave
        const dayOfYear = (outboundDate.getTime() - new Date(outboundDate.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24);
        const seasonality = Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 150 + Math.sin((dayOfYear - 330) * 2 * Math.PI / 365) * 80;
        const randomFactor = Math.floor(Math.random() * 40) - 20;
        const distanceMultiplier = to === 'NRT' ? 950 : to === 'CDG' ? 650 : 450;
        const mockPrice = Math.round(distanceMultiplier + seasonality + randomFactor);

        return {
          date: outboundDateStr,
          returnDate: returnDateStr,
          price: mockPrice,
          isMock: true,
          link: `https://www.google.com/travel/flights?q=Flights%20to%20${to}%20from%20${from}%20on%20${outboundDateStr}%20through%20${returnDateStr}`
        };
      });

      fallbackData[keyName] = {
        destination: name,
        from,
        to,
        nights,
        prices: flightPrices,
        highlights: [
          `Historic landmarks in ${name}`,
          `Popular shopping districts`,
          `Scenic public parks`,
          `Top-rated local cuisines`
        ],
        lastUpdated: new Date().toISOString(),
        warning: 'Vercel KV database not linked. Displaying simulated travel price data.'
      };
    }

    return res.status(200).json({
      success: true,
      source: 'fallback_simulator',
      data: fallbackData
    });

  } catch (error: any) {
    console.error('Tracker API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
