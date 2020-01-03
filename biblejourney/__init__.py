from flask import Flask
from flask.json import JSONEncoder
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_migrate import Migrate
from biblejourney.config import Config
from datetime import date

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
## the name of the function that defines our route is 'login'
login_manager.login_view = 'users.login'
## bootstrap class to improve the look of the flashed message
login_manager.login_message_category = 'info'

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        try:
            if isinstance(obj, date):
                return obj.isoformat()
            iterable = iter(obj)
        except TypeError:
            pass
        else:
            return list(iterable)
        return JSONEncoder.default(self, obj)

def create_app(config_class=Config):
	app = Flask(__name__)
	app.config.from_object(Config)
	app.json_encoder = CustomJSONEncoder
	db.init_app(app)
	bcrypt.init_app(app)
	login_manager.init_app(app)
	migrate = Migrate(app, db)

	## register blueprints here 
	from biblejourney.main.routes import main
	from biblejourney.users.routes import users
	app.register_blueprint(main)
	app.register_blueprint(users)

	import biblejourney.models

	return app
