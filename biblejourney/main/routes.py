from flask import render_template, request, Blueprint

main = Blueprint('main', __name__)

@main.route("/")
@main.route("/home")
def home():
	return render_template('main/home.html') 

@main.route("/about")
def about():
	return render_template('main/about.html', title = 'About')

@main.route("/verses/<string:search_param", methods = ["GET"])
def verses(search_param):
	## version is world english bible by default until different versions are supported
def getVerseBodyRequest(book: str, chapter: str, start_verse: str = '0', end_verse: str = '0', version: str = 'web'):
	## if start verse and end verse are provided
	## world english bible api id: 9879dbb7cfe39e4d-01
	API_URL = 'https://getbible.net/json?passage='
	sanitize_chapter = chapter.strip()
	sanitize_book = book.strip()
	sanitize_start_verse = start_verse.strip()
	sanitize_end_verse = end_verse.strip()
	print('book: ' , sanitize_book, 'chapter: ' , sanitize_chapter, 'start_verse: ', sanitize_start_verse, 'end_verse: ', sanitize_end_verse, file = sys.stderr)
	if (start_verse != '0' and end_verse != '0'):
		query_string = '{} {}:{}-{}'.format(sanitize_book, sanitize_chapter, sanitize_start_verse, sanitize_end_verse)	
	## if just start verse
	elif (start_verse != '0'):
		query_string = '{} {}:{}'.format(sanitize_book, sanitize_chapter, sanitize_start_verse)	
	else:
		query_string = '{} {}'.format(sanitize_book, sanitize_chapter)
	
	API_URL = 'https://getbible.net/json?passage={}&version={}'.format(query_string, version)
	print(API_URL, file =sys.stderr)
	response = requests.get(API_URL)
	## trim the outer parenthesis to convert from jsonp to json
	data = response.text.split("(", 1)[1].strip(");")
	json_data = json.loads(data)
	## json response for the api changes depending on whether th e 
	# print(json_data, file = sys.stderr)
	try:
		if (start_verse != '0'):
			## current response: { book: [] }
			outer_list = json_data['book']
			chapter_data = outer_list[0]['chapter']
		else:
			chapter_data = json_data['chapter']
		# print(chapter_data, file =sys.stderr)
		verses_dict_list = []
		for verses_key in chapter_data:
			verses_dict = dict()
			verses_dict['book'] = sanitize_book
			verses_dict['chapter'] = sanitize_chapter
			verses_dict['verse'] = verses_key
			verses_dict['text'] = chapter_data[verses_key]['verse']
			verses_dict_list.append(verses_dict)
		return verses_dict_list
	except:
		return [] 
	# print(response.json(), file = sys.stderr)
	## convert from jsonp to json
	# try:
	# 	return passages['verses']
	# except:
	# 	return passages['error'] 