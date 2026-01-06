import pandas as pd
import pickle
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def train_deep_model():
    print("Loading data...")
    df = pd.read_csv('flood_risk_dataset_india_modified.csv')
    
    column_mapping = {
        'Rainfall (mm)': 'rainfall',
        'Humidity (%)': 'humidity',
        'Water Level (m)': 'water_level',
        'Flood Occurred': 'flood'
    }
    for col in df.columns:
        if 'Temperature' in col:
            column_mapping[col] = 'temperature'
            break
    df.rename(columns=column_mapping, inplace=True)
    
    X = df[['rainfall', 'humidity', 'temperature', 'water_level']]
    y = df['flood']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("Training Deep Learning Model (MLP)...")
    mlp = MLPClassifier(hidden_layer_sizes=(10, 5), max_iter=2000, random_state=42)
    mlp.fit(X_train_scaled, y_train)
    
    with open('deep_model.pkl', 'wb') as f:
        pickle.dump({'model': mlp, 'scaler': scaler}, f)
        
    print("Deep Learning model trained and saved as 'deep_model.pkl'!")

if __name__ == "__main__":
    train_deep_model()
