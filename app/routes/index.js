/*
 * Copyright (C) 2017 Jason Henderson
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

// Another example of logging out within the child process
var log = require('electron-log');
log.transports.console.level = 'info';
log.transports.file.level = 'info';

var express = require('express');
var app = express();
var hospitals;

// view engine setup
var path = require('path');
var viewsPath = path.join(__dirname, '../', 'views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');


function doSearchHosIndex(rooturi){
  return new Promise(function(resolve, reject) {
    const hos = hospitals.filter((item)=>{
      return (item.Hos_RootPathUri === rooturi);
    })
    resolve(hos);
  });
}

/* GET home page. */
app.get('/', function(req, res) {
    const rootname = req.originalUrl.split('/')[1];
    log.info('serving home page... ' + rootname);
    doSearchHosIndex(rootname).then((hos)=> {
      console.log(JSON.stringify(hos));
      res.render('index', { title: hos[0].Hos_Name });
  });
});

module.exports = (hosp) => {
  hospitals = hosp;
  return app;
}
