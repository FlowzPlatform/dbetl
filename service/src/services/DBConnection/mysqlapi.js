var mysql = require('mysql');
let _ = require('lodash');
var db1 = require('./db');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var endecrypt = require('../encryption/security')
var db = [];

db1.mysql.dbinstance.forEach(function (instance, inx) {
  if (instance.isenable) {
    var pass = endecrypt.decrypt(instance.password)
    var connection = mysql.createConnection({
      host     : instance.host,
      user     : instance.username,
      password : pass,
      database : instance.dbname
    });
     
    connection.connect();

    db.push({ id: instance.id, conn: connection })
  }
})

var schemadataWithId = async(function (id, selectedDB) {
  var result = []

  return new Promise((resolve, reject) => {
    selectedDB.conn.query('SELECT * from tbl_schema where id='+id, function (error, results, fields) {
      _.forEach(results, function (instance) {
        var table_name = instance.title.replace(' ', '_');
        console.log('table_name', table_name);
        result.push(table_name) 
      })
      resolve(result)
    })
  }).then(content => {
    return content;
  }).catch(err=> {
    return err;
  })
});

var tabledataWithId = async(function (table_name, id, selectedDB) {
  var result1 = []

  return new Promise((resolve, reject) => {
    selectedDB.conn.query('SELECT _id from '+table_name+' where id='+id, function (error, results, fields) {
      _.forEach(results, function (instance) {
        result1.push(instance._id);
        console.log('result1', result1);
        
      })
      resolve(result1)
    })
  }).then(content => {
    return content;
  }).catch(err=> {
    return err;
  })
});

var schemadetailWithId = async(function (id, selectedDB) {
  var result1 = []

  return new Promise((resolve, reject) => {
    selectedDB.conn.query('SELECT title,database_name from tbl_schema where id='+id, function (error, results, fields) {
      _.forEach(results, function (instance) {
        result1.push(instance);
      })
      resolve(result1)
    })
  }).then(content => {
    return content;
  }).catch(err=> {
    return err;
  })
});

