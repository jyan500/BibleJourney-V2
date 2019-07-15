from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class VersesForm(FlaskForm):
	verse = StringField('Verse', 
		validators = [DataRequired()])
	submit = SubmitField('Search')

	# def validate_username(self, username):

	# 	user = User.query.filter_by(username=username.data).first()
	# 	if user:
	# 		raise ValidationError('That username is not available, please choose another username!')
	# def validate_email(self, email):
	# 	email = User.query.filter_by(email=email.data).first()
	# 	if email:
	# 		raise ValidationError('That email is not available, please choose another email!')



