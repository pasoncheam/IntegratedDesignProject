# analysis_firebase_detailed.py

import firebase_admin
from firebase_admin import credentials, db
import joblib
import numpy as np
import pandas as pd
import os
import json

# -------------------------------
# Firebase Initialization
# -------------------------------
'''
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate("")
    firebase_admin.initialize_app(cred, {
        "databaseURL": "https://aura-data-cb5bf-default-rtdb.asia-southeast1.firebasedatabase.app"
    })
'''
# Load Firebase key from environment variable
# check if key exists
firebase_key_json = os.environ.get("FIREBASE_KEY")
if not firebase_key_json:
    raise ValueError("FIREBASE_KEY not found in environment variables!")

# Convert string to dictionary
firebase_key_dict = json.loads(firebase_key_json)

# connect to firebase
cred = credentials.Certificate(firebase_key_dict)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://aura-data-cb5bf-default-rtdb.asia-southeast1.firebasedatabase.app"
})
# -------------------------------
# Load Model
# -------------------------------
# load our trained ai model
model = joblib.load("flood_unsupervised.pkl")

# -------------------------------
# Fetch Sensor Data From Firebase
# -------------------------------
def get_sensor_data():
    # get latest data from sensor path
    ref = db.reference("sensors/latest")
    data = ref.get()
    return data


# -------------------------------
# Prediction Function (with detailed explanation)
# -------------------------------
def predict_flood(humidity, rainfall, temperature, waterLevel):
    features = pd.DataFrame([[humidity, rainfall, temperature, waterLevel]],
                            columns=['humidity', 'rainfall', 'temperature', 'waterLevel'])

    # IsolationForest: 1 = safe, -1 = flood
    prediction_raw = model.predict(features)[0]
    prediction = 0 if prediction_raw == 1 else 1

    score = model.score_samples(features)[0]
    probability = 1 / (1 + np.exp(-score))
    if prediction == 1:
        probability = 1 - probability

    return prediction, float(probability)


# -------------------------------
# Upload Detailed Result to Firebase
# -------------------------------
def upload_result_to_firebase(result_text, prediction, confidence):
    ref = db.reference("sensors/floodResult")
    ref.set({
        "prediction": prediction,
        "confidence": confidence,
        "message": result_text
    })


# -------------------------------
# Main Execution (every 1 minute)
# -------------------------------
def main():
    data = get_sensor_data()

    if not data:
        print("No data found in Firebase.")
        return

    humidity = float(data["humidity"])
    rainfall = float(data["rainfall"])
    temperature = float(data["temperature"])
    waterLevel = float(data["waterLevel"])

    flood, confidence = predict_flood(humidity, rainfall, temperature, waterLevel)

    # -------------------------------
    # Detailed Explanation (same as original)
    # -------------------------------
    if flood == 1:
        result_text = (
            "FLOOD RISK DETECTED\n"
            f"Confidence Level: {confidence:.2f}\n"
            "Environmental Assessment:\n"
            "  The current combination of humidity, rainfall intensity, ambient temperature,\n"
            "  and water level indicates an abnormal hydrological condition. Such patterns\n"
            "  typically occur when excessive surface runoff, saturated soil layers, and\n"
            "  rising water columns coincide.\n"
            "\n"
            "  • Elevated humidity often reflects high moisture retention in the atmosphere.\n"
            "  • Rainfall values indicate incoming precipitation contributing to catchment loading.\n"
            "  • Temperature readings influence evaporation rates and atmospheric stability.\n"
            "  • Water-level elevation suggests reduced drainage efficiency and channel overflow risk.\n"
            "\n"
            "  Together, these factors point toward a high likelihood of localised flooding,\n"
            "  particularly in low-lying or poorly drained areas."
        )
    else:
        result_text = (
            "CONDITIONS WITHIN NORMAL RANGE\n"
            f"- Confidence Level: {confidence:.2f}\n"
            "- Environmental Assessment:\n"
            "  The current meteorological and hydrological indicators fall within typical\n"
            "  non-flood operational conditions.\n"
            "\n"
            "  • Humidity is within a stable atmospheric moisture range.\n"
            "  • Rainfall levels do not significantly contribute to surface accumulation.\n"
            "  • Temperature supports normal evaporation and air stability.\n"
            "  • Water levels remain below thresholds associated with overflow danger.\n"
            "\n"
            "  These readings suggest minimal surface runoff pressure and adequate drainage\n"
            "  capacity, indicating low likelihood of flooding under current conditions."
        )

    # Upload to Firebase
    upload_result_to_firebase(result_text, flood, confidence)

    print("Uploaded to Firebase:")
    print(result_text)


if __name__ == "__main__":
    main()
