var init = {};

init.outputFolder = './output';
init.host = 'localhost';
init.database = 'minicricket';
init.username = 'postgres';
init.password = 'root';
init.port = 5432;
init.schema = 'public';
init.dbFileName = 'db.js';
init.routeFileName = 'index.js';


init.includes = `var express = require('express');
var app = express();
var promise = require('bluebird');
var init = require('../init/init');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://` + init.username + `:` + init.password + `@` + init.host + `:` + init.port +`/` + init.database + `';
var db = pgp(connectionString);`;

init.selectSingleStatement = `function selectSingle{0}(req, res) {
  var id = req.params.id;
  db.any('SELECT {1} FROM public.{0} where {2} = $1;',[id])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one {0}'
        });
    })
    .catch(function (err) {
      //return next(err);
    })
    .finally(function () {
      pgp.end();
    });
}`;

init.selectManyStatement = `function selectMany{0}(req, res) {
  db.any('SELECT {1} FROM public.{0};')
    .then(function (data) {
      //console.log(data);
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL {0}'
        });
    })
    .catch(function (err) {
      //return next(err);
    })
    .finally(function () {
      pgp.end();
    });
}`;

init.createStatement = `function create{0}(req, res, next) {
  db.none('insert into share({1}) values ({2})', req.query)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one {0}'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}`;

init.updateStatement = `function update{0}(req, res, next) {
  var id = req.params.id;
  db.none('update public.{0} set {1}} where {2}=$1', [parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated {0}'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}`;

init.deleteStatement = `function delete{0}(req, res, next) {
  var id = parseInt(req.params.id);
  db.result('delete from public.{0} where {1} = $1' ,[id])
    .then(function (result) {

      res.status(200)
        .json({
          status: 'success',
          message: 'Removed {1}'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}`;

init.exports = 'module.exports = { \r\n {0} \r\n }';

module.exports = init;