// Initializes the `/pdm_uploader_data` service on path `/pdm-uploader-data`
const createService = require('./pdm-uploader-data.class.js');
const hooks = require('./pdm-uploader-data.hooks');
const filters = require('./pdm-uploader-data.filters');
const socketio = require('feathers-socketio');
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


module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  app.configure(socketio(function(io) {
    // console.log("io....",io)
  io.on('connection', function(socket) {
    // console.log("connected successfully to importdb.....")
    // socket.emit('customer_uploaded_data',data);
    socket.on('pdmData',async function( data){
        // console.log('Found all imported data', data);
          // var url = 'mongodb://' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmUploader';
          var url = 'mongodb://' + config1.username + ':' + config1.password + '@' + config1.mongodb_host + ':' + config1.mongodb_port + '/pdmuploader';
          var cnn_with_mongo = await connectToMongo(url,data)
          console.log("cnn_with_mongo...............",cnn_with_mongo)
          socket.emit('response',{stdout:cnn_with_mongo.result})

  });
  });
  io.use(function (socket, next) {
   // Exposing a request property to services and hooks
   socket.feathers.referrer = socket.request.referrer;
   next();
 });
 }));

  const options = {
    name: 'pdm-uploader-data',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pdm-uploader-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pdm-uploader-data');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

var connectToMongo = async function(url,data){
  var db = await (MongoClient.connect(url))
    console.log("Connected correctly to server.");
    let host = 'localhost'
    let port = '3001'
    let collection_name = data.activetab.split(" ")
    console.log("colection_name...",data.activetab.split(" "))
    collection_name = data.activetab.split(" ")
    let prod_name = collection_name[0]
    collection_name.splice(0,1)
    console.log("collection_name",  collection_name)
    for(let i=0 ;i<collection_name.length;i++){
      console.log("+++++++++",collection_name[i])
      name = collection_name[i].toLowerCase()
    }
    collection_name = "uploader" + prod_name + name

    console.log("collection_name",  collection_name)

    var response = await (db.listCollections().toArray())
       console.log("collections",response)
       let index = _.findIndex(response, function(o) { return o.name == collection_name; });
       console.log("index",index)
        if(index == -1){
          var response = await db.createCollection(collection_name)
          var result = await (db.collection(collection_name).insert(data.newCSV))
          console.log("result....",result)
          return result
      }
      else{
        var result = await (db.collection(collection_name).insert(data.newCSV))
        console.log("result....",result)
        return result
      }
}
