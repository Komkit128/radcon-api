const fs = require('fs');
const util = require("util");
const path = require('path');
const url = require('url');
const jwt = require("jwt-simple");
const express = require('express');
const app = express();

var db, User, log;

function doExistUser(username){
  return new Promise(async function(resolve, reject) {
    try {
      const users = await db.users.findAll({ where: {	username: username}});
      resolve(users);
    } catch(error) {
      reject(error)
    }
  });
}

function doVerifyUser(username, password) {
  return new Promise(function(resolve, reject) {
    doExistUser(username).then((users) => {
      if (users.length > 0) {
        const isCorect = users[0].correctPassword(password);
        resolve({ result: isCorect });
      } else {
        resolve({ result: false, reson: 'Invalid username'});
      }
    });
  });
}

function doEncodeToken(username) {
  const payload = {
		sub: username,
		iat: new Date().getTime(), //มาจากคำว่า issued at time (สร้างเมื่อ)
	};
	const payloadEncode = jwt.encode(payload, process.env.SECRET_KAY);
	log.info('payloadEncode => ' + payloadEncode);
  return payloadEncode;
};

function doDecodeToken(token){
  const payloadDecode = jwt.decode(token, process.env.SECRET_KAY);
  log.info('payloadDecode => ' + payloadDecode);
  return payloadDecode;
}

function doGetHospitalFromRootUri(rootname){
  return new Promise(async function(resolve, reject) {
    try {
      const hosp = await db.hospitals.findAll({ where: {	Hos_RootPathUri: rootname}});
      resolve(hosp);
    } catch(error) {
      reject(error)
    }
  });
}

function doGetUsertypeById(typeId){
  return new Promise(async function(resolve, reject) {
    try {
      const types = await db.usertypes.findAll({ where: {	id: typeId}});
      resolve(types);
    } catch(error) {
      reject(error)
    }
  });
}

function doGetUserstatusActive(){
  return new Promise(async function(resolve, reject) {
    try {
      const statuses = await db.userstatuses.findAll({ where: {	UserStatus_Name: 'Active'}});
      resolve(statuses);
    } catch(error) {
      reject(error)
    }
  });
}

///////////////////////////////////////////////////////

