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
			isParagraphMode: false
		}
		this.handleGetRequest = this.handleGetRequest.bind(this);
		this.saveParagraphMode = this.saveParagraphMode.bind(this);
	}	
	handleGetRequest(verse){
		console.log('in handle Get Request: ' + verse);			

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

	render(){
		return (
			e(React.Fragment, null, 
				e('div', {'className' : 'col-md-8'},
					e(SearchBar, {'handleGetRequest': this.handleGetRequest, 'label' : this.props.label}),
					e(VerseSection, {
						'error' : this.state.error, 
						'verses' : this.state.verses_list, 
						'book' : this.state.book_name, 
						'num_chapters' : this.state.num_chapters,
						'chapter' : this.state.chapter,
						'handleGetRequest' : this.handleGetRequest,
						'isParagraphMode' : this.state.isParagraphMode
					})
				),
				e('div', {'className' : 'col-md-4'},
					e(SideBar, {
						'title' : this.props.sideBarTitle, 
						'description' : this.props.sideBarDescription, 
						'label' : this.props.checkBoxLabel,
						'saveParagraphMode': this.saveParagraphMode
					})
				)
			)
		);
	}	
}

ReactDOM.render(
	e(MainSection, {'label' : 'Verse', 'sideBarDescription' : 'Verse display options', 'checkBoxLabel' : 'Paragraph Mode', 'sideBarTitle' : 'Options'}),
	document.getElementById('main_section')
)