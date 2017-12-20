/* eslint-disable no-unused-vars */
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var axios = require('axios');
let config = require('config');
var _ = require('lodash');
var url = 'http://' + config.host + ':' + config.port;
var slimit = 0
var elimit = 50

class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    var conndata = findFunction()
    return Promise.resolve(conndata);
  }

  get (id, params) {
    if (params.query.schemaname != undefined) {
      var conndata = getThisFunction(id, params.query.schemaname, params.query.sl, params.query.el)
      return Promise.resolve(conndata);
    } else {
      var conndata = getFunction(id, params.query.schemaname, params.query.sl, params.query.el)
      return Promise.resolve(conndata);
    }
  }

  create (data, params) {
    var conndata = createFunction(data)
    return Promise.resolve(conndata);
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
    var conndata = removeFunction(id, params)
    return Promise.resolve(conndata);
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

// var getThisSettingByName = async ( function(conn_name) {
//   var allSettings = await (getallSettings())
//   for (let db in allSettings) {
//     for (let [i, inst] in allSettings[db].dbinstance.entries()) {
//       if (inst.connection_name == conn_name) {
//         return inst.id
//       }
//     }
//   }
// }) 

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
        var _res = await (conn.getConnsAllData(inst.id, elimit))
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

var getThisFunction = async(function (id, schemaname, sl, el) {
  if (sl == undefined) {
    sl = slimit
    el = elimit
  } else {
    sl = parseInt(sl)
    el = parseInt(el)
  }
  var settings = await (getallSettings())
  var res = []
  for (let db in settings) {
    for (let [i, inst] of settings[db].dbinstance.entries()) {
      if (inst.id == id) {
        if (inst.isenable) {
          var conn = require('../DBConnection/' + db + 'api')
          var _res = await (conn.getTableRecord(id, schemaname, sl, el))
          return _res
        } else {
          return 'Please Enable the Connection for Result'
        }
      } 
      if (inst.connection_name == id) {
        if (inst.isenable) {
          var conn = require('../DBConnection/' + db + 'api')
          var _res = await (conn.getTableRecord(inst.id, schemaname, sl, el))
          return _res
        } else {
          return 'Please Enable the Connection for Result'
        }
      }
    }
  }
  return res
})

var getFunction = async (function (id, schemaname, sl, el) {
  var settings = await (getallSettings())
  var res = []
  for (let db in settings) {
    for (let [i, inst] of settings[db].dbinstance.entries()) {
      if (inst.id == id) {
        if (inst.isenable) {
          var conn = require('../DBConnection/' + db + 'api')
          var _res = await (conn.getConnsAllData(id, elimit))
          if (schemaname != undefined) {
            for (let [inx, tObj] of _res.entries()) {
              if (tObj.t_name == schemaname) {
                return tObj.t_data   
              }
            }
          } else {
            return _res
          }
        } else {
          return 'Please Enable the Connection for Result'
        }
      } 
      if (inst.connection_name == id) {
        if (inst.isenable) {
          var conn = require('../DBConnection/' + db + 'api')
          var _res = await (conn.getConnsAllData(inst.id, elimit))
          if (schemaname != undefined) {
            for (let [inx, tObj] of _res.entries()) {
              if (tObj.t_name == schemaname) {
                return tObj.t_data   
              }
            }
          } else {
            return _res
          }
        } else {
          return 'Please Enable the Connection for Result'
        }
      }
    }
  }
  return res
})

var createFunction = async (function (data) {
  var inst_id = data.inst_id
  var setting_res = await (getThisSetting(inst_id))
  var db = setting_res.selectedDb
  var conn = require('../DBConnection/' + db + 'api')
  var _res = await (conn.postTableRecord(data))
  return _res 
})

var updateFunction = async (function (id, data) {
  var inst_id = data.inst_id
  var setting_res = await (getThisSetting(inst_id))
  var db = setting_res.selectedDb
  var conn = require('../DBConnection/' + db + 'api')
  var _res = await (conn.putTableRecord(id, data))
  return _res
})

var removeFunction = async (function (id, params) {
  var inst_id = params.query.instid
  var tname = params.query.tname
  var setting_res = await (getThisSetting(inst_id))
  var db = setting_res.selectedDb
  var conn = require('../DBConnection/' + db + 'api')
  var _res = await (conn.deleteThisTableRecord(id, inst_id, tname))
  return _res
})

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
