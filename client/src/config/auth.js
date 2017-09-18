import * as firebase from 'firebase';

export const config = {
  apiKey: "AIzaSyDCb2eE8cg75fMQxcQNuI8c-X4zS6DAbA4",
  authDomain: "commitment-issues.firebaseapp.com",
  databaseURL: "https://commitment-issues.firebaseio.com",
  projectId: "commitment-issues",
  storageBucket: "commitment-issues.appspot.com",
  messagingSenderId: "479646167912"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GithubAuthProvider();
provider.addScope('repo');


