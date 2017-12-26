var mongoose = require('mongoose');
let _ = require('lodash');
var db1 = require('./db');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var endecrypt = require('../encryption/security')
var db = [];
var defaultDb = []
var MongoClient = require('mongodb').MongoClient;
// db1.mongo.dbinstance.forEach(function (instance, inx) {
//   if (instance.isenable) {
//     // console.log('instance', instance)
//     var pass = endecrypt.decrypt(instance.password)
//       // console.log(pass)
//     var mongoDB = 'mongodb://' + instance.username + ':' + pass + '@' + instance.host + ':' + instance.port + '/' + instance.dbname;
//     // var mongoDB = 'mongodb://'+instance.host+':'+instance.port+'/'+((instance.dbname == '') ? databasename : instance.dbname);
//     console.log('database::::', mongoDB);
//     var connection = mongoose.createConnection(mongoDB);
//     connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//     db.push({ id: instance.id, conn: connection })
//   }
//   if (instance.isdefault) {
//     // console.log('instance', instance)
//     var pass = endecrypt.decrypt(instance.password)
//       // console.log(pass)
//     var mongoDB = 'mongodb://' + instance.username + ':' + pass + '@' + instance.host + ':' + instance.port + '/' + instance.dbname;
//     // var mongoDB = 'mongodb://'+instance.host+':'+instance.port+'/'+((instance.dbname == '') ? databasename : instance.dbname);
//     console.log('database::::', mongoDB);
//     var connection = mongoose.createConnection(mongoDB);
//     connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

//     defaultDb.push({ id: instance.id, conn: connection })
//   }
// })

// db1.mongo.username+':'+db1.mongo.password+'@'+
// var mongoDB = 'mongodb://'+db1.mongo.host+':'+db1.mongo.port+'/'+((db1.mongo.dbname == '') ? databasename : db1.mongo.dbname);
// var mongoDB = 'mongodb://localhost:27017,172.16.230.87:27017,172.16.160.117:27017/schema_builder?replicaSet=rs0&ssl=true&poolSize=10&authSource=admin&';

// console.log('database::::',mongoDB);

// console.log('-----',mongoose.connection.readyState);
// if(mongoose.connection.readyState >0){
//  mongoose.disconnect();
// }
// mongoose.connect(mongoDB);
// db = mongoose.connection;

// mongoose.connect(mongoDB);
// db = mongoose.createConnection(mongoDB);
// console.log("---------db----------",db);
// console.log('-----after---',mongoose.connection.readyState);
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// console.log('Success!!!!!!!!!!!!! Mongo');

var getConnection = async (function(data) {
  // console.log(data)
  var uri = 'mongodb://' + ((data.username != '' ? data.username + ':' + data.password + '@' : '')) + data.host + ':' + data.port + '/' + data.dbname; 
  // console.log(uri)
  var _data = await (MongoClient.connect(uri).then(res=> {
    return res
  }).catch(err=> {
    var obj = {iserror: true, msg: err} 
    return obj
  }))
  return _data
})

