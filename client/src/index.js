import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';

import Brand from './components/Brand/Brand.jsx';
import routes from './config/routes.js';

ReactDOM.render(
  <div>
    <Brand />
	  <Router routes = { routes } history = { browserHistory } />
  </div>, document.getElementById('root')
);