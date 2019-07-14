from flask import render_template, url_for, flash, redirect, request, Blueprint
from flask_login import login_user, current_user, logout_user, login_required
from biblejourney import db, bcrypt
from biblejourney.models import User
from biblejourney.users.forms import (RegistrationForm, LoginForm, UpdateAccountForm)
from biblejourney.users.utils import is_safe_url, save_picture

users = Blueprint('users', __name__)

@users.route("/register", methods = ['GET', 'POST'])
def register():
	if (current_user.is_authenticated):
		return redirect(url_for('main.home'))
	form = RegistrationForm()
	if (form.validate_on_submit()):
		hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
		user = User(username=form.username.data, email=form.email.data.lower(), password=hashed_password)
		db.session.add(user)
		db.session.commit()
		flash('Your account has been created, you are now able to login!', 'success')
		return redirect(url_for('users.login'))
	return render_template('users/register.html', title = 'Register', form = form)

@users.route("/login", methods = ["GET", "POST"])
def login():
	if (current_user.is_authenticated):
		return redirect(url_for('main.home'))
	form = LoginForm()
	if (form.validate_on_submit()):
		user = User.query.filter_by(email=form.email.data).first()
		if user and bcrypt.check_password_hash(user.password, form.password.data):
			login_user(user, remember=form.remember.data)
			## if the user accesses a protected route, redirect them to their intended page after login based
			## on the route listed in the query parameter 
			flash(f'You have been logged in!', 'success')
			next_page = request.args.get('next')
			if (not is_safe_url(next_page)):
				return abort(400)
			return redirect(next_page or url_for('main.home'))
		else:
			flash(f'Login Unsuccessful, Please check email and password', 'danger')

	return render_template('users/login.html', title = 'Login', form = form)

@users.route("/logout")
def logout():
	logout_user()
	flash(f'You have logged out!', 'success')
	return redirect(url_for('main.home'))

@users.route("/account", methods = ["GET", "POST"])
@login_required
def account():
	form = UpdateAccountForm()
	if request.method == 'POST' and form.validate_on_submit():
		if (form.picture.data):
			picture_file = save_picture(form.picture.data)
			current_user.image_file = picture_file 
		current_user.username = form.username.data
		current_user.email = form.email.data
		db.session.commit()
		flash('Your Account has been updated!', 'success')
		return redirect(url_for('users.account'))
	elif request.method == 'GET':
		form.username.data = current_user.username
		form.email.data = current_user.email

	image_file = url_for('static', filename='profile_pics/' + current_user.image_file)
	return render_template('users/account.html', title = 'Account', image_file = image_file, form = form)