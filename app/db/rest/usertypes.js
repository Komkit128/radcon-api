const fs = require('fs');
const util = require("util");
const path = require('path');
const url = require('url');
const jwt = require("jwt-simple");
const express = require('express');
const app = express();

var db, Usertype, log;

const excludeColumn = { exclude: ['updatedAt', 'createdAt'] };

app.get('/', async (req, res) => {
  try {
    const types = await Usertype.findAll({attributes: excludeColumn});
    res.json({status: {code: 200}, types: types});
  } catch(error) {
    res.json({status: {code: 500}, error: error});
  }
});


module.exports = ( dbconn, monitor ) => {
  db = dbconn;
  log = monitor;
  //Usertype = db.sequelize.define('usertypes', db.Def.RadUserDef);
  Usertype = db.usertypes;
  return app;
}
