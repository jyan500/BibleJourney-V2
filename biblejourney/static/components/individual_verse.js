class IndividualVerse extends React.Component {
	constructor(){
		super()
		this.onClick = this.onClick.bind(this);
	}
	onClick(event){
		console.log('book: ', this.props.book, 'chapter: ', this.props.chapter, 'Verse Number: ', this.props.verseNumber);
		// show the toolbar
		// add the verse numbers to an array
		// when the user clicks the highlight button, construct the final verse from the verse numbers from the array
		// if the toolbar is already shown when the user clicks on a verse, do not show the toolbar already
		// alert('Book: ', this.props.book, 'Chapter: ', this.props.chapter, 'Verse Number: ', this.props.verseNumber, 'Verse Text: ', this.props.verseText);
		this.props.showHideToolBar(true);
		this.props.updateToolBar(this.props.book, this.props.chapter, this.props.verseNumber);
	}
	render(){
		if (this.props.isParagraphMode){
			return e('span', {	
							key: this.props.verseNumber, 
							onClick: this.onClick, 
							style: 
								{
									'backgroundColor': this.props.highlightColor !== '' ? this.props.highlightColor : '',
									'outlineStyle' : this.props.isSelected ? 'dotted' : ''
								}
							}, 
					e('sup', {'className' : 'mr-1'}, this.props.verseNumber),
					this.props.verseText	
			);
		}
		else {
			return e('p', {
						key: this.props.verseNumber, 
						'onClick': this.onClick, 
						'style': 
							{
								'backgroundColor': this.props.highlightColor !== '' ? this.props.highlightColor : '',
								'outlineStyle' : this.props.isSelected ? 'dotted' : '',
								'outlineColor' : this.props.isSelected ? '#C0C0C0' : '',
							}
						}, 
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
	highlightColor: PropTypes.string,
	showHideToolBar: PropTypes.func,
	updateToolBar: PropTypes.func,
	isSelected: PropTypes.bool,
}
