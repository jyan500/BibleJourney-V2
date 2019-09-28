class VerseSection extends React.Component {
	constructor(){
		super()
	}	
	renderPrevious(){
		if (this.props.book != ""){
			if (this.props.chapter - 1 > 0){
				return (
					e('div', {'className' : 'col-md-1 prev', 'id' : 'home-prev-div'}, 
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
					e('div', {'className': 'col-md-1 next pr-2 m-0', 'id' : 'home-next-div'},
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
				e('h2', {'className' : 'mb-3'}, this.props.book + ' ' + this.props.chapter)
			)
		}	
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
						e(React.Fragment, null, this.renderPrevious()),
						e('div', {'className' : 'col-md-10 pl-2'}, 
							e(React.Fragment, null, this.renderTitle()),
							e(React.Fragment, null, verse_elements),
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
	error: PropTypes.string
}
