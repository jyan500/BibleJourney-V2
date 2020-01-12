class VerseSection extends React.Component {
	constructor(){
		super()
		this.onClickPrev = this.onClickPrev.bind(this)
		this.onClickNext = this.onClickNext.bind(this)
	}	
	onClickPrev(){
		let prev_chapter = this.props.chapter - 1
		if (prev_chapter > 0){
			let prev_verse = this.props.book + ' ' + prev_chapter
			this.props.handleGetRequest(prev_verse)	
		}
	}
	onClickNext(){
		let next_chapter = this.props.chapter + 1
		if (next_chapter <= this.props.num_chapters){
			let next_verse = this.props.book + ' ' + next_chapter
			this.props.handleGetRequest(next_verse)
		}
	}
	renderPrevious(){
		if (this.props.book != ""){
			if (this.props.chapter - 1 > 0){
				return (
					e('div', {'className' : 'col-md-1 prev', 'id' : 'home-prev-div', 'onClick' : this.onClickPrev}, 
						e('a', {'id' : 'home-prev-link'},
							e('i', {'className' : 'fas fa-chevron-left'})
						)
					)
				)	
			}
			else {
				return (
					e('div', {'className' : 'col-md-1 prev'}, 
					)
				)	
			}
		}	
	}
	renderNext(){
		if (this.props.book != ""){
			if (this.props.chapter < this.props.num_chapters){
				return (
					e('div', {'className': 'col-md-1 next pr-2 m-0', 'id' : 'home-next-div', 'onClick' : this.onClickNext},
						e('a', {'id' : 'home-next-link'},
							e('i', {'className' : 'fas fa-chevron-right'})
						)
					)	
				)	
			}
			else{
				e('div', {'className' : 'col-md-1 next'}, 
				)
			}
		}
	}
	renderTitle(){
		if (this.props.book != '' && this.props.chapter != 0){
			return (
				e('h2', {'className' : 'mt-3 mb-3'}, this.props.book + ' ' + this.props.chapter)
			)
		}	
	}
	renderVerseElements(){
		let verse_elements = [];
		if (!this.props.isParagraphMode){
			verse_elements = this.props.verses.map((verse, i) => {
				// return e('p', {key: verse.verse}, 
				// 			e('sup', {key : verse.verse, 'className' : 'mr-1'}, verse.verse),
				// 			verse.text
				// 		)	
				return e(IndividualVerse, {key: i, 'isParagraphMode': this.props.isParagraphMode, 'book': this.props.book, 'chapter' : this.props.chapter, 'verseNumber': verse.verse, 'verseText': verse.text})
			});
		}	
		else {
			this.props.verses.forEach((verse, i) => {
				console.log(verse);
				if (i != 0 && i % 5 == 0){
					verse_elements.push(e('br', null, null))
					verse_elements.push(e('br', null, null))
				}
				verse_elements.push(
					e(IndividualVerse, {key: i, 'isParagraphMode': this.props.isParagraphMode, 'book': this.props.book, 'chapter' : this.props.chapter, 'verseNumber': verse.verse, 'verseText': verse.text})
					// e('span', null, 
					// 	e('sup', {key: verse.verse, 'className' : 'mr-1'}, verse.verse),
					// 	verse.text
					// )
				)
			})
		}
		return e(React.Fragment, null, verse_elements)
	}
	render(){
		
		if (this.props.error != ''){
			return (
				e('div', {'className' : 'content-section'},
					e('h3', null, this.props.error)
				)
			)
		}
		else {
			return (
				e('div', {'className' : 'content-section'},
					e('div', {'className' : 'row verses'}, 
						e(React.Fragment, null, this.renderPrevious()),
						e('div', {'className' : 'col-md-10 pl-2'}, 
							e(React.Fragment, null, this.renderTitle()),
							e(React.Fragment, null, this.renderVerseElements()),
						),
						e(React.Fragment, null, this.renderNext())
					)
				)
			)	
		}
			
	}
}

VerseSection.propTypes = {
	verses: PropTypes.array.isRequired,
	book_name: PropTypes.string,
	num_chapters: PropTypes.number,
	chapter: PropTypes.number,
	error: PropTypes.string,
	handleGetRequest: PropTypes.func
}
