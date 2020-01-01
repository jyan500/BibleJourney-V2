class NotePanel extends React.Component {
	constructor(){
		super();
	}	
	renderNotes(){
		let elements = [];
		this.props.notes.map((obj) => {
			elements.push(
				e('div', {key: obj.id, className: 'mb-2 mt-2 col-sm-4'}, 
					e('div', {className: 'card'}, 
						e('div', {className: 'card-body'}, obj.book + ' ' + obj.chapter)
					)
				)
			)
		})	
		return e('div', {className: 'row'}, elements);
	}
	render(){
		return e('div', {'className' : 'content-section'}, 
			e('h3', {}, 'Notes'),
			e('p', {'className' : 'text-muted'}, 'Your most recent notes!'),
			this.renderNotes()
		)
	}	
}