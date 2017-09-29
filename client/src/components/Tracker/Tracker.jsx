import React, { Component } from 'react';
import { Link } from 'react-router';
import * as firebase from 'firebase';
import * as axios from 'axios';
import './Tracker.css';
import Brand from '../Brand/Brand.jsx';

import successSound from '../../media/success.mp3';
import reminderSound from '../../media/reminder.mp3';

function Results (props) {
	console.log(props.result);
	//Fail
	switch (props.result) {
		case 'fail':
			return (
				<div className="result_message">
					<audio src={reminderSound} />
					<p className="message red"><i className="material-icons">error_outline</i>This is a friendly reminder to commit and push!</p>
				</div>
			);
			break;
		case 'pass':
			return (
				<div className="result_message">
					<audio src={successSound} />
					<p className="message green"><i className="material-icons">check_circle</i>Great job! Backed-up code does a happy dev make!</p>
				</div>
			);
			break;
	}
}

class Tracker extends Component {
	constructor(props) {
		super(props);
			firebase.auth().onAuthStateChanged( (user) => {
			if (!user) {
				window.location = '/';
			} else {
				console.log('Signed In');
				this.user = user;
			}
		});

		//Bind 'this' to the component class in method scopes
		this.changeUnit = this.changeUnit.bind(this);
		this.changeInterval = this.changeInterval.bind(this);
		this.runTimer = this.runTimer.bind(this);
		this.clearResultMessage = this.clearResultMessage.bind(this);

		this.state = {
			repo: this.props.params.repo,
			owner: this.props.params.owner,
			mostRecentCommit: null,
			rerenders: 0,
			interval: 4,
			unit: 'hour',
			tracking: false,
			result: 'waiting',

			hourInterval: null,
			demoInterval: null,
			workdayInterval: null,
			//halfdayInterval: null
		}
	}

	changeUnit(upOrDown) {
		window.clearInterval(this.state.hourInterval);
		window.clearInterval(this.state.demoInterval);
		window.clearInterval(this.state.workdayInterval);
		//window.clearInterval(this.state.halfdayInterval);

		let unitsArray = ['hour', 'workday', 'Try It!'];
		let index = unitsArray.indexOf(this.state.unit);
		if (upOrDown === 'increment') {
			if (index === unitsArray.length - 1) {
				console.log('re-render triggered here');
				this.setState({
					unit: unitsArray[0],
					tracking: false
				});
			} else {
				console.log('re-render triggered here');
				this.setState({
					unit: unitsArray[index + 1],
					tracking: false
				});
			}
		} else {
			console.log('re-render triggered here');
			if (index === 0) {
				this.setState({
					unit: unitsArray[unitsArray.length - 1],
					tracking: false
				})
			} else {
				console.log('re-render triggered here');
				this.setState({
					unit: unitsArray[index - 1],
					tracking: false
				})
			}
		}
	}

