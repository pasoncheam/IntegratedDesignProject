import pandas as pd
import pickle
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
import numpy as np
import json

# Set style
sns.set_theme(style="whitegrid")

def load_data():
    print("Loading data...")
    df = pd.read_csv('flood_risk_dataset_india_modified.csv')
    
    # Rename columns
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
    # Split same as training
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    return X_test, y_test

def evaluate_models():
    X_test, y_test = load_data()
    
    models = {}
    
    # helper to load pickle safely
    print("Loading models...")
    try:
        with open('logistic_model.pkl', 'rb') as f:
            models['Logistic Regression'] = pickle.load(f)
            
        with open('decision_tree_model.pkl', 'rb') as f:
            models['Decision Tree'] = pickle.load(f)
            
        with open('svm_model.pkl', 'rb') as f:
            models['SVM'] = pickle.load(f)
            
        with open('deep_model.pkl', 'rb') as f:
            deep_pkg = pickle.load(f)
            models['Deep Learning (MLP)'] = deep_pkg
    except FileNotFoundError as e:
        print(f"Error loading models: {e}")
        return

    results = []
    output_text = ""
    
    # 1. Evaluate Loop
    for name, model_obj in models.items():
        if name == 'Deep Learning (MLP)':
             # DL model handle (has scaler)
             model = model_obj['model']
             scaler = model_obj['scaler']
             X_input = scaler.transform(X_test)
        else:
             model = model_obj
             X_input = X_test
             
        y_pred = model.predict(X_input)
        acc = accuracy_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred)
        
        results.append({
            'name': name,
            'accuracy': acc,
            'cm': cm,
            'model': model
        })
        
        
        report = classification_report(y_test, y_pred)
        res_str = f"\n--- {name} Results ---\nAccuracy: {acc:.2f}\nConfusion Matrix:\n{cm}\nReport:\n{report}\n"
        output_text += res_str
        # print(res_str) # defer printing

    # 2. Visualization
    
    # A. Accuracy Comparison Bar Chart
    plt.figure(figsize=(10, 6))
    names = [r['name'] for r in results]
    accs = [r['accuracy'] for r in results]
    sns.barplot(x=names, y=accs, palette='viridis')
    plt.title('Model Accuracy Comparison')
    plt.ylim(0, 1.1)
    plt.ylabel('Accuracy')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('model_accuracy_comparison.png')
    print("Saved 'model_accuracy_comparison.png'")
    
    # B. Confusion Matrices Heatmaps
    fig, axes = plt.subplots(2, 2, figsize=(12, 10))
    axes = axes.flatten()
    
    for i, res in enumerate(results):
        sns.heatmap(res['cm'], annot=True, fmt='d', cmap='Blues', ax=axes[i])
        axes[i].set_title(f"{res['name']} - CM")
        axes[i].set_xlabel('Predicted')
        axes[i].set_ylabel('Actual')
        
    plt.tight_layout()
    plt.savefig('confusion_matrices.png')
    print("Saved 'confusion_matrices.png'")

    # C. Feature Importance (Decision Tree Only)
    dt_res = next((r for r in results if r['name'] == 'Decision Tree'), None)
    if dt_res:
        plt.figure(figsize=(8, 5))
        model = dt_res['model']
        feats = ['rainfall', 'humidity', 'temperature', 'water_level']
        importances = model.feature_importances_
        sns.barplot(x=feats, y=importances, palette='magma')
        plt.title('Feature Importance (Decision Tree)')
        plt.ylabel('Importance')
        plt.tight_layout()
        plt.savefig('feature_importance_dt.png')
        print("Saved 'feature_importance_dt.png'")
        
    with open('results_utf8.txt', 'w', encoding='utf-8') as f:
        f.write(output_text)
    print("Saved 'results_utf8.txt'")
    print(output_text)

    # Save metrics for prediction script
    # We only need name and accuracy to pick the best one, 
    # but let's save more just in case.
    metrics_export = []
    for r in results:
        metrics_export.append({
            'name': r['name'],
            'accuracy': r['accuracy']
        })
    
    with open('model_metrics.json', 'w') as f:
        json.dump(metrics_export, f, indent=4)
    print("Saved 'model_metrics.json'")

if __name__ == "__main__":
    evaluate_models()
