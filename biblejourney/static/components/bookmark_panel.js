class BookmarkPanel extends React.Component {
	constructor(){
		super();
		this.onClick = this.onClick.bind(this);
	}
	onClick(event){
		console.log(event.target.id);
		return this.props.handleGetRequest(event.target.id);
	}
	renderBookmarks(){
		let elements = [];
		this.props.bookmarks.map((obj) => {
			elements.push(
				e('div', {key: obj.id, className: 'mb-2 mt-2 col-sm-4'}, 
					e('div', {className: 'card'}, 
						e('img', {className: 'card-img-top', src: this.props.bible_bookmark_url, alt : 'Card image cap'}),
						e('div', {className: 'card-body'}, 
							e('a', {id: obj.book + ' ' + obj.chapter, href: '#', onClick: this.onClick, className: 'card-title stretched-link'}, obj.book + ' ' + obj.chapter),
						)
					)
				)
			)
		})	
		return e('div', {className: 'row'}, elements);
	}
	render(){
		return e('div', {'className' : 'content-section'}, 
			e('h3', {}, 'Bookmarks'),
			e('p', {'className' : 'text-muted'}, 'Pick up where you left off!'),
			this.renderBookmarks()
		)
	}	
}


BookmarkPanel.propTypes = {
}