var mysql = require('mysql');
let _ = require('lodash');
var db1 = require('./db');
var fs = require('fs');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var endecrypt = require('../encryption/security')
var db = [];
var defaultDb = [];

db1.mysql.dbinstance.forEach(function (instance, inx) {  
  var pass = endecrypt.decrypt(instance.password)

  var conn1 = mysql.createConnection({
    host     : instance.host,
    port     : instance.port,
    user     : instance.username,
    password : pass
  });
  conn1.connect();

  conn1.query("CREATE DATABASE IF NOT EXISTS "+instance.dbname, function (err) {
    if (err) throw err;
    conn1.query('USE '+instance.dbname, function (err) {
        if (err) throw err;
        if (instance.isenable) {
          db.push({ id: instance.id, conn: conn1 })
        }
        if (instance.isdefault) {
          defaultDb.push({ id: instance.id, conn: conn1 })
        }
    });
  });
  // conn1.end();
  // if (instance.isenable) {
  //   var pass = endecrypt.decrypt(instance.password)

  //   var connection = mysql.createConnection({
  //     host     : instance.host,
  //     user     : instance.username,
  //     password : pass,
  //     database : instance.dbname
  //   });

  //   connection.connect();

  //   db.push({ id: instance.id, conn: connection })
  // }
})

// var schemadataWithId = async(function (id, selectedDB) {
//   var result = []
//   var commonSelectWithCondition = await(getQuery('mysql','select','commonSelectWithCondition'));
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ table_name }}','tbl_schema');
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ fields }}','*');
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ where }}','id='+id);

//   return new Promise((resolve, reject) => {
//     selectedDB.conn.query(commonSelectWithCondition, function (error, results, fields) {
//       _.forEach(results, function (instance) {
//         var table_name = instance.title.replace(' ', '_');
//         result.push(table_name)
//       })
//       resolve(result)
//     })
//   }).then(content => {
//     return content;
//   }).catch(err=> {
//     return err;
//   })
// });

// var getSchemaIdFromEntity = async(function (selectedDB,Schemaid,columnName) {
//   var result = []
//   var commonSelect = await(getQuery('mysql','select','commonSelectWithCondition'));
//   commonSelect = commonSelect.replace('{{ table_name }}','tbl_entity');
//   commonSelect = commonSelect.replace('{{ fields }}','type');
//   commonSelect = commonSelect.replace('{{ where }}','name="'+columnName+'" AND schemaid="'+Schemaid+'" AND customtype="1"');

//   return new Promise((resolve, reject) => {
//     selectedDB.conn.query(commonSelect, function (error, results, fields) {
//       _.forEach(results, function (instance) {
//         var orgSchemaId = parseInt(instance.type);
//         result.push(orgSchemaId)
//       })
//       resolve(result)
//     })
//   }).then(content => {
//     return content;
//   }).catch(err=> {
//     return err;
//   })
// });

// var getSchemaOriginalId = async(function (id, selectedDB) {
//   var result = []
//   var commonSelectWithCondition = await(getQuery('mysql','select','commonSelectWithCondition'));
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ table_name }}','tbl_schema');
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ fields }}','id');
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ where }}','id='+id);

//   return new Promise((resolve, reject) => {
//     selectedDB.conn.query(commonSelectWithCondition, function (error, results, fields) {
//       _.forEach(results, function (instance) {

//         result.push(instance.id)
//       })
//       resolve(result)
//     })
//   }).then(content => {
//     return content;
//   }).catch(err=> {
//     return err;
//   })
// });

// var tabledataWithId = async(function (table_name, id, selectedDB) {
//   var result1 = []
//   var commonSelectWithCondition = await(getQuery('mysql','select','commonSelectWithCondition'));
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ table_name }}',table_name);
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ fields }}','_id');
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ where }}','id='+id);
//   //'SELECT _id from '+table_name+' where id='+id

//   return new Promise((resolve, reject) => {
//     selectedDB.conn.query(commonSelectWithCondition, function (error, results, fields) {
//       _.forEach(results, function (instance) {
//         result1.push(instance._id);
//       })
//       resolve(result1)
//     })
//   }).then(content => {
//     return content;
//   }).catch(err=> {
//     return err;
//   })
// });

// var schemadetailWithId = async(function (id, selectedDB) {
//   var result1 = []

//   var commonSelectWithCondition = await(getQuery('mysql','select','commonSelectWithCondition'));
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ table_name }}','tbl_schema');
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ fields }}','title,database_name');
//   commonSelectWithCondition = commonSelectWithCondition.replace('{{ where }}','id='+id);

//   return new Promise((resolve, reject) => {
//     selectedDB.conn.query(commonSelectWithCondition, function (error, results, fields) {
//       _.forEach(results, function (instance) {
//         result1.push(instance);
//       })
//       resolve(result1)
//     })
//   }).then(content => {
//     return content;
//   }).catch(err=> {
//     return err;
//   })
// });

// var schemaTabledata = async(function (selectedDB,Schemaid) {
//   var result = []
//   var query = await(getQuery('mysql','select','schemaTabledata'));
//   if(typeof Schemaid !== 'undefined')
//   {
//     query = query.replace('{{ where }}','where s.id='+Schemaid);
//   }
//   else{
//     query = query.replace('{{ where }}','');
//   }
//   return new Promise((resolve, reject) => {
//     selectedDB.conn.query(query, function (error, results, fields) {
//       _.forEach(results, function (instance) {
//         result.push(instance);
//       })
//       resolve(result)
//     })
//   }).then(content => {
//     return content;
//   }).catch(err=> {
//     return err;
//   })
// });

// var schemaTableAllData = async(function (selectedDB) {
//   var result = []
//   var query = await(getQuery('mysql','select','getSchema'));

//   return new Promise((resolve, reject) => {
//     selectedDB.conn.query(query, function (error, results, fields) {
//       _.forEach(results, function (instance) {
//         result.push(instance);
//       })
//       resolve(result)
//     })
//   }).then(content => {
//     return content;
//   }).catch(err=> {
//     return err;
//   })
// });

