import React, { Component } from 'react';
import './RepositoryDetail.css';

class RepositoryDetail extends Component {
	render() {
		return (
			<div>
				<h2>My Repositories</h2>
				<h4>{this.props.detailUser}</h4>
			</div>
		)

	}
}

export default RepositoryDetail;
