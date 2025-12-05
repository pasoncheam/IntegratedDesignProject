# Flood Management Software

This project is a Flood Management Software application server built using Flask. It utilizes various machine learning models to predict flood risks based on environmental factors.

## Features

- **Logistic Regression Model**
  - Predicts flood risk using a logistic regression algorithm.
  - Provides feature importance through model coefficients.
- **Decision Tree Model**
  - Predicts flood risk using a decision tree algorithm.
  - Provides feature importance through model feature importances.
- **Support Vector Machine (SVM) Model**
  - Predicts flood risk using an SVM algorithm.
  - Provides feature importance through model coefficients.

## Supported Algorithms

1. **Logistic Regression**
2. **Decision Tree**
3. **Support Vector Machine (SVM)**

## Input Features

The models use the following features for prediction:

- Rainfall Amount
- River Water Level
- Soil Moisture Content
- Temperature
- Relative Humidity
- Wind Speed
- Topography
- Urbanization Rate
- Drainage System Capacity
- Previous Flood History

## Setup Instructions

### Prerequisites

- Python 3.x
- Flask
- Required Python packages (listed in `requirements.txt`)

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/yourusername/flood-management-software.git
   cd flood-management-software
   ```

2. **Create a virtual environment**

   ```sh
   python3 -m venv venv
   source venv/bin/activate # On Windows use `venv\Scripts\activate`
   ```

3. **Install required packages**

   ```sh
   pip install -r requirements.txt
   ```

4. **Run the application**
   
   Make sure to use the python executable from the virtual environment:
   ```sh
   .\.venv\Scripts\python server.py
   ```

The server will start at `http://127.0.0.1:5000/`.

## API Endpoints

### GET `/`

Returns a welcome message.

### GET `/logistic_regression`

Returns the feature importance of the Logistic Regression model.

### POST `/logistic_regression`

Predicts flood risk using the Logistic Regression model. Expects a JSON payload with the input features.

Example:

```json
{
  "rainfallAmount": 100,
  "riverWaterLevel": 50,
  "soilMoistureContent": 30,
  "temperature": 25,
  "relativeHumidity": 60,
  "windSpeed": 10,
  "topography": 5,
  "urbanizationRate": 3,
  "drainageSystemCapacity": 8,
  "previousFloodHistory": 1
}
```

### GET `/decision_tree`

Returns the feature importance of the Decision Tree model.

### POST `/decision_tree`

Predicts flood risk using the Decision Tree model. Expects a JSON payload with the input features.

Example:

```json
{
  "rainfallAmount": 100,
  "riverWaterLevel": 50,
  "soilMoistureContent": 30,
  "temperature": 25,
  "relativeHumidity": 60,
  "windSpeed": 10,
  "topography": 5,
  "urbanizationRate": 3,
  "drainageSystemCapacity": 8,
  "previousFloodHistory": 1
}
```

### GET `/svm`

Returns the feature importance of the SVM model.

### POST `/svm`

Predicts flood risk using the SVM model. Expects a JSON payload with the input features.

Example:

```json
{
  "rainfallAmount": 100,
  "riverWaterLevel": 50,
  "soilMoistureContent": 30,
  "temperature": 25,
  "relativeHumidity": 60,
  "windSpeed": 10,
  "topography": 5,
  "urbanizationRate": 3,
  "drainageSystemCapacity": 8,
  "previousFloodHistory": 1
}
```

## Contributing

Please fork the repository and submit pull requests for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