var schemaTableAllData = async(function (dbinstance) {
  var result = []
  var promises = []

    var createTableQuery = await(getQuery('mysql','create','createTable'));
    createTableQuery = createTableQuery.replace('{{ table_name }}','tbl_schema');
    createTableQuery = createTableQuery.replace('{{ fields }}',"id int(11) NOT NULL AUTO_INCREMENT, _id varchar(255),title varchar(255) DEFAULT NULL, createTemplate text, database_name text, entity text, viewTemplate text, isdeleted tinyint(1) NOT NULL DEFAULT '0', PRIMARY KEY (id)");
    createTableQuery = createTableQuery.replace(',)',')');

    dbinstance.conn.query(createTableQuery);

    var createTableQuery = await(getQuery('mysql','create','createTable'));
    createTableQuery = createTableQuery.replace('{{ table_name }}','tbl_entity');
    createTableQuery = createTableQuery.replace('{{ fields }}',"id int(11) NOT NULL AUTO_INCREMENT, name text NOT NULL, type text NOT NULL, customtype tinyint(4) DEFAULT '0', notes text NOT NULL, schemaid int(11) NOT NULL, PRIMARY KEY (id)");
    createTableQuery = createTableQuery.replace(',)',')');

    dbinstance.conn.query(createTableQuery);

    var createTableQuery = await(getQuery('mysql','create','createTable'));
    createTableQuery = createTableQuery.replace('{{ table_name }}','tbl_property');
    createTableQuery = createTableQuery.replace('{{ fields }}',"id int(11) NOT NULL AUTO_INCREMENT, min int(11) NOT NULL, max int(11) NOT NULL, mindate text, maxdate text, allowed_value text NOT NULL, default_value text NOT NULL, helper text NOT NULL, regex text NOT NULL, placeholder text NOT NULL, optional varchar(255) NOT NULL, options text NOT NULL, IsArray text NOT NULL, entity_id int(11) NOT NULL, PRIMARY KEY (id)");
    createTableQuery = createTableQuery.replace(',)',')');

    dbinstance.conn.query(createTableQuery);

    var process = new Promise((resolve, reject) => {

      var query = await(getQuery('mysql','select','getSchema'));

      dbinstance.conn.query(query, function (error, results, fields) {
        if (error) throw error;
        _.forEach(results, function (instance,key) {
          entity_result=[]

          let name = instance.name.split("||");
          let type = instance.type.split("||");
          let customtype = instance.customtype.split("||");
          let notes = instance.notes.split("||");

          let IsArray = instance.IsArray.split("||");
          let allowed_value = instance.allowed_value.split("||");
          let default_value = instance.default_value.split("||");

          let helper = instance.helper.split("||");
          let min = instance.min.split("||");
          let max = instance.max.split("||");

          let mindate = instance.mindate.split("||");
          let maxdate = instance.maxdate.split("||");
          let optional = instance.optional.split("||");
          let options = instance.options.split("||");
          let placeholder = instance.placeholder.split("||");
          let regEx = instance.regEx.split("||");

          _.forEach(name, function (nameArray,key) {
            if(customtype[key] == 1)
            {
              instance['entity'] = {'name':name[key],'type':type[key],'notes':notes[key],'customtype': true};
            }
            else
            {
              instance['entity'] = {'name':name[key],'type':type[key],'notes':notes[key],'customtype': false};
            }
            //instance['entity'] = {'name':name[key],'type':type[key],'notes':notes[key]};

            instance['entity']['property'] = {'IsArray': IsArray[key],'allowedValue': JSON.parse(allowed_value[key]),'defaultValue': default_value[key],'helper': helper[key],'max': max[key],'maxdate': maxdate[key],'min': min[key],'mindate': mindate[key],'optional': JSON.parse(optional[key]),'options': JSON.parse(options[key]),'placeholder': placeholder[key],'regEx': regEx[key]};
            entity_result.push(instance['entity']);
          })

          instance['entity'] = entity_result;
          //instance['database_name'] = JSON.parse(instance['database_name'])
          if(instance['isdeleted'] == 1)
          {
            instance['isdeleted'] = true;
          }
          else
          {
            instance['isdeleted'] = false;
          }
          instance['database'] = JSON.parse(instance['database_name'])
          instance['_id'] = instance['id']

          // delete instance['database_name'];
          // delete instance['entityid'];
          // delete instance['name'];
          // delete instance['type'];
          // delete instance['customtype'];
          // delete instance['notes'];
          // delete instance['IsArray'];
          // delete instance['allowed_value'];
          // delete instance['default_value'];
          // delete instance['helper'];
          // delete instance['max'];
          // delete instance['min'];
          // delete instance['maxdate'];
          // delete instance['mindate'];
          // delete instance['optional'];
          // delete instance['options'];
          // delete instance['placeholder'];
          // delete instance['regEx'];
          result.push(instance);

        })
        resolve(result)
      })
    })
    promises.push(process)

  return Promise.all(promises).then(content => {
    return _.union(...content)
  });
});

var schemaTableAllDataByID = async(function (id) {
  var result = []
  var promises = []

  for(var dbinstance of db) {
    var process = new Promise((resolve, reject) => {

      var query = await(getQuery('mysql','select','getThisSchema'));
      query = query.replace('{{ id }}',id);
      // console.log('----------query-----------',query);
      dbinstance.conn.query(query, function (error, results, fields) {
        if (error) throw error;
      // console.log('----------results-----------',results);

        _.forEach(results, function (instance,key) {
          var entity_result=[]
          var old_fields=[]
          let name = instance.name.split("||");
          let type = instance.type.split("||");
          let customtype = instance.customtype.split("||");
          let notes = instance.notes.split("||");

          let IsArray = instance.IsArray.split("||");
          let allowed_value = instance.allowed_value.split("||");
          let default_value = instance.default_value.split("||");

          let helper = instance.helper.split("||");
          let min = instance.min.split("||");
          let max = instance.max.split("||");

          let mindate = instance.mindate.split("||");
          let maxdate = instance.maxdate.split("||");
          let optional = instance.optional.split("||");
          let options = instance.options.split("||");
          let placeholder = instance.placeholder.split("||");
          let regEx = instance.regEx.split("||");

          _.forEach(name, function (nameArray,key) {

            if(customtype[key] == 1)
            {
              instance['entity'] = {'name':name[key],'type':parseInt(type[key]),'notes':notes[key],'customtype': true};
            }
            else
            {
              instance['entity'] = {'name':name[key],'type':type[key],'notes':notes[key],'customtype': false};
            }
            instance['entity']['property'] = {'IsArray': IsArray[key],'allowedValue': JSON.parse(allowed_value[key]),'defaultValue': default_value[key],'helper': helper[key],'max': JSON.parse(max[key]),'maxdate': maxdate[key],'min': JSON.parse(min[key]),'mindate': mindate[key],'optional': JSON.parse(optional[key]),'options': JSON.parse(options[key]),'placeholder': placeholder[key],'regEx': regEx[key]};
            entity_result.push(instance['entity']);
            old_fields.push(nameArray);
          })

          instance['entity'] = entity_result;
          instance['old_title'] = instance['title'];
          instance['old_fields'] = old_fields;
          instance['database_name'] = JSON.parse(instance['database_name'])
          if(instance['isdeleted'] == 1)
          {
            instance['isdeleted'] = true;
          }
          else
          {
            instance['isdeleted'] = false;
          }
          instance['database'] = instance['database_name']
          instance['_id'] = instance['id']

          result.push(instance);
        })
        // console.log('###########result###############',result);
        resolve(result);
      })
    })
    promises.push(process)
  }

  return Promise.all(promises).then(content => {
    return _.union(...content)
  });
});

var getDatabaseName = async(function (id) {
  let result = new Promise((resolve, reject) => {
    fs.readFile(__dirname+'/db.json',function (err, data) {
      if (err) return console.log(err);
          resolve(JSON.parse(data));
          });
    });

    var _data = Promise.resolve(result).then(function(dbdata){
        var instance;
        _.forEach(dbdata, function(instances, db){
            var obj = _.find(instances.dbinstance, {id: id})
            if(obj != undefined){
              instance = obj
            }
        })
        return instance
    });

    return _data
});

