const Queue = require('rethinkdb-job-queue')
// const func = require('./function')
const app = require('config')
var axios = require('axios');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
const cxnOptions = app.get('rethinkdb')
var pino = require('pino')
// var fs = require('fs')
// console.log('app config: ', app)
// const qOptions = {
//   name: 'start_worker',
//   masterInterval: 60000,
//   changeFeed: true,
//   concurrency: 100,
//   removeFinishedJobs: false,
// }
console.log('Worker Started.....')
const qOptions = app.get('qOptions')
const q = new Queue(cxnOptions, qOptions)

var setInstanceforPost = async(function(data) {
	for(let [index, mObj] of data.entries()){
	   // if () {}
       if(mObj.hasOwnProperty('_id') || mObj.hasOwnProperty('id')) {
        delete data[index]._id
        delete data[index].id
       }
       for (let sKey in mObj) {
            if (Array.isArray(mObj[sKey])) {
                data[index][sKey] = await (setInstanceforPost(mObj[sKey]))
            }
       }
	}
    return data
})

q.process(async(job, next) => {
	try {
			// console.log('job.data\n ', job.data)
			var res = []
			var instance = []
			// var temp_Store = job.data.data 
			var mainData = job.data.data
			// if(job.data.option == 'schema'){
					for (let i = 0; i < mainData.length; i++) {
						// console.log('mainData[i]', mainData[i])
							var old_id = mainData[i]._id
							delete mainData[i]._id
							delete mainData[i].id
							// console.log('mainData', mainData[i], '\n job.data.data', old_id)
							var a = await (axios.post('http://'+job.configData.host+':'+job.configData.port+'/schema', mainData[i]))
							// console.log('>>>>>>>>>>>>>>>>>>>>>', a.data)
							res.push(a.data)
							if (job.data.option == 'schemaData') {
									console.log('Here......................')
									var _resi = await (axios.get('http://'+job.configData.host+':'+job.configData.port+'/instance'))
									// console.log('_resi', _resi.data)
									// console.log('\n ...........DataWithOldId' ,job.data.data)
									for (let j = 0; j < _resi.data.length; j++) {
											if (_resi.data[j].Schemaid == old_id) {
  												_resi.data[j].Schemaid = a.data[0]._id
  												delete _resi.data[j]._id
  												delete _resi.data[j].id
  												instance.push(_resi.data[j])
											}
									} 
								// console.log('instance list', _resi.data)
						}
			}
			// console.log('Schema....res', res)
			// console.log('....................\n ', JSON.stringify(instance))
			var new_instance = await (setInstanceforPost(instance))
			// console.log('\n??????????????????????\n', JSON.stringify(new_instance))
			var resInstance = []
			if (job.data.option == 'schemaData') {
					for(let k = 0; k < new_instance.length; k++ ) {
  						// delete instance[k]._id
  						// delete instance[k].id
  						var s = []
  						s.push(new_instance[k])
  						var _resi = await (axios.post('http://'+job.configData.host+':'+job.configData.port+'/instance', {data: s}))
  						console.log('_resi', _resi.data)
  						resInstance.push(_resi.data)
					}
			}
			// console.log('resInstance', resInstance)
            console.log('-----------------------||  Done  ||------------------------')
		// } else {
			// console.log('With data Found')
		// }
		// for (let i = 0; i < job.data.capacity; i++) {
		//   job.data.output[i] = {}
		//   for (key in job.data.input[i]) {
		//     job.data.output[i][key] = job.data.input[i][key]
		//   }
		// }
		//  await job.update()
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