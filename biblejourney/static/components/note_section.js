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
		console.log(this.state.value);
	}	
	onChange(event){
		this.setState({value: event.target.value});
	}
	render(){
		return (
			e('form', {'onSubmit' : this.onSubmit}, 
				e('div', {'className' : 'form-group'}, 
					e('textarea', {'value' : this.state.value, 'className' : 'form-control', 'placeholder' : 'Please type your note here...'})
				),
				e('div', {'className' : 'form-group'},
					e('button', {'className' : 'btn btn-outline-info', 'type': 'submit'}, 'Submit')
				)
			)
		)		
	}
}