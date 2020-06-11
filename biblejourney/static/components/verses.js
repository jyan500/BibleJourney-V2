const e = React.createElement;

class Verses extends React.Component {
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
			searchQuery: '', 
			userAuthError: '',
			highlightedVerses: [],
			isShowToolBar: false,
			toolBarVerses: {'book' : '', 'chapter' : 0, 'verses': new Set()}
		}
		if (window.objects.react_state_obj){
			console.log(this.state.searchQuery)
			this.state['searchQuery'] = window.objects.react_state_obj.search_query
			this.state['verses_list'] = window.objects.react_state_obj.verses 
			this.state['book_name'] = window.objects.react_state_obj.book 
			this.state['num_chapters'] = window.objects.react_state_obj.num_chapters 
			this.state['chapter'] = window.objects.react_state_obj.chapter 
			this.state['isBookmark'] = window.objects.react_state_obj.is_bookmark
			this.state['note'] = window.objects.react_state_obj.note
			this.state['highlightedVerses'] = window.objects.react_state_obj.highlighted_verses ? window.objects.react_state_obj.highlighted_verses : []
		}
		this.handleGetRequest = this.handleGetRequest.bind(this);
		this.saveParagraphMode = this.saveParagraphMode.bind(this);
		this.addOrDeleteBookmark = this.addOrDeleteBookmark.bind(this);
		this.handleSaveNote = this.handleSaveNote.bind(this);
		this.handleGetNote = this.handleGetNote.bind(this);
		this.handleGetBookmark = this.handleGetBookmark.bind(this);
		this.handleGetHighlightedVerses = this.handleGetHighlightedVerses.bind(this);
		this.showHideToolBar = this.showHideToolBar.bind(this);
		this.updateToolBar = this.updateToolBar.bind(this);
		this.highlightVerses = this.highlightVerses.bind(this);
		this.deleteSelectedVerses = this.deleteSelectedVerses.bind(this);
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
	this.setState({isShowToolBar: false, toolBarVerses: {'book' : '', 'chapter' : 0, 'verses': new Set()}, isSaveNoteSuccess: false, noteMessage: '', note: '', isBookmark: false, loading: true});
		const API_URL = 'https://bible-api.com/';
		let url = API_URL + verse;
		var r1, r2, r3, r4, r5;
		return fetch(url, {method: 'GET'})
			.then(response => {
				return response.json();
			})
			.then(json => {
				console.log(json);
				r1 = json;
				return fetch('/book?book_name=' + json.verses[0].book_name);
			})
			.then(response => {
				return response.json();
			})
			.then(json => {
				r2 = json;
				return this.handleGetNote(r1.verses[0].chapter, r1.verses[0].book_name);
			}).then(json=>{
				r3 = json;
				return this.handleGetBookmark(r1.verses[0].chapter, r1.verses[0].book_name);
			}).then(json=>{
				r4 = json;				
				return this.handleGetHighlightedVerses(r1.verses[0].chapter, r1.verses[0].book_name);
			}).then(json=>{
				r5 = json;
				console.log(r5.highlighted_verses);
				console.log('Setting bookmark: ' , json.is_bookmark);
				this.setState({
						searchQuery: verse, 
						error: '', 
						verses_list: r1.verses, 
						book_name: r1.verses[0].book_name, 
						chapter: r1.verses[0].chapter, 
						num_chapters: r2.num_chapters, 
						note: r3.content,
						isBookmark: r4.is_bookmark,
						highlightedVerses: r5.highlighted_verses ? r5.highlighted_verses : [],
						loading: false});
			}).catch(e => {
				this.setState({loading:false,error: 'Book/Verse was not found!'})
			});
	}
	handleGetNote(chapter, book){
		let url = '/note/retrieve?book=' + book + '&chapter=' + chapter;
		return fetch(url, {
			method: 'GET',
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
	handleGetHighlightedVerses(chapter, book){
		let url = '/bookmark/verses/retrieve?book=' + book + '&chapter=' + chapter;
		return fetch(url, {
		
		}).then(response => {
			return response.json();	
		})
	}
	handleSaveNote(note){
		// console.log('in handle Save Note: ', note);	
		let url = '/note/save';
		this.setState({isSaveNoteSuccess: false, noteMessage: ''})
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
		let props = {'handleGetRequest' : this.handleGetRequest, 'searchQuery' : this.state.searchQuery, 'label': this.props.label};
		return e(SearchBar, props)	
	}

	saveParagraphMode(isParagraphMode){
		this.setState({isParagraphMode: isParagraphMode});
	}

	showHideToolBar(value){

		let clearToolBarVerses = {'book' : '', 'chapter' : 0, 'verses': new Set()};
		this.setState({isShowToolBar: value, toolBarVerses: clearToolBarVerses});
	}

	updateToolBar(book, chapter, verse){
		let previousVerses = this.state.toolBarVerses.verses;
		previousVerses.add(verse);
		this.setState({toolBarVerses: {'book' : book, 'chapter': chapter, 'verses' : previousVerses}});
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

	highlightVerses(color){
		let url = '/bookmark/verses/save';
		if (url != ''){
			return fetch(url, {
				method : 'POST',
				body: JSON.stringify(
					{
						'book' : this.state.toolBarVerses.book, 
						'chapter' : this.state.toolBarVerses.chapter, 
						'verses' : Array.from(this.state.toolBarVerses.verses),
						'color': color
					}
					),
				headers: {'Content-Type': 'application/json'}
			})
			.then(response => {
				return response.json();	
			})
			.then(json => {
				console.log(json);
				// get the updated list of highlighted verses after saving
				return this.handleGetHighlightedVerses(this.state.toolBarVerses.chapter, this.state.toolBarVerses.book);
				// this.setState({isBookmark: this.state.isBookmark ? false : true});					
			}).then(json => {
				console.log('reload the highlighted verses')
				console.log('reloaded: ', json.highlighted_verses);
				this.setState({highlightedVerses: json.highlighted_verses ? json.highlighted_verses : []})
			}).catch(e => {

			})
		}	
	}

	deleteSelectedVerses(){
		let url = '/bookmark/verses/delete';
		if (url != ''){
			return fetch(url, {
				method : 'POST',
				body: JSON.stringify(
					{
						'book' : this.state.toolBarVerses.book, 
						'chapter' : this.state.toolBarVerses.chapter, 
						'verses' : Array.from(this.state.toolBarVerses.verses),
					}
					),
				headers: {'Content-Type': 'application/json'}
			})
			.then(response => {
				return response.json();	
			})
			.then(json => {
				console.log(json);
				// get the updated list of highlighted verses after saving
				return this.handleGetHighlightedVerses(this.state.toolBarVerses.chapter, this.state.toolBarVerses.book);
				// this.setState({isBookmark: this.state.isBookmark ? false : true});					
			}).then(json => {
				console.log('reload the highlighted verses')
				console.log('reloaded: ', json.highlighted_verses);
				this.setState({highlightedVerses: json.highlighted_verses ? json.highlighted_verses : []})
			}).catch(e => {

			})
		}	
	}

	// addOrDeleteBookmarkVerse(book, chapter, verse){
	// 	let url = this.state.isBookmark ? '/bookmark/delete' : '/bookmark/save';
	// 	if (url != ''){
	// 		return fetch(url, {
	// 			method : 'POST',
	// 			body: JSON.stringify({'book' : book, 'chapter' : chapter, 'verse' : verse}),
	// 			headers: {'Content-Type': 'application/json'}
	// 		})
	// 		.then(response => {
	// 			return response.json();	
	// 		})
	// 		.then(json => {
	// 			console.log(json);
	// 			this.setState({isBookmark: this.state.isBookmark ? false : true});					
	// 		}).catch(e => {

	// 		})
	// 	}	
	// }

	renderVerseSection(){
		if (this.state.book_name != "" && this.state.chapter != ""){
			return e(VerseSection, {
				'error' : this.state.error, 
				'verses' : this.state.verses_list, 
				'book' : this.state.book_name, 
				'num_chapters' : this.state.num_chapters,
				'chapter' : this.state.chapter,
				'handleGetRequest' : this.handleGetRequest,
				'isParagraphMode' : this.state.isParagraphMode,
				'showHideToolBar' : this.showHideToolBar,
				'isShowToolBar' : this.state.isShowToolBar,
				'toolBarVerses': this.state.toolBarVerses,
				'updateToolBar': this.updateToolBar,
				'highlightVerses': this.highlightVerses,
				'highlightedVerses': this.state.highlightedVerses,
				'deleteSelectedVerses': this.deleteSelectedVerses
			})
		}
	}
	renderSideBar(){
		if (this.state.book_name != "" && this.state.chapter != ""){
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
		if (this.state.book_name != "" && this.state.chapter != ""){
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

	convertDateFromMySQL(dateString){
		console.log(dateString);
		let parts = dateString.replace('T', ' ').split(/[- :]/);
		console.log('parts: ', parts);
		// javascript months are indexed 0 to 11
		let date = new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]);
		return date
		// let d = new Date(Date.UTC(t[0], t[1]-1, t[2]))	
		// console.log(d);
		// return d.toString();
	}

	render(){
		return (
			e(React.Fragment, null, 
				e('div', {'className' : 'col-md-8'},
					this.renderSearchBar(),
					this.renderLoadingOverlay(),
					this.renderVerseSection()
				),
				e('div', {'className' : 'col-md-4'},
					this.renderSideBar(),
					this.renderNoteSection()
				)
			)
		);
	}	
}

ReactDOM.render(
	e(Verses, {'label' : 'Verse', 'sideBarDescription' : 'Verse display options', 'checkBoxLabel' : 'Paragraph Mode', 'sideBarTitle' : 'Options'}),
	document.getElementById('verses-page')
)