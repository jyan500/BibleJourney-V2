from flask import render_template, request, Blueprint, flash, session, jsonify, url_for, redirect
from biblejourney.main.forms import VersesForm 
from biblejourney.main.utils import *
from biblejourney.models import BookRef, Note, Bookmark 
from biblejourney import db
from flask_login import current_user, login_required
import json
import requests
import sys
import re
main = Blueprint('main', __name__)

@main.route("/")
@main.route("/home")
def home():
	form = VersesForm()
	if (current_user.is_authenticated):
		## get only the top 6 most recent bookmarks and notes
		all_bookmarks = Bookmark.query.filter_by(author = current_user).order_by(Bookmark.date_posted.desc()).all()[0:6];
		all_notes = Note.query.filter_by(author = current_user).order_by(Note.date_posted.desc()).all()[0:6];
		return render_template('main/home.html', form=form, bookmarks = convert_obj(all_bookmarks), notes = convert_obj(all_notes)) 
	else:
		return render_template('main/home.html', form=form)

@main.route("/about")
def about():
	return render_template('main/about.html', title = 'About')

@main.route("/book")
def book():
	book_name = request.args.get('book_name')
	if (book_name != None):
		num_chapters = int(BookRef.query.filter_by(book=book_name).first().num_chapters)
		if (num_chapters != None):
			return jsonify({'num_chapters' : num_chapters})
		else:
			return jsonify({'error' : 'Selected book did not have any chapters!'})
	else:
		return jsonify({'error' : 'Selected book was not found!'})

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
		book = json_result['verses'][0]['book_name']
		num_chapters = int(BookRef.query.filter_by(book=book).first().num_chapters)
		form.verse.data = json_result['reference'] 
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
		return render_template("main/verses.html", form=form)
			
	json_result = getVerseBodyRequest(search_param)
	##print(json_result, file = sys.stderr)
	if (json_result.get('error')):
		flash("Verses could not be found!", "danger")
		return render_template("main/verses.html", form=form)

	else:
		## the reason why the name of the book is retrieved from the API is because the API utilizes a fuzzy-search
		## algorithm in case the user misspells the book slightly
		book = json_result['verses'][0]['book_name']
		verses = json_result['verses']
		num_chapters = int(BookRef.query.filter_by(book=book).first().num_chapters)
		is_bookmark = False
		note_content = ''
		highlighted_verses_list = []
		react_state_object = {'search_query': search_param, 'verses': verses, 'book': book, 'chapter': chapter, 'num_chapters': num_chapters} 
		if (current_user.is_authenticated):

			## get only the bookmarks where verses are null, since this is referring to bookmarked chapters
			existing_bookmark = Bookmark.query.filter_by(book=request.args.get('book'), chapter = request.args.get('chapter'), author = current_user).filter((Bookmark.verse == 0) | (Bookmark.verse == None)).first()

			if (existing_bookmark):
				is_bookmark = True
			existing_note = Note.query.filter_by(book=book, chapter=chapter, author= current_user).first()
			if (existing_note):
				note_content =existing_note.content

			## get the highlighted verses, bookmarks where verse is not null
			highlighted_verses = Bookmark.query.filter_by(book=book, chapter = chapter, author = current_user).filter((Bookmark.verse != 0) | (Bookmark.verse != None)).all()
			if (len(highlighted_verses) > 0):
				highlighted_verses_list = convert_obj(highlighted_verses)	
			## add the remaining two attributes if the user is logged in 
			react_state_object['highlighted_verses'] = highlighted_verses_list
			react_state_object['is_bookmark'] = is_bookmark 
			react_state_object['note'] = note_content

		return render_template("main/verses.html", form=form, react_state_object = react_state_object)
	## version is world english bible by default until different versions are supported

@main.route('/notes', methods = ["GET"])
@login_required
def notes():
	if (current_user.is_authenticated):
		notes_per_page = 5;
		page = request.args.get('page', 1, type=int)
		pagination_obj = Note.query.filter_by(author = current_user).order_by(Note.date_posted.desc()).paginate(page, notes_per_page, False);
		next_url = None
		prev_url = None
		if pagination_obj.has_next:
			next_url = url_for('main.notes', page=pagination_obj.next_num)
		if pagination_obj.has_prev:
			prev_url = url_for('main.notes', page=pagination_obj.prev_num)
		return render_template('main/notes.html', notes = pagination_obj.items, next_url=next_url, prev_url=prev_url)

