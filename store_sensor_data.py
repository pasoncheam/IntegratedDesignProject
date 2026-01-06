import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
import os
import json
from datetime import datetime
import pytz

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
# Fetch Sensor Data From Firebase
# -------------------------------
def get_sensor_data():
    # fetch data from sensors/latest
    ref = db.reference("sensors/latest")
    data = ref.get()
    return data

# -------------------------------
# Main Execution
# -------------------------------
def main():
    data = get_sensor_data()

    if not data:
        print("No data found in Firebase.")
        return

    # Extract specific fields to ensure only relevant data is stored
    # get the values we need and add timestamp
    sensor_reading = {
        'humidity': float(data.get('humidity', 0)),
        'rainfall': float(data.get('rainfall', 0)),
        'temperature': float(data.get('temperature', 0)),
        'waterLevel': float(data.get('waterLevel', 0)),
        'timestamp': datetime.now(pytz.timezone('Asia/Kuala_Lumpur')).strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Create DataFrame for new data
    new_row = pd.DataFrame([sensor_reading])
    
    # Ensure public directory exists
    public_dir = "public"
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)

    csv_file = os.path.join(public_dir, "sensor_data.csv")
    
    if os.path.exists(csv_file) and os.path.getsize(csv_file) > 0:
        try:
            # Read existing data
            df = pd.read_csv(csv_file)
            # Append new data
            df = pd.concat([df, new_row], ignore_index=True)
        except pd.errors.EmptyDataError:
            # File exists but is empty
            df = new_row
    else:
        # Create new DataFrame
        df = new_row
        
    # Keep only the last 1001 rows
    if len(df) > 1001:
        df = df.tail(1001)
        
    # Save back to CSV
    # save to csv file
    df.to_csv(csv_file, index=False)
    print(f"Data appended. Total rows: {len(df)}")

if __name__ == "__main__":
    main()
