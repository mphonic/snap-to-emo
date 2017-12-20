import React from 'react';
import {render} from 'react-dom';
import CamSnap from './components/cam-snap.jsx';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require('./css/index.css');


render(<CamSnap />, document.getElementById('app'));