@main.route('/bookmarks', methods = ["GET"])
@login_required
def bookmarks():
	if (current_user.is_authenticated):
		bookmarks_per_page = 5;
		page = request.args.get('page', 1, type=int)
		pagination_obj = Bookmark.query.filter_by(author = current_user).order_by(Bookmark.date_posted.desc()).paginate(page, bookmarks_per_page, False);
		bookmark_content_map = dict() 
		for bookmark in pagination_obj.items:
			print(bookmark.id, file = sys.stderr)
			search_param = bookmark.book + ' ' + bookmark.chapter
			if (bookmark.verse != None):
				search_param += ':' + bookmark.verse
			json = getVerseBodyRequest(search_param)
			if (json.get('error')):
				flash("One or more verses could not be found!", "danger")
				return render_template("main/bookmarks.html", form=form)
			else:
				## only show the first 5 verses of each chapter
				bookmark_content_map[search_param] = {'id' : bookmark.id, 'verses': json['verses'][0:5], 'bookmark' : search_param, 'date': bookmark.date_posted}
		next_url = None
		prev_url = None
		if pagination_obj.has_next:
			next_url = url_for('main.bookmarks', page=pagination_obj.next_num)
		if pagination_obj.has_prev:
			prev_url = url_for('main.bookmarks', page=pagination_obj.prev_num)
		return render_template('main/bookmarks.html', bookmarks = bookmark_content_map, next_url=next_url, prev_url=prev_url)

## ENDPOINTS 
@main.route("/note/retrieve", methods = ["GET"])
def get_note():
	if (current_user.is_authenticated):
		existing_note = Note.query.filter_by(book=request.args.get('book'), chapter=request.args.get('chapter'), author=current_user).first()
		if (existing_note):
			return jsonify({'status': 'Note found', 'book': existing_note.book, 'chapter': existing_note.chapter, 'content': existing_note.content})
		else:
			return jsonify({'status': 'No Note Found', 'content' : ''})
	else:
		return jsonify({'status': 'Error: User must be logged in'})

@main.route("/note/save", methods = ["POST"])
def save_note():
	if (current_user.is_authenticated):
		existing_note = Note.query.filter_by(book=request.json.get('book'), chapter=request.json.get('chapter'), author = current_user).first()
		if (existing_note):
			existing_note.content = request.json.get('note')
			print("updated note", file = sys.stderr)
			db.session.commit()
			return jsonify({'status': 'Updated Successfully!'})
		else:
			note = Note(book = request.json.get('book'), chapter = request.json.get('chapter'), content=request.json.get('note'), author=current_user)
			db.session.add(note)
			db.session.commit()
			print("added note", file=sys.stderr)
			return jsonify({'status': 'Saved successfully!'})
	else:
		return jsonify({'status': 'Error: User must be logged in'})

@main.route("/note/delete/<id>", methods = ["POST"])
def delete_note_by_id(id):
	existing_note = Note.query.get(id)
	db.session.delete(existing_note)
	db.session.commit()
	flash('Note deleted!', 'success')
	return redirect(url_for('main.notes'))

@main.route("/bookmark/retrieve", methods = ["GET"])
def get_bookmark():
	existing_bookmark = None
	if (current_user.is_authenticated):
		if (request.args.get('book') and request.args.get('chapter')):
			## get only the bookmarks where verses are null, since this is referring to bookmarked chapters
			existing_bookmark = Bookmark.query.filter_by(book=request.args.get('book'), chapter = request.args.get('chapter'), author = current_user).filter((Bookmark.verse == 0) | (Bookmark.verse == None)).first()
		if (existing_bookmark):
			return jsonify({'status' : 'Bookmark received', 'is_bookmark' : True})
		else:
			return jsonify({'status' : 'Bookmark not found', 'is_bookmark' : False})
	else:
		return jsonify({'status': 'Error: User must be logged in', 'status' : 1})

