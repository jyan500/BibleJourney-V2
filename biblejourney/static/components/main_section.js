const e = React.createElement;

class MainSection extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			bookmarks: window.objects.bookmarks,
			notes: window.objects.notes,
		}
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
	renderSearchBar(){
		let props = {'label': this.props.label};
		return e(SearchBar, props)	
	}
	renderBookmarkPanel(){
		if (window.appConfig.is_authenticated){
			return e(BookmarkPanel, {convertDate: this.convertDateFromMySQL, bible_bookmark_url: window.objects.bible_bookmark_url, bookmarks: this.state.bookmarks, handleGetRequest: this.handleGetRequest});
		}
	}

	renderNotePanel(){
		if (window.appConfig.is_authenticated){
			return e(NotePanel, {convertDate: this.convertDateFromMySQL, handleGetRequest: this.handleGetRequest, notes: this.state.notes, bible_notebook_url: window.objects.bible_notebook_url})	
		}
	}

	renderHomeSideBar(){
		if (window.appConfig.is_authenticated){
			return e(HomeSideBar, {username: window.objects.username})	
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
					this.renderBookmarkPanel(),
					this.renderNotePanel(),
				),
				e('div', {'className' : 'col-md-4'},
					this.renderHomeSideBar(),
				)
			)
		);
	}	
}

ReactDOM.render(
	e(MainSection, {'label' : 'Verse', 'sideBarDescription' : 'Verse display options', 'checkBoxLabel' : 'Paragraph Mode', 'sideBarTitle' : 'Options'}),
	document.getElementById('main_section')
)