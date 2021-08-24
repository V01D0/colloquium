from wtforms.fields.core import SelectField
from wtforms.fields.simple import TextAreaField
from app import email
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, RadioField, HiddenField
from wtforms.validators import DataRequired, Email, Regexp, length, EqualTo, Optional


class CreateBlog(FlaskForm):
    """Form to create a blog"""

    blog_name = StringField(
        "Name of the blog",
        validators=[
            length(
                min=3,
                max=32,
                message="The name of your blog must have a minimum of 3 characters and a maximum of 32 characters",
            ),
            DataRequired(),
            Regexp(
                "^[a-zA-Z0-9-_]*$",
                0,
                "The name of your blog can only contain alphabets, numbers, dashes and underscores",
            ),
        ],
    )
    heading = StringField(
        "Heading/Title",
        validators=[DataRequired("Please give your blog a title/heading")],
    )
    description = TextAreaField(
        "Describe your blog",
        validators=[DataRequired("Please fill in the description of your blog")],
    )
    invite_list = StringField("Invite a friend or two", validators=[Optional()])
    added_users = HiddenField()
    posters = RadioField(
        "Decide who can post on this blog",
        validators=[DataRequired("Please choose who can post on your blog")],
        choices=[("0", "Anyone"), ("1", "Only me"), ("2", "Custom")],
    )
    submit = SubmitField("Create my blog!")


class PostSubmit(FlaskForm):
    """Form to create/submit posts"""

    blogs = StringField(
        "Select the blogs you'd like to share this to",
        validators=[DataRequired("Please select at least one community to post to")],
    )
    added_blogs = HiddenField()
    title = StringField(
        "Your post title",
        validators=[
            length(min=1, max=100, message="Can't have an empty title!"),
            DataRequired("Can't have an empty title!"),
        ],
    )
    body = TextAreaField(
        "Your post body",
        validators=[
            length(min=1, message="Can't have an empty body"),
            DataRequired("Can't have an empty body"),
        ],
    )
    submit = SubmitField("Submit!")
