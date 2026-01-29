import React, { useMemo, useState } from "react";
import "./App.css";

const SPECIES_LABELS = {
  0: "Setosa",
  1: "Versicolor",
  2: "Virginica",
};

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function App() {
  const [sepalLength, setSepalLength] = useState("");
  const [sepalWidth, setSepalWidth] = useState("");
  const [petalLength, setPetalLength] = useState("");
  const [petalWidth, setPetalWidth] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [species, setSpecies] = useState(null);

  const formValues = useMemo(
    () => ({
      sepal_length: toNumber(sepalLength),
      sepal_width: toNumber(sepalWidth),
      petal_length: toNumber(petalLength),
      petal_width: toNumber(petalWidth),
    }),
    [sepalLength, sepalWidth, petalLength, petalWidth]
  );

  const isValid = useMemo(() => {
    return (
      formValues.sepal_length !== null &&
      formValues.sepal_width !== null &&
      formValues.petal_length !== null &&
      formValues.petal_width !== null
    );
  }, [formValues]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSpecies(null);

    if (!isValid) {
      setError("Please fill in all 4 fields with valid numbers.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `Request failed (${res.status}). ${text ? `Details: ${text}` : ""}`.trim()
        );
      }

      const data = await res.json();
      const raw = data?.species;
      const label =
        Object.prototype.hasOwnProperty.call(SPECIES_LABELS, raw) ?
          SPECIES_LABELS[raw] :
          null;

      if (!label) {
        throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
      }

      setSpecies(label);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <h1 className="title">Iris Species Predictor</h1>
          <p className="subtitle">
            Enter flower measurements and get the predicted species.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit}>
          <div className="grid">
            <label className="field">
              <span className="label">Sepal Length</span>
              <input
                inputMode="decimal"
                type="number"
                step="any"
                placeholder="e.g. 5.1"
                value={sepalLength}
                onChange={(e) => setSepalLength(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="label">Sepal Width</span>
              <input
                inputMode="decimal"
                type="number"
                step="any"
                placeholder="e.g. 3.5"
                value={sepalWidth}
                onChange={(e) => setSepalWidth(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="label">Petal Length</span>
              <input
                inputMode="decimal"
                type="number"
                step="any"
                placeholder="e.g. 1.4"
                value={petalLength}
                onChange={(e) => setPetalLength(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="label">Petal Width</span>
              <input
                inputMode="decimal"
                type="number"
                step="any"
                placeholder="e.g. 0.2"
                value={petalWidth}
                onChange={(e) => setPetalWidth(e.target.value)}
              />
            </label>
          </div>

          <div className="actions">
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Predicting..." : "Predict"}
            </button>
            <span className="hint">
              {loading ? "Waiting for API response…" : "FastAPI: POST /predict"}
            </span>
          </div>
        </form>

        <div className="result" aria-live="polite">
          {error ? <div className="error">{error}</div> : null}
          {species ? (
            <div className="success">
              Prediction: <strong>{species}</strong>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

