class LoadingSpinner extends React.Component {
	constructor(){
		super()
	}	
	render(){
		return e('div', {'className' : 'small-spinner-container'}, 
					e('div', {'className' : 'small-spinner'})
				)
	}
}