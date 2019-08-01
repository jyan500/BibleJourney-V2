from flask import render_template, request, Blueprint, flash, session
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

@main.route("/verses/chapter")
def chapter():
	regex = re.compile('^(\\d?\\s?[a-zA-Z]+)(\\s\\d+)([:]?\\d+)?([-]?\\d+)?$')
	form = VersesForm(request.args)
	is_paragraph_mode = '0' 
	is_only_chapter = True
	search_param = request.args.get('search_param')
	print('search_param: ', search_param, file = sys.stderr)
	match = regex.match(search_param)
	if (match):
		match_groups = match.groups()
		chapter = int(match_groups[1].strip())
		start_verse = match_groups[2]
		end_verse = match_groups[3]
		if (start_verse or end_verse):
			is_only_chapter = False
	else:
		flash("Please search with one of the following formats: John 3, John 3:16, John 3:16-19", "danger")
		return render_template("main/home.html", form=form)

 	## save this preference in session
	if (request.args.get('paragraph_mode') == '1'):
		is_paragraph_mode = '1' 

	json_result = getVerseBodyRequest(search_param)
	if (json_result.get('error')):
		flash("Verses could not be found!", "danger")
		return render_template("main/home.html", form=form)
	else:
		book = json_result['reference'].split(' ')[0]
		num_chapters = int(BookRef.query.filter_by(book=book).first().num_chapters)
		return render_template("main/home.html", 
			form=form, 
			verses=json_result, 
			book = book, 
			chapter = chapter, 
			is_only_chapter = is_only_chapter, 
			num_chapters = num_chapters,
			is_paragraph_mode = is_paragraph_mode)

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
		chapter = int(match_groups[1].strip())
		start_verse = match_groups[2]
		end_verse = match_groups[3]
		if (start_verse or end_verse):
			is_only_chapter = False 
	else:	
		flash("Please search with one of the following formats: John 3, John 3:16, John 3:16-18", "danger")
		return render_template("main/home.html", form=form)
			
	json_result = getVerseBodyRequest(search_param)
	print(json_result, file = sys.stderr)
	if (json_result.get('error')):
		flash("Verses could not be found!", "danger")
		return render_template("main/home.html", form=form)

	else:
		## the reason why the name of the book is retrieved from the API is because the API utilizes a fuzzy-search
		## algorithm in case the user misspells the book slightly
		book = json_result['reference'].split(' ')[0]
		num_chapters = int(BookRef.query.filter_by(book=book).first().num_chapters)
		return render_template("main/home.html", form=form, verses=json_result, book = book, chapter = chapter, is_only_chapter = is_only_chapter, num_chapters=num_chapters)
	## version is world english bible by default until different versions are supported
def getVerseBodyRequest(param: str):
	## if start verse and end verse are provided
	## world english bible api id: 9879dbb7cfe39e4d-01
	API_URL = 'https://bible-api.com/'
	request_url = API_URL + '{}'.format(param)
	response = requests.get(request_url)
	json_data = json.loads(response.text)
	return json_data
