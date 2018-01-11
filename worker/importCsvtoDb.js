const Queue = require('rethinkdb-job-queue')
// const func = require('./function')
const app = require('./config')
// console.log('config::::', app, '>>>>>>>>>>>')
var axios = require('axios');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
const cxnOptions = app.rethinkdb
var pino = require('pino');
var mongodb = require('mongodb');
var elasticsearch = require('elasticsearch');
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var path = require('path');
var Datastore = require('nedb-promise');
var nedbpath = path.join(__dirname, '../service/nedb')
var Papa = require('papaparse');
// var aurl = 'http://' + job.configData.host + ':' + job.configData.port;
// var endecrypt = require('../service/src/services/encryption/security')			
var mysql = require('mysql');
var _ = require('lodash')

console.log('importCsvToDb Worker Started.....')
const qOptions = app.qOptions
qOptions.name = app.importCsvtoDb
const q = new Queue(cxnOptions, qOptions)

var createConn = async (function(data, mapdata) {
	// console.log('id................', data.id)
	// if(data.hasOwnProperty('id')) {
		// data.password = endecrypt.decrypt(data.password)
		// console.log(data.password)
	// }
	if(data.selectedDb == 'mongo') {
		var mongoDB;
	    if (data.username != "" && data.password != "") {
	      mongoDB = 'mongodb://' + data.username + ':' + data.password + '@' + data.host + ':' + data.port + '/' + data.dbname;
	    } else {
	      mongoDB = 'mongodb://' + data.host + ':' + data.port + '/' + data.dbname;
	    }
		var conn = await (MongoClient.connect(mongoDB))
		return {conn: conn, db: data.selectedDb}
	} else if(data.selectedDb == 'rethink') {
		console.log('rethink........................')
		var r = require('rethinkdbdash')({
		  username: data.username,
          password: data.password,
	      port: data.port,
	      host: data.host,
	      db: data.dbname
	    })
	    return {conn: r, db: data.selectedDb}
	} else if(data.selectedDb == 'elastic') {
		 var client = await (new elasticsearch.Client({
	        host: data.host + ':' + data.port
	      }))
      // console.log(client)
    	return {conn: client, db: data.selectedDb}
	} else if (data.selectedDb == 'nedb') {
		var nPath = path.join(nedbpath, '/' + data.dbname)
		return {conn: nPath, db: data.selectedDb}
	} else if(data.selectedDb == 'mysql') {
		// console.log('-----------import ------------',data);
		// var pass = endecrypt.decrypt(data.password)
		var connection = mysql.createConnection({
			host     : data.host,
			port     : data.port,
			user     : data.username,
			password : data.password,
			database : data.dbname
		});
		connection.connect();
		
		return {conn: connection, db: data.selectedDb}

	}
})

var getSourceData = async (function(url) {
	console.log('----URL---', url)
	// return new Promise((resolve, reject) => {
	// 	fs.readFile(url, function(err, data) {
	// 		if(err) {
	// 			reject(err)
	// 		} else {
	// 			resolve(data)
	// 		}
	// 	})
	// })
	return axios.get(url).then(res => {
		// console.log('response...', res.data)
		return res.data
	}).catch(err => {
		console.log('error...', err)
		return null
	})
})

var getQuery = async(function (dbName,type,queryFor) {
  let result = new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '../service/src/services/DBConnection/query.json'),function (err, data) {
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
})

