const fs = require('fs');
const util = require("util");
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

var db, Usertype, log, auth;

const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };

//List API
app.post('/list', (req, res) => {
  let token = req.headers.authorization;
  if (token) {
    auth.doDecodeToken(token).then(async (ur) => {
      if (ur.length > 0){
        try {
          const limit = req.query.jtPageSize;
          const startAt = req.query.jtStartIndex;
          const count = await Usertype.count();
          const types = await Usertype.findAll({offset: startAt, limit: limit, attributes: excludeColumn});
          //res.json({status: {code: 200}, types: types});
          //log.info('Result=> ' + JSON.stringify(types));
          res.json({Result: "OK", Records: types, TotalRecordCount: count});
        } catch(error) {
          log.error(error);
          res.json({status: {code: 500}, error: error});
        }
      } else {
        log.info('Can not found user from token.');
        res.json({status: {code: 203}, error: 'Your token lost.'});
      }
    });
  } else {
    log.info('Authorization Wrong.');
    res.json({status: {code: 400}, error: 'Your authorization wrong'});
  }
});

//insert, update, delete API
app.post('/(:subAction)', (req, res) => {
  let token = req.headers.authorization;
  if (token) {
    auth.doDecodeToken(token).then(async (ur) => {
      if (ur.length > 0){
        const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };
      	const subAction = req.params.subAction;
        const id = req.body.id;
        try {
          switch (subAction) {
            case 'add':
              let newUsertype = req.body;
              let adUsertype = await Usertype.create(newUsertype);
              res.json({Result: "OK", Record: adUsertype});
            break;
            case 'update':
              let updateUsertype = req.body;
              await Usertype.update(updateUsertype, { where: { id: id } });
              res.json({Result: "OK"});
            break;
            case 'delete':
              await Usertype.destroy({ where: { id: id } });
              res.json({Result: "OK"});
            break;
          }
        } catch(error) {
      		log.error(error);
          res.json({ status: {code: 500}, error: error });
      	}
      } else {
        log.info('Can not found user from token.');
        res.json({status: {code: 203}, error: 'Your token lost.'});
      }
    });
  } else {
    log.info('Authorization Wrong.');
    res.json({status: {code: 400}, error: 'Your authorization wrong'});
  }
});

app.get('/options', async (req, res) => {
  const types = await Usertype.findAll({ attributes: ['id', 'UserType_Name'] });
  const result = [];
  types.forEach((type, i) => {
    result.push({Value: type.id, DisplayText: type.UserType_Name});
  });
  res.json({Result: "OK", Options: result});
});

app.post('/options', async (req, res) => {
  const types = await Usertype.findAll({ attributes: ['id', 'UserType_Name'] });
  const result = [];
  types.forEach((type, i) => {
    result.push({Value: type.id, DisplayText: type.UserType_Name});
  });
  res.json({Result: "OK", Options: result});
});

module.exports = ( dbconn, monitor ) => {
  db = dbconn;
  log = monitor;
  auth = require('./auth.js')(db, log);
  Usertype = db.usertypes;
  return app;
}
