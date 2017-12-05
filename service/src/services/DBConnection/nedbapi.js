var db1 = require('./db');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var path = require('path')
var Datastore = require('nedb-promise');
var fs = require('fs');
if (!fs.existsSync('nedb')) {
  fs.mkdir('nedb', function(res, err) {
    // console.log('created...... directory')
  })
}
var dpath = 'nedb/'
var dbapi = []
var defaultapi = []
// var fname = (db1.nedb.dbname == '') ? databasename + '.db' : db1.nedb.dbname + '.db';
// console.log(fname);
// var db = new Datastore({ filename: fname, autoload: true });
// db = {}; 

// db.schema = new Datastore({ filename: 'schema.db', autoload: true });
// db.instance = new Datastore({ filename: 'instance.db', autoload: true });

db1.nedb.dbinstance.forEach(function (instance, inx) {
  if (instance.isenable) {
    // console.log('instance', instance)
    if (!fs.existsSync(path.join('nedb/', instance.dbname))) {
        fs.mkdir(path.join('nedb/', instance.dbname), function(err, folder) {
          if (err) {
            console.log('Error......', err)
          } else {
            dbapi.push({conn: 'nedb/'+ instance.dbname, id: instance.id})
          }
        })
    } else {
      dbapi.push({conn: 'nedb/'+ instance.dbname, id: instance.id})
    }
  }
  if (instance.isdefault) {
    if (!fs.existsSync(path.join('nedb/', instance.dbname))) {
      fs.mkdir(path.join('nedb/', instance.dbname), function(err, folder) {
        if (err) {
          console.log('Error......', err)
        } else {
          defaultapi.push({conn: 'nedb/'+ instance.dbname, id: instance.id})
        }
      })
    } else {
      defaultapi.push({conn: 'nedb/'+ instance.dbname, id: instance.id})
    }     
  }
})

