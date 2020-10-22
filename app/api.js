//require('dotenv').config();
const os = require('os');
const fs = require('fs');
const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');
const apiApp = express();

var log;

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

module.exports = ( webSocketServer, monitor ) => {
	log = monitor;
	const uploader = require('./lib/uploader.js')(apiApp);
	const pdfconvertor = require('./lib/pdfconvertor.js')(apiApp, webSocketServer);
	const users = require('./db/rest/users.js')(db, log);
	const user = require('./db/rest/user.js')(db, log);
	const usertypes = require('./db/rest/usertypes.js')(db, log);
	const userstatuses = require('./db/rest/userstatuses.js')(db, log);
	const hospital = require('./db/rest/hospital.js')(db, log);
	const urgenttypes = require('./db/rest/urgenttypes.js')(db, log);
	const generalstatus = require('./db/rest/generalstatus.js')(db, log);
	const cliamerights = require('./db/rest/cliamerights.js')(db, log);
	const orthanc = require('./db/rest/orthanc.js')(db, log);
	const dicomtransferlog = require('./db/rest/dicomtransferlog.js')(db, log);
	const patient = require('./db/rest/patient.js')(db, log);
	const casestatus = require('./db/rest/casestatus.js')(db, log);
	const cases = require('./db/rest/cases.js')(db, log);

	apiApp.use('/users', users);
	apiApp.use('/user', user);
	apiApp.use('/usertypes', usertypes);
	apiApp.use('/userstatuses', userstatuses);
	apiApp.use('/hospital', hospital);
	apiApp.use('/cliamerights', cliamerights);
	apiApp.use('/urgenttypes', urgenttypes);
	apiApp.use('/generalstatus', generalstatus);
	apiApp.use('/cliamerights', cliamerights);
	apiApp.use('/orthanc', orthanc);
	apiApp.use('/dicomtransferlog', dicomtransferlog);
	apiApp.use('/patient', patient);
	apiApp.use('/casestatus', casestatus);
	apiApp.use('/cases', cases);

	return { api: apiApp, db: db };
}
