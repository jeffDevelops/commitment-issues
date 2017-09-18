import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import * as axios from 'axios';
import './Tracker.css';

class Tracker extends Component {
	constructor(props) {
		super(props);
		user: null;
		firebase.auth().onAuthStateChanged( (user) => {
			if (!user) {
				window.location = '/login';
			} else {
				console.log('Signed In');
				this.user = user;
				console.log('re-render triggered here.');
				this.setState({
					user: user.displayName
				});
			}
		});
		this.changeUnit = this.changeUnit.bind(this);
		this.changeInterval = this.changeInterval.bind(this);
		this.state = {
			repo: this.props.params.repo,
			owner: this.props.params.owner,
			mostRecentCommit: null, 
			interval: 4,
			unit: 'hour'
		}
	}

	changeUnit(upOrDown) {
		let unitsArray = ['hour', 'half-day', 'workday', '[DEMO]'];
		let index = unitsArray.indexOf(this.state.unit);
		if (upOrDown === 'increment') {
			if (index === unitsArray.length - 1) {
				console.log('re-render triggered here');
				this.setState({
					unit: unitsArray[0]
				});
			} else {
				console.log('re-render triggered here');
				this.setState({
					unit: unitsArray[index + 1]
				});
			}
		} else {
			console.log('re-render triggered here');
			if (index === 0) {
				this.setState({
					unit: unitsArray[unitsArray.length - 1]
				})
			} else {
				console.log('re-render triggered here');
				this.setState({
					unit: unitsArray[index - 1]
				})
			}
		}
	}

	changeInterval(upOrDown) {
		let intervalsArray = [];
		let intervalValue;
		let index;
		if (this.state.unit === 'hour') {
			for (let i = 0; i < 4; i++) {
				intervalValue = i + 1;
				intervalsArray.push(intervalValue);
			}
			index = intervalsArray.indexOf(this.state.interval);
		} else if (this.state.unit === 'half-day' || this.state.unit === '[DEMO]') {
			console.log('re-render triggered here.');
			this.setState( {
				interval: 1
			});
		} else if (this.state.unit === 'workday') {
			console.log('workday');
			for (let i = 0; i < 8; i++) {
				intervalValue = i + 1;
				intervalsArray.push(intervalValue);
			}
			console.log(intervalsArray);
			index = intervalsArray.indexOf(this.state.interval);
		}
		if (upOrDown === 'increment') {
			if (index !== intervalsArray.length - 1) {
				console.log('re-render triggered here.');
				this.setState({
					interval: intervalsArray[index + 1]
				})
			}
		} else {
			if (index !== 0) {
				console.log('re-render triggered here.');
				this.setState({
					interval: intervalsArray[index - 1]
				})
			}
		}
	}

	componentDidMount() {
		let token = window.sessionStorage.getItem('ghAccessToken');
		let URL = `https://api.github.com/repos/${this.state.owner}/${this.state.repo}/commits?access_token=${token}`;
		console.log(URL);
		axios({
			method: 'get',
			url: URL
		}).then( (response) => {
			console.log(response.data);
			this.setState({
				mostRecentCommit: response.data[0].sha
			})
		});
	}


	componentDidUpdate() {

	}

	render() {
		console.log('----------RENDER----------');
		console.log(this.state);

		let token = window.sessionStorage.getItem('ghAccessToken');
		console.log(token);
		let URL = `https://api.github.com/repos/${this.state.owner}/${this.state.repo}/commits?access_token=${token}`;
		console.log(URL);
		//HOUR CONDITION
		if (this.state.unit === 'hour') {
			let hour = 3600000;
			let interval = hour / this.state.interval;
			console.log(interval);
			window.setInterval( () => {
				axios({
					method: 'get',
					url: URL
				}).then( (response) => {
					console.log(response.data);
					this.setState({
						mostRecentCommit: response.data[0]
					});
				});
			console.log('hour ran');
			}, interval);
		}
		//DEMO CONDITION
		if (this.state.unit === '[DEMO]') {
			window.setInterval( () => {
				axios({
					method: 'get',
					url: URL
				}).then( (response) => {
					console.log(response.data);
					if (response.data[0].sha == this.state.mostRecentCommit) { //user fails if previous API call comes back with same array
						this.setState({
							result: 'fail'
						})
					} else { //if they pass, also update the state of the most recent commit, so that can be checked next
						this.setState({
							mostRecentCommit: response.data[0].sha,
							result: 'pass'
						});
					}
				});
				console.log('DEMO ran');
			}, 15000);
		}
		//HALFDAY CONDITION
		if (this.state.unit === 'half-day') {
			//make API calls at 11:55am and 4:55pm
		}
		if (this.state.unit === 'workday') {
			let workday = 28800000;
			let interval = workday / this.state.interval;
			window.setInterval( () => {
				console.log('workday ran');
			// 	axios({
			// 		method: 'get',
			// 		url: URL
			// 	}).then( (response) => {
			// 		console.log(response.data);
			// 	})
			}, interval);
		}

		return (
			<div>
				<Link to='/login' className="back_button"><i className="material-icons back">chevron_left</i></Link>
				<h3 className="repo">You are tracking the <b>{this.state.repo}</b> repository.</h3>
				<div className="tracker">
					<h2>Goal Interval</h2>
					<div className="interval_container">
						{ this.state.unit === 'half-day' || this.state.unit === '[DEMO]'
							? <div>
									<button
									className="override">
									<i className="disabled material-icons arrow_buttons">arrow_drop_up</i>
									</button>
									<h3 className="interval_value">1</h3>
									<button 
										className="override">
										<i className=" disabled material-icons arrow_buttons down interval_value_down">arrow_drop_down</i>
									</button>
								</div>
							: <div>
									<button
										onClick={ () => { this.changeInterval('increment') }}
										className="override">
										<i className="material-icons arrow_buttons">arrow_drop_up</i>
									</button>
									<h3 className="interval_value">{this.state.interval}</h3>
									<button 
									onClick={ () => { this.changeInterval('decrement') }}
									className="override">
									<i className="material-icons arrow_buttons down interval_value_down">arrow_drop_down</i>
									</button>
								</div>
						}
						</div>
					<h1 className="slash">/</h1>
					<div className="unit_container">
						<button 
						onClick={ () => { this.changeUnit('increment') }}
						className="override"><i className="material-icons arrow_buttons up unit_value_up">arrow_drop_up</i></button>
						<h3 className="unit_value">{this.state.unit}</h3>
						<button 
						onClick={ () => {this.changeUnit('decrement') }}
						className="override">
						<i className="material-icons arrow_buttons down unit_value_down">arrow_drop_down</i>
						</button>
						{ this.state.unit === 'workday'
						? <p className="unit_description">This setting will remind you to commit and push however many times you want within a 8-hour period.
							</p>
						: null
						}
						{ this.state.unit === 'half-day'
						? <p className="unit_description">This setting will remind you to commit and push before lunch and before 5 o'clock.
							</p>
						: null
						}
						{ this.state.unit === '[DEMO]'
						? <p className="unit_description">This setting demonstrates the functionality of the app by checking whether you've committed and pushed every 30 seconds.
							</p>
						: null
						}
					</div>
				</div>
				<div className="results">

				</div>
			</div>
		)
	}
}

export default Tracker;