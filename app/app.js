var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('winston');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

module.exports = (webSocketServer, monitor, hosp) => {
	var log = monitor;
  var hospitalitem = hosp;

  var index = require(path.join(__dirname, 'routes', 'index'))(hospitalitem);
  var users = require(path.join(__dirname, 'routes', 'users'));
  var hospitals = require(path.join(__dirname, 'routes', 'hospitals'))(hospitalitem);

  // uncomment after placing your favicon in /public
  app.use(favicon(path.join(__dirname + '/..', 'public', 'favicon.ico')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  //app.use(express.static(path.join(__dirname + '/..', 'public')));

  app.use('/', index);
  app.use('/users', users);
  app.use('/hospitals', hospitals);

	return app;
}
