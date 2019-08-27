class VerseSection extends React.Component {
	constructor(){
		super()
	}	
	render(){
		let verse_elements = this.props.verses.map(function(verse){
			return e('p', null, 
						e('sup', {key : verse.verse, 'className' : 'mr-1'}, verse.verse),
						verse.text
					)	
		});
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
						e(React.Fragment, null, verse_elements)
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
	error: PropTypes.string
}
