from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api, reqparse, fields, marshal_with, abort
from sqlalchemy.types import JSON
from sqlalchemy.ext.mutable import MutableList

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
api = Api(app)

class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userName = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    transactions = db.Column(MutableList.as_mutable(JSON))

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
            abort(404, message="User not found")
        return user

    @marshal_with(userFields)
    def patch(self, id):
        data = request.get_json()
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        user.userName = data["userName"]
        user.email = data["email"]
        user.transactions = data["transactions"]
        db.session.commit()
        return user

    @marshal_with(userFields)
    def delete(self, id):
        user = UserModel.query.filter_by(id=id).first()
        if not user:
            abort(404, message="User not found")
        db.session.delete(user)
        db.session.commit()
        users = UserModel.query.all()
        return users, 201

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

        # print(transactions)
        print(data)

        user.transactions = transactions
        db.session.commit()
        return user

api.add_resource(User, '/api/users/<int:id>')
api.add_resource(Users, '/api/users/')
api.add_resource(addTransaction, '/api/addTransaction/<int:id>')
api.add_resource(getUserTransactions, '/api/getUserTransactions/<int:id>')
api.add_resource(deleteTransaction, '/api/deleteTransaction/<int:id>')
api.add_resource(editTransaction, '/api/editTransaction/<int:id>')


@app.route('/')
def home():
    return "<h1>Hello World!</h1>"

if __name__ == '__main__':
    app.run(debug=True)