from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin
from sqlalchemy.types import JSON
from sqlalchemy.ext.mutable import MutableList
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_fallback')
db = SQLAlchemy(app)
api = Api(app)

bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class UserModel(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False) #longer to hold hash
    email = db.Column(db.String(80), unique=True, nullable=False)
    transactions = db.Column(MutableList.as_mutable(JSON))

    def __repr__(self):
        return f"User(username = {self.username}, email = {self.email})"

@login_manager.user_loader
def load_user(user_id):
    return UserModel.query.get(int(user_id))     

userFields = {
    'id': fields.Integer, 
    'username': fields.String,
    'password': fields.String,
    'email': fields.String,
    'transactions': fields.Raw,
}

# class Users(Resource):
#     @marshal_with(userFields)
#     def get(self):
#         users = UserModel.query.all()
#         return users

#     @marshal_with(userFields)
#     def post(self):
#         data = request.get_json()
#         user = UserModel(
#             username=data["username"],
#             email=data["email"],
#             transactions=data.get("transactions", [])
#         )
#         db.session.add(user)
#         db.session.commit()
#         users = UserModel.query.all()
#         return users, 201

# class User(Resource):
#     @marshal_with(userFields)
#     def get(self, id):
#         user = UserModel.query.filter_by(id=id).first()
#         if not user:
#             abort(404, message="User not found")
#         return user

#     @marshal_with(userFields)
#     def patch(self, id):
#         data = request.get_json()
#         user = UserModel.query.filter_by(id=id).first()
#         if not user:
#             abort(404, message="User not found")
#         user.username = data["username"]
#         user.email = data["email"]
#         user.transactions = data["transactions"]
#         db.session.commit()
#         return user

#     @marshal_with(userFields)
#     def delete(self, id):
#         user = UserModel.query.filter_by(id=id).first()
#         if not user:
#             abort(404, message="User not found")
#         db.session.delete(user)
#         db.session.commit()
#         users = UserModel.query.all()
#         return users, 201

class addTransaction(Resource):
    @marshal_with(userFields)
    def patch(self, id):
        data = request.get_json()
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        user.transactions = user.transactions + data["transactions"]
        db.session.commit()
        return user

class getUserTransactions(Resource):
    @marshal_with(userFields)
    def get(self, id):
        filterValue = request.args.get('filter', default=None, type=str)

        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")

        if filterValue and filterValue != 'All':
            user = user.filter.filter_by(type=filtervalue)
        return user

class deleteTransaction(Resource):
    @marshal_with(userFields)
    def delete(self, id):
        user = UserModel.query.filter_by(id=id).first()
        transactionId = request.args.get('transactionId', default=None, type=int)

        if not user:
            abort(404, message="User not found")
        if transactionId is None:
            abort(400, message="Transaction ID is required")

        user.transactions = [t for t in user.transactions if t['id'] != transactionId]
        db.session.commit()
        return user

class editTransaction(Resource):
    @marshal_with(userFields)
    def patch(self, id):
        user = UserModel.query.filter_by(id=id).first()
        transactionId = request.args.get('transactionId', default=None, type=int)
        data = request.get_json()

        if not user:
            abort(404, message="User not found")
        if transactionId is None:
            abort(400, message="Transaction ID is required")
        
        transactions = user.transactions.copy() if user.transactions else []

        for i, transaction in enumerate(transactions):
            if transaction.get("id") == transactionId:
                transactions[i] = {**transaction, **data}
                break

        user.transactions = transactions
        db.session.commit()
        return user

class registerUser(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if UserModel.query.filter_by(email=email).first():
            abort(400, message="Email already exists")
        if UserModel.query.filter_by(username=username).first():
            abort(400, message="Username already exists")

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = UserModel(username=username, email=email, password=hashed_password, transactions=[])
        db.session.add(new_user)
        db.session.commit()
        return{"message": "User registered successfully"}, 201

class login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = UserModel.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            abort(401, message="Invalid email or password")
        
        login_user(user)
        return {"message": f"Logged in as {user.username}"}, 200

class logout(Resource):
    def post(self):
        logout_user()
        return{"message": "Logged out"}, 200

# api.add_resource(User, '/api/users/<int:id>')
# api.add_resource(Users, '/api/users/')
api.add_resource(addTransaction, '/api/addTransaction/<int:id>')
api.add_resource(getUserTransactions, '/api/getUserTransactions/<int:id>')
api.add_resource(deleteTransaction, '/api/deleteTransaction/<int:id>')
api.add_resource(editTransaction, '/api/editTransaction/<int:id>')
api.add_resource(registerUser, '/api/registerUser')
api.add_resource(login, '/api/login')
api.add_resource(logout, '/api/logout')


# @app.route('/')
# def home():
#     return "<h1>Hello World!</h1>"

if __name__ == '__main__':
    app.run(debug=True)