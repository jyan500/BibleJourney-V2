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
			noteMessage: ''
		}
		this.handleGetRequest = this.handleGetRequest.bind(this);
		this.saveParagraphMode = this.saveParagraphMode.bind(this);
		this.addOrDeleteBookmark = this.addOrDeleteBookmark.bind(this);
		this.handleSaveNote = this.handleSaveNote.bind(this);
		this.handleGetNote = this.handleGetNote.bind(this);
		this.handleGetBookmark = this.handleGetBookmark.bind(this);
	}	
	handleGetRequest(verse){
		// reset the existing status messages 
		this.setState({isSaveNoteSuccess: false, noteMessage: '', isBookmark: false});

		const API_URL = 'https://bible-api.com/';
		let url = API_URL + verse;
		fetch(url, {method: 'GET'})
			.then(response => {
				return response.json();
			})
			.then(json => {
				console.log(json);
				this.setState({error: '', verses_list : json.verses, book_name : json.verses[0].book_name, chapter: json.verses[0].chapter});
				return fetch('http://localhost:5000/book?book_name=' + json.verses[0].book_name);
			})
			.then(response => {
				return response.json();
			})
			.then(json => {
				console.log(json);	
				this.setState({num_chapters: json.num_chapters});
			})
			.catch(e => {
				this.setState({error: 'Book/Verse was not found!'})
			});
	}
	handleGetNote(){
		let url = '/note/retrieve'	
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify({'book': this.state.book_name, 'chapter': this.state.chapter}),
			headers: {'Content-Type': 'application/json'}

		}).then(response => {
			return response.json()	
		})
	}
	handleGetBookmark(){
		let url = '/bookmark/retrieve'	
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify({'book' : this.state.book_name, 'chapter': this.state.chapter}),
			headers: {'Content-Type': 'application/json'}
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
		let props = {'handleGetRequest' : this.handleGetRequest, 'label': this.props.label}

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
						'chapter' : this.state.chapter,
						'book' : this.state.book_name,
						'label' : this.props.checkBoxLabel,
						'saveParagraphMode': this.saveParagraphMode,
						'addOrDeleteBookmark': this.addOrDeleteBookmark,
						'isBookmark' : this.state.isBookmark,
						'handleGetBookmark': this.handleGetBookmark
					})
		}
	}

	renderNoteSection(){
		if (this.state.book != "" && this.state.chapter != ""){
			return e(NoteSection, {
					'chapter' : this.state.chapter, 
					'book' : this.state.book_name,
					'handleSaveNote' : this.handleSaveNote,
					'handleGetNote' : this.handleGetNote,
					'isSuccessNoteSave' : this.state.isSaveNoteSuccess,
					'noteMessage' : this.state.noteMessage
			})
		}
	}

	render(){
		return (
			e(React.Fragment, null, 
				e('div', {'className' : 'col-md-8'},
					e(SearchBar, {'handleGetRequest': this.handleGetRequest, 'label' : this.props.label}),
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
	e(MainSection, {'label' : 'Verse', 'sideBarDescription' : 'Verse display options', 'checkBoxLabel' : 'Paragraph Mode', 'sideBarTitle' : 'Options'}),
	document.getElementById('main_section')
)