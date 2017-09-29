import React from 'react';
import { Route } from 'react-router';

import Login from '../components/Auth/Login.jsx';
import RepositoryIndex from '../components/Repository_Index/RepositoryIndex.jsx';
import Tracker from '../components/Tracker/Tracker.jsx';

export default (
	<div>
		<Route path="/" component={ Login } />
		<Route path="/repositories" component={ RepositoryIndex } />
		<Route path="/tracker/:repo/:owner" component={ Tracker } />
	</div>
)
