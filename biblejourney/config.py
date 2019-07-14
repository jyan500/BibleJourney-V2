import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
## load env file
load_dotenv(verbose = True)

class Config:
	SECRET_KEY = os.environ.get('SECRET_KEY')
	SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI') 