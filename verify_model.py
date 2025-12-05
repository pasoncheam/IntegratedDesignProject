import joblib
import os
import sys

try:
    model = joblib.load('svm.pkl')
    print(f"Model loaded successfully.")
    if hasattr(model, 'n_features_in_'):
        print(f"Expected features: {model.n_features_in_}")
    else:
        # Try to inspect the pipeline steps if it is a pipeline
        if hasattr(model, 'steps'):
            print("Model is a Pipeline.")
            # usually the first step is scaler, check that
            # or check the classifier at the end
            clf = model.steps[-1][1]
            if hasattr(clf, 'n_features_in_'):
                print(f"Classifier expected features: {clf.n_features_in_}")
            else:
                print("Could not determine n_features_in_ from classifier.")
        else:
            print("Model does not have n_features_in_ attribute.")

except Exception as e:
    print(f"Error loading model: {e}")
