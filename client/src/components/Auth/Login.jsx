import React, { Component } from 'react';
import './Login.css';

//Firebase Auth (does it belong in this file? NO. It needs to be moved to the parent component.)
import * as firebase from 'firebase';

const config = {
	apiKey: "AIzaSyDCb2eE8cg75fMQxcQNuI8c-X4zS6DAbA4",
  authDomain: "commitment-issues.firebaseapp.com",
  databaseURL: "https://commitment-issues.firebaseio.com",
  projectId: "commitment-issues",
  storageBucket: "commitment-issues.appspot.com",
  messagingSenderId: "479646167912"
};
firebase.initializeApp(config);
var provider = new firebase.auth.GithubAuthProvider();
provider.addScope('repo');

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: '',
			fetchingUser: false
		}
		this.logout = this.logout.bind(this);
	}

	authenticate() {
		firebase.auth().signInWithRedirect(provider).then(function(result) {
			//This gives you access to a GitHub Access Token, which is used to access the Github API
			var token = result.credential.accessToken;
			//The signed-in user info
			var user = result.user;
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;
			//The email of the user's account used
			var email = error.email;
			//The firebase.auth.AuthCredential type that was used (Github)
			var credential = error.credential;
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
		this.setState({
			user: ''
		})
	}

	componentWillMount() {
		this.setState({
			fetchingUser: true
		})
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged( user => {
			if (user) {
				console.log(user);
				this.setState({
					user: user.displayName,
					fetchingUser: false
				})
			}
			else {
				console.log('No user is signed in.');
			}
		});
	}

	render() {
		return (
			<div>
			{ this.state.fetchingUser 
				?
				<div>Retrieving Your Repositories</div>
				:
				<div>
					{ this.state.user 
						? 
						<div>
							<h2>Hello, { this.state.user }!</h2> 
							<button onClick= { this.logout }><i className="material-icons logout">undo</i>Log out</button>
						</div>
						: 
						<div>
							<h3>You must be logged into your GitHub profile to use this app.</h3>
							<button onClick={ this.authenticate }><i className="devicon-github-plain colored"></i>Log In With GitHub</button>
						</div>
					}
				</div>
			}
			</div>
		)
	}
}

export default Login;