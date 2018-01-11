const config1 = require('../../../config/default.json');
let shell = require('shelljs');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
const _ = require('lodash');
if (process.env.mongodb_host)
    config1.mongodb_host = process.env.mongodb_host
if (process.env.mongodb_port)
    config1.mongodb_port = process.env.mongodb_port
if (process.env.username)
    config1.username = process.env.username
if (process.env.password)
    config1.password = process.env.password


module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

var beforeFind = async function(hook) {
    // console.log("hook.....",hook)
    var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
    var cnn_with_mongo = await connectToMongo(url,hook)
    console.log("cnn_with_mongo...............",cnn_with_mongo)
}

var connectToMongo = async function(url,hook){
  var db = await (MongoClient.connect(url))
    console.log("Connected correctly to server.");
    let tables = hook.params.query.tables
    console.log("tables...",tables)
    //
    var result = await (db.collection(tables).find({"import-tracker_id":hook.params.query.import_tracker_id}).toArray())
    console.log("result.......",result)
    hook.result = result
}
