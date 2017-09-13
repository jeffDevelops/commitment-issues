import React, { Component } from 'react';

/*import children components here*/
import RepositoryDetail from '../Repository_Detail/RepositoryDetail.jsx';

import './RepositoryIndex.css';


class RepositoryIndex extends Component {
	constructor(props) {
		super(props);
		/*this.state = { } */
	}
	render() {
		return(	
			<div>
				<h2>My Repositories</h2>

				<RepositoryDetail />
				<RepositoryDetail />
				<RepositoryDetail />
				<RepositoryDetail />
			</div>
		)
	}
}

export default RepositoryIndex;
