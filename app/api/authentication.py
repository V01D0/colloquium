from flask_restful import Resource, reqparse
from ..models import Users
from . import api
from flask_jwt_extended import create_access_token, create_refresh_token
from flask import jsonify


class Username(Resource):
    """Check if username exists in database"""

    def get(self):
        """on GET"""
        arg_parser = reqparse.RequestParser()
        arg_parser.add_argument(
            "username",
            dest="username",
            location="args",
            required=True,
            help="The user's username",
        )
        args = arg_parser.parse_args()
        user = Users.query.filter_by(username=args.username).first()
        if user is None:
            return {"status": True}
        return {"status": False}


api.add_resource(Username, "/checkuser")


class Login(Resource):
    """Check if login credentials are valid"""

    def post(self):
        """on POST"""
        arg_parser = reqparse.RequestParser()
        arg_parser.add_argument(
            "username",
            dest="username",
            required=True,
            help="The user's username",
        )
        arg_parser.add_argument(
            "password",
            dest="password",
            required=True,
            help="The user's password",
        )
        args = arg_parser.parse_args()
        user = Users.query.filter_by(username=args.username).first()
        result = {"status": False}
        if user is not None and user.verify_password(args.password):
            result["status"] = True
            result["access_token"] = create_access_token(
                identity=args.username, fresh=True
            )
            result["refresh_token"] = create_refresh_token(identity=args.username)
        return result


api.add_resource(Login, "/auth/login")
