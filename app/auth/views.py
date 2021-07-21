from .forms import LoginForm, SignupForm, GetMailForm
from . import auth
from flask import render_template, session, redirect, url_for, request
from flask.helpers import flash
from .. import db
from ..models import Users
from flask_login import login_user, logout_user, login_required, current_user
from ..email import send_email
from app import models
from app import email


@auth.route('/login', methods=['GET', 'POST'])
def login():
    """ Function to log an existing user in """
    form = LoginForm()
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        # user = Users.query.filter((Users.email == form.username.data) | (Users.username == form.username.data)).first()
        if user is not None and user.verify_password(form.password.data):
            login_user(user, form.remember_me)
            next = request.args.get('next')
            if next is None or not next.startswith('/'):
                next = url_for('main.index')
            return redirect(next)
        else:
            flash('Either your username or password are incorrect', 'error')
    return render_template('auth/login.html', form=form)


@auth.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
    """ Function to register a new user """
    form = GetMailForm()
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    if form.validate_on_submit():
        mail = Users.query.filter_by(email=form.email.data).first()
        if mail is None:
            user = Users(email=form.email.data.lower())
            print(f'SENDING MAIL TO ->{form.email.data.lower()}')
            token = user.generate_confirmation_token()
            print(token)
            flash('A confirmation email has been sent to you by email.', 'info')
            return redirect(url_for('main.index'))
            # send_email(form.email.data, "Colloquium registration", "auth/verify/")
        else:
            flash('An error occured', 'error')
            return redirect(url_for('.sign_up'))
    return render_template('auth/get_mail.html', form=form)


@auth.route('/confirm/<token>', methods=['GET', 'POST'])
def confirm(token):
    """ Confirm token passed as GET var """
    form = SignupForm()
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    email = models.confirm(token)
    if not email:
        flash('An error occured', 'error')
        return redirect(url_for('main.index'))
    mail = Users.query.filter_by(email=email).first()
    if mail is not None:
        flash('An error occured!', 'error')
        return redirect(url_for('main.index'))
    if form.validate_on_submit():
        user = Users.query.filter_by(username=form.username.data).first()
        if user is None:
            user = Users(username=form.username.data,
                         password=form.password.data, email=email)
            db.session.add(user)
            db.session.commit()
            flash('Welcome to colloquium!', 'success')
            return redirect(url_for('main.index'))
        else:
            flash('That username is taken 🙁', 'error')
            return redirect(request.url)
    elif not email:
        flash('An error occured', 'error')
        return redirect(url_for('main.index'))
    return render_template('auth/sign_up.html', form=form)


@auth.route('/logout')
@login_required
def logout():
    """ Function that logs out a user """
    logout_user()
    flash('Successfully logged out!', 'info')
    return redirect(url_for('main.index'))
