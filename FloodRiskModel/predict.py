import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

# Decision Tree Classification

# Load the dataseq
df = pd.read_csv('balanced_data.csv')

# Optional: One-hot encode the 'Location Name' if you decide to use it
# df = pd.get_dummies(df, columns=['Location Name'], drop_first=True)

# For this example, let's exclude 'Location Name' assuming it's not used
# For this example, let's exclude 'Location Name' assuming it's not used
# df = df.drop(columns=['Location Name', 'Latitude', 'Longitude'])  # Dropping for simplicity

# Assuming 'Will Cause Flood' is your target variable
# Replace 'Will Cause Flood' with the actual name of your target column
features = ['Rainfall Amount (mm)', 'Relative Humidity (%)', 'Temperature (°C)', 'River Water Level (meters)']
X = df[features]
y = df['Flood Event']  # Target variable

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the features (important for some models, optional for Decision Tree)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Initialize the Decision Tree Classifier
clf = DecisionTreeClassifier(random_state=42)

# Train the model
clf.fit(X_train, y_train)

# Predict on the test set
y_pred = clf.predict(X_test)

# Evaluate the model
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

