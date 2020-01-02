class HomeSideBar extends React.Component {
	constructor(){
		super();
	}
	render(){
		return e('div', {'className' : 'content-section'}, 
			e('h3', {}, 'Welcome back ' + this.props.username)
		)	
	}
}