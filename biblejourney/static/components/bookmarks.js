class BookmarkSection extends React.Component {
	constructor(){
		super();
	}
	renderBookmarks(){
		let elements = [];
		this.props.bookmarks.map((obj) => {
			elements.push(
				e('li', {key: obj.id}, obj.book + obj.chapter)
			)
		})	
		return e('ul', null, elements);
	}
	render(){
		return e('div', {'className' : 'content-section'}, 
			e('h3', {}, 'Bookmarks'),
			e('p', {'className' : 'text-muted'}, 'Pick up where you left off!'),
			this.renderBookmarks()
		)
	}	
}


BookmarkSection.propTypes = {
}