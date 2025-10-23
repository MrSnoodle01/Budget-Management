from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, login_user, login_required, logout_user, current_user, UserMixin
from sqlalchemy.types import JSON
from sqlalchemy.ext.mutable import MutableList
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev_secret_fallback')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_fallback')

db = SQLAlchemy(app)
api = Api(app)
jwt = JWTManager(app)

bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class UserModel(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=True)
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

class addTransaction(Resource):
    @jwt_required()
    def patch(self):
        data = request.get_json()
        user_id = get_jwt_identity()
        user = UserModel.query.get(int(user_id))
        if not user:
            abort(404, message="User not found")
        user.transactions = user.transactions + data["transactions"]
        db.session.commit()
        return {"transactions": user.transactions}, 200

class getUserTransactions(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        user = UserModel.query.filter_by(id=user_id).first()

        if not user:
            abort(404, message="User not found")

        return {"transactions": user.transactions}, 200

class deleteTransaction(Resource):
    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        user = UserModel.query.get(int(user_id))
        transactionId = request.args.get('transactionId', default=None, type=int)

        if not user:
            abort(404, message="User not found")
        if transactionId is None:
            abort(400, message="Transaction ID is required")

        user.transactions = [t for t in user.transactions if t['id'] != transactionId]
        db.session.commit()
        return {"transactions": user.transactions}, 200

class editTransaction(Resource):
    @jwt_required()
    def patch(self):
        user_id = get_jwt_identity()
        user = UserModel.query.filter_by(id=user_id).first()
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
        return {"transactions": user.transactions}, 200

class registerUser(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if UserModel.query.filter_by(email=email).first():
            abort(400, message="Email already exists")

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = UserModel(username=email, email=email, password=hashed_password, transactions=[])
        db.session.add(new_user)
        db.session.commit()
        return{"message": "User registered successfully"}, 200

class login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = UserModel.query.filter_by(email=email).first()
        if not user or not bcrypt.check_password_hash(user.password, password):
            abort(401, message="Invalid email or password")
        
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=2))
        return {
            "access_token": token,
            "user":{
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        }, 200

api.add_resource(addTransaction, '/api/addTransaction')
api.add_resource(getUserTransactions, '/api/getUserTransactions')
api.add_resource(deleteTransaction, '/api/deleteTransaction')
api.add_resource(editTransaction, '/api/editTransaction')
api.add_resource(registerUser, '/api/registerUser')
api.add_resource(login, '/api/login')

if __name__ == '__main__':
    app.run(debug=True)