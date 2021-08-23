# SELECT username FROM users WHERE username LIKE 'r%';
from flask_restful import Resource, reqparse
from flask import jsonify
from flask_login import current_user
from . import api
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from ..models import BlogsInfo, Users, gen_post_id, strip_image, gen_image_name
import werkzeug
import os

uploads_dir = "app/static/images/uploads"
allowed_types = ["image/png", "image/jpeg", "image/gif"]


class BlogCheck(Resource):
    """Check if blog name exists"""

    @jwt_required()
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


api.add_resource(BlogCheck, "/blog/check")


class UserList(Resource):
    """List users with names like name%"""

    @jwt_required()
    def get(self):
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
                Users.query.with_entities(Users.username,Users.id)
                .filter(Users.id != get_jwt_identity())
                .filter(Users.username.ilike(f"{args.friend}%"))
                .all()
            )
            print(users_like)
            response = [{"id":id,"username":value} for (value,id) in users_like]
            print(response)
        user_obj = {}
        user_obj = response
        return user_obj


api.add_resource(UserList, "/users/like")


class BlogList(Resource):
    """List blogs with names like name%"""

    @jwt_required()
    def get(self):
        arg_parser = reqparse.RequestParser()
        arg_parser.add_argument(
            "name",
            dest="name",
            location="args",
            required=True,
            help="The blog's name",
        )
        args = arg_parser.parse_args()
        response = []
        chars = set("%$`")
        if (
            args.name.strip() != ""
            and not any((c in chars) for c in args.name.strip())
            # and not args.name.startswith("_")
        ):
            args.name = args.name.replace("_", "\\_")
            blogs_like = (
                BlogsInfo.query.with_entities(BlogsInfo.name, BlogsInfo.description, BlogsInfo.id)
                .filter(
                    (
                        BlogsInfo.name.ilike(f"%{args.name}%")
                        | (BlogsInfo.description.ilike(f"%{args.name}%"))
                    )
                )
                .all()
            )
            print(blogs_like)
            response = [{"name":blog,"desc":description,"id":id} for (blog, description, id) in blogs_like]
            print(response)
        blog_obj = {}
        blog_obj["blogs"] = response
        return blog_obj


api.add_resource(BlogList, "/blogs/like")


class UploadFile(Resource):
    """Upload a file to to storage"""

    @jwt_required()
    def post(self):
        arg_parser = reqparse.RequestParser()
        arg_parser.add_argument(
            "file", type=werkzeug.datastructures.FileStorage, location="files"
        )
        args = arg_parser.parse_args()
        content_type = args.file.mimetype
        image = args.file.read()
        # stripped_image,length = strip_image(image)
        # stripped_image.seek(0, os.SEEK_END)
        # length = stripped_image.tell()
        # stripped_image.seek(0)
        args.file.seek(0, os.SEEK_END)
        length = args.file.tell()
        print(length)
        args.file.seek(0)
        response = {}
        response["status"] = False
        if content_type in allowed_types:
            if length > 2000000:
                response["reason"] = "Max file size is 2MB"
            else:
                # return {"status":True}
                ext = content_type.split("/")[1]
                rand_name = gen_image_name(path=uploads_dir)
                file = f"{rand_name}.{ext}"
                args.file.save(os.path.join(uploads_dir, file))
                # stripped_image.save(os.path.join(uploads_dir, file))
                response["status"] = True
                response["name"] = file
        else:
            response["reason"] = "Only JPEG/JPG, GIF and PNG files are allowed"
        return response


api.add_resource(UploadFile, "/upload/file")
