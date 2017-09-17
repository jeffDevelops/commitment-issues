import React, { Component } from 'react';
import { Link } from 'react-router';
import './Tracker.css';

class Tracker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			repo: this.props.params.repo,
			interval: 4,
			unit: 'hour'
		}
	}

	
	render() {
		return (
			<div>
				<Link to='/login' className="back_button"><i className="material-icons back">chevron_left</i></Link>
				<h3>You are tracking {this.state.repo}</h3>
				<div className="tracker">
					<h2>Goal Interval</h2>
					<div className="interval_container">
						<button className="override"><i className="material-icons arrow_buttons up interval_value_up">arrow_drop_up</i></button>
						<h3 className="interval_value">{this.state.interval}</h3>
						<button className="override"><i className="material-icons arrow_buttons down interval_value_down">arrow_drop_down</i></button>
					</div>
					<h1 className="slash">/</h1>
					<div className="unit_container">
						<button className="override"><i className="material-icons arrow_buttons up unit_value_up">arrow_drop_up</i></button>
						<h3 className="unit_value">{this.state.unit}</h3>
						<button className="override"><i className="material-icons arrow_buttons down unit_value_down">arrow_drop_down</i></button>
					</div>
				</div>
			</div>
		)
	}
}

export default Tracker;