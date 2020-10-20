require('dotenv').config();
const crypto = require('crypto');
const jwt = require("jwt-simple");

var db, User, Hospital, Usertype, Userstatus, Userinfo, log;

const doExistUser = function(username){
  return new Promise(async function(resolve, reject) {
    const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };
    const userInclude = [{ model: Hospital, attributes: excludeColumn}, {model: Usertype, attributes: excludeColumn}, {model: Userstatus, attributes: excludeColumn}, {model: Userinfo, attributes: excludeColumn}];
    try {
      const users = await User.findAll({ include: userInclude, attributes: excludeColumn, where: {	username: username}});
      resolve(users);
    } catch(error) {
      reject(error)
    }
  });
}

const doVerifyUser = function (username, password) {
  return new Promise(function(resolve, reject) {
    doExistUser(username).then((users) => {
      if (users.length > 0) {
        const isCorect = users[0].correctPassword(password);
        resolve({ result: isCorect, data: users[0] });
      } else {
        resolve({ result: false, reson: 'Invalid username'});
      }
    });
  });
}

const doEncodeToken = function(username) {
  const payload = {
		sub: username,
		iat: new Date().getTime(), //มาจากคำว่า issued at time (สร้างเมื่อ)
	};
	const payloadEncode = jwt.encode(payload, process.env.SECRET_KAY);
	log.info('payloadEncode => ' + payloadEncode);
  return payloadEncode;
};

const doDecodeToken = function(token){
  log.info('You send token => ' + token);
  const payloadDecode = jwt.decode(token, process.env.SECRET_KAY);
  log.info('payloadDecode stringify => ' + JSON.stringify(payloadDecode));
  let yourUsername = payloadDecode.sub;
  return new Promise(async function(resolve, reject) {
    try {
      const users = await User.findAll({ where: {	username: yourUsername}});
      resolve(users);
    } catch(error) {
      log.info('Can not found username = ' + yourUsername);
      reject(error);
    }
  });
}

const doGetHospitalFromRootUri = function (rootname){
  return new Promise(async function(resolve, reject) {
    try {
      const hosp = await Hospitals.findAll({ where: {	Hos_RootPathUri: rootname}});
      resolve(hosp);
    } catch(error) {
      reject(error)
    }
  });
}

const doGetUsertypeById = function (typeId){
  return new Promise(async function(resolve, reject) {
    try {
      const types = await Usertype.findAll({ where: {	id: typeId}});
      resolve(types);
    } catch(error) {
      reject(error)
    }
  });
}

const doGetUserstatusActive = function(){
  return new Promise(async function(resolve, reject) {
    try {
      const statuses = await Userstatus.findAll({ where: {	UserStatus_Name: 'Active'}});
      resolve(statuses);
    } catch(error) {
      reject(error)
    }
  });
}

const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = users.generateSalt()
    user.password = users.encryptPassword(user.password(), user.salt())
  }
}

module.exports = ( dbconn, monitor ) => {
  db = dbconn;
  log = monitor;
  //User = db.sequelize.define('users', db.Def.RadUserDef);
  //Hospital = db.sequelize.define('hospitals', db.Def.RadHospitalDef);
  //Usertype = db.sequelize.define('usertypes', db.Def.RadUserTypeDef);
  //Userstatus = db.sequelize.define('userstatuses', db.Def.RadUserStatusDef);
  User = db.users;
  Hospital = db.hospitals;
  Usertype = db.usertypes;
  Userstatus = db.userstatuses;
  Userinfo = db.userinfoes
  User.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64')
  }
  User.encryptPassword = function(plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex')
  }
  User.beforeCreate(setSaltAndPassword)
  User.beforeUpdate(setSaltAndPassword)
  User.prototype.correctPassword = function(enteredPassword) {
    return User.encryptPassword(enteredPassword, this.salt()) === this.password()
  }

  return {
    setSaltAndPassword,
    doExistUser,
    doVerifyUser,
    doEncodeToken,
    doDecodeToken,
    doGetHospitalFromRootUri,
    doGetUsertypeById,
    doGetUserstatusActive
  }
}
