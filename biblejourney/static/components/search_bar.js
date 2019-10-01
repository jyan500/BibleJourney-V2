class SearchBar extends React.Component {
	constructor(){
		super();
		this.state = {
			verse: ''	
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onChange(event){
		this.setState({verse: event.target.value})	
	}
	onSubmit(event){
		event.preventDefault();
		this.props.handleGetRequest(this.state.verse);
	}
	render(){
		return (
			e('div', {'className' : 'content-section'}, 
			// children
				e('form', {'onSubmit':this.onSubmit},
					e('div', {'className' : 'form-group'}, 
						e('label', {'className' : 'form-control-label'}, this.props.label),
						e('input', {'onChange' : this.onChange, 'className' : 'form-control form-control-lg', 'placeholder' : 'Examples: John 3, John 3:16, John 3:16-18 ...'})
					),
					e('div', {'className' : 'form-group'},
						e('button', {'type' : 'submit', 'className' : 'btn btn-outline-info'}, 'Submit')
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