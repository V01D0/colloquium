from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.fields.core import BooleanField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Email, Regexp, length, EqualTo


class loginForm(FlaskForm):
    username = StringField('Username', validators=[length(min=3, max=30, message='Username must be between 3 and 30 characters'), DataRequired(),
    Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0, 'Usernames must have only letters, numbers, dots or underscores')])
    password = PasswordField('Password', validators=[DataRequired(), length(min=8, max=52, message='Password must be between 8 and 52 characters'),
    Regexp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', 0, 
    'Passwords must contain a of minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')])
    remember_me = BooleanField('Remember me')
    submit = SubmitField('Login')

class signupForm(FlaskForm):
    username = StringField('Username', validators=[length(min=3, max=30, message='Username must be between 3 and 30 characters'),
    DataRequired(), Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0, 'Usernames must have only letters, numbers, dots or underscores')])
    password = PasswordField('Password', validators=[DataRequired(),EqualTo('confirm', message='Passwords must match'),
    length(min=8, max=52, message='Password must be between 8 and 52 characters'),
    Regexp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', 0,
    'Passwords must contain a of minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')])
    confirm = PasswordField('Confirm Password', validators=[DataRequired()])
    submit = SubmitField("Register")

class getMailForm(FlaskForm):
    email = EmailField('E-mail', validators=[DataRequired(), Email('This field requires a valid email address')])
    submit = SubmitField("Send registration mail")