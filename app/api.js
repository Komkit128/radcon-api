//require('dotenv').config();
const os = require('os');
const fs = require('fs');
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');
const apiApp = express();

var log, hospitals;

apiApp.use(express.json({limit: '50mb'}));
apiApp.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
//apiApp.use(bodyParser.json({ limit: "50MB", type:'application/json'}));
//apiApp.use(express.urlencoded({limit: '50mb'}));

const windowsappPath = '/home/windowsapp';
const db = require('./db/relation.js');
db.sequelize.sync({ force: false });

const apiproxy = require('./lib/apiproxy.js');
const orthancproxy = require('./lib/orthancproxy.js');
const windowsappStatic = express.static(windowsappPath);
const windowsappIndex = serveIndex(windowsappPath, {'icons': true});
const uploader = require('./lib/uploader.js')(apiApp);
const notificator = require('./lib/notification.js')(apiApp);

apiApp.use('/apiproxy', apiproxy);
apiApp.use('/orthancproxy', orthancproxy);
apiApp.use('/windowsapp', windowsappStatic, windowsappIndex);

apiApp.get('/', (req, res) => {
	const hostname = req.headers.host;
	const rootname = req.originalUrl.split('/')[1];
	log.info('hostname => ' + hostname);
	log.info('rootname => ' + rootname);
	let url = '/' + rootname + '/index.html';
	res.redirect(url);
});

apiApp.post('/', (req, res) => {
	log.info(req.connection._peername);
	res.status(200).send(req.body);
});

module.exports = ( webSocketServer, monitor, hosp ) => {
	log = monitor;
	hospitals = hosp;
	const uploader = require('./lib/uploader.js')(apiApp);
	const pdfconvertor = require('./lib/pdfconvertor.js')(apiApp, webSocketServer);
	const users = require('./db/rest/users.js')(db, log);
	const usertypes = require('./db/rest/usertypes.js')(db, log);
	apiApp.use('/users', users);
	apiApp.use('/usertypes', usertypes);
	return apiApp;
}
