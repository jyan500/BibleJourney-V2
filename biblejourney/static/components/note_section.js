class NoteSection extends React.Component {
	constructor(){
		super()	
		this.state = {
			value: '',
		}
		this.onSubmit = this.onSubmit.bind(this);
		this.onChangeEditor = this.onChangeEditor.bind(this);
	}	
	componentDidMount(){
		// this.getExistingNote()	
		this.setState({value: this.props.note})
	}
	componentDidUpdate(prevProps){
		if (prevProps.chapter != this.props.chapter || prevProps.book != this.props.book || prevProps.note != this.props.note){
			//console.log('component did update note section');
			//console.log('value of props: ', this.props)
			this.setState({value: this.props.note})
		}
	}
	// getExistingNote(){
	// 	this.setState({value: ''});
	// 	this.props.handleGetNote()
	// 	.then(response=>{
	// 		this.setState({value: response.content})	
	// 	})	
	// }
	onSubmit(event){
		event.preventDefault();
		this.setState({isSuccess: false})
		this.props.handleSaveNote(this.state.value);
	}	
	onChangeEditor(val){
		//console.log(val);
		this.setState({value: val});
	}
	renderSubmit(){
		if (window.appConfig.is_authenticated){
			return e('div', {'className' : 'col-md-4'},
				e('button', {'className' : 'btn btn-outline-info', 'type': 'submit'}, 'Submit')
			)	
		}	
		else {
			return e('div', {'className' : 'col-md-8'},
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
						// e('textarea', {'id' : 'editor', 'name' : 'user-note', 'className' : 'form-control', 'cols' : '30', 'rows' : '13', 'value' : this.state.value, 'onChange' : this.onChange}),
						e(TinyWrap, {content: this.state.value, onChange: this.onChangeEditor, 
							config: {
								height: '450',  
        						plugins: 'lists fullscreen link',
        						toolbar: 'numlist bullist | fullscreen link',
        						image_advtab: true, 
        					}
        				})
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
	noteMessage: PropTypes.string,
	note: PropTypes.string
}
