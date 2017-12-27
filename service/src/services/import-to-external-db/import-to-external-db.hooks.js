let async = require('asyncawait/async');
let await = require('asyncawait/await');
const app = require('config');
const config = require('../config')
  // const app = require('config');
  // const config = app.get('rethinkdb')
  // const rdash = require('rethinkdbdash')(config)
const _ = require('lodash')
module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [],
    create: [
      hook => beforeCreate(hook)
    ],
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

function beforeCreate(hook) {
  const Queue = require('rethinkdb-job-queue')
  const cxnOptions = config.rethinkdb
  const qOptions = {
    name: app.get('importToExternal')
  }
  // console.log('qOptions', qOptions)
  const q = new Queue(cxnOptions, qOptions)
  var jobOptions = {}
  jobOptions.data = {}
    // jobOptions.data.fId = id
  jobOptions.data = hook.data
    // jobOptions.app = app
  jobOptions.userId = hook.data.userId
  jobOptions.configData = { host: app.get('host'), port: app.get('port') }
  // console.log('hook.data', hook.data)
  jobOptions.timeout = app.get('qJobTimeout')
  jobOptions.retryMax = app.get('qJobRetryMax')
  const job = q.createJob(jobOptions)
  q.addJob(job).then((savedJobs) => {}).catch(err => console.error(err))
  hook.result = { "data": hook.data, code: 200 }
}


let beforeFind = (hook) => {
  // console.log('hook', hook)
  if (hook.params.user) {
    hook.params.query.userId = hook.params.user._id;
  }
};