var schemaTabledata = async(function (selectedDB) {
  var result = []

  return new Promise((resolve, reject) => {
    selectedDB.conn.query("SELECT s.id,s.title,s.database_name,GROUP_CONCAT(e.name SEPARATOR '||') as name,GROUP_CONCAT(e.type SEPARATOR '||')as type,GROUP_CONCAT(e.customtype SEPARATOR '||') as customtype FROM tbl_schema as s join tbl_entity as e on s.id=e.schemaid GROUP BY s.id", function (error, results, fields) {
      _.forEach(results, function (instance) {
        result.push(instance);
      })
      resolve(result)
    })
  }).then(content => {
    return content;
  }).catch(err=> {
    return err;
  })
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
  getSchema: async(function () {
    console.log('mysql get Schema');
    
    var schemadata = async(function () {
      var result = []
      var promises = []
      
      for(var dbinstance of db) {
        var process = new Promise((resolve, reject) => { 
          dbinstance.conn.query("SELECT s.id,s.title,s.database_name,s.isdeleted,GROUP_CONCAT(e.id SEPARATOR '||') as entityid,GROUP_CONCAT(e.name SEPARATOR '||') as name,GROUP_CONCAT(e.type SEPARATOR '||') as type,GROUP_CONCAT(e.customtype SEPARATOR '||') as customtype,GROUP_CONCAT(e.notes SEPARATOR '||') as notes,GROUP_CONCAT(p.IsArray SEPARATOR '||') as IsArray,GROUP_CONCAT(p.allowed_value SEPARATOR '||') as allowed_value,GROUP_CONCAT(p.default_value SEPARATOR '||') as default_value,GROUP_CONCAT(p.helper SEPARATOR '||') as helper,GROUP_CONCAT(p.max SEPARATOR '||') as max,GROUP_CONCAT(p.min SEPARATOR '||') as min,GROUP_CONCAT(p.maxdate SEPARATOR '||') as maxdate,GROUP_CONCAT(p.mindate SEPARATOR '||') as mindate,GROUP_CONCAT(p.optional SEPARATOR '||') as optional,GROUP_CONCAT(p.options SEPARATOR '||') as options,GROUP_CONCAT(p.placeholder SEPARATOR '||') as placeholder,GROUP_CONCAT(p.regEx SEPARATOR '||') as regEx FROM `tbl_schema` as s join tbl_entity as e on s.id=e.schemaid join tbl_property as p on e.id=p.entity_id GROUP BY s.id", function (error, results, fields) {
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
                  instance['entity'] = {'name':name[key],'type':parseInt(type[key]),'notes':notes[key],'customtype': true};
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
      }
      
      // _.forEach(db, function (dbinstance) {
      //   var r = await (dbinstance.conn.query('SELECT s.id as schema_id,s.title,s.database_name,e.id as entityid,e.name,e.type,e.notes,p.* FROM `tbl_schema` as s join tbl_entity as e on s.id=e.schemaid join tbl_property as p on e.id=p.entity_id', function (error, results, fields) {
      //     if (error) throw error;
      //     // console.log('rr',results);
      //     var current_schema_id='';
      //     var previous_instance=[];

      //     _.forEach(results, function (instance,key) {
            
      //       if(current_schema_id == '')
      //       {
      //         current_schema_id = instance.schema_id;
      //       }
            
      //       instance['entity'] = {'name':instance.name,'type':instance.type,'notes':instance.notes};
      //       instance['entity']['property'] = {'IsArray': instance.IsArray ,'allowedValue': JSON.parse(instance.allowed_value),'defaultValue': instance.default_value,'helper': instance.helper,'max': instance.max,'maxdate': instance.maxdate,'min': instance.min,'mindate': instance.mindate,'optional': JSON.parse(instance.optional),'options': JSON.parse(instance.options),'placeholder': instance.placeholder,'regEx': instance.regEx};
            
      //       if(current_schema_id == instance.schema_id)
      //       {
      //         entity_result.push(instance['entity']);
      //         previous_instance = instance;
      //       }
      //       else
      //       {
      //         previous_instance['entity'] = entity_result;
      //         previous_instance['database_name'] = JSON.parse(previous_instance['database_name'])
      //         result.push(previous_instance);
      //         entity_result = [];  
      //         current_schema_id = instance.schema_id;
      //         entity_result.push(instance['entity']);
      //         previous_instance = instance;
      //       }
      //     })
      //     previous_instance['entity'] = entity_result;
      //     previous_instance['database_name'] = JSON.parse(previous_instance['database_name'])
      //     result.push(previous_instance);
      //   }))
      // })
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
      // var entity_result = []
     
      // _.forEach(db, function (dbinstance) {
      //   var r = await (dbinstance.conn.query('SELECT s.id as schema_id,s.title,s.database_name,e.id as entityid,e.name,e.type,e.notes,p.* FROM `tbl_schema` as s join tbl_entity as e on s.id=e.schemaid join tbl_property as p on e.id=p.entity_id where s.id='+id, function (error, results, fields) {
      //     if (error) throw error;
      //     // console.log('rr',results);
      //     _.forEach(results, function (instance,key) {
      //       instance['entity'] = {'name':instance.name,'type':instance.type,'notes':instance.notes};
      //       instance['entity']['property'] = {'IsArray': instance.IsArray ,'allowedValue': JSON.parse(instance.allowed_value),'defaultValue': instance.default_value,'helper': instance.helper,'max': instance.max,'maxdate': instance.maxdate,'min': instance.min,'mindate': instance.mindate,'optional': JSON.parse(instance.optional),'options': JSON.parse(instance.options),'placeholder': instance.placeholder,'regEx': instance.regEx};
      //       // _.forEach(instance, function (value,key) {
      //       //   {
      //       //     try {
      //       //       instance[key] = JSON.parse(value)                                                  
      //       //     } catch (e) {
      //       //     }
      //       //   }
      //       // })
      //       entity_result.push(instance['entity'])
            
      //       if(results.length-1 == key)
      //       {
      //         instance['entity'] = entity_result;
      //         instance['database_name'] = JSON.parse(instance['database_name'])
      //         result.push(instance);
      //       }
      //       // console.log('result',result);
      //     })
      //   }))
      // })


      var promises = []
      
      for(var dbinstance of db) {
      //_.forEach(db, function (dbinstance) {
        var process = new Promise((resolve, reject) => { 
          dbinstance.conn.query("SELECT s.id,s.title,s.database_name,s.isdeleted,GROUP_CONCAT(e.id SEPARATOR '||') as entityid,GROUP_CONCAT(e.name SEPARATOR '||') as name,GROUP_CONCAT(e.type SEPARATOR '||') as type,GROUP_CONCAT(e.customtype SEPARATOR '||') as customtype,GROUP_CONCAT(e.notes SEPARATOR '||') as notes,GROUP_CONCAT(p.IsArray SEPARATOR '||') as IsArray,GROUP_CONCAT(p.allowed_value SEPARATOR '||') as allowed_value,GROUP_CONCAT(p.default_value SEPARATOR '||') as default_value,GROUP_CONCAT(p.helper SEPARATOR '||') as helper,GROUP_CONCAT(p.max SEPARATOR '||') as max,GROUP_CONCAT(p.min SEPARATOR '||') as min,GROUP_CONCAT(p.maxdate SEPARATOR '||') as maxdate,GROUP_CONCAT(p.mindate SEPARATOR '||') as mindate,GROUP_CONCAT(p.optional SEPARATOR '||') as optional,GROUP_CONCAT(p.options SEPARATOR '||') as options,GROUP_CONCAT(p.placeholder SEPARATOR '||') as placeholder,GROUP_CONCAT(p.regEx SEPARATOR '||') as regEx FROM `tbl_schema` as s join tbl_entity as e on s.id=e.schemaid join tbl_property as p on e.id=p.entity_id where s.id="+id+" GROUP BY s.id", function (error, results, fields) {
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


      // _.forEach(db, function (dbinstance) {
      //   var r = await (dbinstance.conn.query("SELECT s.id,s.title,s.database_name,GROUP_CONCAT(e.id SEPARATOR '||') as entityid,GROUP_CONCAT(e.name SEPARATOR '||') as name,GROUP_CONCAT(e.type SEPARATOR '||') as type,GROUP_CONCAT(e.customtype SEPARATOR '||') as customtype,GROUP_CONCAT(e.notes SEPARATOR '||') as notes,GROUP_CONCAT(p.IsArray SEPARATOR '||') as IsArray,GROUP_CONCAT(p.allowed_value SEPARATOR '||') as allowed_value,GROUP_CONCAT(p.default_value SEPARATOR '||') as default_value,GROUP_CONCAT(p.helper SEPARATOR '||') as helper,GROUP_CONCAT(p.max SEPARATOR '||') as max,GROUP_CONCAT(p.min SEPARATOR '||') as min,GROUP_CONCAT(p.maxdate SEPARATOR '||') as maxdate,GROUP_CONCAT(p.mindate SEPARATOR '||') as mindate,GROUP_CONCAT(p.optional SEPARATOR '||') as optional,GROUP_CONCAT(p.options SEPARATOR '||') as options,GROUP_CONCAT(p.placeholder SEPARATOR '||') as placeholder,GROUP_CONCAT(p.regEx SEPARATOR '||') as regEx FROM `tbl_schema` as s join tbl_entity as e on s.id=e.schemaid join tbl_property as p on e.id=p.entity_id where s.id="+id+" GROUP BY s.id", function (error, results, fields) {
      //     if (error) throw error;
          
      //     _.forEach(results, function (instance,key) {
      //       var entity_result=[]
      //       var old_fields=[]
      //       let name = instance.name.split("||");
      //       let type = instance.type.split("||");
      //       let customtype = instance.customtype.split("||");
      //       let notes = instance.notes.split("||");
            
      //       let IsArray = instance.IsArray.split("||");
      //       let allowed_value = instance.allowed_value.split("||");
      //       let default_value = instance.default_value.split("||");

      //       let helper = instance.helper.split("||");
      //       let min = instance.min.split("||");
      //       let max = instance.max.split("||");

      //       let mindate = instance.mindate.split("||");
      //       let maxdate = instance.maxdate.split("||");
      //       let optional = instance.optional.split("||");
      //       let options = instance.options.split("||");
      //       let placeholder = instance.placeholder.split("||");
      //       let regEx = instance.regEx.split("||");

      //       _.forEach(name, function (nameArray,key) {

      //         if(customtype[key] == 1)
      //         {
      //           instance['entity'] = {'name':name[key],'type':parseInt(type[key]),'notes':notes[key],'customtype': true};
      //         }
      //         else
      //         {
      //           instance['entity'] = {'name':name[key],'type':type[key],'notes':notes[key],'customtype': false};                
      //         }
      //         instance['entity']['property'] = {'IsArray': IsArray[key],'allowedValue': JSON.parse(allowed_value[key]),'defaultValue': default_value[key],'helper': helper[key],'max': JSON.parse(max[key]),'maxdate': maxdate[key],'min': JSON.parse(min[key]),'mindate': mindate[key],'optional': JSON.parse(optional[key]),'options': JSON.parse(options[key]),'placeholder': placeholder[key],'regEx': regEx[key]};
      //         entity_result.push(instance['entity']);
      //         old_fields.push(nameArray);
      //       })

      //       instance['entity'] = entity_result;
      //       instance['old_title'] = instance['title'];
      //       instance['old_fields'] = old_fields;
      //       instance['database_name'] = JSON.parse(instance['database_name'])
      //       instance['database'] = instance['database_name']
      //       instance['_id'] = instance['id']
            
      //       result.push(instance);  
      //     })
          
      //   }))
      // })
      // return result;

      return Promise.all(promises).then(content => {
        return _.union(...content)
      });
    });
    var res = await (schemadata())
    console.log('schemadata getSchema',res);
    return res;
  }),
  getflowsInstance: async(function () {
    console.log('mysql get flowsInstance');

    var flowsInstance = async(function () {
      var result = []
      var promises = []

      for(var dbinstance of db) {

        var res = await (schemaTabledata(dbinstance))
        
        //instanceVal1 = {};
        
          // console.log('rr', res);
        _.forEach(res, function (r) {

          let name = r.name.split("||");
          let type = r.type.split("||");
          let customtype = r.customtype.split("||");
          
          _.forEach(name, function (nameArray,key) {

            if(customtype[key] == 1)
            {
              console.log('true', parseInt(type[key]));
              var detailSchema = await (schemadetailWithId(parseInt(type[key]), dbinstance))
              console.log('detailSchema', detailSchema);
            }
            else
            {
              console.log('false');
            }
          })

            instanceVal1 = [];

            var process = new Promise((resolve, reject) => {
              dbinstance.conn.query("SELECT * from "+r.title, function (error, results, fields) {
                if (error) throw error;
                _.forEach(results, function (rs) {
                  instanceVal = {};         
                  //instanceVal['title'] = r.title;
                  instanceVal['database'] = JSON.parse(r.database_name);
                  instanceVal['Schemaid'] = r.id;
                  _.forEach(rs, function (rs1,key) {
                    try {
                        instanceVal[key] = JSON.parse(rs1);
                      } catch (e) {
                        instanceVal[key] = rs1;                        
                      }
                  })
                  instanceVal1.push(instanceVal);
                })
                resolve(instanceVal1)
              })
            })
            promises.push(process)
        })
      }
      
      console.log('promises', promises)
      return Promise.all(promises).then(content => {
        return _.union(...content)
      });
      //return result;
    })

    var res = await (flowsInstance())
    return res;
  }),
  getThisflowsInstance: async(function (id,Schemaid) {
    console.log('mysql get flowsInstanceCurrent');
  
    var flowsInstance = async(function () {
      var result = []
      var promises = []
      _.forEach(db, function (dbinstance) {

        ///////////////////////////////////////////////  Using Schemaid //////////////////////////////////////////////////////////
        
        // var res = await (schemadetailWithId(Schemaid,dbinstance))
        // var rs = res[0];
        // table_name = rs.title.replace(' ', '_');
    
        // console.log(table_name);
        // instanceVal1 = [];
        
        // var process = new Promise((resolve, reject) => {
        //   dbinstance.conn.query("SELECT * from "+table_name+" where id="+id, function (error, results, fields) {
        //     if (error) throw error;
        //     _.forEach(results, function (instance) {
        //       instanceVal = {};         

        //       instanceVal['database'] = JSON.parse(rs.database_name);
        //       instanceVal['Schemaid'] = Schemaid;
              
        //       _.forEach(rs, function (rs1,key) {
        //         try {
        //             instanceVal[key] = JSON.parse(rs1);
        //           } catch (e) {
        //             instanceVal[key] = rs1;                        
        //           }
        //       })
        //       instanceVal1.push(instanceVal);
        //     })
        //     resolve(instanceVal1)
        //   })
        // })

        ///////////////////////////////////////////////  Using Schemaid //////////////////////////////////////////////////////////

        var res = await (schemaTabledata(dbinstance))
        
          // console.log('rr', res);
        _.forEach(res, function (r) {

          instanceVal1 = [];
          
          var process = new Promise((resolve, reject) => {
            var table_name = r.title.replace(' ', '_');
            
            dbinstance.conn.query("SELECT * from "+table_name+" where _id='"+id+"'", function (error, results, fields) {
              if (error) throw error;

              if(results.length>0)
              {
                _.forEach(results, function (instance) {
                  instanceVal = {};         
    
                  instanceVal['database'] = JSON.parse(r.database_name);
                  instanceVal['Schemaid'] = r.id;
                  
                  _.forEach(instance, function (rs1,key) {
                    try {
                        instanceVal[key] = JSON.parse(rs1);
                      } catch (e) {
                        instanceVal[key] = rs1;                        
                      }
                  })
                  instanceVal1.push(instanceVal);
                })
              }
              resolve(instanceVal1)
            })
          })
          
          promises.push(process)

        })
      })
      //return result;

      //console.log('promises', promises)
      return Promise.all(promises).then(content => {
        return _.union(...content)
      });

    });
    var res = await (flowsInstance())
    return res;
  }),
  //post methods
  postSchema: async(function (data) {
    console.log('mysql post Schema');
    let database_name = JSON.stringify(data.database)

    var selectedDB = _.find(db, (d) => {
      return d.id == data.database[1]
    })
    var sql = "INSERT INTO tbl_schema (title,database_name) VALUES ('"+data.title+"','"+database_name+"')";

    var schemadata = async(function () {
      var result = []
      var schema = await (selectedDB.conn.query(sql, function (err, results) {
        if (err) throw err;
        console.log('last inserted:'+results.insertId);
        table_name = data.title.replace(' ', '_');
        fields="";
        _.forEach(data.entity, function (entity,index) {

          var isLastElement = index == data.entity.length -1;
          if(isLastElement)
            fields += entity.name+" Text";
          else
            fields += entity.name+" Text,";
          
          if(isLastElement)
          {
            sql = "CREATE TABLE IF NOT EXISTS "+table_name+" ("+fields+")";
            selectedDB.conn.query(sql);
            sql = "SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '"+table_name+"' AND COLUMN_NAME = 'id'";
            isexist = selectedDB.conn.query(sql, function (err, results) {
              if(results.length == 1)
              {
                var sql = "ALTER TABLE "+table_name+" DROP id";
                selectedDB.conn.query(sql);
              }
              var sql = "ALTER TABLE "+table_name+" ADD id INT(11) NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (id);";
              selectedDB.conn.query(sql); 
            })

            sql = "SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '"+table_name+"' AND COLUMN_NAME = '_id'";
            isexist = selectedDB.conn.query(sql, function (err, results) {
              if(results.length == 1)
              {
                var sql = "ALTER TABLE "+table_name+" DROP _id";
                selectedDB.conn.query(sql);
              }
              var sql = "ALTER TABLE "+table_name+" ADD _id Varchar(255) NOT NULL  AFTER id";
              selectedDB.conn.query(sql);  
            })
          }

          if(entity.customtype)
          {
            console.log('true')
            customtype = 1;
          }
          else{
            console.log('false')
            customtype = 0;
          }
          var sql = "INSERT INTO tbl_entity (name,type,customtype,notes,schemaid) VALUES ('"+entity.name+"','"+entity.type+"',"+customtype+",'"+entity.notes+"','"+results.insertId+"')";
          selectedDB.conn.query(sql, function (err, entity_result) {
            if (err) throw err;
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

              var sql = "INSERT INTO tbl_property (min,max,mindate,maxdate,allowed_value,default_value,helper,regex,placeholder,optional,options,IsArray,entity_id) VALUES ('"+min+"','"+max+"','"+mindate+"','"+maxdate+"','"+allowedValue+"','"+defaultValue+"','"+placeholder+"','"+helper+"','"+regEx+"','"+optional+"','"+options+"','"+IsArray+"','"+entity_result.insertId+"')";
              selectedDB.conn.query(sql, function (err, property_result) {
                if (err) throw err;
              });

          });
        })
        result.push(results.insertId)
      }))
      return result     
    });
    var res = await (schemadata())
    return res;
  }),
  postflowsInstance: async(function (data) {
    var selectedDB = _.find(db, (d) => {
      return d.id == data.database[1]
    })

    var res = await (schemadataWithId(data.Schemaid, selectedDB))
    table_name = res[0];

    var schemadata = function () {
      var result = []
      var tableFields='';
      k=0;  

      _.forEach(data, function (d,key) {
        if(key != 'Schemaid' && key != 'database')
        {
          if(k==0)
          {
            let res = await (UUID())
            let uuid = res;

            tableFields += key+"='"+d+"'";
            tableFields += ",_id='"+uuid+"'";
          }
          else
          {
            if(typeof d == 'object')
            {
              tableFields += ","+key+"='"+JSON.stringify(d)+"'";
            }
            else{
              tableFields += ","+key+"='"+d+"'";              
            }
          }
          k++; 
        }
      })
    
      return new Promise((resolve, reject) => {
        selectedDB.conn.query("INSERT INTO "+table_name+" SET "+tableFields, function (error, result, fields) {
          error? reject(error) : resolve(result.insertId)
        })
      }).then(content => {
        return content;
      }).catch(err=> {
        return err;
      })
    };
    var res = await (schemadata())

    var tableDetail = await (tabledataWithId(table_name, res, selectedDB));
    return tableDetail[0];
  }),
  //put methods
  putSchema: async(function (data, id) {
    console.log('mysql put Schema');
    
    let database_name = JSON.stringify(data.database)
    let entity = JSON.stringify(data.entity)

    var selectedDB = _.find(db, (d) => {
      return d.id == data.database[1]
    })

    if(data.old_title != data.title)
    {
      var sql = "RENAME Table "+data.old_title+" TO "+data.title;
      selectedDB.conn.query(sql);
    }
    // console.log("=============="+JSON.stringify(selectedDB))

    // var sql = "UPDATE tbl_schema SET title='"+data.title+"',database_name='"+database_name+"',entity='"+entity+"' WHERE id="+id;

    // var schemadata = async(function () {
    //   var result = []
    //   var schema = await (selectedDB.conn.query(sql, function (err, results) {
    //     if (err) throw err;
    //     console.log('results');
    //     console.log(results.insertId);
    //     result.push(results.insertId)
    //     // _.forEach(results, function (instance) {
    //     //   result.push(instance)
    //     // })
    //     //console.log("1 record inserted");
    //   }))
    //   return result      
    // });
    var sql = "UPDATE tbl_schema SET title='"+data.title+"',database_name='"+database_name+"' WHERE id="+id;
    
    var schemadata = async(function () {
      var result = []
      var schema = await (selectedDB.conn.query(sql, function (err, results) {
        if (err) throw err;

        var sql = "SELECT GROUP_CONCAT(e.id) as entityid FROM tbl_entity as e where schemaid="+id+" GROUP BY schemaid";
        
        selectedDB.conn.query(sql, function (err, entity_ids) {
          if (err) throw err;
          
          var sql = "DELETE FROM tbl_entity where schemaid="+id;
          selectedDB.conn.query(sql);
          
          var sql = "DELETE FROM tbl_property where entity_id IN("+entity_ids[0].entityid+")";
          selectedDB.conn.query(sql);
          
          table_name = data.title.replace(' ', '_');
          new_fields=[]
          _.forEach(data.entity, function (entity,index) {

            if(entity.name != 'id' && entity.name != '_id')
            {
              new_fields.push(entity.name);
              var sql = "SELECT * FROM information_schema.COLUMNS WHERE TABLE_NAME = '"+table_name+"' AND COLUMN_NAME = '"+entity.name+"'";
              isexist = selectedDB.conn.query(sql, function (err, results) {
                if(results.length == 0)
                {
                  var sql = "ALTER TABLE "+table_name+" ADD "+entity.name+" TEXT NULL DEFAULT NULL";
                  selectedDB.conn.query(sql);
                } 
              })
            }  
            
            if(entity.customtype)
            {
              console.log('true')
              customtype = 1;
            }
            else{
              console.log('false')
              customtype = 0;
            }

            var sql = "INSERT INTO tbl_entity (name,type,customtype,notes,schemaid) VALUES ('"+entity.name+"','"+entity.type+"',"+customtype+",'"+entity.notes+"','"+id+"')";
            selectedDB.conn.query(sql, function (err, entity_result) {
              if (err) throw err;
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
  
                var sql = "INSERT INTO tbl_property (min,max,mindate,maxdate,allowed_value,default_value,helper,regex,placeholder,optional,options,IsArray,entity_id) VALUES ('"+min+"','"+max+"','"+mindate+"','"+maxdate+"','"+allowedValue+"','"+defaultValue+"','"+placeholder+"','"+helper+"','"+regEx+"','"+optional+"','"+options+"','"+IsArray+"','"+entity_result.insertId+"')";
                selectedDB.conn.query(sql, function (err, property_result) {
                  if (err) throw err;
                });
  
            });
          })
          difference = _.difference(data.old_fields,new_fields)
          _.forEach(difference, function (value,index) {
            var sql = "ALTER TABLE "+table_name+" DROP "+value;
            selectedDB.conn.query(sql);
          })
        });
        result.push(results.insertId)
      }))
      return result     
    });

    var res = await (schemadata())
    return res;
  }),
  putflowsInstance: async(function (data, id) {
    console.log('mysql put flowsInstance');

    var selectedDB = _.find(db, (d) => {
      return d.id == data.database[1]
    })
    
    var res = await (schemadataWithId(id, selectedDB))
    table_name = res[0];

    var schemadata = function () {
      var result = []
      var tableFields='';
      k=0;  

      _.forEach(data, function (d,key) {
        if(key != 'schemaid' && key != 'database')
        {
          if(k==0)
            tableFields += key+"='"+d+"'";
          else
            tableFields += ","+key+"='"+d+"'";
          k++; 
        }
      })

      return new Promise((resolve, reject) => {
        selectedDB.conn.query("UPDATE "+table_name+" SET "+tableFields+" where id="+data.id, function (error, result, fields) {
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
  deleteThisSchema: async(function (id,type) {
    console.log('-----------mysql delete schema--------------'+id+'----'+type);


    if(type == 'softdel') {
      var schemadata = async(function () {
        var result = []
        _.forEach(db, function (dbinstance) {
          sql = 'UPDATE tbl_schema SET isdeleted=1 where id='+id;
          var data = await (dbinstance.conn.query(sql, function (err, results) {
            console.log('-------results-------', results);
          }))
          // _.forEach(data, function (instance) {
          //   result.push(instance)
          // })
        })
        return result;
      });
      var res = await (schemadata())
      // console.log('rethink delete res::', res);
      return res;
    }
  }),
  deleteThisflowsInstance: async(function (id) {
    console.log('mysql delete flowsInstance');
  })
}
