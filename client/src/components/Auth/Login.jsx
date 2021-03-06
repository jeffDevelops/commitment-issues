import React, { Component } from 'react';
import { Link } from 'react-router';
import * as axios from 'axios';
import * as firebase from 'firebase';
import { provider } from '../../config/auth.js';
import './Login.css';


function RepoIndex(props) {
	console.log(props.repos);
	return (
		<div>
			<h2 className="repo_section_title">Select a Repo To Track</h2>
			<section className="repos_section">
				<ul className="repos_list">
					{ props.repos.map(function(repo, index) {
						return (
						 	<Link to={`/tracker/${repo.name}/${repo.owner.login}`} className="link" key={repo.name}
						 		onClick={ ((event) => {
						 			// event.preventDefault();
						 			saveToDatabase(repo.name, event)
						 		})}>
							 	<li className="repo_detail">
							 		<div className="info_container">
								 		<h4 className="repo_name">{repo.name}</h4>
								 		<p>{repo.owner.login}</p>
								 		<h4 className="repo_detail">Stars: {repo.stargazers_count}</h4>
								 		<h4 className="repo_detail">Watchers: {repo.watchers_count}</h4>
								 		<h4 className="repo_detail">Open Issues: {repo.open_issues}</h4>
								 	</div>
								 	<img src={repo.owner.avatar_url} alt={repo.owner.login + "'s GitHub Avatar" } />
								</li>
							</Link>
						)
					})}
				</ul>
			</section>
		</div>
	);
}

function saveToDatabase(repo, event) {
	console.log('saving this thing', repo);
}


class Login extends Component {
	constructor(props) {
		super(props);
		this.getUserRepositories = this.getUserRepositories.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.logout = this.logout.bind(this);
		// this.token = null;
		this.state = {
			token: null,
		};
	}

	authenticate() {
		let token;
		console.log("setState");
		this.setState({ fetchingUser: true });
		firebase.auth().signInWithPopup(provider).then(function(result) {
			//This gives you access to a GitHub Access Token, which is used to access the Github API
			token = result.credential.accessToken;
			console.log(token);
			//The signed-in user info
			// var user = result.user;
		}).catch(function(error) {
			// var errorCode = error.code;
			// var errorMessage = error.message;
			//The email of the user's account used
			// var email = error.email;
			//The firebase.auth.AuthCredential type that was used (Github)
			// var credential = error.credential;
		}).then( () => {
			console.log(token);
			window.sessionStorage.setItem('ghAccessToken', token);
			let storedToken = window.sessionStorage.getItem('ghAccessToken');
			console.log(storedToken);
			console.log("setState");
			this.getUserRepositories(storedToken);
			this.setState({
				token: storedToken,
				fetchingUser: false,
				askForTokenPermission: false
			});
		});
	}

	getUserRepositories(token) {
		console.log('API Call here!'); //
		console.log(token);
		// https://api.github.com/user/repos?access_token=
		let URL = `https://api.github.com/user/repos?sort=updated&per_page=1000&access_token=${token}`;
		axios({ //Make API Call
			method: 'get',
			url: URL,
			responseType: 'json'
		}).then( (response) => { //Render results
			console.log("setState");
			this.setState({
				repositories: response.data
			});
		});
	}

	logout() {
		firebase.auth().signOut().then( () => {
			return(
				<div><h2>Log Out Successful!</h2></div>
			)
		}).catch( (error) => {
			console.log('An error occurred.', error);
		});
		console.log("setState");
		this.setState({
			user: ''
		});
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged( (user) => {
			if (user) {
				console.log('SIGNED IN: ' + user.displayName);
				console.log(user);
				console.log(this);
				if (this.state.token) {
					console.log("API function called");
					this.getUserRepositories(this.state.token);
					console.log("setState");
					this.setState({
						askForTokenPermission: false,
					 	user: user.displayName
					});
				} else {
					console.log("setState");
					this.setState({
						askForTokenPermission: true,
						user: user.displayName
					});
				}
			}
			else {
				console.log('No user is signed in.');
			}
		});
		let savedToken = window.sessionStorage.getItem('ghAccessToken');
		console.log("API function called");
		this.getUserRepositories(savedToken);
		console.log("setState");
		this.setState({ token: savedToken })
	}

	render() {
		console.log('--------------STATE: ', this.state);
		return (
			<div>
				{ this.state.user && !this.state.fetchingUser
					? <div>
							<div className="login_section">
								<h2>Hello, {this.state.user}!</h2>
								<button onClick= { this.logout }><i className="material-icons logout">undo</i>Log out</button>
							</div>
							<div>
							{ this.state.repositories
								? <RepoIndex repos={this.state.repositories} />
								: <h2 className="loading">Fetching your repositories</h2>
							}
							</div>
						</div>
					:	<div className="login_prompt">
							{ this.state.fetchingUser &&
								<h2 className="loading">Fetching your repositories</h2>
							}
							<h3 className="login_message">You must be logged into your GitHub profile to use this app.</h3>
							<button onClick={ this.authenticate }><i className="devicon-github-plain colored"></i>Log In With GitHub</button>
						</div>
				}
				{ this.state.askForTokenPermission && this.state.user && !this.state.fetchingUser &&
					<div className="auth_prompt">
						<div className="auth_group">
							<h2 className="authorize_text">The use of this app requires read-only permissions to access your GitHub repositories. Authorize the app to check when you have backed up your work?</h2>
							<button
								onClick = { this.authenticate }><i className="material-icons">verified_user</i>
								Authorize
							</button>
						</div>
					</div>
				}
			</div>
		)
	} //render
}

export default Login;
