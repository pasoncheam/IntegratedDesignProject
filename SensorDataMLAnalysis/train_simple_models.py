import pandas as pd
import pickle
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split

def train_models():
    
    print("Loading data...")
    
    # read the csv file
    df = pd.read_csv('flood_risk_dataset_india_modified.csv')
    
    # rename columns so they are easier to use
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
    
    # split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training models...")
    
    print("Training Logistic Regression...")
    log_reg = LogisticRegression()
    log_reg.fit(X_train, y_train)
    
    with open('logistic_model.pkl', 'wb') as f:
        pickle.dump(log_reg, f)
        
    print("Training Decision Tree...")
    dtree = DecisionTreeClassifier()
    dtree.fit(X_train, y_train)

    with open('decision_tree_model.pkl', 'wb') as f:
        pickle.dump(dtree, f)
        
    print("Training SVM...")
    svm_model = SVC(kernel='linear')
    svm_model.fit(X_train, y_train)
    # Save
    with open('svm_model.pkl', 'wb') as f:
        pickle.dump(svm_model, f)
        
    print("All models trained and saved as .pkl files!")

if __name__ == "__main__":
    train_models()
