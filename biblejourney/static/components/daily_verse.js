class DailyVerse extends React.Component {
	constructor(){
		super();
		this.state = {
			verse: '',
			reference: '',
			version: '',
			notice: '',
			url: '',
			loading: false,
		}
	}
	componentDidMount(){
		this.setState({loading: true});
		fetch('https://beta.ourmanna.com/api/v1/get/?format=json&order=random')
			.then((response) => {
				return response.json()
			})
			.then((json) => {
				console.log(json);
				let disclaimer = json.verse.notice;
				let details = json.verse.details;
				this.setState({loading: false,verse: details.text, reference: details.reference, version: details.version, url: details.verseurl, notice: json.verse.notice})
			});
	}
	render(){
		if (this.state.loading){
			return e(LoadingSpinner)	
		}
		else {
			return e('div', {className: 'mt-3 mb-3 content-section'}, 
				e('label', {}, 'Verse of the Day'),
				e('p', {className: 'text-muted'}, this.state.verse),
				e('p', {className: 'text-muted'}, this.state.reference + ` (${this.state.version})`),
				e('small', {}, e('a', {href: this.state.url}, this.state.notice))
			)	
		}
	}

}