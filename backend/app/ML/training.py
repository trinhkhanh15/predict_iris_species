import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier


def main():
    df = pd.read_csv("../dataset/Iris.csv")

    feature_cols = [
        "SepalLengthCm",
        "SepalWidthCm",
        "PetalLengthCm",
        "PetalWidthCm"
    ]
    target_col = "Species"

    x = df[feature_cols]
    y = df[target_col]

    x_train, _, y_train, _ = train_test_split(
        x, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("scaler", StandardScaler()),
        ("knn", KNeighborsClassifier(
            n_neighbors=5,
            weights="distance",
            metric="minkowski",
            p=2
        ))
    ])

    pipeline.fit(x_train, y_train)

    joblib.dump(pipeline, "knn_model.pkl")
    print("Model saved to knn_model.pkl")

if __name__ == "__main__":
    main()