var getQuery = async(function (dbName,type,queryFor) {
  let result = new Promise((resolve, reject) => {
    fs.readFile(__dirname+'/query.json',function (err, data) {
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

module.exports = {
  generateInstanceTable: async(function (data){
    console.log('mysql generate instance collection..........');

      var selectedDB;
      for (let i = 0; i< db.length; i++) {
        if (db[i].id == data.database[1]) {
          selectedDB = db[i]
        }
      }

      table_name = data.title.replace(' ', '_');
      fields="";

      _.forEach(data.entity, function (entity,index) {

        var isLastElement = index == data.entity.length -1;
        if(entity.name !="id" && entity.name != "_id")
        {
          if(isLastElement)
            fields += entity.name.replace(' ', '_')+" Text";
          else
            fields += entity.name.replace(' ', '_')+" Text,";
        }
        if(isLastElement)
        {
          var createTableQuery = await(getQuery('mysql','create','createTable'));
          createTableQuery = createTableQuery.replace('{{ table_name }}',table_name);
          createTableQuery = createTableQuery.replace('{{ fields }}',fields);
          createTableQuery = createTableQuery.replace(',)',')');

          selectedDB.conn.query(createTableQuery);

          var alterTableAndAddPrimaryKey = await(getQuery('mysql','alter','alterTableAndAddPrimaryKey'));
          alterTableAndAddPrimaryKey = alterTableAndAddPrimaryKey.replace('{{ table_name }}',table_name);
          alterTableAndAddPrimaryKey = alterTableAndAddPrimaryKey.replace('{{ field }}','id');
          alterTableAndAddPrimaryKey = alterTableAndAddPrimaryKey.replace('{{ primary_field }}','id');


          selectedDB.conn.query(alterTableAndAddPrimaryKey);

          var alterTableAndAddField = await(getQuery('mysql','alter','alterTableAndAddField'));
          alterTableAndAddField = alterTableAndAddField.replace('{{ table_name }}',table_name);
          alterTableAndAddField = alterTableAndAddField.replace('{{ field }}','Schemaid');
          alterTableAndAddField = alterTableAndAddField.replace('{{ type }}','Varchar(255)');
          alterTableAndAddField = alterTableAndAddField.replace('{{ after }}','');

          selectedDB.conn.query(alterTableAndAddField);

          // var alterTableAndAddField = await(getQuery('mysql','alter','alterTableAndAddField'));
          // alterTableAndAddField = alterTableAndAddField.replace('{{ table_name }}',table_name);
          // alterTableAndAddField = alterTableAndAddField.replace('{{ field }}','_id');
          // alterTableAndAddField = alterTableAndAddField.replace('{{ type }}','Varchar(255) NOT NULL');
          // alterTableAndAddField = alterTableAndAddField.replace('{{ after }}','AFTER id');

          // selectedDB.conn.query(alterTableAndAddField);
        }
      });
    return 'success';
  }),
  updateInstanceTable: async(function (data,old_data){
    console.log('mysql generate update collection..........');
    old_fields = [];

    _.forEach(old_data, function (nameArray,key) {
      old_fields.push(nameArray.name);
    })

    var selectedDB;
    for (let i = 0; i< db.length; i++) {
      if (db[i].id == data.database[1]) {
        selectedDB = db[i]
      }
    }
    // if(data.old_title != data.title)
    //   {
    //     var commonRename = await(getQuery('mysql','rename','commonRename'));
    //     commonRename = commonRename.replace('{{ old_table_name }}',data.old_title);
    //     commonRename = commonRename.replace('{{ new_table_name }}',data.title.replace(' ', '_'));
    //     try{
    //       selectedDB.conn.query(commonRename);
    //     } catch (e) {
    //       console.log('exception',e)
    //     }
    //   }
      var dbName = await(getDatabaseName(data.database[1]));
      var updateSchemaData = async(function () {
        var promises = []

        table_name = data.title.replace(' ', '_');

        new_fields=[]

        _.forEach(data.entity, function (entity,index) {

          if(entity.name != 'id' && entity.name != '_id')
          {
            new_fields.push(entity.name.replace(' ', '_'));

            var checkColumn = await(getQuery('mysql','select','checkColumn'));
            checkColumn = checkColumn.replace('{{ table_name }}','information_schema.COLUMNS');
            checkColumn = checkColumn.replace('{{ tableName }}',table_name);
            checkColumn = checkColumn.replace('{{ fields }}','*');
            checkColumn = checkColumn.replace('{{ database_name }}',dbName.dbname);
            checkColumn = checkColumn.replace('{{ column_name }}',entity.name.replace(' ', '_'));


            var process = new Promise((resolve, reject) => {
              selectedDB.conn.query(checkColumn, function (error, result, fields) {
                error? reject(error) : result.length == 0 ? resolve(entity.name.replace(' ', '_')) : resolve('')
              })
            })
          }

          promises.push(process);
        });

        return Promise.all(promises).then(content => {
          return _.union(content)
        });
      })

      var updateSchemaDataResponse = await (updateSchemaData())

      _.forEach(updateSchemaDataResponse, function (field,index) {
          if(field != "")
          {
            var alterTableAndAddField = await(getQuery('mysql','alter','alterTableAndAddField'));
            alterTableAndAddField = alterTableAndAddField.replace('{{ table_name }}',table_name);
            alterTableAndAddField = alterTableAndAddField.replace('{{ field }}',field);
            alterTableAndAddField = alterTableAndAddField.replace('{{ type }}','TEXT NULL DEFAULT NULL');
            alterTableAndAddField = alterTableAndAddField.replace('{{ after }}','');

            selectedDB.conn.query(alterTableAndAddField);
          }
      })

      difference = _.difference(old_fields,new_fields)

      _.forEach(difference, function (value,index) {
        var dropField = await(getQuery('mysql','alter','dropField'));
        dropField = dropField.replace('{{ table_name }}',table_name);
        dropField = dropField.replace('{{ field }}',value);

        selectedDB.conn.query(dropField);
      });
      return 'success';
  }),
  getConnsAllData: async (function(ins_id) {
    for(let [i, db_i] of db.entries()) {
      if(db_i.id == ins_id) {
        // console.log('ins_id+++++++++++++++++++++++',ins_id)
         var arr = []
        //  console.log('db[i]',db[i])
         var dbName = await(getDatabaseName(ins_id));
          // //get tables
          var getDatabaseTables = await(getQuery('mysql','select','getDatabaseTables'));
          getDatabaseTables = getDatabaseTables.replace('{{ table_name }}','information_schema.tables');
          getDatabaseTables = getDatabaseTables.replace('{{ database_name }}',dbName.dbname);
          getDatabaseTables = getDatabaseTables.replace('{{ fields }}','group_concat(table_name) as table_name');
          
          var tableList = function () {
            var result = []
            
            return new Promise((resolve, reject) => {
              db[i].conn.query(getDatabaseTables, function (error, result, fields) {
                error? reject(error) : resolve(result[0].table_name)
              })
            }).then(content => {
              return content;
            }).catch(err=> {
              return err;
            })     
          };
          var resTableList = await (tableList())

          // console.log('----------resTableList----------',resTableList);
          var tableName = resTableList.split(",");
          for (let [inx, val] of tableName.entries()) {
            var obj = {}
            obj['t_name'] = val

            var getDatabaseTables = await(getQuery('mysql','select','commonSelect'));
						getDatabaseTables = getDatabaseTables.replace('{{ table_name }}',val);
            getDatabaseTables = getDatabaseTables.replace('{{ fields }}','*');
            
            var tableData = function () {
						  var result = []
						  
						  return new Promise((resolve, reject) => {
                db[i].conn.query(getDatabaseTables, function (error, result, fields) {
							  error? reject(error) : resolve(result)
							})
						  }).then(content => {
							return content;
						  }).catch(err=> {
							return err;
						  })     
						};
            var resTableData = await (tableData())
            sData = [];
            for (let [i, sObj] of resTableData.entries()) {
							instanceVal = {};
							_.forEach(sObj, function (rs1,key) {
                // console.log('i',i)
                // console.log('key',key)
                // console.log('rs1',rs1)
                instanceVal[key] = rs1;   
              })
              
							sData.push(instanceVal)
            }
            // console.log("sData",sData);                     
            
          // console.log('----------resTableData----------',resTableData);
            
            // var data = await (r[i].conn.table(val).run())
            obj['t_data'] = sData
            arr.push(obj)
          }

        // var result = await (r[i].conn.tableList())
        // // console.log(result)
        // for (let [inx, val] of result.entries()) {
        //   var obj = {}
        //   obj['t_name'] = val
        //   var data = await (r[i].conn.table(val).run())
        //   obj['t_data'] = data
        //   arr.push(obj)
        // }
        return arr
      }
    }
  }),
  choose: async(function () {
    console.log('===================mysql=================');
  }),
  //get methods
  getSchemaName: async(function (name) {
    console.log('mysql get SchemaName');
  }),
  getThisSchemaType: async(function (id, type) {
    console.log('mysql get SchemaCurrent Type', type);
  }),
  getThisSchemaFieldName: async(function (id, fieldname) {
    console.log('mysql get SchemaCurrent fieldname');
  }),
  getSchemaByDbid: async(function(dbid) {
    console.log('mysql get Schema By dbid...........................');
    var schemadata = async(function () {
      var result = []
      _.forEach(db, function (dbinstance) {
        if (dbinstance.id == dbid) {
          var r = await (schemaTableAllData(dbinstance))
          _.forEach(r, function (instance) {
            result.push(instance)
          })
        }
      })
      return result;
    });
    var res = await (schemadata())
    return res;
  }),
  getSchema: async(function () {
    console.log('mysql get Schema');

    var schemadata = async(function () {
      var result = []
      var promises = []

      // for(var dbinstance of db) {
      //   var process = new Promise((resolve, reject) => {

      //     // var query = await(getQuery('mysql','select','getSchema'));
      //     var r = await (schemaTableAllData(dbinstance))
      //     _.forEach(r, function (instance) {
      //       result.push(instance)
      //     })
      //     resolve(result)
      //   })
      //   promises.push(process)
      // }
      var process = new Promise((resolve, reject) => {

        var r = await (schemaTableAllData(defaultDb[0]))
        _.forEach(r, function (instance) {
          result.push(instance)
        })
        resolve(result)
      })

      promises.push(process)

      return Promise.all(promises).then(content => {
        return _.union(...content)
      });
    });
    var res = await (schemadata())
    return res;

  }),
  getThisSchema: async(function (id) {
    console.log('mysql get SchemaCurrent');


    var schemadata = async(function () {
      var result = []

      var promises = []

      if(/^\d+$/.test(id))
      {
        for(var dbinstance of db) {
        //_.forEach(db, function (dbinstance) {
          var process = new Promise((resolve, reject) => {

            var query = await(getQuery('mysql','select','getThisSchema'));
            query = query.replace('{{ id }}',id);

            dbinstance.conn.query(query, function (error, results, fields) {
              if (error) throw error;
              _.forEach(results, function (instance,key) {
                var entity_result=[]
                var old_fields=[]
                let name = instance.name.split("||");
                let type = instance.type.split("||");
                let customtype = instance.customtype.split("||");
                let notes = instance.notes.split("||");

                let IsArray = instance.IsArray.split("||");
                let allowed_value = instance.allowed_value.split("||");
                let default_value = instance.default_value.split("||");

                let helper = instance.helper.split("||");
                let min = instance.min.split("||");
                let max = instance.max.split("||");

                let mindate = instance.mindate.split("||");
                let maxdate = instance.maxdate.split("||");
                let optional = instance.optional.split("||");
                let options = instance.options.split("||");
                let placeholder = instance.placeholder.split("||");
                let regEx = instance.regEx.split("||");

                _.forEach(name, function (nameArray,key) {

                  if(customtype[key] == 1)
                  {
                    instance['entity'] = {'name':name[key],'type':parseInt(type[key]),'notes':notes[key],'customtype': true};
                  }
                  else
                  {
                    instance['entity'] = {'name':name[key],'type':type[key],'notes':notes[key],'customtype': false};
                  }
                  instance['entity']['property'] = {'IsArray': IsArray[key],'allowedValue': JSON.parse(allowed_value[key]),'defaultValue': default_value[key],'helper': helper[key],'max': JSON.parse(max[key]),'maxdate': maxdate[key],'min': JSON.parse(min[key]),'mindate': mindate[key],'optional': JSON.parse(optional[key]),'options': JSON.parse(options[key]),'placeholder': placeholder[key],'regEx': regEx[key]};
                  entity_result.push(instance['entity']);
                  old_fields.push(nameArray);
                })

                instance['entity'] = entity_result;
                instance['old_title'] = instance['title'];
                instance['old_fields'] = old_fields;
                instance['database_name'] = JSON.parse(instance['database_name'])
                if(instance['isdeleted'] == 1)
                {
                  instance['isdeleted'] = true;
                }
                else
                {
                  instance['isdeleted'] = false;
                }
                instance['database'] = instance['database_name']
                instance['_id'] = instance['id']

                result.push(instance);
              })
              resolve(result);
            })
          })
          promises.push(process)
        }
      }

      return Promise.all(promises).then(content => {
        return _.union(...content)
      });
    });
    var res = await (schemadata())
    return res;
  }),
  getflowsInstance: async(function (title,instance_id) {
    console.log('mysql get flowsInstance----------------------------------------------------');

    var flowsInstance = async(function () {
      var result = []
      var promises = []

      for(var dbinstance of db)
      {
        // var res = await (schemaTabledata(defaultDb[0]))

        //instanceVal1 = {};

        // _.forEach(res, function (r) {

          // let database_name = JSON.parse(r.database_name)

          var dbName = await(getDatabaseName(instance_id));

            instanceVal1 = [];
            if(instance_id == dbinstance.id)
            {
              var process = new Promise((resolve, reject) => {

                var commonSelect = await(getQuery('mysql','select','commonSelect'));
                commonSelect = commonSelect.replace('{{ table_name }}',dbName.dbname+'.'+title.replace(' ', '_'));
                commonSelect = commonSelect.replace('{{ fields }}','*');

                dbinstance.conn.query(commonSelect, function (error, results, fields) {
                  if (error) throw error;

                  _.forEach(results, function (rs) {
                    instanceVal = {};
                    //instanceVal['title'] = r.title;
                    // instanceVal['database'] = JSON.parse(r.database_name);
                    // instanceVal['Schemaid'] = rs.id.toString();
                    instanceVal['_id'] = rs.id.toString();

                    _.forEach(rs, function (rs1,key) {
                      try {
                          instanceVal[key] = JSON.parse(rs1);
                        } catch (e) {
                          instanceVal[key] = rs1;
                        }
                    })
                    delete instanceVal['id'];
                    if(instanceVal.Schemaid == null)
                    {
                     delete  instanceVal.Schemaid;
                    }
                    instanceVal1.push(instanceVal);
                  })
                  resolve(instanceVal1)
                })
              })
              promises.push(process)
            }
        // })
      }

      return Promise.all(promises).then(content => {
        return _.union(...content)
      });
      //return result;
    })

    var res = await (flowsInstance())
    // console.log('myssql................', res)
    return res;
  }),
  getThisflowsInstance: async(function (id, tableName, instance_id) {
    console.log('mysql get flowsInstanceCurrent',id,tableName,instance_id);

    var flowsInstance = async(function () {
      var result = []
      var promises = []
      // if(/^\d+$/.test(id))
      // {
        // _.forEach(db, function (dbinstance) {
          for(let[i, dbinstance] of db.entries()){
          if( dbinstance.id == instance_id ) {
            console.log('db.id', dbinstance.id)
          ///////////////////////////////////////////////  Using Schemaid //////////////////////////////////////////////////////////

          // var res = await (schemadetailWithId(Schemaid,dbinstance))
          // var rs = res[0];
          // table_name = rs.title.replace(' ', '_');

          // console.log(tableName);
          instanceVal1 = [];

          var p1 = new Promise((resolve, reject) => {
            var commonSelect = await(getQuery('mysql','select','commonSelectWithCondition'));
            commonSelect = commonSelect.replace('{{ table_name }}',tableName);
            commonSelect = commonSelect.replace('{{ fields }}','*');
            commonSelect = commonSelect.replace('{{ where }}','id="'+id+'"');

            dbinstance.conn.query(commonSelect, function (error, results, fields) {
              if (error) throw error;
              // console.log('results', results[0])
              // _.forEach(results, function (instance) {
              //   instanceVal = {};

              //   // instanceVal['database'] = JSON.parse(rs.database_name);
              //   // instanceVal['Schemaid'] = Schemaid;

              //   // _.forEach(rs, function (rs1,key) {
              //   //   try {
              //   //       instanceVal[key] = JSON.parse(rs1);
              //   //     } catch (e) {
              //   //       instanceVal[key] = rs1;
              //   //     }
              //   // })
              //   instanceVal1.push(instanceVal);
              // })
              resolve(results)
            })
          })
          promises.push(p1)


          ///////////////////////////////////////////////  Using Schemaid //////////////////////////////////////////////////////////
          // if(typeof columnName !== 'undefined' && typeof Schemaid !== 'undefined')
          // {
          //   var getSchemaId = await (getSchemaIdFromEntity(defaultDb[0], Schemaid, columnName))
          //   var res = await (schemaTabledata(defaultDb[0],getSchemaId[0]))
          // }
          // else if(typeof Schemaid !== 'undefined')
          // {
          //   var res = await (schemaTabledata(defaultDb[0],Schemaid))
          // }
          // else{
          //   var res = await (schemaTabledata(defaultDb[0]))
          // }

          // _.forEach(res, function (r) {

          //   instanceVal1 = [];

          //   var process = new Promise((resolve, reject) => {

          //     let database_name = JSON.parse(r.database_name)
          //     var dbName = await(getDatabaseName(database_name[1]));

          //     var table_name = dbName.dbname+'.'+r.title.replace(' ', '_');

          //     var commonSelect = await(getQuery('mysql','select','commonSelectWithCondition'));
          //     commonSelect = commonSelect.replace('{{ table_name }}',table_name);
          //     commonSelect = commonSelect.replace('{{ fields }}','*');
          //     commonSelect = commonSelect.replace('{{ where }}','id="'+id+'"');

          //     dbinstance.conn.query(commonSelect, function (error, results, fields) {
          //       if (error) throw error;

          //       if(results.length>0)
          //       {
          //         _.forEach(results, function (instance) {
          //           instanceVal = {};

          //           // instanceVal['database'] = JSON.parse(r.database_name);
          //           // instanceVal['Schemaid'] = r.id.toString();
          //           instanceVal['_id'] = instance.id.toString();

          //           _.forEach(instance, function (rs1,key) {
          //             try {
          //                 instanceVal[key] = JSON.parse(rs1);
          //               } catch (e) {
          //                 instanceVal[key] = rs1;
          //               }
          //           })
          //           if(instanceVal.Schemaid == null)
          //           {
          //             delete  instanceVal.Schemaid;
          //           }
          //           instanceVal1.push(instanceVal);
          //         })
          //       }
          //       resolve(instanceVal1)
          //     })
          //   })

          //   promises.push(process)

          // })
        }
        }
        return Promise.all(promises).then(content => {
            // console.log(content)
            return content[0]
          });
      // }
      //return result;


    });
    var res = await (flowsInstance())
    // console.log('.............................................', res[0])
    var _res = res[0]
    for(let k in _res) {
      if(typeof _res[k] == 'string') {
        if(_res[k][0] == '['){
        _res[k] = JSON.parse(_res[k])
        }
      }
    }
    if(_res.Schemaid == null ){
      delete _res.Schemaid
    }
    _res._id = _res.id
    return _res;
  }),
  // getThisflowsInstance: async(function (id,Schemaid,columnName) {
  //     console.log('mysql get flowsInstanceCurrent',id,Schemaid,columnName);

  //     var flowsInstance = async(function () {
  //       var result = []
  //       var promises = []
  //       if(/^\d+$/.test(id))
  //       {
  //         _.forEach(db, function (dbinstance) {

  //           ///////////////////////////////////////////////  Using Schemaid //////////////////////////////////////////////////////////

  //           // var res = await (schemadetailWithId(Schemaid,dbinstance))
  //           // var rs = res[0];
  //           // table_name = rs.title.replace(' ', '_');

  //           // console.log(table_name);
  //           // instanceVal1 = [];

  //           // var process = new Promise((resolve, reject) => {
  //           //   dbinstance.conn.query("SELECT * from "+table_name+" where id="+id, function (error, results, fields) {
  //           //     if (error) throw error;
  //           //     _.forEach(results, function (instance) {
  //           //       instanceVal = {};

  //           //       instanceVal['database'] = JSON.parse(rs.database_name);
  //           //       instanceVal['Schemaid'] = Schemaid;

  //           //       _.forEach(rs, function (rs1,key) {
  //           //         try {
  //           //             instanceVal[key] = JSON.parse(rs1);
  //           //           } catch (e) {
  //           //             instanceVal[key] = rs1;
  //           //           }
  //           //       })
  //           //       instanceVal1.push(instanceVal);
  //           //     })
  //           //     resolve(instanceVal1)
  //           //   })
  //           // })

  //           ///////////////////////////////////////////////  Using Schemaid //////////////////////////////////////////////////////////
  //           if(typeof columnName !== 'undefined' && typeof Schemaid !== 'undefined')
  //           {
  //             var getSchemaId = await (getSchemaIdFromEntity(defaultDb[0], Schemaid, columnName))
  //             var res = await (schemaTabledata(defaultDb[0],getSchemaId[0]))
  //           }
  //           else if(typeof Schemaid !== 'undefined')
  //           {
  //             var res = await (schemaTabledata(defaultDb[0],Schemaid))
  //           }
  //           else{
  //             var res = await (schemaTabledata(defaultDb[0]))
  //           }

  //           _.forEach(res, function (r) {

  //             instanceVal1 = [];

  //             var process = new Promise((resolve, reject) => {

  //               let database_name = JSON.parse(r.database_name)
  //               var dbName = await(getDatabaseName(database_name[1]));

  //               var table_name = dbName.dbname+'.'+r.title.replace(' ', '_');

  //               var commonSelect = await(getQuery('mysql','select','commonSelectWithCondition'));
  //               commonSelect = commonSelect.replace('{{ table_name }}',table_name);
  //               commonSelect = commonSelect.replace('{{ fields }}','*');
  //               commonSelect = commonSelect.replace('{{ where }}','id="'+id+'"');

  //               dbinstance.conn.query(commonSelect, function (error, results, fields) {
  //                 if (error) throw error;

  //                 if(results.length>0)
  //                 {
  //                   _.forEach(results, function (instance) {
  //                     instanceVal = {};

  //                     // instanceVal['database'] = JSON.parse(r.database_name);
  //                     // instanceVal['Schemaid'] = r.id.toString();
  //                     instanceVal['_id'] = instance.id.toString();

  //                     _.forEach(instance, function (rs1,key) {
  //                       try {
  //                           instanceVal[key] = JSON.parse(rs1);
  //                         } catch (e) {
  //                           instanceVal[key] = rs1;
  //                         }
  //                     })
  //                     if(instanceVal.Schemaid == null)
  //                     {
  //                       delete  instanceVal.Schemaid;
  //                     }
  //                     instanceVal1.push(instanceVal);
  //                   })
  //                 }
  //                 resolve(instanceVal1)
  //               })
  //             })

  //             promises.push(process)

  //           })
  //         })
  //       }
  //       //return result;

  //       return Promise.all(promises).then(content => {
  //         return _.union(...content)
  //       });

  //     });
  //     var res = await (flowsInstance())

  //     return res;
  //   }),
  //post methods
  postSchema: async(function (data) {
    console.log('mysql post Schema');
    let database_name = JSON.stringify(data.database)

    var selectedDB = _.find(db, (d) => {
      return d.id == data.database[1]
    })

    schemaDb = defaultDb[0];

    var dbName = await(getDatabaseName(data.database[1]));
    let uuid = await (UUID())
    var schemaQuery = await(getQuery('mysql','insert','commonInsert'));
    schemaQuery = schemaQuery.replace('{{ table_name }}','tbl_schema');
    schemaQuery = schemaQuery.replace('{{ fields }}','title,database_name');

    var values = "'"+data.title+"'"+","+"'"+database_name+"'";

    schemaQuery = schemaQuery.replace('{{ values }}',values);

    // insert data in schema table
    var schemadata = function () {
      var result = []

      return new Promise((resolve, reject) => {
        schemaDb.conn.query(schemaQuery, function (error, result, fields) {
          error? reject(error) : resolve(result.insertId)
        })
      }).then(content => {
        return content;
      }).catch(err=> {
        return err;
      })
    };
    var res = await (schemadata())
    // end - insert data in schema table

    // insert data in entity table

    var entitydata = async(function () {
      var promises = []

      table_name = data.title.replace(' ', '_');
      fields="";

      _.forEach(data.entity, function (entity,index) {

        var isLastElement = index == data.entity.length -1;
        if(entity.name !="id" && entity.name != "_id")
        {
          if(isLastElement)
            fields += entity.name.replace(' ', '_')+" Text";
          else
            fields += entity.name.replace(' ', '_')+" Text,";
        }
        if(isLastElement)
        {
          // var createTableQuery = await(getQuery('mysql','create','createTable'));
          // createTableQuery = createTableQuery.replace('{{ table_name }}',table_name);
          // createTableQuery = createTableQuery.replace('{{ fields }}',fields);
          // createTableQuery = createTableQuery.replace(',)',')');

          // selectedDB.conn.query(createTableQuery);

          // var alterTableAndAddPrimaryKey = await(getQuery('mysql','alter','alterTableAndAddPrimaryKey'));
          // alterTableAndAddPrimaryKey = alterTableAndAddPrimaryKey.replace('{{ table_name }}',table_name);
          // alterTableAndAddPrimaryKey = alterTableAndAddPrimaryKey.replace('{{ field }}','id');
          // alterTableAndAddPrimaryKey = alterTableAndAddPrimaryKey.replace('{{ primary_field }}','id');


          // selectedDB.conn.query(alterTableAndAddPrimaryKey);

          // var alterTableAndAddField = await(getQuery('mysql','alter','alterTableAndAddField'));
          // alterTableAndAddField = alterTableAndAddField.replace('{{ table_name }}',table_name);
          // alterTableAndAddField = alterTableAndAddField.replace('{{ field }}','_id');
          // alterTableAndAddField = alterTableAndAddField.replace('{{ type }}','Varchar(255) NOT NULL');
          // alterTableAndAddField = alterTableAndAddField.replace('{{ after }}','AFTER id');

          // selectedDB.conn.query(alterTableAndAddField);
        }

        if(entity.customtype)
        {
          customtype = 1;
        }
        else{
          customtype = 0;
        }

        var entityQuery = await(getQuery('mysql','insert','commonInsert'));
        entityQuery = entityQuery.replace('{{ table_name }}','tbl_entity');
        entityQuery = entityQuery.replace('{{ fields }}','name,type,customtype,notes,schemaid');

        var values = "'"+entity.name.replace(' ', '_')+"'"+","+"'"+entity.type+"'"+","+"'"+customtype+"'"+","+"'"+entity.notes+"'"+","+"'"+res+"'";

        entityQuery = entityQuery.replace('{{ values }}',values);

        var process = new Promise((resolve, reject) => {
          schemaDb.conn.query(entityQuery, function (error, result, fields) {
            error? reject(error) : resolve(result.insertId)
          })
        })
        promises.push(process);
      });

      return Promise.all(promises).then(content => {
        return _.union(content)
      });
    })
    var entityResponse = await (entitydata())
    // end - insert data in entity table

    // insert data in property table

    var propertydata = async(function () {
      _.forEach(data.entity, function (entity,index) {
        return new Promise((resolve, reject) => {

          let properties = entity.property;

          let min = properties.min||'0';
          let max = properties.max||'0';
          let mindate = properties.mindate||'';
          let maxdate = properties.maxdate||'';
          let allowedValue = JSON.stringify(properties.allowedValue)||[];
          let defaultValue = properties.defaultValue||'';
          let placeholder = properties.placeholder||'';
          let helper = properties.helper||'';
          let regEx = properties.regEx||'';
          let optional = properties.optional||'';
          let options = JSON.stringify(properties.options)||[];
          let IsArray = properties.IsArray||'';

          var propertyQuery = await(getQuery('mysql','insert','commonInsert'));
          propertyQuery = propertyQuery.replace('{{ table_name }}','tbl_property');
          propertyQuery = propertyQuery.replace('{{ fields }}','min,max,mindate,maxdate,allowed_value,default_value,helper,regex,placeholder,optional,options,IsArray,entity_id');

          var values = "'"+min+"'"+","+"'"+max+"'"+","+"'"+mindate+"'"+","+"'"+maxdate+"'"+","+"'"+allowedValue+"'"+","+"'"+defaultValue+"'"+","+"'"+helper+"'"+","+"'"+regEx+"'"+","+"'"+placeholder+"'"+","+"'"+optional+"'"+","+"'"+options+"'"+","+"'"+IsArray+"'"+","+"'"+entityResponse[index]+"'";

          propertyQuery = propertyQuery.replace('{{ values }}',values);

          schemaDb.conn.query(propertyQuery, function (error, result, fields) {
            error? reject(error) : resolve(result.insertId)
          })
        }).then(content => {
          return content;
        }).catch(err=> {
          return err;
        })
      });
    })
    var propertyResponse = await (propertydata())
    // var r = await (tabledataWithId('tbl_schema',res,selectedDB))
    var response = await (schemaTableAllDataByID(res))
    responseArray = [];
    _.forEach(response, function (resp,index) {
      responseObj = {};
      responseObj['_id'] = resp['id']
      responseObj['database'] = resp['database']
      responseObj['entity'] = resp['entity']
      responseObj['title'] = resp['title']
      responseArray.push(responseObj);
    });

    return responseArray;
    // end - insert data in property table
  }),
  postflowsInstance: async(function (data,dbid,_id) {
    console.log('mysql post flowsInstance**********',data,dbid,_id);
    // var selectedDB = _.find(db, (d) => {
    //   return d.id == data.database[1]
    // })
    var selectedDB;
    for (let i = 0; i< db.length; i++) {
      if (db[i].id == dbid) {
        selectedDB = db[i]
      }
    }

    if(typeof _id !== 'undefined')
    {
      var id = parseInt(_id);
    }
    else{
      var id = parseInt(data.Schemaid);
    }

    // var res = await (schemadataWithId(id, defaultDb[0]))

    table_name = _id;//res[0];

    var schemadata = function () {
      var result = []
      var tableFields='';
      var tableValues='';
      k=0;

      _.forEach(data, function (d,key) {
        if(key != 'Schemaid' && key != 'database')
        {
          if(k==0)
          {
            let res = await (UUID())
            let uuid = res;

            tableFields += key;
            if(typeof data.Schemaid !== 'undefined')
            {
              tableFields += ",Schemaid";
            }

            if(typeof d == 'object')
              {
                tableValues += "'"+JSON.stringify(d)+"'";
              }
              else{
                tableValues += "'"+d+"'";
              }
              if(typeof data.Schemaid !== 'undefined')
              {
                tableValues += ",'"+data.Schemaid+"'";
              }
          }
          else
          {
            if(typeof d == 'object')
            {
              tableFields += ','+key;
              tableValues += ",'"+JSON.stringify(d)+"'";
            }
            else{
              tableFields += ','+key;
              tableValues += ",'"+d+"'";
            }
          }
          k++;
        }
      })

      // _.forEach(data, function (d,key) {
      //   if(key != 'Schemaid' && key != 'database')
      //   {
      //     if(k==0)
      //     {
      //       let res = await (UUID())
      //       let uuid = res;

      //       tableFields += key+"='"+d+"'";
      //       tableFields += ",_id='"+uuid+"'";
      //     }
      //     else
      //     {
      //       if(typeof d == 'object')
      //       {
      //         tableFields += ","+key+"='"+JSON.stringify(d)+"'";
      //       }
      //       else{
      //         tableFields += ","+key+"='"+d+"'";
      //       }
      //     }
      //     k++;
      //   }
      // })

      return new Promise((resolve, reject) => {
        var commonInsert = await(getQuery('mysql','insert','commonInsert'));
        commonInsert = commonInsert.replace('{{ table_name }}',table_name);
        commonInsert = commonInsert.replace('{{ fields }}',tableFields);
        commonInsert = commonInsert.replace('{{ values }}',tableValues);
        selectedDB.conn.query(commonInsert, function (error, result, fields) {
          error? reject(error) : resolve(result.insertId)
        })
      }).then(content => {
        return content;
      }).catch(err=> {
        return err;
      })
    };
    var res = await (schemadata())
    return res;

    // var tableDetail = await (tabledataWithId(table_name, res, selectedDB));
    // return tableDetail[0];
  }),
  //put methods
  putSchema: async(function (data, id) {
    console.log('mysql put Schema');

    let database_name = JSON.stringify(data.database)
    let entity = JSON.stringify(data.entity)

    var selectedDB = _.find(db, (d) => {
      return d.id == data.database[1]
    })
    schemaDb = defaultDb[0];

    if(data.old_title != data.title)
    {
      var commonRename = await(getQuery('mysql','rename','commonRename'));
      commonRename = commonRename.replace('{{ old_table_name }}',data.old_title);
      commonRename = commonRename.replace('{{ new_table_name }}',data.title.replace(' ', '_'));

      selectedDB.conn.query(commonRename);
    }

    var dbName = await(getDatabaseName(data.database[1]));

    var commonUpdate = await(getQuery('mysql','update','commonUpdate'));
    commonUpdate = commonUpdate.replace('{{ table_name }}','tbl_schema');
    commonUpdate = commonUpdate.replace('{{ fields }}',"title="+"'"+data.title+"',database_name="+"'"+database_name+"'");
    commonUpdate = commonUpdate.replace('{{ where }}','id='+id);

    var updateSchema = function () {
      var result = []

      return new Promise((resolve, reject) => {
        schemaDb.conn.query(commonUpdate, function (error, result, fields) {
          error? reject(error) : resolve(result.insertId)
        })
      }).then(content => {
        return content;
      }).catch(err=> {
        return err;
      })
    };
    var resUpdateSchema = await (updateSchema());

    var commonSelectWithCondition = await(getQuery('mysql','select','commonSelectWithCondition'));
    commonSelectWithCondition = commonSelectWithCondition.replace('{{ table_name }}','tbl_entity');
    commonSelectWithCondition = commonSelectWithCondition.replace('{{ fields }}','GROUP_CONCAT(id) as entityid');
    commonSelectWithCondition = commonSelectWithCondition.replace('{{ where }}','schemaid='+id+' GROUP BY schemaid');

    var deleteSchemaData = function () {
      return new Promise((resolve, reject) => {
        schemaDb.conn.query(commonSelectWithCondition, function (error, result, fields) {
          error? reject(error) : resolve(result[0].entityid)
        })
      }).then(content => {
        return content;
      }).catch(err=> {
        return err;
      })
    };
    var resDeleteSchemaData = await (deleteSchemaData());

    var commonDelete = await(getQuery('mysql','delete','commonDelete'));
    commonDelete = commonDelete.replace('{{ table_name }}','tbl_entity');
    commonDelete = commonDelete.replace('{{ where }}','schemaid='+id);

    schemaDb.conn.query(commonDelete);

    var commonDelete = await(getQuery('mysql','delete','commonDelete'));
    commonDelete = commonDelete.replace('{{ table_name }}','tbl_property');
    commonDelete = commonDelete.replace('{{ where }}','entity_id IN('+resDeleteSchemaData+')');

    schemaDb.conn.query(commonDelete);

    // insert data in entity table

    var entitydata = async(function () {
      var promises = []

      table_name = data.title.replace(' ', '_');

      _.forEach(data.entity, function (entity,index) {

        if(entity.customtype)
        {
          customtype = 1;
        }
        else{
          customtype = 0;
        }

        var entityQuery = await(getQuery('mysql','insert','commonInsert'));
        entityQuery = entityQuery.replace('{{ table_name }}','tbl_entity');
        entityQuery = entityQuery.replace('{{ fields }}','name,type,customtype,notes,schemaid');

        var values = "'"+entity.name.replace(' ', '_')+"'"+","+"'"+entity.type+"'"+","+"'"+customtype+"'"+","+"'"+entity.notes+"'"+","+"'"+id+"'";

        entityQuery = entityQuery.replace('{{ values }}',values);

        var process = new Promise((resolve, reject) => {
          schemaDb.conn.query(entityQuery, function (error, result, fields) {
            error? reject(error) : resolve(result.insertId)
          })
        })
        promises.push(process);
      });

      return Promise.all(promises).then(content => {
        return _.union(content)
      });
    })
    var entityResponse = await (entitydata())
    // end - insert data in entity table

    // insert data in property table

    var propertydata = async(function () {
      _.forEach(data.entity, function (entity,index) {
        return new Promise((resolve, reject) => {

          let properties = entity.property;

          let min = properties.min||'0';
          let max = properties.max||'0';
          let mindate = properties.mindate||'';
          let maxdate = properties.maxdate||'';
          let allowedValue = JSON.stringify(properties.allowedValue)||[];
          let defaultValue = properties.defaultValue||'';
          let placeholder = properties.placeholder||'';
          let helper = properties.helper||'';
          let regEx = properties.regEx||'';
          let optional = properties.optional||'';
          let options = JSON.stringify(properties.options)||[];
          let IsArray = properties.IsArray||'';

          var propertyQuery = await(getQuery('mysql','insert','commonInsert'));
          propertyQuery = propertyQuery.replace('{{ table_name }}','tbl_property');
          propertyQuery = propertyQuery.replace('{{ fields }}','min,max,mindate,maxdate,allowed_value,default_value,helper,regex,placeholder,optional,options,IsArray,entity_id');

          var values = "'"+min+"'"+","+"'"+max+"'"+","+"'"+mindate+"'"+","+"'"+maxdate+"'"+","+"'"+allowedValue+"'"+","+"'"+defaultValue+"'"+","+"'"+helper+"'"+","+"'"+regEx+"'"+","+"'"+placeholder+"'"+","+"'"+optional+"'"+","+"'"+options+"'"+","+"'"+IsArray+"'"+","+"'"+entityResponse[index]+"'";

          propertyQuery = propertyQuery.replace('{{ values }}',values);

          schemaDb.conn.query(propertyQuery, function (error, result, fields) {
            error? reject(error) : resolve(result.insertId)
          })
        }).then(content => {
          return content;
        }).catch(err=> {
          return err;
        })
      });
    })
    var propertyResponse = await (propertydata())
    // end - insert data in property table


    var updateSchemaData = async(function () {
      var promises = []

      table_name = data.title.replace(' ', '_');

      new_fields=[]

      _.forEach(data.entity, function (entity,index) {

        if(entity.name != 'id' && entity.name != '_id')
        {
          new_fields.push(entity.name.replace(' ', '_'));

          var checkColumn = await(getQuery('mysql','select','checkColumn'));
          checkColumn = checkColumn.replace('{{ table_name }}','information_schema.COLUMNS');
          checkColumn = checkColumn.replace('{{ tableName }}',table_name);
          checkColumn = checkColumn.replace('{{ fields }}','*');
          checkColumn = checkColumn.replace('{{ database_name }}',dbName.dbname);
          checkColumn = checkColumn.replace('{{ column_name }}',entity.name.replace(' ', '_'));


          var process = new Promise((resolve, reject) => {
            schemaDb.conn.query(checkColumn, function (error, result, fields) {
              error? reject(error) : result.length == 0 ? resolve(entity.name.replace(' ', '_')) : resolve('')
            })
          })
        }

        promises.push(process);
      });

      return Promise.all(promises).then(content => {
        return _.union(content)
      });
    })

    var updateSchemaDataResponse = await (updateSchemaData())

    _.forEach(updateSchemaDataResponse, function (field,index) {
        if(field != "")
        {
          var alterTableAndAddField = await(getQuery('mysql','alter','alterTableAndAddField'));
          alterTableAndAddField = alterTableAndAddField.replace('{{ table_name }}',table_name);
          alterTableAndAddField = alterTableAndAddField.replace('{{ field }}',field);
          alterTableAndAddField = alterTableAndAddField.replace('{{ type }}','TEXT NULL DEFAULT NULL');
          alterTableAndAddField = alterTableAndAddField.replace('{{ after }}','');

          selectedDB.conn.query(alterTableAndAddField);
        }
    })

    difference = _.difference(data.old_fields,new_fields)

    _.forEach(difference, function (value,index) {
      var dropField = await(getQuery('mysql','alter','dropField'));
      dropField = dropField.replace('{{ table_name }}',table_name);
      dropField = dropField.replace('{{ field }}',value);

      selectedDB.conn.query(dropField);
    })

    return id;
  }),
  putflowsInstance: async(function (id, data, tableName, inst_id) {
    console.log('mysql put flowsInstance');

    // var selectedDB = _.find(db, (d) => {
    //   return d.id == data.database[1]
    // })
    var selectedDB = _.find(db, (d) => {
      return d.id == inst_id
    })
   
    // var resSchema = await (getSchemaOriginalId(parseInt(data.Schemaid), selectedDB))

    // var schemaid = resSchema[0];

    // var res = await (schemadataWithId(schemaid, selectedDB))

    var schemadata = function () {
      var result = []
      var tableFields='';
      k=0;

      _.forEach(data, function (d,key) {
        if(key != 'Schemaid' && key != '_id' && key != 'id' && key != 'database')
        {
          if(k==0)
          {
            if(typeof d == 'object')
            {
              tableFields += key+"='"+JSON.stringify(d)+"'";
            }
            else {
              tableFields += key+"='"+d+"'";
            }
          }
          else
          {
            if(typeof d == 'object')
              {
                tableFields += ","+key+"='"+JSON.stringify(d)+"'";
              }
              else {
                tableFields += ","+key+"='"+d+"'";
              }
          }
          k++;
        }
      })

      return new Promise((resolve, reject) => {
        var commonUpdate = await(getQuery('mysql','update','commonUpdate'));
        commonUpdate = commonUpdate.replace('{{ table_name }}',tableName);
        commonUpdate = commonUpdate.replace('{{ fields }}',tableFields);
        commonUpdate = commonUpdate.replace('{{ where }}','id='+id);

        selectedDB.conn.query(commonUpdate, function (error, result, fields) {
          error? reject(error) : resolve(data.id)
        })
      }).then(content => {
        return content;
      }).catch(err=> {
        return err;
      })
    };
    var res = await (schemadata())
    return res;

  }),
  deleteSchema: async(function () {
    console.log('mysql delete allSchema');
  }),

  deleteThisSchema: async(function (id,type) {
    console.log('-----------mysql delete schema--------------'+id+'----'+type);


    if(type == 'softdel') {
      var schemadata = async(function () {
        var result = []

        var commonUpdate = await(getQuery('mysql','update','commonUpdate'));
        commonUpdate = commonUpdate.replace('{{ table_name }}','tbl_schema');
        commonUpdate = commonUpdate.replace('{{ fields }}','isdeleted=1');
        commonUpdate = commonUpdate.replace('{{ where }}','id='+id);

        var data = await (defaultDb[0].conn.query(commonUpdate))
        return result;
      });
      var res = await (schemadata())
      return res;
    }
  }),
  deleteThisflowsInstance: async(function (id, tableName, inst_id) {
    console.log('mysql delete flowsInstance');
    var selectedDB = _.find(db, (d) => {
        return d.id == inst_id
    })

    var commonDelete = await(getQuery('mysql','delete','commonDelete'));
    commonDelete = commonDelete.replace('{{ table_name }}',tableName);
    commonDelete = commonDelete.replace('{{ where }}','id='+id);

    selectedDB.conn.query(commonDelete);

    return id;
  })
}
