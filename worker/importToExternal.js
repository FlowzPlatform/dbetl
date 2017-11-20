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
// var aurl = 'http://' + job.configData.host + ':' + job.configData.port;

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
					}

					console.log('sData', sData)

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
							sObj.id = (sObj._id).toString()
							sObj._id = sObj.id
							if(sObj.hasOwnProperty('Schemaid')) {
								sObj.Schemaid = sId
								// console.log(sObj.Schemaid)
							}
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