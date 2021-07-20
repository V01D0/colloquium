from .forms import LoginForm, SignupForm, GetMailForm
from . import auth
from flask import render_template, session, redirect, url_for, request
from flask.helpers import flash
from .. import db
from ..models import User
from flask_login import login_user, logout_user, login_required, current_user
from ..email import send_email
from app import models

from app import email




@auth.route('/login', methods=['GET','POST'])
def login():
    form = LoginForm()
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    if form.validate_on_submit():
        # user = User.query.filter_by(username=form.username.data).first()
        user = User.query.filter((User.email == form.username.data) | (User.username == form.username.data)).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me)
            next = request.args.get('next')
            if next is None or not next.startswith('/'):
                next = url_for('main.index')
            return redirect(next)
        else:
            flash('Either your username or password are incorrect','error')
    return render_template('auth/login.html',form=form)

@auth.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
    form = GetMailForm()
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    if form.validate_on_submit():
        mail = User.query.filter_by(email=form.email.data).first()
        if mail is None:
            user = User(email=form.email.data.lower())
            print(f'SENDING MAIL TO ->{form.email.data.lower()}')
            token = user.generate_confirmation_token()
            print(token)
            flash('A confirmation email has been sent to you by email.','info')
            return redirect(url_for('main.index'))
            # send_email(form.email.data, "Colloquium registration", "auth/verify/")
        else:
            flash('An error occured', 'error')
            return redirect(url_for('.sign_up'))
    return render_template('auth/get_mail.html',form=form)

@auth.route('/confirm/<token>', methods=['GET', 'POST'])
def confirm(token):
    form = SignupForm()
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    email = models.confirm(token)
    if not email:
        flash('An error occured','error')
        return redirect(url_for('main.index'))
    mail = User.query.filter_by(email=email).first()
    if mail is not None:
        flash('An error occured!','error')
        return redirect(url_for('main.index'))
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None:
            user = User(username=form.username.data,password=form.password.data,email=email)
            db.session.add(user)
            db.session.commit()
            flash('Welcome to colloquium!','success')
            return redirect(url_for('main.index'))
    elif not email:
        flash('An error occured','error')
        return redirect(url_for('main.index'))
    return render_template('auth/sign_up.html',form=form)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Successfully logged out!','info')
    return redirect(url_for('main.index'))