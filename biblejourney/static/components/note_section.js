

class NoteSection extends React.Component {
	constructor(){
		super()	
		this.state = {
			value: ''
		}
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}	
	onSubmit(event){
		event.preventDefault();
		this.props.handleSaveNote(this.state.value);
	}	
	onChange(event){
		this.setState({value: event.target.value});
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
					e('div', {'className' : 'form-group'},
						e('button', {'className' : 'btn btn-outline-info', 'type': 'submit'}, 'Submit')
					)
				)
			)
		)		
	}
}

NoteSection.propTypes = {
	book: PropTypes.string,
	chapter: PropTypes.number,
	handleSaveNote: PropTypes.func
}
