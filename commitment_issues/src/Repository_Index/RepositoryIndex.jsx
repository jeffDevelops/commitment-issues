import React, { Component } from 'react';

/*import children components here*/

import './RepositoryIndex.css';


class RepositoryIndex extends Component {
	constructor(props) {
		super(props);
		/*this.state = { } */
	}
	render() {
		return(
			<div className="title_container">
				<h1>Commitment</h1>
				<h1>Issues</h1>
				<h4>Build Healthy Version Control Habits</h4>
			</div>
		)
	}
}
