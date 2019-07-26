from flask import render_template, request, Blueprint, flash
from biblejourney.main.forms import VersesForm 
from biblejourney.models import BookRef 
import json
import requests
import sys
import re
main = Blueprint('main', __name__)

@main.route("/")
@main.route("/home")
def home():
	form = VersesForm()
	return render_template('main/home.html', form=form) 

@main.route("/about")
def about():
	return render_template('main/about.html', title = 'About')

@main.route("/verses/<string:search_param>")
def verses_links(search_param):
	regex = re.compile('^(\\d?\\s?[a-zA-Z]+)(\\s\\d+)([:]?\\d+)?([-]?\\d+)?$')
	form = VersesForm(request.args)
	is_only_chapter = True
	match = regex.match(search_param)
	if (match):
		match_groups = match.groups()
		book = match_groups[0]
		chapter = match_groups[1]
		start_verse = match_groups[2]
		end_verse = match_groups[3]
		num_chapters = BookRef.query.filter_by(book).first().chapter
		if (start_verse or end_verse):
			is_only_chapter = False
	else:
		flash("Please search with one of the following formats: John 3, John 3:16, John 3:16-19", "danger")
		return render_template("main/home.html", form=form)
	json_result = getVerseBodyRequest(search_param)
	if (json_result.get('error')):
		flash("Verses could not be found!", "danger")
		return render_template("main/home.html", form=form)
	else:
		return render_template("main/home.html", form=form, verses=json_result, book = book, chapter = chapter, is_only_chapter = is_only_chapter)


@main.route("/verses")
def verses():
	form = VersesForm(request.args)
	search_param = form.verse.data
	regex = re.compile('^(\\d?\\s?[a-zA-Z]+)(\\s\\d+)([:]?\\d+)?([-]?\\d+)?$')
	match = regex.match(search_param)
	is_only_chapter = True 
	if (match):
		match_groups = match.groups()
		print('Match found: ', match.groups(), len(match.groups()), file = sys.stderr)
		book = match_groups[0]
		chapter = match_groups[1].strip()
		start_verse = match_groups[2]
		end_verse = match_groups[3]
		if (start_verse or end_verse):
			is_only_chapter = False 
	else:	
		flash("Please search with one of the following formats: John 3, John 3:16, John 3:16-18")
		return render_template("main/home.html", form=form)
			
	json_result = getVerseBodyRequest(search_param)
	print(json_result, file = sys.stderr)
	if (json_result.get('error')):
		flash("Verses could not be found!", "danger")
		return render_template("main/home.html", form=form)
	else:
		return render_template("main/home.html", form=form, verses=json_result, book = book, chapter = chapter, is_only_chapter = is_only_chapter)
	## version is world english bible by default until different versions are supported
def getVerseBodyRequest(param: str):
	## if start verse and end verse are provided
	## world english bible api id: 9879dbb7cfe39e4d-01
	API_URL = 'https://bible-api.com/'
	request_url = API_URL + '{}'.format(param)
	response = requests.get(request_url)
	json_data = json.loads(response.text)
	return json_data
