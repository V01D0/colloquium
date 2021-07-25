from . import db
from werkzeug.security import check_password_hash, generate_password_hash
from flask_login import UserMixin
from flask import current_app, request
from . import login_manager
from flask_jwt_extended import create_access_token
from flask_jwt_extended import decode_token
from random import choice
import string
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required

class Users(UserMixin, db.Model):
    """ Table that handles the User's username, password, email """
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        """ Function to verify password with hash in DB """
        return check_password_hash(self.password_hash, password)

    def generate_confirmation_token(self):
        """ Function that returns a JWT """
        token = create_access_token(self.email)
        return token

    def __repr__(self):
        return '<User %r>' % self.username


class BlogsInfo(db.Model):
    """ Info about each blog """
    __tablename__ = 'blogs_information'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, index=True)


class Blogs(db.Model):
    """ Blogs that a user is subscribed to """
    __tablename__ = 'blogs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String(64), db.ForeignKey('blogs_information.name'))


def gen_post_id(length=6):
    """ Function to generate random post id """
    return ''.join(choice(string.ascii_letters + string.digits) for _ in range(length))


class Posts(db.Model):
    """ All posts """
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.String(12), unique=True)
    post_author = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_title = db.Column(db.String(256))
    post_body = db.Column(db.String)

def confirm(token):
    try:
        decoded_token = decode_token(token)
        email = decoded_token['sub']
        return email
    except:
        return False


@ login_manager.user_loader
def load_user(user_id):
    """ Function that returns user id """
    return Users.query.get(int(user_id))
