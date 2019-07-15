from flask import render_template, request, Blueprint
from biblejourney.main.forms import VersesForm 
import json
import requests
import sys
main = Blueprint('main', __name__)

@main.route("/")
@main.route("/home")
def home():
	form = VersesForm()
	return render_template('main/home.html', form=form) 

@main.route("/about")
def about():
	return render_template('main/about.html', title = 'About')

@main.route("/verses")
def verses():
	form = VersesForm(request.args)
	search_param = form.verse.data
	json_result = getVerseBodyRequest(search_param)
	return render_template("main/home.html", form=form, verses=json_result)

	## version is world english bible by default until different versions are supported
def getVerseBodyRequest(param: str):
	## if start verse and end verse are provided
	## world english bible api id: 9879dbb7cfe39e4d-01
	API_URL = 'https://bible-api.com/'
	request_url = API_URL + '{}'.format(param)
	response = requests.get(request_url)
	json_data = json.loads(response.text)
	return json_data
