import os
from flask import Flask
from flask import render_template
from markupsafe import escape
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/c/<community>')
def show_user_profile(community):
    # show the user profile for that user
    return f'Community {escape(community)}'


# @app.route('/hi')
# def index():
#     return 'Index Page'


@app.route('/hey')
def hey():
    return 'hey'


@app.route('/hello_world')
def hello():
    return 'Hello, World'
