class IndividualVerse extends React.Component {
	constructor(){
		super()
		this.onClick = this.onClick.bind(this);
	}
	onClick(event){
		// alert('Book: ', this.props.book, 'Chapter: ', this.props.chapter, 'Verse Number: ', this.props.verseNumber, 'Verse Text: ', this.props.verseText);
		// this.props.showToolBar();
	}
	render(){
		if (this.props.isParagraphMode){
			return e('span', {key: this.props.verseNumber, onClick: this.onClick, style: {'color': this.props.isHighlighted ? this.props.color : 'black'}}, 
					e('sup', {'className' : 'mr-1'}, this.props.verseNumber),
					this.props.verseText	
			);
		}
		else {
			return e('p', {key: this.props.verseNumber, 'onClick': this.onClick, 'style': {'color': this.props.isHighlighted ? this.props.color : 'black'}}, 
					e('sup', {'className' : 'mr-1'}, this.props.verseNumber),
					this.props.verseText	
			);	
		}
	}
}

VerseSection.propTypes = {
	book: PropTypes.string,
	chapter: PropTypes.number,
	verseNumber: PropTypes.number,
	verseText: PropTypes.string,
	bookmarkVerse: PropTypes.func,
	isHighlighted: PropTypes.bool
}
