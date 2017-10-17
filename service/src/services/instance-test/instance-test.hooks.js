const app = require('config');
const config = app.get('rethinkdb')
const rdash = require('rethinkdbdash')(config)
const _ = require('lodash')
module.exports = {
  before: {
    all: [],
    find: [],
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
    create: [
      hook => aftercreateInstance(hook)
    ],
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
async function aftercreateInstance(hook) {
  //let id = hook.data.id;
  if (hook.data.id != undefined) {
    //console.log('hook.data.id', hook.data)
    let inputData = hook.data.data
    console.log('hook.data.data', hook.data.data)
    let instanceTable = app.get('instance_table')
    let instanceList = await rdash.table(instanceTable).get(hook.data.instanceid).run()
    let processlog = _.find(instanceList.process_log, { 'job': hook.data.processid })
      // let newObject = {}
    console.log('processlog', processlog)
    console.log('processList', _.find(instanceList.processList, { 'id': hook.data.processid }).properties[0].approvalClass)
    let approvalClass = _.find(instanceList.processList, { 'id': hook.data.processid }).properties[0].approvalClass
    if (approvalClass != undefined) {
      const Queue = require('rethinkdb-job-queue')
        //--------------- Connection Options -----------------
      const cxnOptions = config
        //--------------- Queue Options -----------------
      const qOptions = {
        name: app.get('approvar_table')
      }
      const q = new Queue(cxnOptions, qOptions)
      var jobOptions = {}
      jobOptions.data = {}
        // jobOptions.data.fId = id
      jobOptions.data = {
        "fId": hook.data.instanceid,
        "input": inputData,
        "isExternalInput": true,
        "jobId": hook.data.processid,
      }
      jobOptions.timeout = app.get('qJobTimeout')
      jobOptions.retryMax = app.get('qJobRetryMax')
      console.log('jobOptions', jobOptions)
        //--------------- Create new job -----------------
      const job = q.createJob(jobOptions)
        //--------------- Add job -----------------
      q.addJob(job).then((savedJobs) => {}).catch(err => console.error(err))
    } else {
      if (_.isArray(inputData)) {
        for (let arr in processlog.input) {}
      } else {
        var newObject = _.reduce(inputData, function(result, value, key) {
          if (!_.has(processlog.input[0], key)) {
            result[key] = value;
          }
          return result
        }, {});
        console.log('newObject', newObject)
        const Queue = require('rethinkdb-job-queue')
          //--------------- Connection Options -----------------
        const cxnOptions = config
          //--------------- Queue Options -----------------
        const qOptions = {
          name: app.get('scheduler_table')
        }
        const q = new Queue(cxnOptions, qOptions)
        var jobOptions = {}
        jobOptions.data = {}
          // jobOptions.data.fId = id
        jobOptions.data = {
          "fId": hook.data.instanceid,
          "input": newObject,
          "isExternalInput": true,
          "jobId": hook.data.processid,
        }
        jobOptions.timeout = app.get('qJobTimeout')
        jobOptions.retryMax = app.get('qJobRetryMax')
        console.log('jobOptions', jobOptions)
          //--------------- Create new job -----------------
        const job = q.createJob(jobOptions)
          //--------------- Add job -----------------
        q.addJob(job).then((savedJobs) => {}).catch(err => console.error(err))
      }
    }
  }
  // if (hook.data.id != undefined) {
  //   const Queue = require('rethinkdb-job-queue')
  //     //--------------- Connection Options -----------------
  //   const cxnOptions = config
  //     //--------------- Queue Options -----------------
  //   const qOptions = {
  //     name: app.get('scheduler_table')
  //   }
  //   const q = new Queue(cxnOptions, qOptions)
  //   var jobOptions = {}
  //   jobOptions.data = {}
  //     // jobOptions.data.fId = id
  //   jobOptions.data = {
  //     "fId": hook.data.instanceid,
  //     "input": hook.data.data,
  //     "isExternalInput": true,
  //     "jobId": hook.data.processid,
  //   }
  //   jobOptions.timeout = app.get('qJobTimeout')
  //   jobOptions.retryMax = app.get('qJobRetryMax')
  //   console.log('jobOptions', jobOptions)
  //     //--------------- Create new job -----------------
  //   const job = q.createJob(jobOptions)
  //     //--------------- Add job -----------------
  //   q.addJob(job).then((savedJobs) => {}).catch(err => console.error(err))
  // }
}