module.exports = {

  choose: async(function () {
    console.log('===================MONGODB=================');
  }),
  
  getTables: async(function(data) {
    var conn = await( getConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    if (conn.hasOwnProperty('iserror') && conn.iserror) {
      return conn
    } else {
      var result = await(conn.listCollections().toArray())
      // console.log(result)
      conn.close()
      return _.map(result, (d)=> {
        return { name: d.name}
      })
    }
    // return conn    
  }),

  getTablewithColumns: async(function(data) {
    var conn = await( getConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    if (conn.hasOwnProperty('iserror') && conn.iserror) {
      return {iserror: true, msg: err}
    } else {
      // console.log(conn)
      var result = await(conn.listCollections().toArray())
      var resp = []
      for (let [inx, obj] of result.entries()) {
        var cols = []
        var s = await (conn.collection(obj.name).find().limit(1).toArray())
        if (s != undefined && s.length > 0) {
          // console.log('>>>>>>>>>>>>>', s[0])
          for (let k in s[0]) {
            cols.push({ name: k })
          }  
        }
        resp.push({name: obj.name, columns: cols})
      }
      // console.log(result)
      conn.close()
      return resp
      // return _.map(result, (d)=> {
      //   return { name: d.name, columns: cols}
      // })
    }
  }),

  checkConnection: async(function(data) {
    var conn = await( getConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    if (conn.hasOwnProperty('iserror') && conn.iserror) {
      return conn
    } else {
      conn.close()
      return {result: true}
    }
  }),

  getSchemaRecord: async(function (data, tname) {
    var conn = await( getConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    if (conn.hasOwnProperty('iserror') && conn.iserror) {
      return conn
    } else {
      var result = await(conn.collection(tname).find().toArray())
      conn.close()
      return result
    }
  }),

  postSchemaRecord: async(function (data, rdata) {
    var conn = await( getConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    if (conn.hasOwnProperty('iserror') && conn.iserror) {
      return conn
    } else {
      // var id = new mongoose.Types.ObjectId(rdata.rid);
      var result = await(conn.collection(rdata.tname).insert(rdata.data))
      conn.close()
      return result.ops[0]._id
    }
  }),

  putSchemaRecord: async(function (data, rdata) {
    var conn = await( getConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    if (conn.hasOwnProperty('iserror') && conn.iserror) {
      return conn
    } else {
      var id = new mongoose.Types.ObjectId(rdata.rid);
      delete rdata.data.id
      delete rdata.data._id
      var result = await(conn.collection(rdata.tname).updateOne({ _id: id }, { $set: rdata.data }))
      conn.close()
      return result
    }
  }),

  deleteSchemaRecord: async(function (data, rdata) {
    var conn = await( getConnection(data).then(res => {
      return res
    }).catch(err => {
      return {iserror: true, msg: err}
    }))
    if (conn.hasOwnProperty('iserror') && conn.iserror) {
      return conn
    } else {
      var id = new mongoose.Types.ObjectId(rdata.rid);
      var result = await(conn.collection(rdata.tname).deleteOne({ _id: id }))
      conn.close()
      return result
    }
  }),

  generateInstanceTable: async(function (ins_id, title){
    console.log('Mongo generate instance collection..........', ins_id, title);
    // for(let [i, db_i] of db.entries()) {
    //   if(db_i.id == ins_id) {
    //     console.log(db[i].conn)
    //     var res = await (db[i].conn.createCollection(title))
    //     console.log('res......generateInstanceTable........', res)
    //     return res
    //   }
    // }
    return 'success'
  }),

  getConnsAllData: async (function(ins_id, limit) {
    for(let [i, db_i] of db.entries()) {
      if(db_i.id == ins_id) {
        var arr = []
        // console.log('db[i].conn', db[i].conn)
        var result = await (db_i.conn.db.listCollections().toArray().then(res => {
          return res
        }).catch(err => {
          return []
        }))
        // console.log('result........', result)
        for (let [inx, val] of result.entries()) {
          if(val.name != "system.indexes") {
            var obj = {}
            obj['t_name'] = val.name
            var data = await (db_i.conn.collection(val.name).find().limit(limit).toArray().then(res => {
              return res
            }).catch(err => {
              return []
            }))
            obj['t_data'] = data
            arr.push(obj)
          }
        }
        return arr
      }
    }
  }),


  getTableRecord: async(function(ins_id, tname, sl, el) {
    console.log(ins_id, tname, sl, el)
    var limit = el - sl 
    for(let [i, db_i] of db.entries()) {
      if(db_i.id == ins_id) {
        var arr = []
        // console.log('db[i].conn', db[i].conn)
        var result = await (db_i.conn.db.listCollections().toArray().then(res => {
          return res
        }).catch(err => {
          return []
        }))
        // console.log('result........', result)
        for (let [inx, val] of result.entries()) {
          if(val.name == tname) {
            // var obj = {}
            // obj['t_name'] = val.name
            var tcount = await (db_i.conn.collection(val.name).find().count().then(res => {
              return res
            }).catch(err => {
              return 0
            }))
            // console.log('mongo tcount', tcount)
            var obj = {}
            obj.total = tcount
            var _data = await (db_i.conn.collection(val.name).find().skip(sl).limit(limit).toArray().then(res => {
              return res
            }).catch(err => {
              return []
            }))
            // obj['t_data'] = data
            obj.data = _data
            return obj
            // arr.push(obj)
          }
        }
      }
    }
  }),

  postTableRecord: async(function(data) {
    for (let [i, inst] of db.entries()) {
      if ( inst.id == data.inst_id ) {
        var res = await (inst.conn.collection(data.tname).insert(data.data))
        // console.log('rethink >>>>>>>>>>>>>>', res)
        return res.ops[0]._id;
      }
    }
  }),

  putTableRecord: async(function(id, data) {
    for (let [i, inst] of db.entries()) {
      if ( inst.id == data.inst_id ) {
        var id = new mongoose.Types.ObjectId(id);
        delete data.data._id
        delete data.data.id
        var res = await (inst.conn.collection(data.tname).updateOne({ _id: id }, { $set: data.data }))
        // console.log('mongo >>>>>>>>>>>>>>', res)
        return res
      }
    }
  }),

  deleteThisTableRecord: async(function (id, inst_id, tname) {
    var id = new mongoose.Types.ObjectId(id);
    for (let [i, inst] of db.entries()) {
      if ( inst.id == inst_id ) {
        var res = await (inst.conn.collection(tname).deleteOne({ _id: id }))
        // console.log('mongo >>>>>>>>>>>>>>', res)
        return res
      }
    }
  }),

  //get methods
  getSchemaName: async(function (name) {
    console.log('mongo get SchemaName.............................');
    var schemadata = async(function () {
      var result = []
      _.forEach(db, function (dbinstance) {
        var r = await (dbinstance.conn.collection('schema').find({ title: name }).toArray())
        _.forEach(r, function (instance) {
          result.push(instance)
        })
      })
      return result;
    });
    var res = await (schemadata())
      // console.log('schemadata getSchema',res);
    return res;
    // var schemadata = await (db.collection('schema').find({ title: name }).toArray());
    // // console.log('SchemaName',schemadata);
    // return schemadata;
  }),

  getThisSchemaType: async(function (id, type) {
    console.log('mongo get SchemaCurrent Type', type);
    if (id.length != 24) {
      return [];
    } else {
      var id = new mongoose.Types.ObjectId(id);
      // // console.log('mongo get SchemaCurrent id:',id);           {$and: [{_id: id}, {type: type}]}
      // var schemadata = await (db.collection('schema').find({ _id: id }, { _id: 0, title: 0, templateType: 0, template: 0 }).toArray());
      // // console.log('SchemaCurrent',schemadata[0].entity);
      // var result = [];
      // schemadata[0].entity.forEach(function (item, i) {
      //   // console.log('item---',item);
      //   if (item.type === type) {
      //     result.push(item);
      //   }
      // });
      // return result;
      var schemadata = async(function () {
        var result = []
        _.forEach(db, function (dbinstance) {
          var r = await (dbinstance.conn.collection('schema').find({ _id: id }).toArray())
          // console.log('rrrrrrrrrrrrrrrrrrrrrrrrrr', r)
          _.forEach(r, function (instance) {
            result.push(instance)
          })
        })
        return result;
      });
      var res = await (schemadata())
      console.log('item---',res);
      var result = [];
      res[0].entity.forEach(function (item, i) {
        if (item.type === type) {
          result.push(item);
        }
      });
      return result;
      // return res;
    }
  }),

  getThisSchemaFieldName: async(function (id, fieldname) {
    console.log('mongo get SchemaCurrent fieldname');
    if (id.length != 24) {
      return [];
    } else {
      var id = new mongoose.Types.ObjectId(id);
      // // console.log('mongo get SchemaCurrent id:',id);           {$and: [{_id: id}, {type: type}]}
      // var schemadata = await (db.collection('schema').find({ _id: id }, { _id: 0, title: 0, templateType: 0, template: 0 }).toArray());
      // // console.log('SchemaCurrent',schemadata[0].entity);
      // var result = [];
      // schemadata[0].entity.forEach(function (item, i) {
      //   // console.log('item---',item);
      //   if (item.name === fieldname) {
      //     result.push(item);
      //   }
      // });
      // return result;
      var schemadata = async(function () {
        var result = []
        _.forEach(db, function (dbinstance) {
          // console.log('rrrrrrrrrrrrrrrrrrrrrrrrrr', dbinstance)
          var r = await (dbinstance.conn.collection('schema').find({ _id: id }).toArray())
          _.forEach(r, function (instance) {
            result.push(instance)
          })
        })
        return result;
      });
      var res = await (schemadata())
        console.log('schemadata getSchema',res);
      var result = [];
      res[0].entity.forEach(function (item, i) {
        // console.log('item---',item);
        if (item.name === fieldname) {
          result.push(item);
        }
      });
      return result;
      // return res;
    }
  }),

  getSchemaByDbid: async(function(dbid) {
    console.log('mongo get Schema By dbid...........................');
    // console.log('dbid......................', dbid)
    var schemadata = async(function () {
      var result = []
      _.forEach(db, function (dbinstance) {
        // console.log('..................', dbinstance)
        if (dbinstance.id == dbid) {
          var r = await (dbinstance.conn.collection('schema').find().toArray())
          _.forEach(r, function (instance) {
            result.push(instance)
          })
        }
      })
      return result;
    });
    var res = await (schemadata())
      // console.log('schemadata getSchema',res);
    return res;
  }),

  getSchema: async(function () {
    console.log('mongo get Schema');
    // var schemadata = async(function () {
    //   var result = []
    //   _.forEach(db, function (dbinstance) {
    //     var r = await (dbinstance.conn.collection('schema').find().toArray())
    //     _.forEach(r, function (instance) {
    //       result.push(instance)
    //     })
    //   })
    //   return result;
    // });
    // var res = await (schemadata())
    var res = await (defaultDb[0].conn.collection('schema').find().toArray())
      // console.log('schemadata getSchema',res);
    return res;
  }),
  getThisSchema: async(function (id) {
    console.log('mongo get SchemaCurrent');
    if (id.length != 24) {
      return [];
    } else {
      var id = new mongoose.Types.ObjectId(id);
      // console.log('mongo get SchemaCurrent id2:',typeof id);
      // var schemadata = await (db.collection('schema').find({ _id: id }).toArray());
      // // console.log('SchemaCurrent',schemadata);
      // return schemadata[0];
      var schemadata = async(function () {
        var result = []
        _.forEach(db, function (dbinstance) {
          var r = await (dbinstance.conn.collection('schema').find({ _id: id }).toArray())
          _.forEach(r, function (instance) {
            result.push(instance)
          })
        })
        return result;
      });
      var res = await (schemadata())
        // console.log('schemadata getSchema',res);
      return res;
    }
  }),
  getflowsInstance: async(function (collName, inst_id) {
    console.log('mongo get flowsInstance');
    // var flowsInstance = async(function (collName, inst_id) {
      for (let [i, inst] of db.entries()) {
        if ( inst.id == inst_id ) {
          var r = await (inst.conn.collection(collName).find().toArray())
          // console.log('mongo r', r)
          return r
        }
      }
      // var result = []
      // _.forEach(db, function (dbinstance) {
      //   var r = await (dbinstance.conn.collection('flows-instance').find().toArray())
      //   _.forEach(r, function (instance) {
      //     result.push(instance)
      //   })
      // })
      // return result;
    // });
    // var res = await (flowsInstance(collName, inst_id))
    // return res;
    // var flowsInstance = await (db.collection('flows-instance').find().toArray());
    // // console.log('flowsInstance',flowsInstance);
    // return flowsInstance;
  }),
  getThisflowsInstance: async(function (id, collName, inst_id) {
    console.log('mongo get flowsInstanceCurrent');
    var id = new mongoose.Types.ObjectId(id);
    for (let [i, inst] of db.entries()) {
        if ( inst.id == inst_id ) {
          var r = await (inst.conn.collection(collName).find({_id: id}).toArray())
          // console.log('mongo r', r)
          return r[0]
          // for(let [inx, obj] of r.entries()) {
          //   if (obj._id == id) {
          //     return obj
          //   }
          // }
        }
      }
    // if (id.length != 24) {
    //   return [];
    // } else {
    //   var id = new mongoose.Types.ObjectId(id);
    //   var flowsInstance = async(function () {
    //     var result = []
    //     _.forEach(db, function (dbinstance) {
    //       var r = await (dbinstance.conn.collection('flows-instance').find({ _id: id }).toArray())
    //       _.forEach(r, function (instance) {
    //         result.push(instance)
    //       })
    //     })
    //     return result;
    //   });
    //   var res = await (flowsInstance())
    //   return res;
    // }
    // var id = new mongoose.Types.ObjectId(id);
    // var flowsInstance = await (db.collection('flows-instance').find({ _id: id }).toArray());
    // // console.log('flowsInstance',flowsInstance);
    // return flowsInstance[0];
  }),

  //post methods
  postSchema: async(function (data) {
    console.log('mongo post Schemax');
    // console.log('guid', data.database[1])
    // var selectedDB = _.find(db, (d) => {
    //     return d.id == data.database[1]
    //   })
      // console.log(selectedDB)
    var schema = await (defaultDb[0].conn.collection('schema').insert(data));
    // console.log(schema)
    return schema.ops;
  }),
  postflowsInstance: async(function (data, dbid, collName) {
    console.log('...................mongo post flowsInstance...................');
    // data.Schemaid = data._id
    // delete data._id
    // delete data.id
    // console.log('guid', data.database[1])
    console.log('dbid', dbid)
    // var selectedDB = _.find(db, async(function(d){
    //     return d.id == dbid
    //   }))
    var selectedDB;
    for(let i = 0; i < db.length; i++ ){
      // console.log('connid', db[i].id)
      if(db[i].id == dbid) {
        selectedDB = db[i]
      }
    }
    // console.log('selectedDB', selectedDB)
    var schema = await (selectedDB.conn.collection(collName).insert(data));
    console.log('Generated Id:', schema.ops[0]._id)
    return schema.ops[0]._id;
    // var flowsInstance = await (db.collection('flows-instance').insert(data));
    // // var flowsInstance = await (db.collection('flows-instance').insert(data, function(err, result) {
    // //     if (err) {
    // //         console.log('Error!! from mongo post flowsInstance');
    // //         return {success: false}
    // //     } else {
    // //         console.log('Success!! from mongo post flowsInstance');
    // //         return {success: true}
    // //     }
    // // }));
    // return flowsInstance.ops;
  }),

  //put methods
  putSchema: async(function (data, id) {
    console.log('mongo put Schema');
    // delete data._id
    // console.log('guid', data.database[1])
    var id = new mongoose.Types.ObjectId(id);
    // var selectedDB = _.find(db, (d) => {
    //   return d.id == data.database[1]
    // })
    var schema = await (defaultDb[0].conn.collection('schema').updateOne({ _id: id }, { $set: data }));
    return schema;
  }),
  putflowsInstance: async(function (id, data, tableName, inst_id) {
    console.log('mongo put flowsInstance');
    delete data._id
    delete data.id
    var id = new mongoose.Types.ObjectId(id);
    // console.log('id from putflowsInstance:',id);
    var selectedDB = _.find(db, (d) => {
      return d.id == inst_id
    })
    var flowsInstance = await (selectedDB.conn.collection(tableName).updateOne({ _id: id }, { $set: data }));
    return flowsInstance.result;
  }),

  //delete methods
  // deleteSchema: async(function() {
  //     // var _data = JSON.parse(data);
  //     // console.log('mongo delete Schema');
  //  // var id = new mongoose.Types.ObjectId(id);
  //  // console.log('id from putSchema:',id);
  //  // db.collection('schema').updateOne({ _id: id }, { $set: _data }, function(err, result) {
  //  //     if (err) {
  //  //         return {success: false}
  //  //     } else {
  //  //         return {success: true}
  //  //     }
  //  // });
  //  db.collection('schema').drop(function(err, result) {
  //   if (err) {
  //          return {success: false}
  //      } else {
  //          return {success: true}
  //      }
  //  });
  // })
  deleteThisSchema: async(function (id, type) {
    console.log('mongo delete schema');
    if (id.length != 24) {
        // console.log('mongo DeleteSchema _blank');
        return [];
    }
    else {
        // console.log('111111')
        var id = new mongoose.Types.ObjectId(id);
        if(type == 'softdel') {
            // console.log('2222')
            // var schemadata = async(function () {
            //     var result = []
            //     _.forEach(db, function (dbinstance) {
            //         var r = await (dbinstance.conn.collection('schema').updateOne({ _id: id }, {$set: {isdeleted: true}}))
            //         _.forEach(r, function (instance) {
            //             result.push(instance)
            //         })
            //     })
            //     return result;
            // });
            // var res = await (schemadata())
            // // console.log('mongo DeleteSchema',res[0]);
            // return res[0];
            var schema = await (defaultDb[0].conn.collection('schema').updateOne({ _id: id }, {$set: {isdeleted: true}}));
            return schema;
        }
    }
    // // var schema = await (db.collection('schema').deleteOne({ _id: id }));
  }),
  deleteThisflowsInstance: async(function (id, tableName, inst_id) {
    console.log('mongo delete this flowsInstance');
    var id = new mongoose.Types.ObjectId(id);
    var selectedDB = _.find(db, (d) => {
      return d.id == inst_id
    })
    var flowsInstance = await (selectedDB.conn.collection(tableName).deleteOne({ _id: id }));
    return flowsInstance;
  })

}
