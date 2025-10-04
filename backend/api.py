from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from sqlalchemy.types import JSON

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)

class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    transactions = db.Column(JSON)

    def __repr__(self):
        return f"User(userName = {self.userName}, email = {self.email})"


userFields = {
    'id': fields.Integer, 
    'userName': fields.String,
    'email': fields.String,
    'transactions': fields.Raw,
}

class Users(Resource):
    @marshal_with(userFields)
    def get(self):
        users = UserModel.query.all()
        return users

    @marshal_with(userFields)
    def post(self):
        data = request.get_json()
        user = UserModel(
            userName=data["userName"],
            email=data["email"],
            transactions=data.get("transactions", [])
        )
        db.session.add(user)
        db.session.commit()
        users = UserModel.query.all()
        return users, 201

class User(Resource):
    @marshal_with(userFields)
    def get(self, id):
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, "User not found")
        return user

    @marshal_with(userFields)
    def patch(self, id):
        args = user_args.parse_args()
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, "User not found")
        user.userName = args["userName"]
        user.email = args["email"]
        db.session.commit()
        return user

    @marshal_with(userFields)
    def delete(self, id):
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, "User not found")
        db.session.delete(user)
        db.session.commit()
        users = UserModel.query.all()
        return users, 201

api.add_resource(User, '/api/users/<int:id>')
api.add_resource(Users, '/api/users/')

@app.route('/')
def home():
    return "<h1>Hello World!</h1>"

if __name__ == '__main__':
    app.run(debug=True)