from flask import Flask, jsonify
from routes.user import user_api

app = Flask(__name__)

# register blueprint (user.py)
app.register_blueprint(user_api)

@app.route("/", methods=['GET'])
def home():
    return jsonify({"location": "home", "message": "welcome to BroncoHacks!"}), 200

# example endpoint with a URL parameter
@app.route("/sayname/<name>", methods=["GET"])
def say_name(name):
    return {"message": f"hello {name}!"}


if __name__ == '__main__':
    app.run(debug=True)