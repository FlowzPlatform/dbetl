const Queue = require('rethinkdb-job-queue')
// const func = require('./function')
const app = require('config')
var axios = require('axios');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
const cxnOptions = app.get('rethinkdb')
var pino = require('pino');
var mongodb = require('mongodb');
var elasticsearch = require('elasticsearch');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
// var aurl = 'http://' + job.configData.host + ':' + job.configData.port;
var mysql = require('mysql');
var _ = require('lodash')

console.log('importToExternal Worker Started.....')
const qOptions = app.get('qOptions1')
const q = new Queue(cxnOptions, qOptions)

var createConn = async (function(data) {
	if(data.selectedDb == 'mongo') {
		var conn = await (MongoClient.connect('mongodb://' + data.host + ':' + data.port + '/' + data.dbname))
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
	      }).ping({
	        requestTimeout: 1000
	      }))
      // console.log(client)
    	return {conn: client, db: data.selectedDb}
	} else if(data.selectedDb == 'mysql') {
		var connection = mysql.createConnection({
			host     : data.host,
			port     : data.port,
			user     : data.username,
			password : data.password,
			database : data.dbname
		});
	
		return {conn: connection, db: data.selectedDb}

	}
})
var getSchemaidByName = async (function(url, name) {
	var _resi = await (axios.get(url +'/schema'))
	var schema = _resi.data
	for(let [i, obj] of schema.entries()) {
		if(obj.title == name) {
			return obj._id
		}
	}
})

var getQuery = async(function (dbName,type,queryFor) {
  let result = new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../service/src/services/DBConnection/query.json'),function (err, data) {
	  if (err) return console.log(err);
	  
          resolve(JSON.parse(data));
          });
    });

    var _data = Promise.resolve(result).then(function(dbdata){
        var instance;

        _.forEach(dbdata[dbName][type], function(instances, db){
            if(Object.keys(instances)[0] == queryFor)
            {
              var obj = _.find(instances)
              if(obj != undefined){
                instance = obj
              }
            }   
        })
        return instance
    });
    return _data
});

var UUID = async(function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
});

