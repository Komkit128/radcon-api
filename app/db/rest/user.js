const fs = require('fs');
const util = require("util");
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

var db, User, log, auth;

const excludeColumn = { exclude: [ 'updatedAt', 'createdAt'] };

//List API
app.post('/list', (req, res) => {
  let token = req.headers.authorization;
  if (token) {
    auth.doDecodeToken(token).then(async (ur) => {
      if (ur.length > 0){
        try {
          const hospitalId = req.query.hospitalId;
          const userInclude = [{model: db.usertypes, attributes: excludeColumn}, {model: db.userstatuses, attributes: excludeColumn}, {model: db.userinfoes, attributes: excludeColumn}];
          const limit = req.query.jtPageSize;
          const startAt = req.query.jtStartIndex;
          const count = await User.count();
          const users = await User.findAll({offset: startAt, limit: limit, attributes: excludeColumn, include: userInclude, where: {hospitalId: hospitalId}});
          //res.json({status: {code: 200}, types: types});
          //log.info('Result=> ' + JSON.stringify(users));
          const result = [];
          users.forEach((user, i) => {
            let tempUser = {hospitalId: hospitalId, userId: user.id, username: user.username};
            if (user.usertype) {
              tempUser.Type = user.usertype.UserType_Name;
            }
            if (user.userstatus) {
              tempUser.Status = user.userstatus.UserStatus_Name;
            }
            if (user.userinfo) {
              tempUser.id = user.userinfo.id,
              tempUser.NameEN = user.userinfo.User_NameEN;
              tempUser.LastNameEN = user.userinfo.User_LastNameEN;
              tempUser.NameTH = user.userinfo.User_NameTH;
              tempUser.LastNameTH = user.userinfo.User_LastNameTH;
              tempUser.Email = user.userinfo.User_Email;
              tempUser.Phone = user.userinfo.User_Phone;
              tempUser.LineID = user.userinfo.User_LineID;
            }
            result.push(tempUser);
          });
          //log.info('Final Result=> ' + JSON.stringify(result));
          res.json({Result: "OK", Records: result, TotalRecordCount: count});
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
        //const userInclude = [{model: db.usertypes, attributes: excludeColumn}, {model: db.userstatuses, attributes: excludeColumn}, {model: db.userinfoes, attributes: excludeColumn}];
      	const subAction = req.params.subAction;
        log.info('Start Action => ' + subAction);
        log.info('Body of Request=> ' + JSON.stringify(req.body));
        log.info('Query of Request=> ' + JSON.stringify(req.query));
        const id = req.body.id;
        try {
          switch (subAction) {
            case 'add':
              let newUser = req.body;
              let adUser = await User.create(newUser);
              res.json({Result: "OK", Record: adUser});
            break;
            case 'update':
              let updateUser = req.body;
              await User.update(updateUser, { where: { id: id } });
              res.json({Result: "OK"});
            break;
            case 'delete':
              await User.destroy({ where: { id: id } });
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

module.exports = ( dbconn, monitor ) => {
  db = dbconn;
  log = monitor;
  auth = require('./auth.js')(db, log);
  User = db.users;
  return app;
}
