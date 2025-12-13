import pandas as pd
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

def train_models():
    # 1. Load the dataset
    # We expect a CSV with columns: rainfall, humidity, temperature, water_level, flood
    print("Loading data...")
    # Load dataset with UTF-8 encoding to handle special characters slightly better, 
    # though pandas usually detects it.
    df = pd.read_csv('flood_risk_dataset_india_modified.csv')
    
    # Rename columns to match what the models expect
    # The terminal showed "Temperature (Â°C)" which suggests UTF-8 read as ASCII/Latin-1 usually.
    # We will try to be robust or just match the exact known headers if standard read works.
    # Mapping based on the provided file headers:
    column_mapping = {
        'Rainfall (mm)': 'rainfall',
        'Humidity (%)': 'humidity',
        'Water Level (m)': 'water_level',
        'Flood Occurred': 'flood'
    }
    
    # Handle Temperature separately to catch the degree symbol variation
    for col in df.columns:
        if 'Temperature' in col:
            column_mapping[col] = 'temperature'
            break
            
    df.rename(columns=column_mapping, inplace=True)

    # Select features and target
    X = df[['rainfall', 'humidity', 'temperature', 'water_level']]
    y = df['flood']
    
    # Split for valid training (though we use all for final model usually, but good practice to split/test)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training models...")
    
    # 2. Logistic Regression
    print("Training Logistic Regression...")
    log_reg = LogisticRegression()
    log_reg.fit(X_train, y_train)
    # Save
    with open('logistic_model.pkl', 'wb') as f:
        pickle.dump(log_reg, f)
        
    # 3. Decision Tree
    print("Training Decision Tree...")
    dtree = DecisionTreeClassifier()
    dtree.fit(X_train, y_train)
    # Save
    with open('decision_tree_model.pkl', 'wb') as f:
        pickle.dump(dtree, f)
        
    # 4. SVM
    print("Training SVM...")
    svm_model = SVC(kernel='linear')
    svm_model.fit(X_train, y_train)
    # Save
    with open('svm_model.pkl', 'wb') as f:
        pickle.dump(svm_model, f)
        
    print("All models trained and saved as .pkl files!")

if __name__ == "__main__":
    train_models()
