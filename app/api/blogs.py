# SELECT username FROM users WHERE username LIKE 'r%';
from flask_restful import Resource, reqparse
from flask import jsonify
from . import api
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from ..models import BlogsInfo, Users


class BlogCheck(Resource):
    """Check if blog name exists"""

    def get(self):
        """on GET"""
        arg_parser = reqparse.RequestParser()
        arg_parser.add_argument(
            "blog",
            dest="blog",
            location="args",
            required=True,
            help="The user's preferred blog name",
        )
        args = arg_parser.parse_args()
        blog = BlogsInfo.query.filter_by(name=args.blog).first()
        if blog is None:
            return {"status": True}
        return {"status": False}


api.add_resource(BlogCheck, "/blogcheck")


class BlogUserCheck(Resource):
    """List users with names like name%"""

    @jwt_required()
    def get(self):
        identity = get_jwt_identity()
        arg_parser = reqparse.RequestParser()
        arg_parser.add_argument(
            "friend",
            dest="friend",
            location="args",
            required=True,
            help="The user's friend",
        )
        args = arg_parser.parse_args()
        response = []
        chars = set("%$`")
        if (
            args.friend.strip() != ""
            and not any((c in chars) for c in args.friend.strip())
            and not args.friend.startswith("_")
        ):
            args.friend = args.friend.replace("_", "\\_")
            users_like = (
                Users.query.with_entities(Users.username)
                .filter(Users.username != identity)
                .filter(Users.username.ilike(f"{args.friend}%"))
                .all()
            )
            response = [value for (value,) in users_like]
        user_obj = {}
        user_obj["users"] = response
        return user_obj


api.add_resource(BlogUserCheck, "/blogusercheck")
