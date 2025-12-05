import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline


data_file_path = './manually_balanced_flood_prediction_data_chennai (1).csv'

def train_regression_model():
    df = pd.read_csv(data_file_path)
    # Select only the required features
    features = ['Rainfall Amount (mm)', 'Relative Humidity (%)', 'Temperature (°C)', 'River Water Level (meters)']
    X = df[features]
    y = df['Flood Event']  # Target variable

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create an instance of the Logistic Regression model
    model = LogisticRegression(max_iter=1000)  # Increasing max_iter for convergence if necessary

    # Fit the model to the training data
    model.fit(X_train, y_train)

    # Predict the target variable for the test set
    # y_pred = model.predict(X_test)
    return model


def train_decision_tree_model():
    df = pd.read_csv(data_file_path)
    # Select only the required features
    features = ['Rainfall Amount (mm)', 'Relative Humidity (%)', 'Temperature (°C)', 'River Water Level (meters)']
    X = df[features]
    y = df['Flood Event']  # Target variable

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create an instance of the Decision Tree model
    model = DecisionTreeClassifier()

    # Fit the model to the training data
    model.fit(X_train, y_train)

    # Predict the target variable for the test set
    # y_pred = model.predict(X_test)
    return model

def train_svm_model():
    df = pd.read_csv(data_file_path)
    # Select only the required features
    features = ['Rainfall Amount (mm)', 'Relative Humidity (%)', 'Temperature (°C)', 'River Water Level (meters)']
    X = df[features]
    y = df['Flood Event']  # Target variable

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Create a pipeline with StandardScaler and SVM classifier
    # Enable probability estimates for confidence scores
    model = make_pipeline(StandardScaler(), SVC(kernel='linear', probability=True))

    # Fit the model to the training data
    model.fit(X_train, y_train)
    return model


def get_model(model_name):
    if model_name == 'logistic_regression':
        return train_regression_model()
    elif model_name == 'decision_tree':
        return train_decision_tree_model()
    elif model_name == 'svm':
        return train_svm_model()
    else:
        raise ValueError("Invalid model name. Please choose from 'logistic_regression', 'decision_tree', or 'svm'.")
    
def train_all_models():
    models = {}
    models['logistic_regression'] = train_regression_model()
    models['decision_tree'] = train_decision_tree_model()
    models['svm'] = train_svm_model()
    print("All models trained successfully.")
    return models