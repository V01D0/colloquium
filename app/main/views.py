from flask import render_template, session, redirect, url_for, current_app, abort
from flask.helpers import flash, get_flashed_messages
from flask_login.utils import login_required
from .. import db
from ..models import Users, BlogsInfo, Posts, gen_post_id
from ..email import send_email
from . import main
from .forms import CreateBlog, PostSubmit
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask_login import login_required, current_user
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    JWTManager,
    set_access_cookies,
    unset_jwt_cookies,
)


@main.route("/")
@jwt_required(optional=True)
def index():
    return render_template("index.html")


@main.route("/blog/create", methods=["GET", "POST"])
@login_required
@jwt_required()
def create():
    form = CreateBlog()
    if form.validate_on_submit():
        if len(form.added_users.data) > 0:
            added_users = [user for user in form.added_users.data.split("|")]
            description = form.description.data
            blog_name = form.blog_name.data
            heading = form.heading.data
            blog = BlogsInfo.query.filter_by(name=blog_name).first()
            my_id = current_user.id
            if blog is None:
                blog = BlogsInfo(
                    name=blog_name, description=description, heading=heading
                )
                db.session.add(blog)
                db.session.commit()
                return redirect(url_for("main.view_blog", blog=blog_name))
            else:
                flash("That blog name is taken 🙁", "error")
        else:
            flash(
                "An error occurred. Contact support and mention error code - Freddie",
                "error",
            )
    return render_template("blog/create.html", form=form)


@main.route("/b/<blog>")
# @main.route("/blog/<blog>")
@jwt_required(optional=True)
def view_blog(blog):
    """Display blog to user"""
    is_real_blog = BlogsInfo.query.filter_by(name=blog).first()
    if not is_real_blog:
        abort(404)
    blog_title = is_real_blog.heading
    blog_description = is_real_blog.description
    print(blog_description)
    return render_template(
        "blog/home.html", title=blog_title, description=blog_description
    )


@main.route("/submit", methods=["GET", "POST"])
@login_required
@jwt_required()
def submit_post():
    """Submit a post"""
    form = PostSubmit()
    if form.validate_on_submit():
        if len(form.added_blogs.data) > 0:
            added_blogs = [int(blog) for blog in form.added_blogs.data.split("|")]
            title = form.title.data
            body = form.body.data
            user_id = current_user.id
            # rand_name = gen_post_id()
            # for blog in added_blogs:
            posts = []
            # post = Posts(
            #     post_id=rand_name, post_author=user_id, post_title=title, post_body=body
            # )
            # print(type(post))
            for blog in added_blogs:
                posts.append(
                    Posts(
                        post_id=gen_post_id(),
                        post_author=user_id,
                        post_title=title,
                        post_body=body,
                        blog=blog,
                    )
                )
            db.session.add_all(posts)
            db.session.commit()
        else:
            flash(
                "An error occurred. Contact support and mention error code - Paige",
                "error",
            )

    return render_template("blog/submit.html", form=form)


# @main.route("/b/<blog>/<id>")
# @jwt_required(optional=True)
# def display_post():
#     """Display a post"""
