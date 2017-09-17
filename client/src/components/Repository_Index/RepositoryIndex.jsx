import React, { Component } from 'react';

import Login from '../Auth/Login.jsx';

/*import children components here*/
import RepositoryDetail from '../Repository_Detail/RepositoryDetail.jsx';

import './RepositoryIndex.css';


class RepositoryIndex extends Component {
	constructor(props) {
		super(props);
		
	}
	render() {
		return(	
			<div>
				<Login />
			</div>
		)
	}
}

export default RepositoryIndex;