	changeInterval(upOrDown) {
		window.clearInterval(this.state.hourInterval);
		window.clearInterval(this.state.demoInterval);
		window.clearInterval(this.state.workdayInterval);
		//window.clearInterval(this.state.halfdayInterval);

		let intervalsArray = [];
		let intervalValue;
		let index;
		if (this.state.unit === 'hour') {
			for (let i = 0; i < 4; i++) {
				intervalValue = i + 1;
				intervalsArray.push(intervalValue);
			}
			index = intervalsArray.indexOf(this.state.interval);
		} else if (this.state.unit === 'half-day' || this.state.unit === 'Try It!') {
			console.log('re-render triggered here.');
			this.setState({
				interval: 1,
				tracking: false
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
					interval: intervalsArray[index + 1],
					tracking: false
				})
			}
		} else {
			if (index !== 0) {
				console.log('re-render triggered here.');
				this.setState({
					interval: intervalsArray[index - 1],
					tracking: false
				})
			}
		}
	}

	runTimer() {
		let token = window.sessionStorage.getItem('ghAccessToken');
		let URL = `https://api.github.com/repos/${this.state.owner}/${this.state.repo}/commits?access_token=${token}`;

		//DEMO CONDITION
		if (this.state.unit === 'Try It!') {
			console.log('DEMO!');
			var demoInterval = window.setInterval( () => {
				axios({
					method: 'get',
					url: URL
				}).then( (response) => {
					console.log(response.data);
					if (response.data[0].sha === this.state.mostRecentCommit) { //user fails if previous API call comes back with same array
						this.setState({
							result: 'fail',
							rerenders: 2
						})
					} else { //if they pass, also update the state of the most recent commit, so that can be checked next
						this.setState({
							rerenders: 2,
							mostRecentCommit: response.data[0].sha,
							result: 'pass'
						});
					}
				});
				console.log('DEMO ran');
			}, 60000);
			this.setState({
				demoInterval: demoInterval,
				tracking: true
			});
		}

		//HOUR CONDITION
		if (this.state.unit === 'hour') {
			let hour = 3600000;
			let interval = hour / this.state.interval;
			console.log(interval);
			var hourInterval = window.setInterval( () => {
				axios({
					method: 'get',
					url: URL
				}).then( (response) => {
					console.log(response.data);
					this.setState({
						mostRecentCommit: response.data[0]
					});
					if (response.data[0].sha === this.state.mostRecentCommit) { //user fails if previous API call comes back with same array
						this.setState({
							result: 'fail',
							rerenders: 2
						})
					} else { //if they pass, also update the state of the most recent commit, so that can be checked next
						this.setState({
							rerenders: 2,
							mostRecentCommit: response.data[0].sha,
							result: 'pass'
						});
					}
					this.setState({
						hourInterval: hourInterval,
						tracking: true
					 });
				}, interval);
			});
		}

		// //HALFDAY CONDITION
		// if (this.state.unit === 'half-day') {
		// 	console.log('HALFDAY');
		// 	//make API calls at 11:55am and 4:55pm
		// 	this.setState({
		// 		tracking: true
		// 	});
		// }

		//WORKDAY CONDITION
		if (this.state.unit === 'workday') {
			console.log('WORKDAY!');
			let workday = 28800000;
			let interval = workday / this.state.interval;
			var workdayInterval = window.setInterval( () => {
				console.log('workday ran');
				axios({
					method: 'get',
					url: URL
				}).then( (response) => {
					console.log(response.data);
					if (response.data[0].sha === this.state.mostRecentCommit) { //user fails if previous API call comes back with same array
						this.setState({
							result: 'fail',
							rerenders: 2
						})
					} else { //if they pass, also update the state of the most recent commit, so that can be checked next
						this.setState({
							rerenders: 2,
							mostRecentCommit: response.data[0].sha,
							result: 'pass'
						});
					}
				});
			}, interval);
			this.setState({
				workdayInterval: workdayInterval,
				tracking: true
			});
		}
	}

	clearResultMessage() { //Wait five seconds, and then clear the result message
		console.log('Is clear function running?');
		window.setTimeout( () => {
			console.log("Is this happening?");
			this.setState({ result: 'waiting' });
		}, 5000);
	}

	componentWillUnmount() {
		window.clearInterval(this.state.hourInterval);
		window.clearInterval(this.state.demoInterval);
		window.clearInterval(this.state.workdayInterval);
		this.setState({ tracking: false });

		//window.clearInterval(this.state.halfdayInterval);
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
		this.state.rerenders += 1;
	}

	render() {
		console.log('----------RENDER----------');
		console.log(this.state);

		if (this.state.tracking && this.state.result !== 'waiting') {
			console.log(this.clearResultMessage);
			this.clearResultMessage(); //This is reeeeally bad practice... a state change exists in this function; definitely open to suggestions on how to implement this better.
		}

		return (
			<div className="tracker_component">
				<Brand className="brand"/>

				{/* RESULTS */}

				{ this.state.mostRecentCommit && this.state.rerenders > 1 &&
					<div>
						{ this.state.result === 'fail' &&
							<Results result="fail" />
						}
						{ this.state.result === 'pass' &&
							<Results result="pass" />
						}
						{ this.state.result === 'waiting' &&
							<div />
						}
					</div>
				}

				{/* UI */}

				<Link to='/' className="back_button"><i className="material-icons back">chevron_left</i></Link>
				<h3 className="repo">You are tracking the <b>{this.state.repo}</b> repository.</h3>
				<h2 className="goal_heading">Goal Interval</h2>
				<div className="tracker">
					<div className="interval_container">
						{ this.state.unit === 'half-day' || this.state.unit === 'Try It!'
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
						{ this.state.unit === 'workday'
						? <p className="unit_description">8-hour workday
							</p>
						: null
						}
						{ this.state.unit === 'half-day'
						? <p className="unit_description">Before noon and 5 o'clock
							</p>
						: null
						}
						{ this.state.unit === 'Try It!'
						? <p className="unit_description">Checks Every Minute
							</p>
						: null
						}
						<i className="material-icons arrow_buttons down unit_value_down">arrow_drop_down</i>
						</button>
					</div>
				</div> {/*TRACKER*/}

				{ !this.state.tracking
					? <div className="track_button">
							<button
								onClick={this.runTimer}
							><i className="material-icons track">track_changes</i>Track Backups
							</button>
						</div>
					: <div className="tracking">
							<i className="material-icons track">track_changes</i><h4>Listening<br />For Backups</h4>
						</div>
				}

			</div>
		)
	}
}

export default Tracker;
