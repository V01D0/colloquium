from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, length, EqualTo

class loginForm(FlaskForm):
    username = StringField('Username', validators=[length(min=3, max=30), DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField("Login")

class signupForm(FlaskForm):
    username = StringField('Username', validators=[length(min=3, max=30), DataRequired()])
    password = PasswordField('Password', validators=[DataRequired(),EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField('Confirm Password', validators=[DataRequired()])
    submit = SubmitField("Register")