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
			let date = this.props.convertDate(obj.date_posted);
			console.log('date in render notes: ', date.getMonth()+1);
			let formatted_date = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
			let link_text = obj.verse ? obj.book + ' ' + obj.chapter + ':' + obj.verse : obj.book + ' ' + obj.chapter
			elements.push(
				e('div', {key: obj.id, className: 'mb-2 mt-2 col-sm-4'}, 
					e('div', {className: 'card hover-dark'}, 
						e('img', {className: 'card-img-top', src: this.props.bible_bookmark_url, alt : 'Card image cap'}),
						e('div', {className: 'card-body'}, 
							e('a', {id: obj.book + ' ' + obj.chapter, href: '/verses?verse=' + link_text, onClick: this.onClick, className: 'card-title stretched-link'}, link_text),
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
			e('h3', {}, 'Bookmarks'),
			e('p', {'className' : 'text-muted'}, 'Pick up where you left off!'),
			this.renderBookmarks(),
			e('small', {'className' : 'text-muted'}, e('a', {href : '/bookmarks'}, 'View More Bookmarks'))
		)
	}	
}


BookmarkPanel.propTypes = {

}