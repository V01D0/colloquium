from datetime import timedelta
from flask import Flask, session, render_template, request, url_for, redirect
from markupsafe import escape
from flask_sqlalchemy import SQLAlchemy
from werkzeug.wrappers import request
from flask import request
from wtforms.csrf.session import SessionCSRF
from wtforms import Form, BooleanField, StringField, PasswordField, validators

app = Flask(__name__)

app.config.from_object('config.DevelopmentConfig')
db = SQLAlchemy(app)
# secret = app.config.get('SECRET_KEY')


class loginForm(Form):
    class Meta:
        csrf = True
        csrf_secret = app.config.get('CSRF_SECRET').encode("utf-8")
        csrf_class = SessionCSRF
        csrf_time_limit = timedelta(minutes=20)

        @property
        def csrf_context(self):
            return session
    username = StringField('Username', [validators.length(
        min=3, max=30), validators.DataRequired()])
    password = PasswordField('Password', [validators.DataRequired()])
    # email = StringField('email')


class signupForm(Form):
    class Meta:
        csrf = True
        csrf_secret = app.config.get('CSRF_SECRET').encode("utf-8")
        csrf_class = SessionCSRF
        csrf_time_limit = timedelta(minutes=20)

        @property
        def csrf_context(self):
            return session
    email = StringField(
        'E-mail', [validators.Email(), validators.DataRequired()])
    password = PasswordField('Password', [
        validators.DataRequired(),
        validators.EqualTo('confirm', message='Passwords must match')
    ])
    confirm = PasswordField('Confirm Password', [
        validators.DataRequired()
    ])


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/c/<community>')
def show_user_profile(community):
    # show the user profile for that user
    return f'Community {escape(community)}'


# @app.route('/hi')
# def index():
#     return 'Index Page'

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = loginForm(request.form)
    # if form.validate()
    if request.method == "GET" and 'username' not in session:
        return render_template('login.html', form=form)
    elif request.method == "GET" and 'username' in session:
        redirect(url_for('index'))
    # elif request.method == "POST":


@app.route('/sign_up', methods=['GET', 'POST'])
def register():
    form = signupForm(request.form)
    if request.method == "GET" and 'username' not in session:
        return render_template("sign_up.html", form=form)
    elif request.method == "GET" and 'username' in session:
        redirect(url_for('index'))


@app.route('/hey')
def hey():
    return 'hey'


@app.route('/hello_world')
def hello():
    return 'Hello, World'
