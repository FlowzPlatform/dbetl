var express = require('express');
var router = express.Router();
var auth = require('../auth')
let _ = require('lodash')
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var db = require('../DBConnection/db');
var path = require('path');
var fileName = '../DBConnection/db.json';
var fs = require('fs');
var databasename = 'schema_builder';


var envFile = '../env.json';
var file3 = require(envFile);
// console.log(file3);
// console.log('#####################################');

var serviceFile = '../../service/config/default.json';
// console.log('#####################################');
var file2 = require(serviceFile);
var mongoDB = 'mongodb://'+db.mongo.host+':'+db.mongo.port+'/'+((db.mongo.dbname == '') ? databasename : db.mongo.dbname);

var file = require(fileName);
var dbapi;

// if (db.mongo.isdefault == 'true') {
//     console.log('***************inside mongo api****************');
//     dbapi = require('../DBConnection/mongoapi')
// } else if (db.rethink.isdefault == 'true') {
//     console.log('***************inside rethink api**************');
//     dbapi = require('../DBConnection/rethinkapi')
// } 

//api for seetings
router.get('/settings', async(function(req, res){
    fs.readFile(path.join(__dirname, '../DBConnection/db.json'), function (err, data) {
        if (err) return console.log(err);
        // console.log('reading file' + data);
        res.send(JSON.parse(data));
    });
}));

router.post('/settings', async(function(req, res){
    var select_db = req.body;
    // console.log('select_db',select_db);
    // console.log('file before:',file);
    if(select_db.database == 'MongoDB'){
        // console.log('111111111111111111111111111111111111111111111111');
        file.mongo.host = select_db.host;
        file.mongo.port = select_db.port;
        file.mongo.username = select_db.username;
        file.mongo.password = select_db.password;
        file.mongo.dbname = select_db.dbname;
        file.mongo.isdefault = 'true';
        file.rethink.isdefault = 'false';
        file.elastic.isdefault = 'false';
        // file2.mongodb = mongoDB;
    }
    if(select_db.database == 'RethinkDB'){
        // console.log('222222222222222222222222222222222222222222222222');
        file.rethink.host = select_db.host;
        file.rethink.port = select_db.port;
        file.rethink.username = select_db.username;
        file.rethink.password = select_db.password;
        file.rethink.dbname = select_db.dbname;
        file.rethink.isdefault = 'true';
        file.mongo.isdefault = 'false';
        file.elastic.isdefault = 'false';
        // file2.rethinkdb.db = ((db.rethink.dbname == "")? databasename : db.rethink.dbname);
        // file2.rethinkdb.servers[0].host = db.rethink.host;
        // file2.rethinkdb.servers[0].port = db.rethink.port;
    }
    if(select_db.database == 'ElasticSearch'){
        // console.log('222222222222222222222222222222222222222222222222');
        file.elastic.host = select_db.host;
        file.elastic.port = select_db.port;
        file.elastic.username = select_db.username;
        file.elastic.password = select_db.password;
        file.elastic.dbname = select_db.dbname;
        file.elastic.isdefault = 'true';
        file.mongo.isdefault = 'false';
        file.rethink.isdefault = 'false';
        // file2.rethinkdb.db = ((db.elastic.dbname == "")? databasename : db.rethink.dbname);
        // file2.rethinkdb.servers[0].host = db.rethink.host;
        // file2.rethinkdb.servers[0].port = db.rethink.port;
    }
    fs.writeFile(path.join(__dirname, '../DBConnection/db.json'), JSON.stringify(file), function(err) {
        if (err) return console.log(err);
        // console.log(JSON.stringify(file));
        // console.log('writing to ' + fileName);
    });

    fs.writeFile(path.join(__dirname, '../../service/src/services/DBConnection/db.json'), JSON.stringify(file), function(err) {
        if (err) return console.log(err);
        // console.log(JSON.stringify(file));
        // console.log('writing to ' + fileName);
    });

    // fs.writeFile(path.join(__dirname, '../../service/config/default.json'), JSON.stringify(file2), function(err) {
    //     if (err) return console.log(err);
    //     // console.log(JSON.stringify(file2));
    //     // console.log('writing to ' + serviceFile);
    // });

    // console.log('file after:',file);
    // delete require.cache[require.resolve('../DBConnection/mongoapi')];
    // delete require.cache[require.resolve('../DBConnection/rethinkapi')];

    // console.log('mongo: ',db.mongo.isdefault, ' rethink: ',db.rethink.isdefault);
    // if (db.mongo.isdefault == 'true') {
    //     console.log('***************inside mongo api****************');
    //     file3.developement.SchemaApi = file3.developement.featherApiUrl + 'm-schema';
    //     file3.production.SchemaApi = file3.developement.featherApiUrl + 'm-schema'; 
    //     file3.developement.InstanceApi = file3.developement.featherApiUrl + 'm-instance';
    //     file3.production.InstanceApi = file3.developement.featherApiUrl + 'm-instance'; 
    //     fs.writeFile(path.join(__dirname, '../env.json'), JSON.stringify(file3), function(err) {
    //         if (err) return console.log(err);
    //         // console.log(JSON.stringify(file));
    //         // console.log('writing to ' + fileName);
    //     });
    //     // dbapi = require('../DBConnection/mongoapi')
    // } else if (db.rethink.isdefault == 'true') {
    //     console.log('***************inside rethink api****************');
    //     file3.developement.SchemaApi = file3.developement.featherApiUrl + 'r-schema';
    //     file3.production.SchemaApi = file3.developement.featherApiUrl + 'r-schema';
    //     file3.developement.InstanceApi = file3.developement.featherApiUrl + 'r-instance';
    //     file3.production.InstanceApi = file3.developement.featherApiUrl + 'r-instance'; 
    //     fs.writeFile(path.join(__dirname, '../env.json'), JSON.stringify(file3), function(err) {
    //         if (err) return console.log(err);
    //         // console.log(JSON.stringify(file));
    //         // console.log('writing to ' + fileName);
    //     });
    //     // dbapi = require('../DBConnection/rethinkapi')
    // } else {
    //     // dbapi = require('../DBConnection/elastic')
    // }
    res.send(file);
}));


