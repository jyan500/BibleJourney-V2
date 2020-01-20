
class VerseToolBar extends React.Component {
	constructor(){
		super();
	}
	renderVerseListing(){
		let book = this.props.toolBarVerses.book;
		let chapter = this.props.toolBarVerses.chapter;
		let verses = this.props.toolBarVerses.verses;

		// check if the verses were highlighted in sequence
		let inSequence = [];
		let verseListings = [];
		let stringListing = '';
	
		// convert to an array and sort
		let verseArray = Array.from(verses);

		// sort as numbers
		verseArray.sort(function(a,b){
			return a-b;
		});
		let first = verseArray[0];
		console.log(typeof first);
		console.log(verseArray);
		for (let i = 0; i < verseArray.length; i++){
			console.log(`value of first: ${first}`);
			// if we aren't in the last verse, and the current verses plus one is not equal to the next verse
			// the verses are not highlighted in sequence
			if (i < verseArray.length && verseArray[i+1] != verseArray[i] + 1){
				// if none of the verses are in sequence, the first would have been equal to last,
				// so only push the first 
				let last = verseArray[i];
				console.log(`value of last: ${last}`);
				if (last != first){
					verseListings.push(`${this.props.toolBarVerses.book} ${this.props.toolBarVerses.chapter}:${first}-${last}`);
				}
				else {
					verseListings.push(`${this.props.toolBarVerses.book} ${this.props.toolBarVerses.chapter}:${first}`);
				}
				first = verseArray[i+1];
			}	
			// verseListings.push(`${this.props.toolBarVerses.book} ${this.props.toolBarVerses.chapter}:${verseArray[i]}`);
		}
		stringListing = verseListings.join(', ');
		console.log(stringListing);
		return e('small', {'className' : 'text-muted'}, stringListing);
	}
	render(){
		
		return e('div', {'className' : 'toolbar card'}, 
				e('div', {'className' : 'card-body'}, 
					e('div', {'className' : 'card-title'}, 
						this.renderVerseListing()
					),
					e('p', {'className' : 'card-text'},
						'Highlight your text here'
					)
				),
			);	
	}
}

VerseToolBar.propTypes = {
	toolBarVerses: PropTypes.object,
}