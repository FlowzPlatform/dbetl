/* eslint-disable no-unused-vars */
// var express = require('express');
// var path = require('path');
// var fs = require('fs');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var axios = require('axios');
var fs = require('fs');
var path = require('path');
var db = '../DBConnection/db.json';
var file = require(db);
// console.log(file);
// var dbapi = require('../DBConnection/DBConnection');
var dbapi;

if (file.mongo.isdefault == 'true') {
    // console.log('***************inside mongo api****************');
    dbapi = require('../DBConnection/mongoapi')
} else if (file.rethink.isdefault == 'true') {
    // console.log('***************inside rethink api**************');
    dbapi = require('../DBConnection/rethinkapi')
} else if (file.elastic.isdefault == 'true') {
  // console.log('***************inside elastic api**************');
    dbapi = require('../DBConnection/elasticapi')
}

var chokidar = require('chokidar');

let readfile = async (function(){
    fs.readFile(path.join(__dirname, '../DBConnection/db.json'), function (err, data) {
        if (err) return console.log(err);
        // console.log('reading file' + data)
        if(data == ''){
          console.log('BLANCK DATA');
          // let try1= async(function(){
          //   fs.readFile(path.join(__dirname, '../DBConnection/db.json'), function (err, data1) {
          //     console.log('INSIDE Data',data1);
          //   });
          // });
          // await(try1);
          return 'nodata';
        }
        file = data;
        let check = JSON.parse(data);
        if (check.mongo.isdefault == 'true') {
            // console.log('***************inside mongo api****************');
            dbapi = require('../DBConnection/mongoapi')
            // console.log('dbapi',dbapi);
            dbapi.choose();
        } else if (check.rethink.isdefault == 'true') {
            // console.log('***************inside rethink api**************');
            dbapi = require('../DBConnection/rethinkapi')
            dbapi.choose();
        } else if (check.elastic.isdefault == 'true') {
            // console.log('***************inside rethink api**************');
            dbapi = require('../DBConnection/elasticapi')
            dbapi.choose();
        } 
    });
})
 
// One-liner for current directory, ignores .dotfiles 
chokidar.watch('.', {ignored: /(^|[\/\\])\../}).on('change',async (function(path) {
  // console.log('File', path, 'has been changed');
  // delete require.cache[require.resolve('../DBConnection/db')];
  delete require.cache[require.resolve('../DBConnection/mongoapi')];
  delete require.cache[require.resolve('../DBConnection/rethinkapi')];
  delete require.cache[require.resolve('../DBConnection/elasticapi')];
  
  var checking = await(readfile);
  if(checking == 'nodata'){
    // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ from instance');
    await(readfile);
  }
}))


class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    console.log('find feathers...');

    if(params.query.name == undefined ){
      var dbdata = dbapi.getflowsInstance();
    }
    if(params.query.name !== undefined ){
      var dbdata = dbapi.getSchemaName(params.query.name);
    }
    return Promise.resolve(dbdata);
  }

  get (id, params) {
    console.log('Get feathers...');
    if(params.query.type !== undefined ){
      var dbdata = dbapi.getThisSchemaType(id, params.query.type)
    }
    else if(params.query.fieldname !== undefined ){
      var dbdata = dbapi.getThisSchemaFieldName(id, params.query.fieldname)
    }
    else {
      var dbdata = dbapi.getThisflowsInstance(id);
    }
    // console.log('dbdata',dbdata);
    // return Promise.resolve({
    //   id, text: `A new message with ID: ${id}!`
    // });
    return Promise.resolve(dbdata);
  }

  // get (name, params) {
  //   console.log('Get name feathers...');
  //   var dbdata = dbapi.getSchemaName(name);
  //   // console.log('dbdata',dbdata);
  //   // return Promise.resolve({
  //   //   id, text: `A new message with ID: ${id}!`
  //   // });
  //   return Promise.resolve(dbdata);
  // }

  // get (types, params) {
  //   console.log('Get types-----------');
  //   return Promise.resolve({
  //     types, text: `A new message with ID: ${types}!`
  //   });
  // }

  create (data, params) {
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current)));
    // }
    console.log('create feathers...');
    var dbdata = dbapi.postflowsInstance(data);
    return Promise.resolve(dbdata);
  }

  update (id, data, params) {
    var dbdata = dbapi.putflowsInstance(data, id);
    return Promise.resolve(dbdata);
  }

  patch (id, data, params) {
    // var dbdata = dbapi.putSchema(data, id);
    return Promise.resolve(data);
  }

  remove (id, params) {
    var dbdata = dbapi.deleteThisflowsInstance(id);
    return Promise.resolve(dbdata);
    // return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