app.get('/', async function(req, res) {
  const hostname = req.headers.host;
	const rootname = req.originalUrl.split('/')[1];
	log.info('hostname => ' + hostname);
	log.info('rootname => ' + rootname);
  try {
		const users = await db.users.findAll();
		res.json({ users })
	} catch(error) {
		log.error(error)
	}
});
app.get('/(:userId)', async (req, res) => {
  const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };
	const userId = req.params.userId;
  const userInclude = [{ model: db.hospitals, attributes: excludeColumn}, {model: db.usertypes, attributes: excludeColumn}, {model: db.userstatuses, attributes: excludeColumn}, {model: db.userinfoes, attributes: excludeColumn}];
	try {
		const user = await db.users.findAll({ include: userInclude, attributes: excludeColumn, where: {	id: userId}});
		res.json({ user })
	} catch(error) {
		log.error(error)
	}
});
app.get('/searchusername/(:username)', async (req, res) => {
  const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };
	const username = req.params.username;
  //const userInclude = [db.hospitals, db.usertypes, db.userstatuses, db.userinfoes];
  const userInclude = [{ model: db.hospitals, attributes: excludeColumn}, {model: db.usertypes, attributes: excludeColumn}, {model: db.userstatuses, attributes: excludeColumn}, {model: db.userinfoes, attributes: excludeColumn}];
	try {
		const user = await db.users.findAll({	include: userInclude, attributes: excludeColumn, where: {	username: username}});
    if (user) {
		  res.json({status: {code: 200}, result: user});
    } else {
      res.json({status: {code: 200}, result: false, reson: 'Invalid username'});
    }
	} catch(error) {
		log.error(error)
	}
});
app.post('/verifyusername/(:username)', async (req, res) => {
  const username = req.params.username;
  const password = req.body.password;
  doVerifyUser(username, password).then((result) => {
    res.json({status: {code: 200}, result: result});
  }).catch ((err) => {
    res.json({status: {code: 500}, error: err});
  });
});
app.get('/gentoken/(:username)', (req, res) => {
  const username = req.params.username;
  const yourToken = doEncodeToken(username);
  res.json({status: {code: 200}, token: yourToken});
});
app.post('/', function(req, res) {
  let newUsername = req.body.username;
  doExistUser(newUsername).then(async (users) => {
    if (users.length === 0) {
      let rootname = req.originalUrl.split('/')[1];
      try {
        doGetHospitalFromRootUri(rootname).then((hospitals) => {
          let usertypeId = req.body.usertypeId;
          doGetUsertypeById(usertypeId).then((usertypes) => {
            doGetUserstatusActive().then(async (userstatuses) => {
              let newUserinfo = {
                User_NameEN: req.body.User_NameEN,
              	User_LastNameEN: req.body.User_LastNameEN,
              	User_NameTH: req.body.User_NameTH,
              	User_LastNameTH: req.body.User_LastNameTH,
              	User_Email: req.body.User_Email,
              	User_Phone: req.body.User_Phone,
              	User_LineID: req.body.User_LineID,
              	User_PathRadiant: req.body.User_PathRadiant
              };
              let adUserinfo = await db.userinfoes.create(newUserinfo);
              log.info('adUserinfo => ' + JSON.stringify(adUserinfo));
              let newUser = {username: req.body.username, password: req.body.password};
              let adUser = await db.users.create(newUser);
              log.info('adUser => ' + JSON.stringify(adUser));
              adUser.setHospital(hospitals[0]);
              adUser.setUsertype(usertypes[0]);
              adUser.setUserstatus(userstatuses[0]);
              adUser.setUserinfo(adUserinfo);
              const yourToken = doEncodeToken(newUsername);
              res.json({status: {code: 200}, token: yourToken });
            });
          });
        });
      } catch(error) {
        log.error(error);
        res.json({status: {code: 500}, error: error});
      }
    } else {
      res.json({status: {code: 200}, error: {why: 'your username is duplicate on DB'}});
    }
  });
});
app.post('/info', function(req, res) {
  let token = req.headers.authorization;
  let yourPayload = doDecodeToken(token);
  let yourUsername = yourPayload.sub;
  log.info('yourUsername => ' + JSON.stringify(yourUsername));
  doExistUser(yourUsername).then(async (users) => {
    log.info('users => ' + JSON.stringify(users));
    if (users.length > 0) {
      const newInfo = req.body;
      let adInfo = await db.userinfoes.create(newInfo);
      res.json({ userinfo: adInfo }) // Returns the new user that is created in the database
    } else {
      res.json({status: {code: 200}, error: {why: 'your username incorrect'}});
    }
  });
});
app.put('/(:userId)', async function(req, res) {
  const userId = req.params.userId;
  try {
    await User.update(req.body, { where: { id: userId } });
    res.json({status: {code: 200}});
  } catch(error) {
		log.error(error)
	}
});
app.put('/settype/(:userId)/(:typeId)', async function(req, res) {
  const userId = req.params.userId;
  const typeId = req.params.typeId;
  try {
    const user = await db.users.findAll({	where: {	id: userId}});
    const type = await db.usertypes.findAll({	where: {	id: typeId}});
    await user[0].setUsertype(type[0]);
    res.json({status: {code: 200}});
  } catch(error) {
		log.error(error)
	}
});
app.put('/setstatus/(:userId)/(:statusId)', async function(req, res) {
  const userId = req.params.userId;
  const statusId = req.params.statusId;
  try {
    const user = await db.users.findAll({	where: {	id: userId}});
    const status = await db.userstatuses.findAll({	where: {	id: statusId}});
    await user[0].setUserstatus(status[0]);
    res.json({status: {code: 200}});
  } catch(error) {
		log.error(error)
	}
});
app.put('/sethospital/(:userId)/(:hospitalId)', async function(req, res) {
  const userId = req.params.userId;
  const hospitalId = req.params.hospitalId;
  try {
    const user = await db.users.findAll({	where: {	id: userId}});
    const hospital = await db.hospitals.findAll({	where: {	id: hospitalId}});
    await user[0].setHospital(hospital[0]);
    res.json({status: {code: 200}});
  } catch(error) {
		log.error(error)
	}
});
app.put('/setinfo/(:userId)/(:infoId)', async function(req, res) {
  const userId = req.params.userId;
  const infoId = req.params.infoId;
  try {
    const user = await db.users.findAll({	where: {	id: userId}});
    const info = await db.userinfoes.findAll({	where: {	id: infoId}});
    await user[0].setUserinfo(info[0]);
    res.json({status: {code: 200}});
  } catch(error) {
		log.error(error)
	}
});
app.delete('/(:userId)', async function(req, res) {
  const userId = req.params.userId;
  try {
    let n = await User.destroy({ where: { id: userId } });
    log.info(`number of deleted rows: ${n}`);
		res.json({users: n})
	} catch(error) {
		log.error(error)
	}
});

module.exports = ( dbconn, monitor ) => {
  db = dbconn;
  log = monitor;
  User = db.sequelize.define('users', db.Def.RadUserDef);
  return app;
}
