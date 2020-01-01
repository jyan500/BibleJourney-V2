class BookmarkPanel extends React.Component {
	constructor(){
		super();
		this.onClick = this.onClick.bind(this);
	}
	onClick(event){
		console.log(event.target.value);
		return this.props.handleGetRequest(event.target.value);
	}
	renderBookmarks(){
		let elements = [];
		this.props.bookmarks.map((obj) => {
			elements.push(
				e('div', {className: 'mb-2 mt-2 col-sm-4'}, 
					e('div', {className: 'card', key: obj.id}, 
						e('img', {className: 'card-img-top', src: this.props.bible_bookmark_url, alt : 'Card image cap'}),
						e('div', {className: 'card-body'}, 
							e('h5', {className: 'card-title'}, obj.book + ' ' + obj.chapter),
							e('button', {value: obj.book + ' ' + obj.chapter, onClick: this.onClick, className: 'btn btn-primary'}, 'Enter')
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