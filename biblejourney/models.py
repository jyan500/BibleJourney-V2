from datetime import datetime 
from biblejourney import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
	return User.query.get(int(user_id))

class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(20), unique=True, nullable=False)
	email = db.Column(db.String(120), unique=True, nullable=False)
	image_file = db.Column(db.String(20), nullable=False, default='default.jpg')	
	password = db.Column(db.String(60), nullable=False)
	## 'Note', is the model that this model relates to. (not the table, that would be lowercase )
	## backref = when we have a note, use the author attribute to get the note 
	## lazy = when at the time this data is loaded, all the posts will also be loaded for the given user
	notes = db.relationship('Note', backref = 'author', lazy=True)

	def __repr__(self):
		return f"User('{self.username}', '{self.email}', '{self.image_file}')"