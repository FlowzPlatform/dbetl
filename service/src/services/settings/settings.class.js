/* eslint-disable no-unused-vars */
var express = require('express');
var path = require('path');
var CryptoJS = require("crypto-js");
let async = require('asyncawait/async');
let await = require('asyncawait/await');
// var db = require('../DBConnection/db');
var fileName = '../DBConnection/db.json';
var fs = require('fs');
var jsonfile = require('jsonfile')
var _ = require('lodash')
var endecrypt = require('../encryption/security')

// check_Connection
var mongodb = require('mongodb');
var elasticsearch=require('elasticsearch');
var MongoClient = require('mongodb').MongoClient;

var check_Connection = async(function(db, data) {
  // console.log('data..', data, 'db', db)
  if(db == 'mongo') {
    // console.log("MongoDB..............");
    var _res;
    if(data.username != "" && data.password != "")
    {
      _res = await (MongoClient.connect('mongodb://'+data.username+':'+data.password+'@'+data.host+':'+data.port+'/'+data.dbname))
    } else {
      _res = await (MongoClient.connect('mongodb://'+data.host+':'+data.port+'/'+data.dbname))
    }
    return _res
  }
  else if(db == 'rethink') {
    // console.log("RethinkDB..............");
    var r = await (require('rethinkdbdash')({
      username: data.username,
      password: data.password,
      port: data.port,
      host: data.host,
      db: data.dbname
    }).connect({
      username: data.username,
      password: data.password,
      port: data.port,
      host: data.host,
      db: data.dbname
    }))
    return r
  }
    // console.log('response>>>>>>>>>>>>', _res)
      // , function(err, database) {
      // if(err){
      //   console.log('err', err)
      //   return 'false'
      // }
      // else {
      // console.log('Mongo connected....',database);
      //   return 'true'
      // }
    // });
  
  else if(db == 'rethink') {
    // console.log("RethinkDB..............");
    var r = await (require('rethinkdbdash')({
      username: data.username,
      password: data.password,
      port: data.port,
      host: data.host,
      db: data.dbname
    }).connect({
      username: data.username,
      password: data.password,
      port: data.port,
      host: data.host,
      db: data.dbname
    }))
    return r
    // ,function(err,response){
    //   if(err){
    //     console.log('XXXXXXXXXXXXXXXXXXXXXXXXX',err);
    //     return 'false'
    //   }
    //   else {
    //     console.log('EEEEEEEEEEEEEEEEEEEEEEEEEEE',response);
    //    return'true'
    //   }
    // })
  }
  else if(db == 'elastic') {
    // console.log("Elastic Search..............");
    var client = await (new elasticsearch.Client( {  
      host: data.host+':'+data.port,
      log: 'error'
    }).ping({
      requestTimeout: 1000
    }))
    console.log(client)
    return client
    // , function (error) {
    //   if (error) {
    //     return 'false'
    //   } else {
    //     return 'true'
    //   }
    // });
  }
  else {
    var _res = new error()
    return _res
  }
})

var getAllSettings = async(function() {
  let result = new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../DBConnection/db.json'),function (err, data) {
          if (err) return console.log(err);
              resolve(JSON.parse(data));
          });
    });
    var _data = Promise.resolve(result).then(function(dbdata){
        // console.log(dbdata)
        _.forEach(dbdata, function(instances, db){
            // console.log(instances)
            _.forEach(instances.dbinstance, function(item, i){
                // console.log(dbdata[db].dbinstance[i])
                delete dbdata[db].dbinstance[i].username
                delete dbdata[db].dbinstance[i].password
            })
        })
        return dbdata
    });
    return _data
})

