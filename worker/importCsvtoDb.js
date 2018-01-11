const Queue = require('rethinkdb-job-queue')
// const func = require('./function')
const app = require('./config')
// console.log('config::::', app, '>>>>>>>>>>>')
var axios = require('axios');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
const cxnOptions = app.rethinkdb
var pino = require('pino');
var mongodb = require('mongodb');
var elasticsearch = require('elasticsearch');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
var Datastore = require('nedb-promise');
var nedbpath = path.join(__dirname, '../service/nedb')
// var aurl = 'http://' + job.configData.host + ':' + job.configData.port;
// var endecrypt = require('../service/src/services/encryption/security')			
var mysql = require('mysql');
var _ = require('lodash')

console.log('importCsvToDb Worker Started.....')
const qOptions = app.qOptions
qOptions.name = app.importCsvtoDb
const q = new Queue(cxnOptions, qOptions)

var createConn = async (function(data, mapdata) {
	// console.log('id................', data.id)
	// if(data.hasOwnProperty('id')) {
		// data.password = endecrypt.decrypt(data.password)
		// console.log(data.password)
	// }
	if(data.selectedDb == 'mongo') {
		var mongoDB;
	    if (data.username != "" && data.password != "") {
	      mongoDB = 'mongodb://' + data.username + ':' + data.password + '@' + data.host + ':' + data.port + '/' + data.dbname;
	    } else {
	      mongoDB = 'mongodb://' + data.host + ':' + data.port + '/' + data.dbname;
	    }
		var conn = await (MongoClient.connect(mongoDB))
		return {conn: conn, db: data.selectedDb}
	} else if(data.selectedDb == 'rethink') {
		console.log('rethink........................')
		var r = require('rethinkdbdash')({
		  username: data.username,
          password: data.password,
	      port: data.port,
	      host: data.host,
	      db: data.dbname
	    })
	    return {conn: r, db: data.selectedDb}
	} else if(data.selectedDb == 'elastic') {
		 var client = await (new elasticsearch.Client({
	        host: data.host + ':' + data.port
	      }))
      // console.log(client)
    	return {conn: client, db: data.selectedDb}
	} else if (data.selectedDb == 'nedb') {
		var nPath = path.join(nedbpath, '/' + data.dbname)
		return {conn: nPath, db: data.selectedDb}
	} else if(data.selectedDb == 'mysql') {
		// console.log('-----------import ------------',data);
		// var pass = endecrypt.decrypt(data.password)
		var connection = mysql.createConnection({
			host     : data.host,
			port     : data.port,
			user     : data.username,
			password : data.password,
			database : data.dbname
		});
		connection.connect();
		
		return {conn: connection, db: data.selectedDb}

	}
})

q.process(async(job, next) => {
	try {
			// console.log('job.data\n ', JSON.stringify(job.data))
			console.log('---------------------||  Start  ||--------------------------')
			var aurl = 'http://' + job.configData.host + ':' + job.configData.port;
			var tConn = await (createConn(job.data.target));
			if(job.data.target.selectedDb == 'mongo') {
				var _res = []
				var arrOfErr = []
				// var sId = await (getSchemaidByName(aurl, obj.target))
				var d1 = new Date().toLocaleTimeString()
				console.log('.......Start......', d1)
				// for (let [i, sObj] of job.data.source.entries()) {
					var s = await (tConn.conn.collection('csvdata10k5').insertMany(job.data.source).then(res => {
						return res
					}).catch(err => {
						// console.log('.....>>>>>>>> ', err)
						arrOfErr.push({err: err})
						return err
					}))
					_res.push(s)
				// }
				var d2 = new Date().toLocaleTimeString()
				console.log('.......End......', d2)
				console.log('_error..............', arrOfErr)
				// await (sConn.conn.collection(obj.source).find().toArray())
			} else if(job.data.target.selectedDb == 'rethink') {
				var _res = []
				var arrOfErr = []
				// var sId = await (getSchemaidByName(aurl, obj.target))
				// console.log(sData)
				var d1 = new Date().toLocaleTimeString()
				console.log('.......Start......', d1)
				// for (let [i, sObj] of job.data.source.entries()) {
					var s = await (tConn.conn.table('csvData10').insert(job.data.source).run().then(res => {
						return res
					}).catch(err => {
						// console.log('.....>>>>>>>> ', err)
						arrOfErr.push({err: err})
						return err
					}))
					_res.push(s)
				// }
				var d2 = new Date().toLocaleTimeString()
				console.log('.......End......', d2)
				console.log('_error..............', arrOfErr)
				// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', _res)
				console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> arrOfErr', arrOfErr)
			} else if(job.data.target.selectedDb == 'elastic') {
				var _res = []
				// var sId = await (getSchemaidByName(aurl, obj.target))
				for (let [i, sObj] of sData.entries()) {
					sObj._id = (sObj._id).toString()
					// delete sObj.id
					// if(sObj.hasOwnProperty('Schemaid')) {
					// 	sObj.Schemaid = sId
					// }
					if (obj.colsData.length !== 0) {
						sObj = await (filterObj(sObj, obj.colsData))
					}
					var s = await (tConn.conn.index({
				        index: job.data.target.dbname,
				        type: obj.target,
				        body: sObj
				    }))
					_res.push(s)
				}
			} else if(job.data.target.selectedDb == 'mysql') {
				var _res = []
				
				// if(sObj.hasOwnProperty('_id')) {
				// 	sObj.id = (sObj._id).toString()
				// 	sObj._id = sObj.id
				// }
				
				// var sId = await (getSchemaidByName(aurl, obj.target))
				
				for (let [i, sObj] of sData.entries()) {
					if (obj.colsData.length !== 0) {
						sObj = await (filterObj(sObj, obj.colsData))
					}
					
					// console.log('sObj',sObj,obj.target,job.data.target.dbname)
					// return false;
					// sObj.Schemaid = sId
					var response = await (updateSchema(sObj, obj.target,job.data.target.dbname,tConn))
				}
			}

			console.log('-----------------------||  Done  ||------------------------')
		return next(null, 'success')
	} catch (err) {
		console.log('Error >>>>>>', err)
		pino().error(new Error('... error in process'))
		return next(new Error('error'))
	}
})
q.on('terminated', (queueId, jobId) => {
})
q.on('completed', (queueId, jobId, isRepeating) => {
})