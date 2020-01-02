const e = React.createElement;

class MainSection extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			verses_list: [],
			book_name: '',
			num_chapters: 0,
			chapter: 0,
			error: '',
			isParagraphMode: false,
			isSaveNoteSuccess: false,
			isBookmark: false,
			note: '',
			noteMessage: '',
			loading: false,
			loadingSpinner: false,
			bookmarks: window.objects.bookmarks,
			notes: window.objects.notes,
			userAuthError: ''
		}
		this.handleGetRequest = this.handleGetRequest.bind(this);
		this.saveParagraphMode = this.saveParagraphMode.bind(this);
		this.addOrDeleteBookmark = this.addOrDeleteBookmark.bind(this);
		this.handleSaveNote = this.handleSaveNote.bind(this);
		this.handleGetNote = this.handleGetNote.bind(this);
		this.handleGetBookmark = this.handleGetBookmark.bind(this);
	}	
	componentDidMount(){
		// this.handleGetAllBookmarks().then(
		// 	response => {
		// 		// if user is logged in, retrieve the bookmarks 
		// 		if (response.status != 1){
		// 			this.setState({bookmarks: response.bookmarks})
		// 			console.log(this.state.bookmarks);
		// 		}
		// 	},
		// 	error => {
		// 		console.log("Error! Could not receive bookmarks");
		// 	}
		// );
	}
	handleGetRequest(verse){
		// reset the existing status messages 
		this.setState({isSaveNoteSuccess: false, noteMessage: '', note: '', isBookmark: false, loading: true});
		const API_URL = 'https://bible-api.com/';
		let url = API_URL + verse;
		var r1, r2, r3, r4;
		return fetch(url, {method: 'GET'})
			.then(response => {
				return response.json();
			})
			.then(json => {
				console.log(json);
				r1 = json;
				//this.setState({error: '', verses_list : json.verses, book_name : json.verses[0].book_name, chapter: json.verses[0].chapter});
				return fetch('http://localhost:5000/book?book_name=' + json.verses[0].book_name);
			})
			.then(response => {
				return response.json();
			})
			.then(json => {
				r2 = json;
				//this.setState({num_chapters: json.num_chapters});
				console.log(r1.verses[0].chapter);
				return this.handleGetNote(r1.verses[0].chapter, r1.verses[0].book_name);
			}).then(json=>{
				r3 = json;
				console.log('Setting note:', json.content);
				//this.setState({note: json.content});
				return this.handleGetBookmark(r1.verses[0].chapter, r1.verses[0].book_name);
			}).then(json=>{
				r4 = json;
				console.log('Setting bookmark: ' , json.is_bookmark);
				this.setState({
						error: '', 
						verses_list: r1.verses, 
						book_name: r1.verses[0].book_name, 
						chapter: r1.verses[0].chapter, 
						num_chapters: r2.num_chapters, 
						note: r3.content,
						isBookmark: r4.is_bookmark,
						loading: false});
			}).catch(e => {
				this.setState({loading:false,error: 'Book/Verse was not found!'})
			});
		// .catch(e => {
		// 	this.setState({error: 'Book/Verse was not found!'})
		// });
		// const API_URL = 'https://bible-api.com/';
		// let url = API_URL + verse;
		// fetch(url, {method: 'GET'})
		// 	.then(response => {
		// 		return response.json();
		// 	})
		// 	.then(json => {
		// 		console.log(json);
		// 		this.setState({error: '', verses_list : json.verses, book_name : json.verses[0].book_name, chapter: json.verses[0].chapter});
		// 		return fetch('http://localhost:5000/book?book_name=' + json.verses[0].book_name);
		// 	})
		// 	.then(response => {
		// 		return response.json();
		// 	})
		// 	.then(json => {
		// 		console.log(json);	
		// 		this.setState({num_chapters: json.num_chapters});
		// 	}).catch(e => {
		// 		this.setState({error: 'Book/Verse was not found!'})
		// 	});
	}
	handleGetNote(chapter, book){
		let url = '/note/retrieve?book=' + book + '&chapter=' + chapter;
		return fetch(url, {
			method: 'GET',
			//body: JSON.stringify({'book': this.state.book_name, 'chapter': this.state.chapter}),
			//headers: {'Content-Type': 'application/json'}

		}).then(response => {
			return response.json()	
		})
	}
	handleGetBookmark(chapter, book){
		let url = '/bookmark/retrieve?book=' + book + '&chapter=' + chapter;
		return fetch(url, {
		}).then(response => {
			return response.json()	
		})
	}
	handleSaveNote(note){
		console.log('in handle Save Note: ', note);	
		let url = '/note/save';
		this.setState({isSaveNoteSuccess: false})
		return fetch(url, {
			method: 'POST', 
			body: JSON.stringify({'note': note, 'book' : this.state.book_name, 'chapter' : this.state.chapter}), 
			headers: {'Content-Type': 'application/json'}
			})
			.then(response => {
				return response.json()
			}).then(json => {
				this.setState({isSaveNoteSuccess: true, noteMessage: json.status})	
			}).catch(e => {
				this.setState({isSaveNoteSuccess: false, noteMessage: json.status})	
			})
	}
	// create method to make API call to Bible API
	renderSearchBar(){
		let props = {'handleGetRequest' : this.handleGetRequest, 'label': this.props.label};
		// console.log('in render search bar: ' + this.state.book_name);
		if (this.state.book_name != '' && this.state.chapter != 0){
			props['book'] = this.state.book_name
			props['chapter'] = this.state.chapter
		}
		return e(SearchBar, props)	
	}

	saveParagraphMode(isParagraphMode){
		this.setState({isParagraphMode: isParagraphMode});
	}
	
	// add bookmark if it doesn't exist, else delete it if the user unchecks
	addOrDeleteBookmark(value){
		let url = this.state.isBookmark ? '/bookmark/delete' : '/bookmark/save';
		if (url != ''){
			return fetch(url, {
				method : 'POST',
				body: JSON.stringify({'book' : this.state.book_name, 'chapter' : this.state.chapter}),
				headers: {'Content-Type': 'application/json'}
			})
			.then(response => {
				return response.json();	
			})
			.then(json => {
				console.log(json);
				this.setState({isBookmark: this.state.isBookmark ? false : true});					
			}).catch(e => {

			})
		}
	}

	renderVerseSection(){
		if (this.state.book != "" && this.state.chapter != ""){
			return e(VerseSection, {
						'error' : this.state.error, 
						'verses' : this.state.verses_list, 
						'book' : this.state.book_name, 
						'num_chapters' : this.state.num_chapters,
						'chapter' : this.state.chapter,
						'handleGetRequest' : this.handleGetRequest,
						'isParagraphMode' : this.state.isParagraphMode
					})
		}
	}
	renderSideBar(){
		if (this.state.book != "" && this.state.chapter != ""){
			return e(SideBar, {
						'title' : this.props.sideBarTitle, 
						'description' : this.props.sideBarDescription, 
						'label' : this.props.checkBoxLabel,
						'book' : this.state.book_name,
						'chapter' : this.state.chapter,
						'saveParagraphMode': this.saveParagraphMode,
						'addOrDeleteBookmark': this.addOrDeleteBookmark,
						'isBookmark' : this.state.isBookmark,
						'handleGetBookmark': this.handleGetBookmark
					})
		}
	}

	renderNoteSection(){
		if (this.state.book != "" && this.state.chapter != ""){
			console.log('Note right now: ', this.state.note);
			return e(NoteSection, {
					'chapter' : this.state.chapter, 
					'book' : this.state.book_name,
					'handleSaveNote' : this.handleSaveNote,
					'handleGetNote' : this.handleGetNote,
					'isSuccessNoteSave' : this.state.isSaveNoteSuccess,
					'noteMessage' : this.state.noteMessage,
					'note' : this.state.note,
			})
		}
	}

	renderLoadingOverlay(){
		if (this.state.loading){
			return e(LoadingOverlay);
		}	
	}

	renderLoadingSpinner(){
		if (this.state.loadingSpinner){
			return e(LoadingSpinner)	
		}
	}

	renderBookmarkPanel(){
		if (window.appConfig.is_authenticated && (this.state.chapter == 0 || this.state.book == '')){
			return e(BookmarkPanel, {bible_bookmark_url: window.objects.bible_bookmark_url, bookmarks: this.state.bookmarks, handleGetRequest: this.handleGetRequest});
		}
	}

	renderNotePanel(){
		if (window.appConfig.is_authenticated && (this.state.chapter == 0 || this.state.book == '')){
			return e(NotePanel, {handleGetRequest: this.handleGetRequest, notes: this.state.notes, bible_notebook_url: window.objects.bible_notebook_url})	
		}
	}

	renderHomeSideBar(){
		if (window.appConfig.is_authenticated && (this.state.chapter == 0 || this.state.book == '')){
			return e(HomeSideBar, {username: window.objects.username})	
		}	
	}

	render(){
		return (
			e(React.Fragment, null, 
				e('div', {'className' : 'col-md-8'},
					this.renderSearchBar(),
					this.renderBookmarkPanel(),
					this.renderNotePanel(),
					this.renderLoadingOverlay(),
					this.renderVerseSection()
				),
				e('div', {'className' : 'col-md-4'},
					this.renderHomeSideBar(),
					this.renderSideBar(),
					this.renderNoteSection()
				)
			)
		);
	}	
}

ReactDOM.render(
	e(MainSection, {'label' : 'Verse', 'sideBarDescription' : 'Verse display options', 'checkBoxLabel' : 'Paragraph Mode', 'sideBarTitle' : 'Options'}),
	document.getElementById('main_section')
)