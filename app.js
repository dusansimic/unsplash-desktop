const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const wallpaper = require('wallpaper');
const download = require('download');

const {app, BrowserWindow, Menu, Tray, ipcMain} = electron;

function createMainWindow() {
	const screen = electron.screen.getPrimaryDisplay().workAreaSize;

	let window = new BrowserWindow({
		width: 350,
		height: 300,
		x: screen.width - 300,
		y: 0,
		autoHideMenuBar: true,
		frame: false,
		show: false,
		resizable: false,
		alwaysOnTop: true,
		skipTaskbar: true,
		icon: path.join(__dirname, 'Icon.png')
	});

	window.loadURL(url.format({
		pathname: path.join(__dirname, 'static/index.html'),
		protocol: 'file:',
		slashes: true
	}));

	window.on('close', () => {
		window = null;
	});

	return window;
}

app.on('ready', () => {
	const mainWindow = createMainWindow();

	const tray = new Tray(path.join(__dirname, 'TrayIcon.png'));
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Toggle',
			type: 'normal',
			click() {
				mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show(); // eslint-disable-line no-unused-expressions
			}
		}, {
			label: 'Shuffle',
			type: 'normal',
			click() {
				// Get wallpaper now
			}
		}, {
			type: 'separator'
		}, {
			label: 'Quit',
			type: 'normal',
			role: 'quit'
		}
	]);
	tray.setToolTip('Unsplash Desktop');
	tray.setContextMenu(contextMenu);

	ipcMain.on('set-image', (event, url) => {
		download(url).then(data => {
			fs.writeFile('/tmp/wallpaper.jpg', data, err => {
				if (err) {
					console.error(err);
					return;
				}

				wallpaper.set('/tmp/wallpaper.jpg').then(() => {
					console.log('Wallpaper set!');
				}).catch(() => {
					console.error(err);
				});
			});
		});
	});

	mainWindow.on('blur', () => {
		mainWindow.hide();
	});
});
