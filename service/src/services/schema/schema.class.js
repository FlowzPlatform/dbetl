/* eslint-disable no-unused-vars */
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var _ = require('lodash');
var cpath = '../DBConnection/'

class Service {
  constructor(options) {
    this.options = options || {};
  }
  find(params) {
    console.log('find schema..')
    return Promise.resolve([])
  }
  get(id, params) {
    console.log('get schema..', id)
    var data = getFunction(id, params)
    // var api = require(cpath + params.data.selectedDb + 'api')
    // // console.log(conn)
    // var data = api.getTables(params.data)
    // // console.log(data)
    return Promise.resolve(data)
  }
  create(data, params) {
    console.log('create schema..')
    return Promise.resolve(data)
  }
  update(id, data, params) {
    console.log('update schema..')
    return Promise.resolve(id)
  }
  patch(id, data, params) {
    console.log('patch schema..')
    return Promise.resolve(id)
  }
  remove(id, params) {
    console.log('remove schema..')
    return Promise.resolve(id)
  }
}

var getFunction = async(function(id, params) {
  var api = require(cpath + params.data.selectedDb + 'api')
  if (params.query.schemaname != undefined) {
    var data = await (api.getSchemaRecord(params.data, params.query.schemaname).then(res => {
      // console.log('response', res)
      return res
    }).catch(err => {
      console.log('error', err)
      return {iserror: true, msg: err}
    }))
    // console.log('getFunction', data)
    return data
  } else {
    var data = await (api.getTables(params.data).then(res => {
      // console.log('response', res)
      return res
    }).catch(err => {
      console.log('error', err)
      return {iserror: true, msg: err}
    }))
    // console.log('getFunction', data)
    return data
  }
})



module.exports = function(options) {
  return new Service(options);
};
module.exports.Service = Service;