import requests
import json

BASE_URL = "http://127.0.0.1:5000"

# Sample data from README
sample_data = {
  "rainfallAmount": 100,
  "riverWaterLevel": 50,
  "soilMoistureContent": 30,
  "temperature": 25,
  "relativeHumidity": 60,
  "windSpeed": 10,
  "topography": 5,
  "urbanizationRate": 3,
  "drainageSystemCapacity": 8,
  "previousFloodHistory": 1
}

endpoints = ["logistic_regression", "decision_tree", "svm"]

print(f"Testing API at {BASE_URL}...\n")

for endpoint in endpoints:
    print(f"--- Testing {endpoint} ---")
    
    # Test POST (Prediction)
    try:
        response_post = requests.post(f"{BASE_URL}/{endpoint}", json=sample_data)
        if response_post.status_code == 200:
            print(f"POST Prediction: {response_post.text}")
        else:
            print(f"POST Error: {response_post.status_code} - {response_post.text}")
    except Exception as e:
        print(f"POST Failed: {e}")

    # Test GET (Feature Importance)
    try:
        response_get = requests.get(f"{BASE_URL}/{endpoint}")
        if response_get.status_code == 200:
            data = response_get.json()
            # Print just a summary to keep it clean
            print(f"GET Feature Importance (first 3): {data['feature_importance'][:3]}...")
        else:
            print(f"GET Error: {response_get.status_code} - {response_get.text}")
    except Exception as e:
        print(f"GET Failed: {e}")
    
    print("\n")
