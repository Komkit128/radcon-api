//http://zetcode.com/javascript/sequelize/
//https://www.enterprisedb.com/postgres-tutorials/how-quickly-build-api-using-nodejs-postgresql
//https://medium.com/@benjaminpwagner/using-sequelize-hooks-and-crypto-to-encrypt-user-passwords-5cf1a27513d9
//https://sequelize.org/v5/manual/data-types.html
const log = require('electron-log');
log.transports.console.level = 'info';
log.transports.file.level = 'info';

const Def = require('./model/model-def.js');
const seed = require('./model/seeddb.json');
const db = require('./relation.js')(log);

const RadHospitalSetup = seed.RadHospitalSetup;
db.sequelize.sync({ force: true }).then(() => {
  db.hospitals.bulkCreate(seed.RadHospitalSetup, { validate: true }).then((hosp) => {
    console.log('hospitals created => ' + JSON.stringify(hosp));
    return new Promise((resolve, reject) => {resolve(hosp)});
  }).then ((hosp) => {
    db.usertypes.bulkCreate(seed.RadUserTypeSetup, { validate: true }).then((type) => {
      console.log('ordertypes created => ' + JSON.stringify(type));
      return new Promise((resolve2, reject2) => {resolve2(type)});
    }).then ((type) => {
      db.userstatuses.bulkCreate(seed.RadUserStatusSetup, { validate: true }).then((status) => {
        console.log('userstatuses created => ' + JSON.stringify(status));
        return new Promise((resolve3, reject3) => {resolve3(status)});
      }).then ((status) => {
        db.userinfoes.bulkCreate(seed.RadUserInfoSetup, { validate: true }).then((info) => {
          console.log('userinfoes created => ' + JSON.stringify(info));
          return new Promise((resolve4, reject4) => {resolve4(info)});
        }).then ((info) => {
          var resp = [];
          var promiseList = new Promise(function(resolve, reject){
            seed.RadUserSetup.forEach(async (user) => {
              console.log(user);
              let adUser = await db.users.create(user);
              console.log('setup admin user => ' + JSON.stringify(adUser) + ' success');
              resp.push(adUser);
      			});
    	  		setTimeout(async ()=> {
              const user = await db.users.findAll({	where: { id: 1}});
              console.log('admin user => ' + JSON.stringify(user) + ' found.');
              await user[0].setUserinfo(info[0]);
              await user[0].setHospital(hosp[0]);
              await user[0].setUsertype(type[0]);
              await user[0].setUserstatus(status[0]);
              resolve(resp);
            }, 3200);
      		});
          Promise.all([promiseList]).then((ob)=> {
            db.users.findByPk(1).then((user) => {
              console.log(user.correctPassword('admin@@'));
            })
            setTimeout(() => {
              db.sequelize.close();
            }, 3200);
          });

        }).catch((err) => {
          console.log('failed to create userinfoes');
          console.log(err);
        });
      }).catch((err) => {
        console.log('failed to create userstatuses');
        console.log(err);
      });

    }).catch((err) => {
      console.log('failed to create usertypes');
      console.log(err);
    });
  }).catch((err) => {
    console.log('failed to create hospitals');
    console.log(err);
  });
});
