import React, { Component } from 'react';
import './Brand.css';

function NavBar(props) {
	return (
		<div className="navbar" />
	);
}

class Brand extends Component {
	render() {
		return (
		<div>
			<NavBar />
			<div className="title_container">
				<h1 className="nav_logo">Commitment</h1>
				<h1 className="nav_logo">Issues</h1>
				<h4 className="nav_logo">Build Healthy Version Control Habits</h4>
			</div>
		</div>
		);
	}
}

export default Brand;
