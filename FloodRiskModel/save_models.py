import joblib
from utils import train_all_models
import os

def save_models():
    print("Training models...")
    models = train_all_models()
    
    print("Saving models...")
    for name, model in models.items():
        filename = f"{name}.pkl"
        joblib.dump(model, filename)
        print(f"Saved {name} to {filename}")

if __name__ == "__main__":
    save_models()
