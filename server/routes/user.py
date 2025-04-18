from flask import request, jsonify, Blueprint

user_api = Blueprint('user_api', __name__)

# test data
users = [{"id": 1, "name": "Justin Nguyen", "major": "Computer Science"},
         {"id": 2, "name": "Daniel Pasion", "major": "Computer Science"},
         {"id": 3, "name": "Billy Bronco", "major": "Animal Health Science"}]

# GET request
@user_api.route("/users/", methods=['GET'])
def get_users():
  return jsonify(users)

# GET request that uses URL parameter
@user_api.route("/users/<id>", methods=['GET'])
def get_user_by_id(id):
  id = int(id)
  for user in users:
    if user["id"] == id:
      print("hi")
      return jsonify(user), 200
  return jsonify({"error": "user not found"}), 404

# POST request that uses a request body
@user_api.route("/user/", methods=["POST"])
def create_new_user():
  name = request.json['name']
  major = request.json['major']

  new_user = {
    "id": len(users) + 1,
    "name": name,
    "major": major
  }
  users.append(new_user)
  return jsonify(new_user), 201