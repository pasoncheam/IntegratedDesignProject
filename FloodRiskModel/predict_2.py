import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Linear   Regression 

# Load the dataseq
df = pd.read_csv('balanced_data.csv')

# Optional: One-hot encode the 'Location Name' if you decide to use it
# df = pd.get_dummies(df, columns=['Location Name'], drop_first=True)

# For this example, let's exclude 'Location Name' assuming it's not used
df = df.drop(columns=['Location Name', 'Latitude', 'Longitude'])  # Dropping for simplicity

# Assuming 'Will Cause Flood' is your target variable
# Replace 'Will Cause Flood' with the actual name of your target column
X = df.drop('Previous Flood History', axis=1)  # Features
y = df['Previous Flood History']  # Target variable

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize the features (important for some models, optional for Decision Tree)
# Apply Linear Regression

# Create an instance of the Linear Regression model
model = LinearRegression()

# Fit the model to the training data
model.fit(X_train, y_train)

# Predict the target variable for the test set
y_pred = model.predict(X_test)

# Evaluate the model using regression metrics
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("Mean Squared Error:", mse) #Error: 0.0 means perfect prediction
print("R2 Score:", r2) # R2 Score: 1.0 means perfect prediction