// api for schema
// router.get('/schema', async(function(req, res){
//     var dbdata = await (dbapi.getSchema());
//     // console.log('api /schema::',dbdata);
//     res.send(dbdata);
// }));

// router.get('/schema/:id', async(function(req, res){
//     var id = req.params.id;
//     var dbdata = await (dbapi.getThisSchema(id));
//     res.send(dbdata);
// }));

// router.post('/schema', async(function(req, res){
//     var data = req.body.data;
//     // console.log('post from schema:', data);
//     var dbdata = await (dbapi.postSchema(data));
//     res.send(dbdata);
// }));

// router.put('/schema/:id', async(function(req, res){
//     var data = req.body.data;
//     var id = req.params.id;
//     // console.log('post from schema:', data, '----id:', id);
//     var dbdata = await (dbapi.putSchema(data , id));
//     res.send(dbdata);
// }));

// router.delete('/schema/:id', async(function(req, res){
//     var id = req.params.id;
//     // console.log('id:::::',id);
//     var dbdata = await (dbapi.deleteThisSchema(id));
//     // console.log('dbdata /schema/:id ****',dbdata);
//     res.send(dbdata);
// }));

// router.delete('/schema', async(function(req, res){
//     var dbdata = await (dbapi.deleteSchema());
//     res.send(dbdata);
// }));


// //api for flowinstance
// router.get('/flowsInstance', async(function(req, res){
//     var dbdata = await (dbapi.getflowsInstance());
//     res.send(dbdata);
// }));

// router.get('/flowsInstance/:id', async(function(req, res){
//     var id = req.params.id;
//     var dbdata = await (dbapi.getThisflowsInstance(id));
//     res.send(dbdata);
// }));

// router.post('/flowsInstance', async(function(req, res){
//     var data = req.body.data;
//     // console.log('post from flowsInstance:', data);
//     var dbdata = await (dbapi.postflowsInstance(data));
//     res.send(dbdata);
// }));

// router.put('/flowsInstance/:id', async(function(req, res){
//     var data = req.body.data;
//     var id = req.params.id;
//     // console.log('post from schema:', data, '----id:', id);
//     var dbdata = await (dbapi.putflowsInstance(data , id));
//     res.send(dbdata);
// }));

// router.delete('/flowsInstance/:id', async(function(req, res){
//     var id = req.params.id;
//     var dbdata = await (dbapi.deleteThisflowsInstance(id));
//     res.send(dbdata);
// }));

// router.delete('/flowsInstance', async(function(req, res){
//     var dbdata = await (dbapi.deleteflowsInstance());
//     res.send(dbdata);
// }));

module.exports = router;