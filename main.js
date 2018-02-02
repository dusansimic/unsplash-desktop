const electron = require('electron');

const {ipcRenderer} = electron;

function onSetClick() { // eslint-disable-line no-unused-vars
	const url = document.getElementById('imageFrame').src; // eslint-disable-line no-undef
	ipcRenderer.send('set-image', url);
}
function onReloadClick() { // eslint-disable-line no-unused-vars
	document.getElementById('imageFrame').src = 'https://source.unsplash.com/random'; // eslint-disable-line no-undef
}