var updateSchema = async( function(data,table_name,databse_name,conn) {
	var tableFields='';
	var tableValues='';
	k=0;
	
	_.forEach(data, function (d,key) {
        // if(key != 'Schemaid' && key != 'id' && key != '_id')
		if(key != 'id')
        {
          if(k==0)
          {
            // let res = await (UUID())
            // let uuid = res;

            tableFields += key.replace(' ', '_');
            

            if(typeof d == 'object')
              {
                tableValues += "'"+JSON.stringify(d)+"'";
              }
              else{
                tableValues += "'"+d+"'";
              }
              
          }
          else
          {
            if(typeof d == 'object')
            {
              tableFields += ','+key.replace(' ', '_');
              tableValues += ",'"+JSON.stringify(d)+"'";              
            }
            else{
              tableFields += ','+key.replace(' ', '_');
              tableValues += ",'"+d+"'";              
            }
          }
          k++; 
        }
	  })
	  // console.log('tableFields :: ', tableFields, '  tableValues::::: ', tableValues)
	  var columns = tableFields.split(",");
	  
	  var updateSchemaData = async(function () {
        var promises = []        
        new_fields=[]
    
        _.forEach(columns, function (entity,index) {
  
          if(entity != 'id')
          {
            var checkColumn = await(getQuery('mysql','select','checkColumn'));
            checkColumn = checkColumn.replace('{{ table_name }}','information_schema.COLUMNS');
            checkColumn = checkColumn.replace('{{ tableName }}',table_name);
            checkColumn = checkColumn.replace('{{ fields }}','*');
            checkColumn = checkColumn.replace('{{ database_name }}',databse_name);
            checkColumn = checkColumn.replace('{{ column_name }}',entity.replace(' ', '_'));
			// console.log('checkColumn..............', checkColumn)
            var process = new Promise((resolve, reject) => {
				conn.conn.query(checkColumn, function (error, result, fields) {
                error? reject(error) : result.length == 0 ? resolve(entity.replace(' ', '_')) : resolve('')
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

			conn.conn.query(alterTableAndAddField);
			}
		})
		
		// var commonInsert = await(getQuery('mysql','insert','commonInsert'));
		// commonInsert = commonInsert.replace('{{ table_name }}',table_name);
		// commonInsert = commonInsert.replace('{{ fields }}',tableFields);
		// commonInsert = commonInsert.replace('{{ values }}',tableValues);
		// console.log('commonInsert', commonInsert)
		// conn.conn.query(commonInsert);

    return "success";
})

q.process(async(job, next) => {
	try {
			// console.log('job.data\n ', JSON.stringify(job.data))
			console.log('---------------------||  Start  ||--------------------------')
			var a1 = new Date().toLocaleTimeString()
			console.log('.......All Start......', a1)
			var sourceData = await (getSourceData(job.data.source.file))
			// console.log('..sourceData....\n', sourceData)
			if(sourceData != null) {
				var _sres = await (Papa.parse(sourceData, {
		            header: true,
		            encoding: 'UTF-8'
		        }))
		        var sData = _sres.data 
				var tConn = await (createConn(job.data.target));
				if(job.data.target.selectedDb == 'mongo') {
					var _res = []
					var arrOfErr = []
					// var sId = await (getSchemaidByName(aurl, obj.target))
					var d1 = new Date().toLocaleTimeString()
					console.log('.......Start......', d1)
					// for (let [i, sObj] of job.data.source.entries()) {
						var s = await (tConn.conn.collection('mycsv5').insertMany(sData).then(res => {
							return res
						}).catch(err => {
							// console.log('.....>>>>>>>> ', err)
							arrOfErr.push({err: err})
							return err
						}))
						_res.push(s)
					// }
					var d2 = new Date().toLocaleTimeString()
					console.log('.......End......', d2)
					console.log('_error..............', arrOfErr)
					// await (sConn.conn.collection(obj.source).find().toArray())
				} else if(job.data.target.selectedDb == 'rethink') {
					var _res = []
					var arrOfErr = []
					// var sId = await (getSchemaidByName(aurl, obj.target))
					// console.log(sData)
					var d1 = new Date().toLocaleTimeString()
					console.log('.......Start......', d1)
					// for (let [i, sObj] of job.data.source.entries()) {
						var tname = 'mycsv2'
						var existTable = await (tConn.conn.tableList().contains(tname))
			    		if(!existTable) {
			    			var createTable = await (tConn.conn.tableCreate(tname)) 
			    		}
			    		console.log('existTable ' + tname + ' ==> ' + existTable)
						var s = await (tConn.conn.table(tname).insert(sData).run().then(res => {
							return res
						}).catch(err => {
							console.log('.....>>>>>>>> ', err)
							arrOfErr.push({err: err})
							return err
						}))
						_res.push(s)
					// }
					var d2 = new Date().toLocaleTimeString()
					console.log('.......End......', d2)
					// console.log('_error..............', arrOfErr)
					// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', _res)
					// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> arrOfErr', arrOfErr)
				} else if(job.data.target.selectedDb == 'elastic') {
					var _res = []
					var myarr = []
					var tname = 'mycsv1'
					var rs = { "index" : { "_index" : job.data.target.dbname, "_type" : tname} }
					for (let [i, sObj] of sData.entries()) {
						myarr.push(rs)
						myarr.push(sObj)
					}
					// console.log(myarr)
					var d1 = new Date().toLocaleTimeString()
					console.log('.......Start......', d1)
					var s = await (tConn.conn.bulk({
				        body: myarr 
				    }))
					_res.push(s)
					// console.log('_res...>> ', _res)
					var d2 = new Date().toLocaleTimeString()
					console.log('.......End......', d2)
				} else if(job.data.target.selectedDb == 'mysql') {
					var _res = []
					var tname = 'i50'
					var tableData = function () {
						var result = []
						
						return new Promise((resolve, reject) => {
							tConn.conn.query("SHOW TABLES LIKE '"+tname+"'", function (error, result, fields) {
							error? reject(error) : resolve(result.length)
						  })
						}).then(content => {
						  return content;
						}).catch(err=> {
						  return err;
						})     
					};
		  			var resTableData = await (tableData())
					var getDatabaseTables = await(getQuery('mysql','select','commonSelect'));
					getDatabaseTables = getDatabaseTables.replace('{{ table_name }}',tname+ ' LIMIT 1');
					getDatabaseTables = getDatabaseTables.replace('{{ fields }}','1');

					if(resTableData == 0)
					{
						var checkColumn = await(getQuery('mysql','create','createTable'));
						checkColumn = checkColumn.replace('{{ table_name }}',tname);
						checkColumn = checkColumn.replace('{{ fields }}','id text NOT NULL');
		
						tConn.conn.query(checkColumn);
		
						var checkColumn = await(getQuery('mysql','alter','changeFieldType'));
						checkColumn = checkColumn.replace('{{ table_name }}',tname);
						checkColumn = checkColumn.replace('{{ field }}','id');
						checkColumn = checkColumn.replace('{{ field1 }}','id');
						checkColumn = checkColumn.replace('{{ fieldType }}','INT(11) NOT NULL');
						
						tConn.conn.query(checkColumn);
						
						var checkColumn = await(getQuery('mysql','alter','addPrimaryKey'));
						checkColumn = checkColumn.replace('{{ table_name }}',tname);
						checkColumn = checkColumn.replace('{{ field }}','id');
						
						tConn.conn.query(checkColumn);
						
						var checkColumn = await(getQuery('mysql','alter','changeFieldType'));
						checkColumn = checkColumn.replace('{{ table_name }}',tname);
						checkColumn = checkColumn.replace('{{ field }}','id');
						checkColumn = checkColumn.replace('{{ field1 }}','id');
						checkColumn = checkColumn.replace('{{ fieldType }}','INT(11) NOT NULL AUTO_INCREMENT');
						
						tConn.conn.query(checkColumn);
					}
					// // if(sObj.hasOwnProperty('_id')) {
					// // 	sObj.id = (sObj._id).toString()
					// // 	sObj._id = sObj.id
					// // }
					
					// // var sId = await (getSchemaidByName(aurl, obj.target))

					var d1 = new Date().toLocaleTimeString()
					console.log('.......Start......', d1)
					// check table structure
					if (sData.length > 0) {
						var response = await (updateSchema(sData[0], tname, job.data.target.dbname,tConn))
					}
					// making bulk query for insert
					console.log('Query Start...')
					var myquery = 'INSERT INTO ' + tname + ' '
					for (let [i, sObj] of sData.entries()) {
						// console.log('.')
						if (i == 0) {
							var keysObj = '(' 
							for (let k in sObj) {
								var s = k.replace(' ', '_')
								keysObj += s + ','
							}
							keysObj = keysObj.slice(0, -1)
							keysObj += ')'
							myquery += keysObj
							myquery += ' VALUES '
							// if data has only one record
							if (i == sData.length-1) {
								var values = '('
								for(let k in sObj) {
									values += "'" + sObj[k]+ "'" + ','
								}
								values = values.slice(0, -1)
								values += ')'
								myquery += values + ','
							}
						} else {
							var values = '('
							for(let k in sObj) {
								values += "'" + sObj[k]+ "'" + ','
							}
							values = values.slice(0, -1)
							values += ')'
							myquery += values + ','
						}
						// _res.push(response)
					}
					myquery = myquery.slice(0, -1)
					myquery += ';'
					console.log('Query End...')
					// console.log('myquery>>>', myquery) 
					tConn.conn.query(myquery);
					var d2 = new Date().toLocaleTimeString()
					console.log('.......End......', d2)
					// 	// console.log('sObj',sObj,obj.target,job.data.target.dbname)
					// 	// return false;
					// 	// sObj.Schemaid = sId
					// 	var response = await (updateSchema(sObj, obj.target,job.data.target.dbname,tConn))
					// }
				}
			}

			console.log('-----------------------||  Done  ||------------------------')
		return next(null, 'success')
	} catch (err) {
		console.log('Error >>>>>>', err)
		pino().error(new Error('... error in process'))
		return next(new Error('error'))
	}
})
q.on('terminated', (queueId, jobId) => {
})
q.on('completed', (queueId, jobId, isRepeating) => {
})