module.exports = {
  choose: async(function () {
    console.log('===================NEDB=================');
  }),

  getConnsAllData: async (function(ins_id) {
    // console.log('getConnsAllData............', ins_id)
    // console.log(dbapi)
    for(let [i, db_i] of dbapi.entries()) {
      if(db_i.id == ins_id) {
        var arr = []
        var result = await (fs.readdirSync(db_i.conn))
        for (let [inx, val] of result.entries()) {
          var s = val.split('.')
          var tname = s[0]
          var obj = {}
          obj['t_name'] = tname
          // console.log('path...........', path.join(db_i.conn, '/' + tname + '.db'))
          var tconn = new Datastore({ filename: path.join(db_i.conn, '/' + tname + '.db'), autoload: true })
          var data = await (tconn.cfind({}).exec())
          // console.log('data............', data)
          obj['t_data'] = data
          arr.push(obj)
        }
        return arr
      }
    }
  }),

  postTableRecord: async(function(data) {
    for (let [i, inst] of dbapi.entries()) {
      if ( inst.id == data.inst_id ) {
        var tconn = new Datastore({ filename: path.join(inst.conn, '/' + data.tname + '.db'), autoload: true })
        var res = await (tconn.insert(data.data))
        // console.log('nedb >>>>>>>>>>>>>>', res)
        return res._id;
      }
    }
  }),

  putTableRecord: async(function(id, data) {
    for (let [i, inst] of dbapi.entries()) {
      if ( inst.id == data.inst_id ) {
        var tconn = new Datastore({ filename: path.join(inst.conn, '/' + data.tname + '.db'), autoload: true })
        delete data.data._id
        delete data.data.id
        var res = await (tconn.update({ _id: id }, { $set: data.data }))
        // console.log('nedb >>>>>>>>>>>>>>', res)
        return res;
      }
    }
  }),

  deleteThisTableRecord: async(function (id, inst_id, tname) {
    for (let [i, inst] of dbapi.entries()) {
      if ( inst.id == inst_id ) {
        var tconn = new Datastore({ filename: path.join(inst.conn, '/' + tname + '.db'), autoload: true })
        var res = await (tconn.remove({ _id: id }))
        // console.log('nedb >>>>>>>>>>>>>>', res)
        return res;
      }
    }
  }),

  //get methods
  getSchemaName: async(function (name) {
    console.log('NeDB get SchemaName');
    var schemadata = await (db.schema.cfind({ title: name }).exec());
    // console.log('SchemaName',schemadata);
    return schemadata;
  }),

  getThisSchemaType: async(function (id, type) {
    console.log('NeDB get SchemaCurrent Type', type);
    var schemadata = await (db.schema.cfindOne({ _id: id }).exec());
    var result = [];
    schemadata.entity.forEach(function (item, i) {
      if (item.type === type) {
        result.push(item);
      }
    });
    return result;
  }),

  getThisSchemaFieldName: async(function (id, fieldname) {
    console.log('NeDB get SchemaCurrent fieldname');
    var schemadata = await (db.schema.cfindOne({ _id: id }).exec());
    var result = [];
    schemadata.entity.forEach(function (item, i) {
      if (item.name === fieldname) {
        result.push(item);
      }
    });
    return result;
  }),

  getSchemaByDbid: async(function(dbid) {
    console.log('nedb get Schema By dbid...........................');
    // console.log('dbid......................', dbid)
    var schemadata = await (db.schema.cfind({}).exec())
      // console.log('schemadata',schemadata)
    return schemadata;
  }),

  getSchema: async(function () {
    console.log('NeDB get Schema');
    var schemadata = await (db.schema.cfind({}).exec())
      // console.log('schemadata',schemadata)
    return schemadata;
  }),
  getThisSchema: async(function (id) {
    console.log('NeDB get SchemaCurrent');
    var schemadata = await (db.schema.cfindOne({ _id: id }).exec());
    // console.log('SchemaCurrent',schemadata);
    // return schemadata;
    if(schemadata == null) {
        return [];
    }
    else {
      var arr=[]
      arr.push(schemadata)
    }
  }),
  getflowsInstance: async(function () {
    console.log('NeDB get flowsInstance');
    var flowsInstance = await (db.instance.cfind({}).exec());
    // console.log('flowsInstance',flowsInstance);
    return flowsInstance;
  }),
  getThisflowsInstance: async(function (id) {
    console.log('NeDB get flowsInstanceCurrent');
    var flowsInstance = await (db.instance.cfindOne({ _id: id }).exec());
    // console.log('flowsInstance',flowsInstance);
    return flowsInstance;
  }),

  //post methods
  postSchema: async(function (data) {
    console.log('NeDB post Schema');
    // db.users = new Datastore('path/to/users.db');
    var schemadata = await (db.schema.insert(data));
    console.log('schemadata', schemadata);
    return schemadata;
  }),
  postflowsInstance: async(function (data) {
    console.log('NeDB post flowsInstance');
    var flowsInstance = await (db.instance.insert(data));
    console.log('flowsInstance', flowsInstance);
    return flowsInstance;
  }),

  //put methods
  putSchema: async(function (data, id) {
    delete data._id
    console.log('NeDB put Schema');
    var schemadata = await (db.schema.update({ _id: id }, { $set: data }));
    console.log('schemadata', schemadata);
    return schemadata;
  }),
  putflowsInstance: async(function (data, id) {
    console.log('NeDB put flowsInstance');
    var flowsInstance = await (db.instance.update({ _id: id }, { $set: data }));
    console.log('flowsInstance', flowsInstance);
    return flowsInstance;
  }),

  //delete methods
  deleteThisSchema: async(function (id, type) {
    console.log('NeDB delete schema', type);
    if(type == 'softdel'){
      var schemadata = await (db.schema.update({ _id: id }, { $set: {isdeleted: true}}));
      // console.log('nedb ',schemadata)
      return schemadata;
    }
    // var schemadata = await (db.schema.remove({ _id: id }));
    // console.log('schemadata', schemadata);
  }),
  deleteThisflowsInstance: async(function (id) {
    console.log('NeDB delete flowsInstance');
    var flowsInstance = await (db.instance.remove({ _id: id }));
    console.log('flowsInstance', flowsInstance);
    return flowsInstance;
  })

}