q.process(async(job, next) => {
	try {
			// console.log('job.data\n ', job.data)
			var aurl = 'http://' + job.configData.host + ':' + job.configData.port;
			var res = []
			var instance = []
			// var _resi = await (axios.get('http://'+job.configData.host+':'+job.configData.port+'/'))
			var sConn = await (createConn(job.data.source));
			var tConn = await (createConn(job.data.target));
			// console.log(sConn, '>>>>>>>>>>>', tConn)
			// console.log('11111111111111111111111111111111111111')
			// var _res = await (sConn.conn.table('address_line').run())
			// var _res = await (tConn.conn.collection('asd').find().toArray())
			// console.log('22222222222222222222222222222222222222')
			// console.log('_res', _res)
			for (let [i, obj] of job.data.mapdata.entries() ) {
				// console.log(obj, i)
				var sData = []
				var tData = [] 
					if(job.data.source.selectedDb == 'mongo') {
						sData = await (sConn.conn.collection(obj.source).find().toArray())
					} else if(job.data.source.selectedDb == 'rethink') {
						// console.log('11111111111111111111111111', obj.source)
						sData = await (sConn.conn.table(obj.source).run())
						// console.log('2222222222222222222222222', sData)
					} else if(job.data.source.selectedDb == 'elastic') {
						var _res = await (sConn.conn.search({
					        index: job.data.source.dbname,
					        type: obj.source,
					        body: {
					            query: {
					                match_all: { }
					            },
					        }
					    }))
						_res.hits.hits.forEach(function(hit){
					        var item =  hit._source;
					        item._id = hit._id;
					        sData.push(item);
					    })
					} else if(job.data.source.selectedDb == 'mysql') {
						var getDatabaseTables = await(getQuery('mysql','select','commonSelect'));
						getDatabaseTables = getDatabaseTables.replace('{{ table_name }}',obj.source);
						getDatabaseTables = getDatabaseTables.replace('{{ fields }}','*');

						var tableList = function () {
						  var result = []
						  
						  return new Promise((resolve, reject) => {
							sConn.conn.query(getDatabaseTables, function (error, result, fields) {
							  error? reject(error) : resolve(result)
							})
						  }).then(content => {
							return content;
						  }).catch(err=> {
							return err;
						  })     
						};
						var resTableList = await (tableList())
						
						for (let [i, sObj] of resTableList.entries()) {
							instanceVal = {};         
							
							_.forEach(sObj, function (rs1,key) {
								  instanceVal[key] = rs1;                        
							})
							
							sData.push(instanceVal);							
						}
							
					}

					if(job.data.target.selectedDb == 'mongo') {
						var _res = []
						var sId = await (getSchemaidByName(aurl, obj.target))
						for (let [i, sObj] of sData.entries()) {
							sObj._id = sObj.id
							delete sObj.id
							if(sObj.hasOwnProperty('Schemaid')) {
								sObj.Schemaid = sId
							}
							var s = await (tConn.conn.collection(obj.target).insert(sObj))
							_res.push(s)
						}
						// await (sConn.conn.collection(obj.source).find().toArray())
					} else if(job.data.target.selectedDb == 'rethink') {
						var _res = []
						var sId = await (getSchemaidByName(aurl, obj.target))
						
						for (let [i, sObj] of sData.entries()) {
							
							if(sObj.hasOwnProperty('_id')) {
								sObj.id = (sObj._id).toString()
								sObj._id = sObj.id
							}
							else{
								let uuid = await (UUID())
								sObj._id = uuid
								sObj.id = uuid
							}
							
							if(sObj.hasOwnProperty('Schemaid')) {
								sObj.Schemaid = sId
								// console.log(sObj.Schemaid)
							}
						console.log('sObj',sObj)
						
							var s = await (tConn.conn.table(obj.target).insert(sObj).run())
							_res.push(s)
						}
						// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', _res)

					} else if(job.data.target.selectedDb == 'elastic') {
						var _res = []
						var sId = await (getSchemaidByName(aurl, obj.target))
						for (let [i, sObj] of sData.entries()) {
							sObj._id = (sObj._id).toString()
							delete sObj.id
							if(sObj.hasOwnProperty('Schemaid')) {
								sObj.Schemaid = sId
							}
							var s = await (tConn.conn.index({
						        index: job.data.target.dbname,
						        type: obj.target,
						        body: sObj
						    }))
							_res.push(s)
						}
					} else if(job.data.target.selectedDb == 'mysql') {
					}
			}

			console.log('-----------------------||  Done  ||------------------------')
		return next(null, 'success')
	} catch (err) {
		pino().error(new Error('... error in process'))
		return next(new Error('error'))
	}
})
q.on('terminated', (queueId, jobId) => {
	// q.getJob(jobId).then((job) => {
	//   func.processError(job[0].data, job[0].id)
	//   pino().info({ 'jobId': job[0].data.id }, 'Start Type Job terminated');
	//   pino(fs.createWriteStream('./mylog')).info({ 'fId': job[0].data.fId, 'jobId': job[0].data.id }, 'Start Type Job terminated')
	// }).catch(err => {
	//   pino().error(new Error(err));
	//   pino(fs.createWriteStream('./mylog')).error({ "error": err }, 'Error in Start Type Job terminated')
	// })
})
q.on('completed', (queueId, jobId, isRepeating) => {
	// q.getJob(jobId).then((job) => {
	//   func.processSuccess(job[0].data, job[0].id)
	//   pino().info({ 'jobId': job[0].data.id }, 'Start Type Job completed:')
	//   pino(fs.createWriteStream('./mylog')).info({ 'fId': job[0].data.fId, 'jobId': job[0].data.id }, 'Start Type Job completed:')
	// }).catch(err => {
	//   pino().error(new Error(err));
	//   pino(fs.createWriteStream('./mylog')).error({ "error": err }, 'Error in Start Type Job compleated')
	// })
})