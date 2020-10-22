const fs = require('fs');
const util = require("util");
const path = require('path');
const url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

var db, Case, log, auth;

const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };

const doGenNewCaseOptions = function(hospitalId) {
  return new Promise(function(resolve, reject) {
    const promiseList = new Promise(async function(resolve, reject) {
      const userInclude = [{model: db.userinfoes, attributes: excludeColumn}];
      const clmes = await db.cliamerights.findAll({ attributes: ['id', 'CR_Name'] });
      const urges = await db.urgenttypes.findAll({ attributes: ['id', 'UGType_Name'], where: {hospitalId: hospitalId} });
      const radusers = await db.users.findAll({ attributes: excludeColumn, include: userInclude, where: {hospitalId: hospitalId, usertypeId: 4}});
      const refusers = await db.users.findAll({ attributes: excludeColumn, include: userInclude, where: {hospitalId: hospitalId, usertypeId: 5}});
      let cliames = [];
      clmes.forEach((clm, i) => {
        let tempRad = {Value: clm.id, DisplayText: clm.CR_Name};
        cliames.push(tempRad);
      });
      let urgents = [];
      urges.forEach((urg, i) => {
        let tempUrg = {Value: urg.id, DisplayText: urg.UGType_Name};
        urgents.push(tempUrg);
      });
      let rades = [];
      radusers.forEach((user, i) => {
        let tempRdl = {Value: user.id, DisplayText: user.userinfo.User_NameTH + ' ' + user.userinfo.User_LastNameTH};
        rades.push(tempRdl);
      });
      let refes = [];
      refusers.forEach((user, i) => {
        let tempRef = {Value: user.id, DisplayText: user.userinfo.User_NameTH + ' ' + user.userinfo.User_LastNameTH};
        refes.push(tempRef);
      });

      setTimeout(()=> {
        resolve({Result: "OK", Options: {cliames, urgents, rades, refes}});
      },400);
    });
    Promise.all([promiseList]).then((ob)=> {
      resolve(ob[0]);
    }).catch((err)=>{
      reject(err);
    });
  });
}

//List API
app.post('/list', (req, res) => {
  let token = req.headers.authorization;
  if (token) {
    auth.doDecodeToken(token).then(async (ur) => {
      if (ur.length > 0){
        try {
          const hospitalId = req.query.hospitalId;
          const limit = req.query.jtPageSize;
          const startAt = req.query.jtStartIndex;
          const count = await Case.count();
          const cases = await Case.findAll({offset: startAt, limit: limit, attributes: excludeColumn, where: {hospitalId: hospitalId}});
          //res.json({status: {code: 200}, types: types});
          //log.info('Result=> ' + JSON.stringify(types));
          res.json({Result: "OK", Records: casees, TotalRecordCount: count});
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
        log.info('Start Action => ' + subAction);
        log.info('Body of Request=> ' + JSON.stringify(req.body));
        log.info('Query of Request=> ' + JSON.stringify(req.query));
        const id = req.body.id;
        try {
          switch (subAction) {
            case 'add':
              let newCase = req.body;
              let adCase = await Case.create(newCase);
              res.json({Result: "OK", Record: adCase});
            break;
            case 'update':
              let updateCase = req.body;
              await Case.update(updateCase, { where: { id: id } });
              res.json({Result: "OK"});
            break;
            case 'delete':
              await Case.destroy({ where: { id: id } });
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

app.get('/options/(:hospitalId)', (req, res) => {
  const hospitalId = req.params.hospitalId;
  doGenNewCaseOptions(hospitalId).then((result) => {
    res.json(result);
  })
});

app.post('/options/(:hospitalId)', async (req, res) => {
  const hospitalId = req.params.hospitalId;
  doGenNewCaseOptions(hospitalId).then((result) => {
    res.json(result);
  })
});

module.exports = ( dbconn, monitor ) => {
  db = dbconn;
  log = monitor;
  auth = require('./auth.js')(db, log);
  Case = db.cases;
  return app;
}
