from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

import schemas

from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent  # backend/app
MODEL_PATH = BASE_DIR / "ML" / "knn_model.pkl"

app = FastAPI()

# Allow the React dev server (and other local frontends) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Predict iris species"}

@app.post("/predict")
def predict(request: schemas.Iris):
    model = joblib.load(MODEL_PATH)
    sample = np.array([request.sepal_length,
                       request.sepal_width,
                       request.petal_length,
                       request.petal_width]).reshape(1, -1)
    species = model.predict(sample)[0]
    return {"species": species}
