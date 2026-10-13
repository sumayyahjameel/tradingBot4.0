# APEX-QUANT: Deployment & Live Demo Guide

## 1. Quick Start for Live Hackathon Demo (Local)

Run the unified application on `http://localhost:5000` with one command:

### Windows (Command Prompt / PowerShell)
```cmd
run_demo.bat
```
or in PowerShell:
```powershell
.\run_demo.ps1
```

This single command:
1. Verifies/builds the production React Vite frontend bundle into `frontend/dist`.
2. Starts the Flask + SocketIO unified engine on `localhost:5000`.
3. Auto-launches your default web browser to the dashboard.
4. Auto-runs the dynamic paper trading telemetry thread emitting real-time signals every 3 seconds.

---

## 2. Deploy to Google Cloud Run (Single-Click / CLI)

### Option A: Direct Build & Deploy via Google Cloud CLI
From the `APEX-QUANT` directory, run:

```bash
gcloud run deploy apex-quant \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1
```

Cloud Run will automatically:
- Trigger Google Cloud Build using the multi-stage [Dockerfile](Dockerfile).
- Stage 1 compiles the React Vite frontend assets.
- Stage 2 sets up Python 3.11 with Gunicorn on port 8080 (honoring `$PORT`).
- Serve static assets and API routes seamlessly under one public HTTPS URL.

### Option B: Pre-built Container Registry
```bash
# 1. Build and push container
docker build -t gcr.io/<PROJECT_ID>/apex-quant:latest .
docker push gcr.io/<PROJECT_ID>/apex-quant:latest

# 2. Deploy image to Cloud Run
gcloud run deploy apex-quant \
    --image gcr.io/<PROJECT_ID>/apex-quant:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --port 8080
```

---

## 3. Architecture & API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/` | `GET` | Production React Vite Dashboard (SPA) |
| `/api/telemetry` | `GET / POST` | Real-time paper engine metrics & signal stream (updates every 3s) |
| `/api/portfolio` | `GET` | Portfolio summary & capital breakdown (₹72,38,535 paper starting balance) |
| `/api/positions` | `GET` | Active algorithmic positions matrix |
| `/api/signals` | `GET` | Real-time quantitative signals log |
| `/api/state` | `GET` | Unified state dictionary |
| `/api/trades` | `GET` | Algorithmic execution trade history |
| `/healthz` | `GET` | Cloud Run healthcheck & container readiness probe |
