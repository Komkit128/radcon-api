const log = require('electron-log');
log.transports.console.level = 'info';
log.transports.file.level = 'info';

const db = require('./relation.js');

const auth = require('./rest/auth.js')(db, log);

auth.resetAdmin();
