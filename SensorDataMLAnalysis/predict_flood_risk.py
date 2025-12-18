import pandas as pd
import pickle
import json
import os
import sys
import requests

def predict_flood_risk():
    # Define paths
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    SENSOR_DATA_PATH = os.path.join(BASE_DIR, '..', 'public', 'sensor_data.csv')
    METRICS_PATH = os.path.join(BASE_DIR, 'model_metrics.json')
    OUTPUT_PATH = os.path.join(BASE_DIR, '..', 'public', 'latest_flood_risk.json')

    print(f"Reading sensor data from: {SENSOR_DATA_PATH}")
    
    try:
        # Read only the last few lines to avoid loading huge files, 
        # but for simplicity/robustness with pandas, we load and tail.
        # If file is huge, could use other methods, but 14KB is tiny.
        df = pd.read_csv(SENSOR_DATA_PATH)
        if df.empty:
            print("Sensor data is empty.")
            return

        # Get latest reading
        latest_row = df.iloc[[-1]].copy() # Keep as DataFrame
        print("Latest reading:")
        print(latest_row)

        # Map columns to model expectations
        # CSV: humidity,rainfall,temperature,waterLevel,timestamp
        # Model: rainfall, humidity, temperature, water_level
        
        # We need to manually construct the input features DataFrame
        # to ensure order and naming are perfect.
        
        input_features = pd.DataFrame()
        input_features['rainfall'] = latest_row['rainfall']
        input_features['humidity'] = latest_row['humidity']
        input_features['temperature'] = latest_row['temperature']
        
        # Handle waterLevel -> water_level
        if 'waterLevel' in latest_row.columns:
            input_features['water_level'] = latest_row['waterLevel']
        elif 'water_level' in latest_row.columns:
            input_features['water_level'] = latest_row['water_level']
        else:
             print("Error: 'waterLevel' column missing.")
             return

        # Load Metrics to find best model
        print(f"Loading metrics from: {METRICS_PATH}")
        with open(METRICS_PATH, 'r') as f:
            metrics = json.load(f)
        
        # Sort by accuracy descending
        best_model_info = sorted(metrics, key=lambda x: x['accuracy'], reverse=True)[0]
        best_model_name = best_model_info['name']
        best_model_acc = best_model_info['accuracy']
        
        print(f"Best model selected: {best_model_name} (Accuracy: {best_model_acc:.2f})")
        
        # Map Name to Filename
        model_filename = ""
        if 'Logistic Regression' in best_model_name:
            model_filename = "logistic_model.pkl"
        elif 'Decision Tree' in best_model_name:
            model_filename = "decision_tree_model.pkl"
        elif 'SVM' in best_model_name:
            model_filename = "svm_model.pkl"
        elif 'Deep Learning' in best_model_name:
            model_filename = "deep_model.pkl"
        else:
            print(f"Unknown model name: {best_model_name}")
            return
            
        model_path = os.path.join(BASE_DIR, model_filename)
        print(f"Loading model from: {model_path}")
        
        with open(model_path, 'rb') as f:
            model_obj = pickle.load(f)
            
        # Handle Deep Learning specific loading (dict with scaler)
        if 'Deep Learning' in best_model_name:
            model = model_obj['model']
            scaler = model_obj['scaler']
            X_input = scaler.transform(input_features)
        else:
            model = model_obj
            X_input = input_features

        # Predict
        prediction = model.predict(X_input)[0]
        
        # Try to get probability if supported
        probability = None
        if hasattr(model, "predict_proba"):
             try:
                # Class 1 is 'Flood' usually
                probability = model.predict_proba(X_input)[0][1] 
             except:
                pass
        
        result = {
            "timestamp": latest_row['timestamp'].values[0] if 'timestamp' in latest_row.columns else "Unknown",
            "prediction": int(prediction), # 0 or 1
            "probability": float(probability) if probability is not None else None,
            "model_used": best_model_name,
            "model_accuracy": float(best_model_acc),
            "input_data": {
                "rainfall": float(input_features['rainfall'].values[0]),
                "humidity": float(input_features['humidity'].values[0]),
                "temperature": float(input_features['temperature'].values[0]),
                "water_level": float(input_features['water_level'].values[0])
            }
        }
        
        print("Prediction result:")
        print(json.dumps(result, indent=2))
        
        # Save to file
        with open(OUTPUT_PATH, 'w') as f:
            json.dump(result, f, indent=4)
        print(f"Saved result to: {OUTPUT_PATH}")



    except Exception as e:
        print(f"An error occurred: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    predict_flood_risk()
