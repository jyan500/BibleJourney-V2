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
	bookmarks = db.relationship('Bookmark', backref = 'author', lazy=True)

	def __repr__(self):
		return f"User('{self.username}', '{self.email}', '{self.image_file}')"

class Note(db.Model):
	id = db.Column(db.Integer, primary_key=True)	
	content = db.Column(db.Text, nullable = False)
	date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
	## in the foreign key, we're referencing the table so user is lowercase
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
	book = db.Column(db.String(20))
	chapter = db.Column(db.String(20))	
	verse = db.Column(db.String(20))

	def __repr__(self):
		return f"Note('{self.content}', '{self.date_posted}', '{self.book}', '{self.chapter}, '{self.verse}')"

class BookRef(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	book = db.Column(db.String(20), unique=True, nullable=False)
	num_chapters = db.Column(db.String(20), nullable=False)

	def __repr__(self):
		return f"BookRef('{self.book}', '{self.num_chapters}')"

class Bookmark(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
	book = db.Column(db.String(20))
	chapter = db.Column(db.String(20))
	verse =  db.Column(db.String(20))	
	highlight_color = db.Column(db.String(20))
	date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

	def __repr__(self):
		return f"Bookmark('{self.book}', '{self.chapter}', '{self.verse}', '{self.date_posted}')"
