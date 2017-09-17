import React, { Component } from 'react';
import { Link } from 'react-router';

import Brand from '../Brand/Brand.jsx';

class App extends Component {
	render() {
		return(
			<div className="page_container">
				<Brand />
				{this.props.children}
			</div>
		);
	}
}

export default App;