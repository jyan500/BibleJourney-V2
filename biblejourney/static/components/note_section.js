

class NoteSection extends React.Component {
	constructor(){
		super()	
		this.state = {
			value: '',
		}
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
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
		this.setState({isSuccess: false})
		this.props.handleSaveNote(this.state.value);
	}	
	onChange(event){
		this.setState({value: event.target.value});
	}
	renderSubmit(){
		if (window.appConfig.is_authenticated){
			return e('div', {'className' : 'col-md-4'},
				e('button', {'className' : 'btn btn-outline-info', 'type': 'submit'}, 'Submit')
			)	
		}	
		else {
			return e('div', {'className' : 'col-md-4'},
				e('small', {'className': 'text-muted'}, 'Please ', e('a', {'href' : '/login'}, 'login'), ' to save your note!')
			)
		}
	}
	renderSubmitNote(){
		if (this.props.noteMessage != ""){
			if (this.props.isSuccessNoteSave == true){
				return e('div', {'className': '__custom-alert alert alert-success col-md-7', 'role' : 'alert'}, this.props.noteMessage)	
			}
			else {
				return e('div', {'className': '__custom-alert alert alert-danger col-md-7', 'role' : 'alert'}, this.props.noteMessage)	
			}
		}
	}
	render(){
		return (
			e('div', {'className' : 'content-section'},
				e('form', {'onSubmit' : this.onSubmit}, 
					e('div', {'className' : 'form-group'},
						e('label', {'className': 'text-muted form-control-label'}, 'Notes for ' + this.props.book + ' ' + this.props.chapter),
						e('textarea', {'name' : 'user-note', 'className' : 'form-control', 'cols' : '30', 'rows' : '13', 'value' : this.state.value, 'onChange' : this.onChange}),
					),
					e('div', {'className': 'form-group row'}, 
						this.renderSubmit(),
						this.renderSubmitNote()
					)
					
				)
			)
		)		
	}
}

NoteSection.propTypes = {
	book: PropTypes.string,
	chapter: PropTypes.number,
	handleSaveNote: PropTypes.func,
	handleGetNote: PropTypes.func,
	isSuccessNoteSave: PropTypes.bool,
	noteMessage: PropTypes.string
}
