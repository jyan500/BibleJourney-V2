class NotePanel extends React.Component {
	constructor(){
		super();
		this.onClick = this.onClick.bind(this);
	}	
	onClick(event){
		console.log(event.target.id);
		return this.props.handleGetRequest(event.target.id);
	}
	renderNotes(){
		let elements = [];
		this.props.notes.map((obj) => {
			let date = this.props.convertDate(obj.date_posted);
			console.log('date in render notes: ', date.getMonth()+1);
			let formatted_date = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
			elements.push(
				e('div', {key: obj.id, className: 'mb-2 mt-2 col-sm-4'}, 
					e('div', {className: 'card hover-dark'}, 
						e('img', {className: 'card-img-top', src: this.props.bible_notebook_url, alt : 'Card image cap'}),
						e('div', {className: 'card-body'}, 
							e('a', {id: obj.book + ' ' + obj.chapter, href: '#', onClick: this.onClick, className: 'card-title stretched-link'}, obj.book + ' ' + obj.chapter),
							e('p', {}, e('small', {}, formatted_date))
						)
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
			this.renderNotes(),
			e('small', {'className' : 'text-muted'}, e('a', {href : '#'}, 'View More Notes'))
		)
	}	
}