@main.route("/bookmark/save", methods = ["POST"])
def save_bookmark():
	if (current_user.is_authenticated):
		book = request.json.get('book')
		chapter = request.json.get('chapter')
		existing_bookmark = Bookmark.query.filter_by(book=book, chapter = chapter, author = current_user).first()
		if (not existing_bookmark):
			bookmark = Bookmark(book = book, chapter = chapter, author = current_user)
			db.session.add(bookmark)
			db.session.commit()
			return jsonify({'status' : 'Bookmark saved'})
		else:
			return jsonify({'status' : 'Error: Bookmark for this chapter already exists!'})
	else:
		return jsonify({'status': 'Error: User must be logged in'})

## get individual verses (bookmarks that are highlighted)
@main.route("/bookmark/verses/retrieve", methods = ["GET"])
def get_verses_bookmark():
	if (current_user.is_authenticated):
		book = request.args.get('book')	
		chapter = request.args.get('chapter')
		existing_bookmarks = Bookmark.query.filter_by(book=book, chapter = chapter, author = current_user).filter((Bookmark.verse != 0) | (Bookmark.verse != None)).all()
		print(existing_bookmarks, file = sys.stderr)
		if (len(existing_bookmarks) > 0):
			return jsonify({'status' : 'Highlighted Verses received', 'highlighted_verses': convert_obj(existing_bookmarks)})
		else:
			return jsonify({'status' : 'Bookmark not found'})

	return jsonify({'status', 'Error: User must be logged in'})

@main.route("/bookmark/verses/save", methods = ["POST"])
def save_verses_bookmark():
	if (current_user.is_authenticated):
		book = request.json.get('book')
		chapter = request.json.get('chapter')
		verses = request.json.get('verses')
		color = request.json.get('color')
		print(verses, file = sys.stderr)
		## find all bookmarks with the book and chapter, then the selected verses
		## with the existing bookmarks, pluck only the verse numberse
		existing_bookmarks = Bookmark.query.filter_by(book=book, chapter = chapter, author = current_user).filter(Bookmark.verse.in_(verses)).all()
		bookmark_map = dict()
		for bookmark in existing_bookmarks:
			bookmark_map[int(bookmark.verse)] = bookmark
		print(bookmark_map, file = sys.stderr)
		## if the verse is existing, but highlighted a different color, update the color
		## else make a new bookmark
		for verse in verses:
			if (bookmark_map.get(verse) == None):
				bookmark = Bookmark(book = book, chapter = chapter, author = current_user, verse=verse, highlight_color=color)
				db.session.add(bookmark)
				db.session.commit()
			else:
				existing_bookmark = bookmark_map.get(verse)
				existing_bookmark.highlight_color = color
				db.session.commit()

		return jsonify({'status' : 'Bookmarks saved'})
	else:
		return jsonify({'status': 'Error: User must be logged in'})


@main.route("/bookmark/delete", methods = ["POST"])
def delete_bookmark():
	if (current_user.is_authenticated):
		book = request.json.get('book')
		chapter = request.json.get('chapter')
		existing_bookmark = Bookmark.query.filter_by(book=book, chapter = chapter, author = current_user).first()
		if (existing_bookmark):
			db.session.delete(existing_bookmark)
			db.session.commit()
			return jsonify({'status' : 'Bookmark deleted!'})
		else:
			return jsonify({'status' : "Error: Bookmark for this chapter doesn't exist!"})
	else:
		return jsonify({'status': 'Error: User must be logged in'})

@main.route("/bookmark/delete/<id>", methods = ["POST"])
def delete_bookmark_by_id(id):
	existing_bookmark = Bookmark.query.get(id)
	db.session.delete(existing_bookmark)
	db.session.commit()
	flash('Bookmark deleted!', 'success')
	return redirect(url_for('main.bookmarks'))

def getVerseBodyRequest(param: str):
	## if start verse and end verse are provided
	## world english bible api id: 9879dbb7cfe39e4d-01
	API_URL = 'https://bible-api.com/'
	request_url = API_URL + '{}'.format(param)
	response = requests.get(request_url)
	json_data = json.loads(response.text)
	return json_data
