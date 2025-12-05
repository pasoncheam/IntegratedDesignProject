# analysis_svm_firebase.py

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
# Load Firebase key from environment variable
firebase_key_json = os.environ.get("FIREBASE_KEY")
if not firebase_key_json:
    raise ValueError("FIREBASE_KEY not found in environment variables!")

# Convert string to dictionary
firebase_key_dict = json.loads(firebase_key_json)

cred = credentials.Certificate(firebase_key_dict)
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://aura-data-cb5bf-default-rtdb.asia-southeast1.firebasedatabase.app"
})

# -------------------------------
# Load Model
# -------------------------------
# Load the trained SVM model
model_path = "svm.pkl"
model = joblib.load(model_path)

# -------------------------------
# Fetch Sensor Data From Firebase
# -------------------------------
def get_sensor_data():
    ref = db.reference("sensors/latest")
    data = ref.get()
    return data


# -------------------------------
# Prediction Function
# -------------------------------
def predict_flood(humidity, rainfall, temperature, waterLevel):
    # Prepare features in the correct order: Rainfall, Humidity, Temperature, Water Level
    # Note: The model was trained with: ['Rainfall Amount (mm)', 'Relative Humidity (%)', 'Temperature (°C)', 'River Water Level (meters)']
    features = pd.DataFrame([[rainfall, humidity, temperature, waterLevel]],
                            columns=['Rainfall Amount (mm)', 'Relative Humidity (%)', 'Temperature (°C)', 'River Water Level (meters)'])

    # Predict class (0 or 1)
    prediction = model.predict(features)[0]
    
    # Predict probability
    # model.predict_proba returns [[prob_0, prob_1]]
    probabilities = model.predict_proba(features)[0]
    confidence = probabilities[1] if prediction == 1 else probabilities[0]

    return int(prediction), float(confidence)


# -------------------------------
# Upload Detailed Result to Firebase
# -------------------------------
def upload_result_to_firebase(result_text, prediction, confidence):
    ref = db.reference("sensors/floodResultSVM") # Saving to a different path for SVM results
    ref.set({
        "prediction": prediction,
        "confidence": confidence,
        "message": result_text
    })


# -------------------------------
# Main Execution
# -------------------------------
def main():
    data = get_sensor_data()

    if not data:
        print("No data found in Firebase.")
        return

    humidity = float(data.get("humidity", 0))
    rainfall = float(data.get("rainfall", 0))
    temperature = float(data.get("temperature", 0))
    waterLevel = float(data.get("waterLevel", 0))

    flood, confidence = predict_flood(humidity, rainfall, temperature, waterLevel)

    # -------------------------------
    # Detailed Explanation
    # -------------------------------
    if flood == 1:
        result_text = (
            "FLOOD RISK DETECTED (SVM)\n"
            f"Confidence Level: {confidence:.2f}\n"
            "Environmental Assessment:\n"
            "  The Support Vector Machine model indicates a high likelihood of flooding based on\n"
            "  current sensor readings. This suggests that the combination of rainfall,\n"
            "  humidity, temperature, and water level has crossed a critical threshold.\n"
            "\n"
            "  • Rainfall and water levels are primary contributors to this risk assessment.\n"
            "  • Immediate attention to water levels and drainage is recommended."
        )
    else:
        result_text = (
            "CONDITIONS WITHIN NORMAL RANGE (SVM)\n"
            f"- Confidence Level: {confidence:.2f}\n"
            "- Environmental Assessment:\n"
            "  The Support Vector Machine model predicts safe conditions.\n"
            "\n"
            "  • Current environmental parameters are within the safe operational boundary.\n"
            "  • No immediate flood risk is detected."
        )

    # Upload to Firebase
    upload_result_to_firebase(result_text, flood, confidence)

    print("Uploaded to Firebase (SVM):")
    print(result_text)


if __name__ == "__main__":
    main()
