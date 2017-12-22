import React from 'react';
import {render} from 'react-dom';

import CamSnap from './components/cam-snap.jsx';
import CamStream from './components/cam-stream.jsx';

import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
require('./css/index.css');

// almost there Microsoft...
// let params = new URLSearchParams(location.search.slice(1));

// if (!params.get('stream')) {
//     render(<CamSnap />, document.getElementById('app'));
// } else {
//     render(<CamStream />, document.getElementById('app'));
// }

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

if (!getParameterByName('stream')) {
    render(<CamSnap />, document.getElementById('app'));
} else {
    render(<CamStream />, document.getElementById('app'));
}