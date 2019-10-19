

class NoteSection extends React.Component {
	constructor(){
		super()	
		this.state = {
			value: ''
		}
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getExistingNote = this.getExistingNote.bind(this);
	}	
	componentDidMount(){
		this.getExistingNote()	
	}
	componentDidUpdate(prevProps){
		if (prevProps.book != this.props.book || prevProps.chapter != this.props.chapter){
			this.getExistingNote()
		}
	}
	getExistingNote(){
		this.setState({value: ''})
		this.props.handleGetNote()
		.then(response=>{
			this.setState({value: response.content})	
		})	
	}
	onSubmit(event){
		event.preventDefault();
		this.props.handleSaveNote(this.state.value);
	}	
	onChange(event){
		this.setState({value: event.target.value});
	}
	renderSubmit(){
		if (window.appConfig.is_authenticated){
			return e('div', {'className' : 'form-group'},
				e('button', {'className' : 'btn btn-outline-info', 'type': 'submit'}, 'Submit')
			)	
		}	
		else {
			return e('div', {'className' : 'form-group'},
				e('small', {'className': 'text-muted'}, 'Please ', e('a', {'href' : '/login'}, 'login'), ' to save your note!')
			)
		}
	}
	render(){
		let textbox_style = {
			'border' : '2px #EEE solid',
			'min-height' : '20vh',
		}
		return (
			e('div', {'className' : 'content-section'},
				e('form', {'onSubmit' : this.onSubmit}, 
					e('div', {'className' : 'form-group'},
						e('label', {'className': 'text-muted form-control-label'}, 'Notes for ' + this.props.book + ' ' + this.props.chapter),
						e('textarea', {'name' : 'user-note', 'className' : 'form-control', 'cols' : '30', 'rows' : '5', 'value' : this.state.value, 'onChange' : this.onChange}),
					),
					this.renderSubmit()
					
				)
			)
		)		
	}
}

NoteSection.propTypes = {
	book: PropTypes.string,
	chapter: PropTypes.number,
	handleSaveNote: PropTypes.func,
	handleGetNote: PropTypes.func
}
