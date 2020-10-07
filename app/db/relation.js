require('dotenv').config();
const Sequelize = require('sequelize');
const crypto = require('crypto')
const log = require('electron-log');
log.transports.console.level = 'info';
log.transports.file.level = 'info';

const dburl = 'postgres://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' + process.env.DB_SERVER_DOMAIN + ':' + process.env.DB_SERVER_PORT + '/' + process.env.DB_NAME;
log.info(dburl);
const sequelize = new Sequelize(dburl, {
  /* operatorsAliases: false, */
  //logging: log.info
  logging: true
});

sequelize.authenticate().then(() => {
	log.info('Connection has been established successfully.');
}).catch(err => {
	log.error('Unable to connect to the database:', err);
});

const Def = require('./model/model-def.js');

const hospitals = sequelize.define('hospitals',  Def.RadHospitalDef);

const usertypes = sequelize.define('usertypes', Def.RadUserTypeDef);

const userstatuses = sequelize.define('userstatuses', Def.RadUserStatusDef);

const users = sequelize.define('users', Def.RadUserDef);

users.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64')
}
users.encryptPassword = function(plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = users.generateSalt()
    user.password = users.encryptPassword(user.password(), user.salt())
  }
}
users.beforeCreate(setSaltAndPassword)
users.beforeUpdate(setSaltAndPassword)
users.prototype.correctPassword = function(enteredPassword) {
  return users.encryptPassword(enteredPassword, this.salt()) === this.password()
}

const userinfoes = sequelize.define('userinfoes', Def.RadUserInfoDef);
users.belongsTo(hospitals);
users.belongsTo(usertypes);
users.belongsTo(userstatuses);
users.belongsTo(userinfoes);

const orthancs = sequelize.define('orthancs', Def.RadOrthancDef);
orthancs.belongsTo(hospitals);

const urgenttypes = sequelize.define('urgenttypes', Def.RadUrgentTypeDef);
urgenttypes.belongsTo(hospitals);

const cliamerights = sequelize.define('cliamerights', Def.RadCliameRightsDef);
cliamerights.belongsTo(hospitals);

const casestatuses = sequelize.define('casestatuses', Def.RadCaseStatusDef);
casestatuses.belongsTo(hospitals);

const patients = sequelize.define('patients', Def.RadPatientDef);
patients.belongsTo(hospitals);

const refferaldoctors = sequelize.define('refferaldoctors', Def.RadRefferalDoctorDef);
refferaldoctors.belongsTo(hospitals);

const radiologistes = sequelize.define('radiologistes', Def.RadRadiologistDef);
radiologistes.belongsTo(hospitals);

const dicomtransferlogs = sequelize.define('dicomtransferlogs', Def.RadDicomTransferLogDef);
dicomtransferlogs.belongsTo(orthancs);

const cases = sequelize.define('cases', Def.RadCaseDef);
cases.belongsTo(hospitals);
cases.belongsTo(patients);
cases.belongsTo(urgenttypes);
cases.belongsTo(cliamerights);
cases.belongsTo(casestatuses);
cases.belongsTo(refferaldoctors);
cases.belongsTo(users);
cases.belongsTo(dicomtransferlogs);

const radiologistresponses = sequelize.define('radiologistresponses', Def.RadRadiologistResponseDef);
radiologistresponses.belongsTo(cases);

module.exports =  {
  sequelize,
  Def,
  hospitals,
  usertypes,
  userstatuses,
  users,
  userinfoes,
  orthancs,
  urgenttypes,
  cliamerights,
  casestatuses,
  patients,
  refferaldoctors,
  radiologistes,
  dicomtransferlogs,
  cases,
  radiologistresponses
}
