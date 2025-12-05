from flask import Flask, request
from utils import train_all_models

app = Flask(__name__)  

models = train_all_models()
feature_names = ['Rainfall Amount', 'River Water Level', 'Temperature','Relative Humidity']


def shape_input_data(request_data):
    input_data = [
        request_data['rainfallAmount'],
        request_data['relativeHumidity'],
        request_data['temperature'],
        request_data['riverWaterLevel']
    ]
    # print(input_data)
    return [input_data]

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/logistic_regression', methods=['GET'])
def linear_regression_get():
    model = models['logistic_regression']
    feature_importance = model.coef_
    return {
        "feature_importance": feature_importance.tolist(),
        "feature_names": feature_names
    }

@app.route('/logistic_regression', methods=['POST'])
def logistic_regression():
    request_data = request.get_json()
    latitude = request_data.pop("latitude", None)
    longitude = request_data.pop("longitude", None)
    location_name = request_data.pop("location Name", None)
    input_data = shape_input_data(request_data)

    # Reshape into a 2D array
    logistic_regression_model = models['logistic_regression']
    # logistic_regression_model.fit()
    print(request_data)
    result = logistic_regression_model.predict(input_data)
    print(result)
    return str(result[0])

@app.route('/decision_tree', methods=['GET'])
def decision_tree_get():
    model = models['decision_tree']
    feature_importance = model.feature_importances_
    return {
        "feature_importance": feature_importance.tolist(),
        "feature_names": feature_names
    }

@app.route('/decision_tree', methods=['POST'])
def decision_tree():
    request_data = request.get_json()
    input_data = shape_input_data(request_data)

    # Reshape into a 2D array
    # input_data = [input_data]  
    decision_tree_model = models['decision_tree']
    # decision_tree_model.fit()
    result = decision_tree_model.predict(input_data)
    return str(result[0])

@app.route('/svm', methods=['POST'])
def svm():
    request_data = request.get_json()
    input_data = shape_input_data(request_data)

    # Reshape into a 2D array
    # input_data = [input_data]  
    svm_model = models['svm']
    # svm_model.fit()
    print(input_data)
    result = svm_model.predict(input_data)
    return str(result[0])

@app.route('/svm', methods=['GET'])
def svm_get():
    model = models['svm']
    feature_importance = model.coef_[0]
    return {
        "feature_importance": feature_importance.tolist(),
        "feature_names": feature_names
    }

if __name__ == '__main__':
    app.run(debug=True) 
