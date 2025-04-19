from flask import Flask, jsonify
from flask_cors import CORS
from routes.parts import parts_api

app = Flask(__name__)

# register blueprints
app.register_blueprint(parts_api)

#Gives permission for the frontend to call the backend
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/", methods=['GET'])
def home():
    return jsonify({"location": "home", "message": "Welcome to PC Part Recommender!"}), 200

if __name__ == '__main__':
    app.run(debug=True)