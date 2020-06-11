
class VerseToolBar extends React.Component {
	constructor(){
		super();
		this.onClickClose = this.onClickClose.bind(this);
		this.onClickColor = this.onClickColor.bind(this);
		this.onClickDelete = this.onClickDelete.bind(this);
	}
	onClickClose(event){
		//console.log('here');
		this.props.showHideToolBar(false);
		//this.props.showHideToolBar(false);
	}
	onClickColor(event){
		// highlight verses	with the chosen color
		this.props.highlightVerses(event.target.value);
	}
	onClickDelete(event){
		this.props.deleteSelectedVerses()
	}
	renderColorGroups(){
		let listElements = [];
		let backgroundColors = {'yellow': '#FFFF00', 'green': '#49fb35', 'turquoise': '#00CED1', 'red': '#F80000', 'orange': '#FF9900'};
		for (let color in backgroundColors){
			listElements.push(
				e('div',{key: color, 'className':'color-col'}, 
					e('button', {onClick: this.onClickColor, key: color, 'className': 'color-button', 'value' : backgroundColors[color], 'style': {'backgroundColor': backgroundColors[color]}}),
					e('label', {'className' : 'text-muted'}, e('small',{},color))
				)
			);
		}
		listElements.push(
			e('div', {key: 'delete', 'className': 'color-col'},
				e('button', {onClick: this.onClickDelete, value: 'delete', key: 'delete', 'className' : 'color-button'}),
				e('label', {'className' : 'text-muted'}, e('small', {}, 'un-highlight'))
			)
		)
		return e('div', {'className' : 'color-row'}, listElements
		)		
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
		//console.log(typeof first);
		//console.log(verseArray);

		// algorithm to check if the verse are in sequence
		// if the verses are no longer in sequence, push the verse listing with the first and last verse (i.e `${Book} ${Chapter}:${first_verse}-${last_verse}')
		// if picking individual verses that are not in sequence, just push each verse to the verse listing
		for (let i = 0; i < verseArray.length; i++){
			//console.log(`value of first: ${first}`);
			// if we aren't in the last verse in the array, and the current verses plus one is not equal to the next verse
			// the verses are no longer highlighted in sequence
			if (i < verseArray.length && verseArray[i+1] != verseArray[i] + 1){
				let last = verseArray[i];
				// console.log(`value of last: ${last}`);
				// if none of the verses are in sequence, the first would have been equal to last,
				// so only push the first 
				if (last != first){
					verseListings.push(`${this.props.toolBarVerses.book} ${this.props.toolBarVerses.chapter}:${first}-${last}`);
				}
				else {
					verseListings.push(`${this.props.toolBarVerses.book} ${this.props.toolBarVerses.chapter}:${first}`);
				}

				// set first to be the next element in the array
				first = verseArray[i+1];
			}	
			// verseListings.push(`${this.props.toolBarVerses.book} ${this.props.toolBarVerses.chapter}:${verseArray[i]}`);
		}
		stringListing = verseListings.join(', ');
		//console.log(stringListing);
		return e('div', {'className':'__verse-listing'}, 
					e('small', {'className' : 'text-muted'}, stringListing)
			);
	}
	render(){
		
		return e('div', {'className' : 'toolbar card'}, 
				e('div', {'className' : 'card-body'}, 
					e('div', {'className' : 'card-title'}, 
						this.renderVerseListing(),
						e('button', {'className' : 'close-button', 'onClick' : this.onClickClose}, '\u00D7')
					),
					this.renderColorGroups()	
				),
			);	
	}
}

VerseToolBar.propTypes = {
	toolBarVerses: PropTypes.object,
	showHideToolBar: PropTypes.func,
	isShowToolBar: PropTypes.bool,
	deleteSelectedVerses: PropTypes.func
}