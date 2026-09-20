export type PageId =
  | 'dashboard'
  | 'market'
  | 'signals'
  | 'portfolio'
  | 'positions'
  | 'backtests'
  | 'models'
  | 'data'
  | 'system'
  | 'settings'

export type SignalAction = 'BUY' | 'SELL' | 'HOLD'
export type PositionSide = 'LONG' | 'SHORT'
export type ModelStatus = 'DEPLOYED' | 'VALIDATED' | 'TRAINING' | 'ARCHIVED'
export type FeedStatus = 'LIVE' | 'SYNCED' | 'DELAYED' | 'DEGRADED'
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

export interface MarketIndex {
  id: string
  name: string
  symbol: string
  current: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: string
  sparkline: number[]
}

export interface StockQuote {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  changePercent: number
  volume: number
  turnoverCr: number
  pe: number
  rsi: number
  volatility20d: number
  high52w: number
  low52w: number
  sparkline: number[]
}

export interface TradingSignal {
  id: string
  symbol: string
  name: string
  action: SignalAction
  confidence: number // 0.0 to 1.0
  strategy: string
  entryPrice: number
  stopLoss: number
  targetPrice: number
  expectedReturnPct: number
  timestamp: string
  timeAgo: string
  status: 'ACTIVE' | 'EXECUTED' | 'EXPIRED'
  spreadRatio?: number
}

export interface PortfolioHolding {
  symbol: string
  name: string
  sector: string
  shares: number
  averagePrice: number
  currentPrice: number
  investedValue: number
  currentValue: number
  pnl: number
  pnlPercent: number
  weight: number
}

export interface PortfolioPosition {
  id: string
  symbol: string
  name: string
  side: PositionSide
  quantity: number
  avgEntryPrice: number
  ltp: number
  currentValue: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  realizedPnl: number
  portfolioWeight: number
  stopLoss: number
  takeProfit: number
  trailingSl: number
  entryTime: string
}

export interface PortfolioSummary {
  portfolioValue: number
  investedCapital: number
  availableCapital: number
  todayPnl: number
  todayPnlPercent: number
  overallPnl: number
  overallPnlPercent: number
  exposurePct: number
  winRatePct: number
  totalTradesCount: number
  sharpeRatio: number
  maxDrawdownPct: number
  var95Pct: number
  betaNifty: number
}

export interface EquityCurvePoint {
  date: string
  equity: number
  drawdown: number
  benchmark: number
}

export interface BacktestTrade {
  id: string
  symbol: string
  side: 'BUY' | 'SELL'
  entryDate: string
  exitDate: string
  entryPrice: number
  exitPrice: number
  shares: number
  pnl: number
  pnlPct: number
  holdingBars: number
  exitReason: 'TARGET' | 'STOP_LOSS' | 'SIGNAL' | 'TIME_EXPIRY'
}

export interface BacktestResult {
  id: string
  name: string
  strategy: string
  universe: string
  startDate: string
  endDate: string
  initialCapital: number
  finalCapital: number
  totalReturnPct: number
  annualizedReturnPct: number
  benchmarkReturnPct: number
  sharpeRatio: number
  sortinoRatio: number
  profitFactor: number
  maxDrawdownPct: number
  winRatePct: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  avgTradeReturnPct: number
  slippagePct: number
  feeRatePct: number
  equityCurve: EquityCurvePoint[]
  trades: BacktestTrade[]
}

export interface ModelFeature {
  name: string
  importance: number
  category: 'MOMENTUM' | 'TREND' | 'VOLATILITY' | 'VOLUME' | 'RELATIVE_STRENGTH' | 'REGIME'
  description: string
}

export interface ModelMetric {
  metric: string
  validationValue: string
  testValue: string
  benchmarkValue: string
  status: 'OPTIMAL' | 'ACCEPTABLE' | 'SUBOPTIMAL'
}

export interface ModelRegistryItem {
  id: string
  name: string
  version: string
  status: ModelStatus
  algorithm: string
  targetHorizon: string
  targetType: string
  rankIc: number
  icIr: number
  mae: number
  rmse: number
  directionalAccuracyPct: number
  trainedAt: string
  datasetRows: number
  features: ModelFeature[]
  metrics: ModelMetric[]
}

export interface DataFeedItem {
  id: string
  name: string
  source: string
  type: 'TICK' | 'MINUTE' | 'DAILY' | 'CORPORATE_ACTIONS' | 'UNIVERSE'
  status: FeedStatus
  recordsCount: number
  lastSync: string
  frequency: string
  healthScorePct: number
  storageFormat: 'PARQUET' | 'SQLITE' | 'IN_MEMORY'
  sizeMb: number
}

export interface SystemLog {
  id: string
  timestamp: string
  level: LogLevel
  module: string
  message: string
}

export interface SystemState {
  botStatus: 'ACTIVE_PAPER' | 'ACTIVE_LIVE' | 'PAUSED' | 'STANDBY'
  executionMode: 'PAPER' | 'LIVE'
  uptime: string
  lastHeartbeat: string
  cpuUsagePct: number
  memoryUsageMb: number
  dataPipelineHealthy: boolean
  modelHealthy: boolean
  riskCheckPassed: boolean
  dailyTradeCount: number
  maxDailyTrades: number
  currentExposureRupees: number
  maxExposureRupees: number
}

export interface AppSettings {
  trading: {
    maxOpenPositions: number
    capitalPerTradePct: number
    defaultStopLossPct: number
    defaultTakeProfitPct: number
    minConfidenceThreshold: number
    executionMode: 'PAPER' | 'LIVE'
    autoRebalance: boolean
  }
  risk: {
    maxDailyLossPct: number
    maxPortfolioExposurePct: number
    maxSectorExposurePct: number
    maxSingleStockWeightPct: number
    enableTrailingStop: boolean
    autoHaltOnBreach: boolean
  }
  notifications: {
    emailAlerts: boolean
    signalAlerts: boolean
    executionAlerts: boolean
    riskAlerts: boolean
    webhookUrl: string
  }
  appearance: {
    density: 'compact' | 'comfortable'
    showTicker: boolean
    showMonochromeCharts: boolean
  }
}
