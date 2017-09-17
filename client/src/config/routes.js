import React from 'react';
import { Route } from 'react-router';

import App from '../components/App/App.jsx';

import Login from '../components/Auth/Login.jsx';
import RepositoryIndex from '../components/Repository_Index/RepositoryIndex.jsx';
import Tracker from '../components/Tracker/Tracker.jsx';


export default (
	<Route path="/" component={ App } >
		<Route path="/login" component={ Login } />
		<Route path="/repositories" component={ RepositoryIndex } />
		<Route path="/tracker/:repo" component={ Tracker } />
	</Route>
)