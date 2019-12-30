class NotePanel extends React.Component {
	constructor(){
		super();
	}	
	renderNotes(){
		let elements = [];
		this.props.notes.map((obj) => {
			elements.push(
				e('li', {key: obj.id}, obj.book + ' ' + obj.chapter)
			)
		})	
		return e('ul', null, elements);
	}
	render(){
		return e('div', {'className' : 'content-section'}, 
			e('h3', {}, 'Notes'),
			e('p', {'className' : 'text-muted'}, 'Your most recent notes!'),
			this.renderNotes()
		)
	}	
}