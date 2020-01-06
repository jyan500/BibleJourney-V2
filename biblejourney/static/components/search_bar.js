class SearchBar extends React.Component {
	constructor(){
		super();
		this.state = {
			verse: ''	
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentDidMount(){
		if (this.props.searchQuery != ""){
			this.setState({verse: this.props.searchQuery})
		}
	}
	componentDidUpdate(prevProps){
		if (prevProps.searchQuery != this.props.searchQuery){
			this.setState({verse: this.props.searchQuery});
		}
	}
	onChange(event){
		this.setState({verse: event.target.value})	
	}
	onSubmit(event){
		event.preventDefault();
		window.location.href = '/verses?verse=' + this.state.verse;
		// this.props.handleGetRequest(this.state.verse);
	}

	render(){
		return (
			e('div', {'className' : 'content-section'}, 
			// children
				e('form', {'id' : 'form', 'onSubmit':this.onSubmit},
					e('div', {'className' : 'form-group'}, 
						e('label', {'className' : 'form-control-label'}, this.props.label),
						e('input', {'value' : this.state.verse, 'onChange' : this.onChange, 'className' : 'form-control form-control-lg', 'placeholder' : 'Examples: John 3, John 3:16, John 3:16-18 ...'})
					),
					e('div', {'className' : 'form-group'},
						e('button', {'type' : 'submit', 'className' : 'btn btn-outline-info'}, 'Search')
					)
				)
			)
		);
	}

}

SearchBar.propTypes = {
	label: PropTypes.string,
	book: PropTypes.string,
	chapter: PropTypes.number,
	handleGetRequest: PropTypes.func
}

// ReactDOM.render(
// 	e(SearchBar, {label: 'Verse'}, null),
// 	document.getElementById('search_bar')
// );