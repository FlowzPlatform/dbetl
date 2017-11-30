/* eslint-disable no-unused-vars */
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var axios = require('axios');
let config = require('config');
var _ = require('lodash');
var url = 'http://' + config.host + ':' + config.port;

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    var conndata = findFunction()
    return Promise.resolve(conndata);
  }

  get (id, params) {
    var conndata = getFunction(id)
    return Promise.resolve(conndata);
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    // console.log(id, data)
    var conndata = updateFunction(id, data)
    return Promise.resolve(conndata);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}


var getallSettings = async (function () {
  var res = await (axios.get(url + '/settings'))
  return res.data
})

var getThisSetting = async( function(id) {
  var res = await (axios.get(url + '/settings/' + id))
  return res.data
}) 

var findFunction = async (function () {
  var __res = []
  var settings = await (getallSettings())
  // console.log(settings)
  for (let db in settings) {
    var mObj = {}
    mObj['db'] = db
    var a = []
    for (let [i, inst] of settings[db].dbinstance.entries()) {
      if (inst.isenable) {
        var obj = {}
        obj['inst_id'] = inst.id  
        var conn = require('../DBConnection/' + db + 'api')
        var _res = await (conn.getConnsAllData(inst.id))
        obj['inst_data'] = _res   
        // _res.id = inst.id
        // _res.selectedDb = db
        a.push(obj)
      }
    }
    mObj['db_data'] = a
    __res.push(mObj)
  }
  return __res
})

var getFunction = async (function (id) {
  var settings = await (getallSettings())
  var res = []
  for (let db in settings) {
    for (let [i, inst] of settings[db].dbinstance.entries()) {
      if (inst.id == id) {
        if (inst.isenable) {
          var conn = require('../DBConnection/' + db + 'api')
          var _res = await (conn.getConnsAllData(id))
          return _res
        } else {
          return 'Please Enable the Connection for Result'
        }
      }
    }
  }
  return res
})

var updateFunction= async (function (id, data) {
  var inst_id = data.inst_id
  var setting_res = await (getThisSetting(inst_id))
  var db = setting_res.selectedDb
  var conn = require('../DBConnection/' + db + 'api')
  var _res = await (conn.putTableRecord(id, data))
  return _res
})


module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
