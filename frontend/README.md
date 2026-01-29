# Iris Predictor (React + FastAPI)

This is a minimal **Create React App (CRA)** style frontend that calls a FastAPI backend to predict the Iris species.

## Requirements

- Node.js (recommended: v18+)
- Backend running at `http://localhost:8000`

## Setup

From the repo root:

```bash
cd frontend
npm install
npm start
```

Then open `http://localhost:3000`.

## API

The app calls:

- `POST /predict` (proxied to `http://localhost:8000/predict` via CRA `proxy`)

Request body:

```json
{
  "sepal_length": 5.1,
  "sepal_width": 3.5,
  "petal_length": 1.4,
  "petal_width": 0.2
}
```

Response:

```json
{ "species": 0 }
```

Species mapping:

- `0` → Setosa
- `1` → Versicolor
- `2` → Virginica

