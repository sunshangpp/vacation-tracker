import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  TrendingDown, 
  ExternalLink, 
  CloudSun, 
  Compass, 
  CheckSquare, 
  RefreshCw, 
  Info, 
  PlaneTakeoff, 
  PlaneLanding, 
  AlertTriangle
} from 'lucide-react';

interface FlightPrice {
  date: string;
  returnDate: string;
  price: number;
  isMock: boolean;
  link: string;
}

interface DestinationDetails {
  destination: string;
  from: string;
  to: string;
  nights: number;
  prices: FlightPrice[];
  highlights: string[];
  lastUpdated: string;
  warning?: string;
}

type DestinationData = Record<string, DestinationDetails>;

export default function App() {
  const [data, setData] = useState<DestinationData | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Local storage for checklist
  const [checkedItems, setCheckedItems] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('vacation_checklists');
    return saved ? JSON.parse(saved) : {};
  });

  // Hover state for chart tooltip
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    x: number;
    y: number;
    price: number;
    date: string;
    returnDate: string;
    link: string;
  } | null>(null);

  // Default packing template
  const defaultPackingList = [
    'Passport & Travel Documents',
    'Universal Power Adapter',
    'Toothbrush & Toiletries',
    'Comfortable Walking Shoes',
    'Local Currency / Credit Cards',
    'Weather-appropriate Clothing',
    'Phone & Laptop Chargers'
  ];

  // Fetch travel details
  const fetchTrackerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/tracker');
      if (!res.ok) {
        throw new Error('API server not responding');
      }
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        const keys = Object.keys(json.data);
        if (keys.length > 0) {
          setSelectedKey(keys[0]);
        }
      } else {
        throw new Error(json.error || 'Failed to retrieve vacation tracking details');
      }
    } catch (err: any) {
      console.warn('Backend API not reachable. Running on frontend simulator mode:', err.message);
      
      // Client-side simulator fallback
      const mockDestinations = [
        { from: "JFK", to: "CDG", name: "Paris", nights: 7 },
        { from: "JFK", to: "NRT", name: "Tokyo", nights: 10 },
        { from: "JFK", to: "LHR", name: "London", nights: 5 }
      ];
      
      const fallbackData: Record<string, any> = {};
      
      for (const dest of mockDestinations) {
        const { from, to, name, nights } = dest;
        const keyName = `${from}-${to}-${nights}`;
        
        const dates: string[] = [];
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 6);
        
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          dates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 7); // weekly
        }
        
        const flightPrices = dates.map((outboundDateStr) => {
          const outboundDate = new Date(outboundDateStr);
          const returnDate = new Date(outboundDate);
          returnDate.setDate(returnDate.getDate() + nights);
          const returnDateStr = returnDate.toISOString().split('T')[0];
          
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
            `Scenic tours and sightseeing spots`,
            `Highly-rated local dining options`,
            `Shopping and main city walks`
          ],
          lastUpdated: new Date().toISOString(),
          warning: 'Running in frontend simulation mode. Local API server is not running.'
        };
      }
      
      setData(fallbackData);
      const keys = Object.keys(fallbackData);
      if (keys.length > 0) {
        setSelectedKey(keys[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData();
  }, []);

  // Update localStorage when checklist changes
  useEffect(() => {
    localStorage.setItem('vacation_checklists', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const activeDest = useMemo(() => {
    if (!data || !selectedKey) return null;
    return data[selectedKey];
  }, [data, selectedKey]);

  // Find the cheapest flight deal
  const cheapestDeal = useMemo(() => {
    if (!activeDest || !activeDest.prices.length) return null;
    return [...activeDest.prices].sort((a, b) => a.price - b.price)[0];
  }, [activeDest]);

  // Find the average price
  const avgPrice = useMemo(() => {
    if (!activeDest || !activeDest.prices.length) return 0;
    const total = activeDest.prices.reduce((sum, p) => sum + p.price, 0);
    return Math.round(total / activeDest.prices.length);
  }, [activeDest]);

  // Handle checking checklist item
  const toggleCheckItem = (item: string) => {
    if (!selectedKey) return;
    const currentList = checkedItems[selectedKey] || [];
    let newList;
    if (currentList.includes(item)) {
      newList = currentList.filter(i => i !== item);
    } else {
      newList = [...currentList, item];
    }
    setCheckedItems({
      ...checkedItems,
      [selectedKey]: newList
    });
  };

  // Programmatic custom SVG Area Chart calculations
  const chartSvg = useMemo(() => {
    if (!activeDest || !activeDest.prices.length) return null;
    
    const prices = activeDest.prices;
    const pricesList = prices.map(p => p.price);
    const maxPrice = Math.max(...pricesList);
    const minPrice = Math.min(...pricesList);
    const priceDiff = maxPrice - minPrice || 1;

    const width = 800;
    const height = 300;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Map each flight price to coordinates
    const points = prices.map((item, index) => {
      const x = paddingLeft + (index / (prices.length - 1)) * chartWidth;
      // Invert Y so higher price is near top
      const y = paddingTop + chartHeight - ((item.price - minPrice) / priceDiff) * chartHeight;
      return { x, y, price: item.price, date: item.date, returnDate: item.returnDate, link: item.link, index };
    });

    // Create SVG path string
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Use bezier curves or clean straight lines
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }

    // Create closed SVG area string
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

    return { points, linePath, areaPath, width, height, minPrice, maxPrice, chartHeight, chartWidth, paddingLeft, paddingTop };
  }, [activeDest]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090f19] text-gray-100 flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
        <p className="text-gray-400 font-medium">Aggregating flight timelines & travel information...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#090f19] text-gray-100 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-white">Initialization Error</h1>
        <p className="text-gray-400 max-w-md">{error || 'Could not load your vacation tracker'}</p>
        <button 
          onClick={fetchTrackerData}
          className="bg-teal-600 hover:bg-teal-500 px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-teal-600/20 transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040811] text-gray-100 font-sans flex flex-col md:flex-row relative">
      
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Sidebar - Destinations List */}
      <aside className="w-full md:w-80 bg-[#070d1a] border-b md:border-b-0 md:border-r border-gray-800/80 p-6 flex flex-col gap-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-white tracking-tight">RoamFlow</h1>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Vacation Tracker</p>
          </div>
        </div>

        <div className="space-y-2 mt-4 flex-grow">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tracked Destinations</p>
          {Object.entries(data).map(([key, dest]) => {
            const isSelected = key === selectedKey;
            const cheapest = [...dest.prices].sort((a, b) => a.price - b.price)[0]?.price || 0;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedKey(key);
                  setHoveredPoint(null);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-1 cursor-pointer ${
                  isSelected 
                    ? 'bg-teal-500/10 border-teal-500/40 shadow-lg shadow-teal-500/5' 
                    : 'bg-gray-950/20 border-gray-800/60 hover:bg-gray-950/40 hover:border-gray-700/60'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-teal-400' : 'text-gray-200'}`}>
                    {dest.destination}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-900 border border-gray-800 text-gray-400">
                    {dest.nights} Nights
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                  <span className="font-mono text-[11px] text-gray-500">
                    {dest.from} ➔ {dest.to}
                  </span>
                  <span>
                    Min: <span className="font-bold text-white font-mono">${cheapest}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[10px] text-gray-600 bg-gray-950/30 p-3 rounded-lg border border-gray-900 text-left">
          <p>🔧 Edit list and duration in <code>config/destinations.json</code> and push updates.</p>
        </div>
      </aside>

      {/* Main Panel */}
      {activeDest && (
        <main className="flex-grow p-6 md:p-10 max-w-6xl mx-auto space-y-8 overflow-y-auto">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-900 pb-6 text-left">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-widest mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Vacation Tracker</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight">
                {activeDest.destination}
              </h2>
            </div>
            
            {/* Quick stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-500">Tracked Window</p>
                <p className="text-sm font-semibold text-white">6 Months</p>
              </div>
              <div className="h-8 w-px bg-gray-800" />
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-500">Stay Length</p>
                <p className="text-sm font-semibold text-white">{activeDest.nights} Nights</p>
              </div>
              <div className="h-8 w-px bg-gray-800" />
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-500">Last Refreshed</p>
                <p className="text-sm font-semibold text-teal-400">
                  {new Date(activeDest.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Warning banner if mock fallback is running */}
          {activeDest.warning && (
            <div className="flex gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs items-start text-left">
              <Info className="w-5 h-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-semibold mb-0.5">Database Not Connected</p>
                <p className="text-amber-400/80">
                  {activeDest.warning} Connect Vercel KV in your production project to enable persistent daily scrapes.
                </p>
              </div>
            </div>
          )}

          {/* Core Dashboard widgets grid */}
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left/Middle Column (Flight Cards & Graph) */}
            <div className="md:col-span-8 space-y-8">
              
              {/* Top Deals Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Best Price Widget */}
                {cheapestDeal && (
                  <div className="glass rounded-2xl p-6 border border-teal-500/20 flex flex-col justify-between text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-all" />
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/5 border border-teal-500/10 px-2 py-0.5 rounded">Cheapest Deal</span>
                        <TrendingDown className="w-4 h-4 text-teal-400" />
                      </div>
                      <div className="flex items-baseline gap-1 mt-4">
                        <span className="text-4xl font-display font-bold text-white">${cheapestDeal.price}</span>
                        <span className="text-xs text-gray-500 font-mono">round-trip</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-800/60 text-xs">
                      <div className="flex items-center gap-2 text-gray-400">
                        <PlaneTakeoff className="w-3.5 h-3.5 text-gray-500" />
                        <span>Depart: <strong className="text-gray-200">{new Date(cheapestDeal.date).toLocaleDateString()}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 mt-1">
                        <PlaneLanding className="w-3.5 h-3.5 text-gray-500" />
                        <span>Return: <strong className="text-gray-200">{new Date(cheapestDeal.returnDate).toLocaleDateString()}</strong></span>
                      </div>
                    </div>
                    
                    <a 
                      href={cheapestDeal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 w-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Book on Google Flights
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Average Price Widget */}
                <div className="glass rounded-2xl p-6 border border-gray-800/80 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-800 px-2 py-0.5 rounded">Average Price</span>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-4xl font-display font-bold text-white">${avgPrice}</span>
                      <span className="text-xs text-gray-500 font-mono">round-trip</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                    Based on analyzing {activeDest.prices.length} flight dates over the next 6 months. High seasonal variation is typical.
                  </p>

                  <div className="mt-5 text-[10px] font-mono text-gray-500">
                    Range: ${Math.min(...activeDest.prices.map(p => p.price))} - ${Math.max(...activeDest.prices.map(p => p.price))}
                  </div>
                </div>

              </div>

              {/* Flight Price Timeline Graph */}
              <div className="glass rounded-2xl p-6 border border-gray-800/80 text-left">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-display font-semibold text-lg text-white">6-Month Price Trend</h3>
                    <p className="text-xs text-gray-500">Hover over the timeline to view prices and dates.</p>
                  </div>
                </div>

                {chartSvg && (
                  <div className="relative overflow-visible">
                    <svg 
                      viewBox={`0 0 ${chartSvg.width} ${chartSvg.height}`}
                      className="w-full h-auto overflow-visible select-none"
                    >
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Y-axis helper grids */}
                      <line 
                        x1={chartSvg.paddingLeft} 
                        y1={chartSvg.paddingTop} 
                        x2={chartSvg.width - 20} 
                        y2={chartSvg.paddingTop} 
                        stroke="#1f2937" 
                        strokeDasharray="4"
                      />
                      <text x={chartSvg.paddingLeft - 10} y={chartSvg.paddingTop + 4} fill="#6b7280" fontSize="10" textAnchor="end">
                        ${chartSvg.maxPrice}
                      </text>

                      <line 
                        x1={chartSvg.paddingLeft} 
                        y1={chartSvg.paddingTop + chartSvg.chartHeight / 2} 
                        x2={chartSvg.width - 20} 
                        y2={chartSvg.paddingTop + chartSvg.chartHeight / 2} 
                        stroke="#1f2937" 
                        strokeDasharray="4"
                      />
                      <text x={chartSvg.paddingLeft - 10} y={chartSvg.paddingTop + chartSvg.chartHeight / 2 + 4} fill="#6b7280" fontSize="10" textAnchor="end">
                        ${Math.round((chartSvg.maxPrice + chartSvg.minPrice) / 2)}
                      </text>

                      <line 
                        x1={chartSvg.paddingLeft} 
                        y1={chartSvg.paddingTop + chartSvg.chartHeight} 
                        x2={chartSvg.width - 20} 
                        y2={chartSvg.paddingTop + chartSvg.chartHeight} 
                        stroke="#1f2937" 
                        strokeWidth="1.5"
                      />
                      <text x={chartSvg.paddingLeft - 10} y={chartSvg.paddingTop + chartSvg.chartHeight + 4} fill="#6b7280" fontSize="10" textAnchor="end">
                        ${chartSvg.minPrice}
                      </text>

                      {/* Area Fill */}
                      <path d={chartSvg.areaPath} fill="url(#chartGradient)" />

                      {/* Line Stroke */}
                      <path d={chartSvg.linePath} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                      {/* Dots & Interaction Overlay */}
                      {chartSvg.points.map((pt, idx) => {
                        const isHovered = hoveredPoint && hoveredPoint.index === idx;
                        return (
                          <g key={idx}>
                            {/* Hover highlight circle */}
                            {isHovered && (
                              <circle cx={pt.x} cy={pt.y} r="6" fill="#14b8a6" stroke="#040811" strokeWidth="2" />
                            )}
                            
                            {/* Invisible interactive hover rects */}
                            <rect
                              x={pt.x - (chartSvg.chartWidth / activeDest.prices.length) / 2}
                              y={chartSvg.paddingTop}
                              width={chartSvg.chartWidth / activeDest.prices.length}
                              height={chartSvg.chartHeight}
                              fill="transparent"
                              className="cursor-crosshair"
                              onMouseEnter={() => {
                                setHoveredPoint({
                                  index: idx,
                                  x: pt.x,
                                  y: pt.y,
                                  price: pt.price,
                                  date: pt.date,
                                  returnDate: pt.returnDate,
                                  link: pt.link
                                });
                              }}
                            />
                          </g>
                        );
                      })}
                    </svg>

                    {/* Timeline X-Axis Labels */}
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-2 pl-[40px] pr-[20px]">
                      <span>{new Date(activeDest.prices[0].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                      <span>{new Date(activeDest.prices[Math.floor(activeDest.prices.length / 2)].date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                      <span>{new Date(activeDest.prices[activeDest.prices.length - 1].date).toLocaleDateString(undefined, {month: 'short'})}</span>
                    </div>

                    {/* Custom HTML Tooltip */}
                    {hoveredPoint && (
                      <div 
                        className="absolute bg-gray-900 border border-gray-800 p-3 rounded-lg shadow-xl text-xs space-y-1 z-10 pointer-events-auto"
                        style={{
                          left: `${(hoveredPoint.x / 800) * 100}%`,
                          top: `${(hoveredPoint.y / 300) * 100 - 32}%`,
                          transform: 'translate(-50%, -100%)'
                        }}
                      >
                        <div className="font-bold text-white">${hoveredPoint.price}</div>
                        <div className="text-[10px] text-gray-400">
                          {new Date(hoveredPoint.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} ➔ {new Date(hoveredPoint.returnDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </div>
                        <a 
                          href={hoveredPoint.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[9px] text-teal-400 hover:underline flex items-center gap-0.5 mt-1"
                        >
                          View Flight <ExternalLink className="w-2 h-2" />
                        </a>
                      </div>
                    )}

                  </div>
                )}
              </div>

            </div>

            {/* Right Column (Travel Info & Checklists) */}
            <div className="md:col-span-4 space-y-8 text-left">
              
              {/* Landmarks Card (Scraped) */}
              <div className="glass rounded-2xl p-6 border border-gray-800/80 space-y-4">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-400" />
                  Local Landmarks
                </h3>
                <p className="text-xs text-gray-500">
                  Aggregated from Wikipedia tourist profiles:
                </p>
                <ul className="space-y-2 text-sm text-gray-300">
                  {activeDest.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weather Info */}
              <div className="glass rounded-2xl p-6 border border-gray-800/80 space-y-4">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                  <CloudSun className="w-5 h-5 text-teal-400" />
                  Travel Insights
                </h3>
                <div className="text-xs space-y-2 text-gray-400">
                  <div className="flex justify-between border-b border-gray-900 pb-2">
                    <span>Route</span>
                    <span className="font-semibold text-gray-200">{activeDest.from} to {activeDest.to}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-900 pb-2">
                    <span>Best Time</span>
                    <span className="font-semibold text-gray-200">Autumn / Spring</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-900 pb-2">
                    <span>Target Length</span>
                    <span className="font-semibold text-gray-200">{activeDest.nights} days</span>
                  </div>
                </div>
                <div className="bg-teal-500/5 p-3 rounded-lg border border-teal-500/10 text-[11px] text-teal-300/80 leading-relaxed">
                  💡 <strong>Tip:</strong> Flight prices fluctuate based on weekday departures. Friday/Sunday departures are typically 20% more expensive than Tuesday/Wednesday departures.
                </div>
              </div>

              {/* Interactive Packing Checklist */}
              <div className="glass rounded-2xl p-6 border border-gray-800/80 space-y-4">
                <h3 className="font-display font-semibold text-lg text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-teal-400" />
                  Packing Checklist
                </h3>
                <div className="space-y-2.5">
                  {defaultPackingList.map((item, index) => {
                    const isChecked = (checkedItems[selectedKey] || []).includes(item);
                    return (
                      <label 
                        key={index} 
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer select-none"
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheckItem(item)}
                          className="w-4 h-4 rounded border-gray-800 bg-gray-950 text-teal-600 focus:ring-teal-500 focus:ring-offset-gray-900 accent-teal-500 cursor-pointer"
                        />
                        <span className={isChecked ? 'line-through text-gray-600' : ''}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </main>
      )}

    </div>
  );
}
