import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

#Logistic Regression

# Load the dataset
df = pd.read_csv('./manually_balanced_flood_prediction_data_chennai (1).csv')

# Optional: One-hot encode 'Location Name' if you decide to use it
# df = pd.get_dummies(df, columns=['Location Name'], drop_first=True)

# Exclude 'Location Name', 'Latitude', and 'Longitude' for simplicity
df = df.drop(columns=['Location Name', 'Latitude', 'Longitude'])

# Assuming 'Previous Flood History' is your target variable
X = df.drop('Flood Event', axis=1)  # Features
y = df['Flood Event']  # Target variable

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create an instance of the Logistic Regression model
model = LogisticRegression(max_iter=1000)  # Increasing max_iter for convergence if necessary

# Fit the model to the training data
model.fit(X_train, y_train)

# Predict the target variable for the test set
y_pred = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred)
cm = confusion_matrix(y_test, y_pred)

print("Accuracy:", accuracy)
print("\nClassification Report:\n", report)
print("\nConfusion Matrix:\n", cm)
