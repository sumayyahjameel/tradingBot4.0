import time
import random
import requests

url = "http://127.0.0.1:5000/api/telemetry"
symbols = ["NIFTY 24500 CE", "BANKNIFTY 52000 PE", "RELIANCE 2980 CALL", "TCS EQUITY", "INFY EQUITY"]
sides = ["LONG BUY", "SHORT SELL", "ACCUMULATE", "EXIT STOP"]
equity = 7238535

print("paper trading simulation stream started...")

while True:
    pnl_delta = random.randint(-1200, 2800)
    equity += pnl_delta
    trade = {
        "symbol": random.choice(symbols),
        "side": random.choice(sides),
        "qty": random.randint(50, 500),
        "price": round(random.uniform(150, 4200), 2),
        "target": round(random.uniform(160, 4300), 2),
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    payload = {
        "portfolio_equity": equity,
        "daily_realized_pnl": pnl_delta,
        "trades_executed": random.randint(1, 20),
        "win_rate": 71.2,
        "max_drawdown": 3.82,
        "latest_trade": trade
    }
    
    try:
        r = requests.post(url, json=payload, timeout=2)
        print(f"pushed trade: {trade['symbol']} | pnl: {pnl_delta} | status: {r.status_code}")
    except Exception as e:
        print(f"sync error: {e}")
        
    time.sleep(3)