var getDbInstances = async(function(dbname) {
  var _res = await (getAllSettings())
  var instances;  
    for (let db in _res) {
        if (db == dbname) {
            instances = _res[db].dbinstance
            // console.log(_res[db].dbinstance)
        }
    }
  return instances
})

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    if(params.query.dbname != undefined) {
      var _res = getDbInstances(params.query.dbname)
      return Promise.resolve(_res)
    } else {
      var _res = getAllSettings()
      return Promise.resolve(_res)
    }
    // let result = new Promise((resolve, reject) => {
    //     fs.readFile(path.join(__dirname, '../DBConnection/db.json'),function (err, data) {
    //       if (err) return console.log(err);
    //           resolve(JSON.parse(data));
    //       });
    // });
    // var _data = Promise.resolve(result).then(function(dbdata){
    //     // console.log(dbdata)
    //     _.forEach(dbdata, function(instances, db){
    //         // console.log(instances)
    //         _.forEach(instances.dbinstance, function(item, i){
    //             // console.log(dbdata[db].dbinstance[i])
    //             delete dbdata[db].dbinstance[i].username
    //             delete dbdata[db].dbinstance[i].password
    //         })
    //     })
    //     return dbdata
    // });
    // return _data
  }

  get (id, params) {
    let result = new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../DBConnection/db.json'),function (err, data) {
          if (err) return console.log(err);
              resolve(JSON.parse(data));
          });
    });
    var _data = Promise.resolve(result).then(function(dbdata){
        // console.log(dbdata)
        var instance;
        _.forEach(dbdata, function(instances, db){
            var obj = _.find(instances.dbinstance, {id: id})
            if(obj != undefined){
              instance = obj
            }   
        })
        return instance
    });
    return _data
  }

  create (data, params) {
    console.log('********* Inside Create Service *********\n');
    if(params.query.check != undefined) {
      var _res = check_Connection(params.query.check, data)
      return Promise.resolve(_res).then(function(res){
        // console.log('result.................', res)
        return {result: true}
      })
      .catch(function(err){
        // console.log('Error..............', err)
        return {result: false}
      })
    } else {
      //encryption
      data.password = endecrypt.encrypt(data.password);
      // console.log(data)
      let result = new Promise((resolve, reject) => {
          fs.readFile(path.join(__dirname, '../DBConnection/db.json'),function (err, data) {
            if (err) return console.log(err);
                resolve(JSON.parse(data));
            });
      });
      var _data = Promise.resolve(result).then(function(res){
        var selectDB = data.selectedDb;
        delete data.selectedDb;

        //check connection alredy exist or not
        var check = ''
        _.map(res[selectDB].dbinstance, function(instance) { 
          if(instance.host == data.host && instance.port == data.port && instance.dbname == data.dbname){
              check = 'Exist'
          }
        })
        if(check == 'Exist'){
          return 'Exist'
        }else{
          //check connection is isdefault true
            if(data.isdefault){
              _.forEach(res[selectDB].dbinstance, function(inst){
                inst.isdefault = false
              })    
            }
            // console.log(res[selectDB].dbinstance)
            res[selectDB].dbinstance.push(data)
            let result1 = new Promise((resolve, reject) => {
              jsonfile.writeFile(path.join(__dirname, '../DBConnection/db.json'), res, {spaces: 4}, function(err) {
                  if (err) return 'Error';
                  resolve(res);
              });
            });
            Promise.resolve(result1);
            return 'Success'
        }
      });
      return _data;
    }
  }

  update (id, data, params) {
    console.log('Inside Update Settings...', id, data, params.query)
    var updatedb = params.query.db
    let result = new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../DBConnection/db.json'),function (err, data) {
          if (err) return console.log(err);
              resolve(JSON.parse(data));
          });
    });
    var _data = Promise.resolve(result).then(function(res){
        var index_instance = _.findKey(res[updatedb].dbinstance, {id: id});
        // console.log('instance', index_instance)
        res[updatedb].dbinstance[index_instance].isenable = data.isenable
        let result1 = new Promise((resolve, reject) => {
            jsonfile.writeFile(path.join(__dirname, '../DBConnection/db.json'), res, {spaces: 4}, function(err) {
                if (err) return 'Error';
                resolve(res);
            });
          });
        return Promise.resolve(result1);
    });
    return _data;
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    console.log('Inside Delete Settings...')
    var updatedb = params.query.db
    let result = new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, '../DBConnection/db.json'),function (err, data) {
          if (err) return console.log(err);
              resolve(JSON.parse(data));
          });
    });
    var _data = Promise.resolve(result).then(function(res){
        var index_instance = _.findKey(res[updatedb].dbinstance, {id: id});
        // console.log('instance', index_instance)
        res[updatedb].dbinstance.splice(index_instance, 1)
        let result1 = new Promise((resolve, reject) => {
            jsonfile.writeFile(path.join(__dirname, '../DBConnection/db.json'), res, {spaces: 4}, function(err) {
                if (err) return 'Error';
                resolve(res);
            });
          });
        return Promise.resolve(result1);
    });
    return _data;
    // return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
