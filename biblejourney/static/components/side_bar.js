class SideBar extends React.Component {
	constructor(){
		super()
		this.state = {
			isParagraphMode: false, 
			isBookMark: false
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onChange(event){
		const {name, type, checked} = event.target
		const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
		this.setState({[event.target.name] : value})	
		if (event.target.type === 'checkbox' && event.target.name == 'isParagraphMode'){
			this.props.saveParagraphMode(value);
		}
		else {
			this.props.addEditBookMark(value);
		}
	}
	onSubmit(event){
	}
	render(){
		return (
			e('div', {'className' : 'content-section'}, 
				e('h3', null, this.props.title),
				e('p', {'className' : 'text-muted'}, this.props.description),
				e('div', {'className' : 'form-group'},
					e('div', {'className' : 'form-check'},
						e('input', {'name': 'isParagraphMode', 'onChange' : this.onChange, 'className' : 'form-check-input', 'type' : 'checkbox', 'checked' : this.state.isParagraphMode}),
						e('label', {'className' : 'form-check-label'}, this.props.label)
					),
					e('div', {'className' : 'form-check'},
						e('input', {'name' : 'isBookMark', 'onChange' : this.onChange, 'className' : 'form-check-input', 'type' : 'checkbox', 'checked': this.state.isBookMark}),
						e('label', {'className' : 'form-check-label'}, 'Bookmark this chapter')
					),
				),
			)
		)
	}
}

SideBar.propTypes = {
	title: PropTypes.string,
	label: PropTypes.string,
	description: PropTypes.string,
	saveParagraphMode: PropTypes.func,
	addEditBookMark: PropTypes.func
}