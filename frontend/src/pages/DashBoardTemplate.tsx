import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Crosshair,
  ShieldCheck,
  Wifi,
} from 'lucide-react';
import { PageId } from '../types';

interface DashboardTemplateProps {
  onNavigate?: (page: PageId) => void;
}

export default function DashboardTemplate({ onNavigate }: DashboardTemplateProps = {}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'signals'>('overview');
  const [synced, setSynced] = useState(false);
  const [tick, setTick] = useState(0);

  // Smooth live wave animation loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 60);
    return () => clearInterval(timer);
  }, []);

  const [liveData, setLiveData] = useState<any>(null);
  const [trades, setTrades] = useState<any[]>([]);

  const fetchLiveState = async () => {
    try {
      setSynced(true);
      const [stateRes, tradesRes] = await Promise.all([
        fetch('/api/state'),
        fetch('/api/trades')
      ]);

      if (stateRes.ok) {
        const data = await stateRes.json();
        setLiveData(data);
      }
      if (tradesRes.ok) {
        const tradesData = await tradesRes.json();
        setTrades(Array.isArray(tradesData) ? tradesData : tradesData.trades || []);
      }
    } catch (err) {
      console.error('Failed to sync engine:', err);
    } finally {
      setTimeout(() => setSynced(false), 800);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const timer = setInterval(fetchLiveState, 2500);
    return () => clearInterval(timer);
  }, []);

  const handleSync = () => {
    fetchLiveState();
  };

  const rawBalance = liveData?.balance ?? 7238535;
  const balanceInInr = rawBalance > 500000 ? rawBalance : rawBalance * 85;
  const formattedEquity = '₹' + Math.round(balanceInInr).toLocaleString('en-IN');

  const rawPnl = liveData?.daily_pnl ?? 24380;
  const pnlInInr = Math.abs(rawPnl) > 5000 ? rawPnl : rawPnl * 85;
  const formattedPnl = (pnlInInr >= 0 ? '+₹' : '-₹') + Math.round(Math.abs(pnlInInr)).toLocaleString('en-IN');

  const stats = [
    {
      title: 'PORTFOLIO EQUITY',
      value: formattedEquity,
      change: liveData?.win_rate ? `+${liveData.win_rate}%` : '+12.4%',
      isPositive: true,
      sub: liveData?.balance ? 'Live paper engine linked' : '₹1.64L net weekly gains',
    },
    {
      title: 'DAILY REALIZED P&L',
      value: formattedPnl,
      change: '+3.85%',
      isPositive: (liveData?.daily_pnl ?? 0) >= 0,
      sub: liveData?.trade_count !== undefined ? `${liveData.trade_count} trades executed` : '9/11 trades profitable',
    },
    {
      title: 'MODEL WIN RATE',
      value: liveData?.win_rate ? `${liveData.win_rate}%` : '71.2%',
      change: '+4.1%',
      isPositive: true,
      sub: 'NIFTY 50 statistical edge',
    },
    {
      title: 'MAX DRAWDOWN',
      value: '3.82%',
      change: '-0.4%',
      isPositive: false,
      sub: 'Strict 5% hard circuit',
    },
  ];

  const liveFeeds = [
    { symbol: 'NIFTY 24500 CE', action: 'LONG BUY', qty: '450', price: '₹184.20', target: '₹218.00', time: '10:48:12' },
    { symbol: 'BANKNIFTY 52000 PE', action: 'SHORT SELL', qty: '180', price: '₹342.10', target: '₹285.00', time: '10:46:55' },
    { symbol: 'RELIANCE 2980 CALL', action: 'ACCUMULATE', qty: '250', price: '₹3,010.50', target: '₹3,090.00', time: '10:42:01' },
    { symbol: 'TCS EQUITY', action: 'EXIT STOP', qty: '100', price: '₹4,120.00', target: '₹4,115.00', time: '10:38:20' },
  ];
  const displayFeeds = trades.length > 0
    ? trades.slice(0, 5).map((t: any) => {
        const sideStr = (t.side || t.action || 'BUY').toUpperCase();
        const actionDisplay = sideStr.includes('BUY') ? 'LONG BUY' : sideStr.includes('SELL') ? 'SHORT SELL' : sideStr;
        return {
          symbol: t.symbol || 'NIFTY 24500 CE',
          action: actionDisplay,
          qty: String(t.amount || t.qty || t.size || '100'),
          price: '₹' + Number(t.price || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 }),
          target: '₹' + Number((t.price || 0) * 1.02).toLocaleString('en-IN', { maximumFractionDigits: 2 }),
          time: t.timestamp ? (t.timestamp.includes(':') ? t.timestamp.split('T').pop()?.split('.')[0] || t.timestamp : new Date(t.timestamp).toLocaleTimeString('en-IN')) : 'Live',
        };
      })
    : liveFeeds;

  // Dynamic moving wave points
  const p1 = 125 + Math.sin(tick * 0.08) * 9;
  const p2 = 65 + Math.cos(tick * 0.07) * 11;
  const p3 = 45 + Math.sin(tick * 0.09) * 8;
  const endY = 22 + Math.sin(tick * 0.1) * 6;

  const pathD = `M 0,135 Q 60,${p1} 130,120 T 260,${p2} T 380,${p3} T 500,${endY}`;
  const areaD = `${pathD} L 500,180 L 0,180 Z`;

  return (
    <div className="min-h-screen bg-[#060810] text-slate-200 p-4 space-y-4 font-mono select-none antialiased">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              QUANT TELEMETRY // LIVE MATRIX
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 flex items-center gap-1 font-normal">
                <Wifi className="w-2.5 h-2.5 text-emerald-400" />
                12ms ping
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-lg font-bold tracking-tight text-white">
                APEX<span className="text-emerald-400">.QUANT</span>
              </h1>
              <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800/90 border border-slate-700/80 text-slate-300">
                v2.6.4 ARCHITECTURE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded text-[11px] font-medium border transition-all ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-3 py-1.5 rounded text-[11px] font-medium border transition-all ${
                activeTab === 'signals'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Live Signals
            </button>
            <button
              onClick={handleSync}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-medium bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${synced ? 'animate-spin' : ''}`} />
              {synced ? 'Synced' : 'Sync Engine'}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((card, i) => (
          <div
            key={i}
            className="group rounded-lg bg-[#0a0f1d] border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 shadow-md"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="tracking-wide text-[10px] uppercase">{card.title}</span>
              <span
                className={`flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                  card.isPositive
                    ? 'bg-emerald-950/70 text-emerald-400 border-emerald-500/30'
                    : 'bg-rose-950/70 text-rose-400 border-rose-500/30'
                }`}
              >
                {card.isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {card.change}
              </span>
            </div>

            <div className="mt-2">
              <div className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                {card.value}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Dynamic Wave Chart */}
        <div className="lg:col-span-2 rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
            <div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <h2 className="text-xs font-semibold text-white tracking-wide uppercase">
                  Portfolio Yield vs NSE Benchmark
                </h2>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Real-time cumulative intraday alpha spread</p>
            </div>

            <div className="flex items-center gap-1 text-[10px] bg-slate-900/80 p-0.5 rounded border border-slate-800">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
                1D
              </span>
              <span className="px-2 py-0.5 rounded text-slate-400 hover:text-white cursor-pointer">
                1W
              </span>
              <span className="px-2 py-0.5 rounded text-slate-400 hover:text-white cursor-pointer">
                1M
              </span>
              <span className="px-2 py-0.5 rounded text-slate-400 hover:text-white cursor-pointer">
                YTD
              </span>
            </div>
          </div>

          {/* SVG Animated Moving Wave */}
          <div className="relative my-4 h-48 w-full">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="yieldGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="70%" stopColor="#10b981" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="60%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              <line x1="0" y1="45" x2="500" y2="45" stroke="#1e293b" strokeDasharray="3 3" strokeOpacity="0.4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#1e293b" strokeDasharray="3 3" strokeOpacity="0.4" />
              <line x1="0" y1="135" x2="500" y2="135" stroke="#1e293b" strokeDasharray="3 3" strokeOpacity="0.4" />

              <path d={areaD} fill="url(#yieldGlow)" />
              <path
                d={pathD}
                fill="none"
                stroke="url(#lineStroke)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(16,185,129,0.7)]"
              />

              <circle cx="500" cy={endY} r="5" fill="#34d399" className="animate-ping" opacity="0.8" />
              <circle cx="500" cy={endY} r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">ALPHA GENERATION +18.4%</span>
            </div>
            <div className="flex items-center gap-3">
              <span>SHARPE: <strong className="text-white">2.84</strong></span>
              <span>SORTINO: <strong className="text-white">3.41</strong></span>
              <span>BETA: <strong className="text-white">0.38</strong></span>
            </div>
          </div>
        </div>

        {/* Live Order Stream */}
        <div className="rounded-xl bg-[#0a0f1d] border border-slate-800/80 p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '9s' }} />
                <h2 className="text-xs font-semibold text-white tracking-wide uppercase">Order Stream</h2>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold animate-pulse">
                EXEC ACTIVE
              </span>
            </div>

            <div className="divide-y divide-slate-800/40 mt-1">
              {displayFeeds.map((feed, idx) => (
                <div key={idx} className="py-2.5 px-1 hover:bg-slate-800/20 rounded transition-colors">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">{feed.symbol}</span>
                      <span
                        className={`text-[8px] px-1 py-0.2 rounded font-bold border ${
                          feed.action.includes('BUY') || feed.action.includes('ACCUM')
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-950 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {feed.action}
                      </span>
                    </div>
                    <span className="text-white font-semibold">{feed.price}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Qty: <strong className="text-slate-300">{feed.qty}</strong> · Tgt: {feed.target}</span>
                    <span className="text-slate-500">{feed.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" />
              Risk Gate Nominal
            </span>
            <span>Latency: 8.4ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}