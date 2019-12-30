class LoadingOverlay extends React.Component {
	constructor(){
		super()
	}	
	render(){
		return e('div', {'className' : 'overlay'}, 
			e('div', {'className' : 'spinner'})
		)
	}
}