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
// var aurl = 'http://' + job.configData.host + ':' + job.configData.port;
// var endecrypt = require('../service/src/services/encryption/security')			
var mysql = require('mysql');
var _ = require('lodash')

console.log('importToExternal Worker Started.....')
const qOptions = app.qOptions
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
	    if (mapdata != undefined) {
	    	for (let [i, mObj] of mapdata.entries() ) {
	    		// console.log(mObj.target)
	    		var existTable = await (r.tableList().contains(mObj.target))
	    		if(!existTable) {
	    			var createTable = await (r.tableCreate(mObj.target)) 
	    		}
	    		console.log('existTable ' + mObj.target + ' ==> ' + existTable)
	    	}
	    }
	    return {conn: r, db: data.selectedDb}
	} else if(data.selectedDb == 'elastic') {
		 var client = await (new elasticsearch.Client({
	        host: data.host + ':' + data.port
	      }))
		 // .ping({
	        // requestTimeout: 1000
	      // })
      // console.log(client)
      	// console.log('.......', client)
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
		
		if (mapdata != undefined) {
	    	for (let [i, mObj] of mapdata.entries() ) {
				var tableData = function () {
					var result = []
					
					return new Promise((resolve, reject) => {
						connection.query("SHOW TABLES LIKE '"+mObj.target+"'", function (error, result, fields) {
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
				getDatabaseTables = getDatabaseTables.replace('{{ table_name }}',mObj.target+ ' LIMIT 1');
				getDatabaseTables = getDatabaseTables.replace('{{ fields }}','1');

				if(resTableData == 0)
				{
					var checkColumn = await(getQuery('mysql','create','createTable'));
					checkColumn = checkColumn.replace('{{ table_name }}',mObj.target);
					checkColumn = checkColumn.replace('{{ fields }}','id text NOT NULL');
	
					connection.query(checkColumn);
	
					var checkColumn = await(getQuery('mysql','alter','changeFieldType'));
					checkColumn = checkColumn.replace('{{ table_name }}',mObj.target);
					checkColumn = checkColumn.replace('{{ field }}','id');
					checkColumn = checkColumn.replace('{{ field1 }}','id');
					checkColumn = checkColumn.replace('{{ fieldType }}','INT(11) NOT NULL');
					
					connection.query(checkColumn);
					
					var checkColumn = await(getQuery('mysql','alter','addPrimaryKey'));
					checkColumn = checkColumn.replace('{{ table_name }}',mObj.target);
					checkColumn = checkColumn.replace('{{ field }}','id');
					
					connection.query(checkColumn);
					
					var checkColumn = await(getQuery('mysql','alter','changeFieldType'));
					checkColumn = checkColumn.replace('{{ table_name }}',mObj.target);
					checkColumn = checkColumn.replace('{{ field }}','id');
					checkColumn = checkColumn.replace('{{ field1 }}','id');
					checkColumn = checkColumn.replace('{{ fieldType }}','INT(11) NOT NULL AUTO_INCREMENT');
					
					connection.query(checkColumn);
				}
				
			}
		}
		return {conn: connection, db: data.selectedDb}
	}
})

// var getSchemaidByName = async (function(url, name) {
// 	var _resi = await (axios.get(url +'/schema'))
// 	var schema = _resi.data
// 	for(let [i, obj] of schema.entries()) {
// 		if(obj.title == name) {
// 			return obj._id
// 		}
// 	}
// })

var getSchemaRecord = async(function (conn, tname) {
  var commonSelect = await(getQuery('mysql','select','commonSelect'));

  commonSelect = commonSelect.replace('{{ table_name }}',tname );
  commonSelect = commonSelect.replace('{{ fields }}','*');

  // console.log(getDatabaseTables)
  var tableList = function () {
    var result = []
    
    return new Promise((resolve, reject) => {
      conn.conn.query(commonSelect, function (error, result) {
        error? reject(error) : resolve(result)
      })
    }).then(content => {
      return content;
    }).catch(err=> {
      return err;
    })     
  };
  var resTableList = await (tableList())
  // conn.conn.end()
  // console.log('resTableList......', resTableList)
  if (resTableList != null ) {
    return resTableList
  } else {
    return []
  }
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
            let res = await (UUID())
            let uuid = res;

            tableFields += key;
            

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
		
		var commonInsert = await(getQuery('mysql','insert','commonInsert'));
		commonInsert = commonInsert.replace('{{ table_name }}',table_name);
		commonInsert = commonInsert.replace('{{ fields }}',tableFields);
		commonInsert = commonInsert.replace('{{ values }}',tableValues);
		conn.conn.query(commonInsert);

    return "success";
})

var getThisTablewithColumns = async(function(tname, dbname, conn) {
    var entitydata = async(function () {
      var promises = []
      var rs = []

      var tableName = tname

          var getTableColumns = await (getQuery('mysql', 'select', 'getTableColumns'));
          getTableColumns = getTableColumns.replace('{{ table_name }}', 'information_schema.columns');
          getTableColumns = getTableColumns.replace('{{ fields }}', 'group_concat(column_name order by ordinal_position) as columns, group_concat(column_type order by ordinal_position) as types, group_concat(column_key order by ordinal_position) as pi');
          getTableColumns = getTableColumns.replace('{{ database_name }}', dbname);
          getTableColumns = getTableColumns.replace('{{ tableName }}', tableName);
          // console.log('getTableColumns........', getTableColumns)

          var process = new Promise((resolve, reject) => {
            conn.conn.query(getTableColumns, function (error, result, fields) {
              // console.log('result???????????????',result)
              _.forEach(result, function (column, key) {
                  // var columnName = result[0];
                  var columnName = column.columns.split(",");
                  var columntype = column.types.split(",");
                  var columnpi = column.pi.split(",");
                  // console.log('columnName:::: ', columnName, '  columntype:::: ', columntype, ' columnpi:::: ', columnpi)
                  cols = []
                  // _.forEach(columnName, function (c, k) {
                  //   cols.push({ name: c })
                  // })
                  for (let [i, rs] of columnName.entries()) {
                    var ispri = false;
                    if (columnpi[i] == 'PRI') {
                      ispri = true
                    }
                    cols.push({ name: rs, type: columntype[i], isprimary: ispri})
                  }
                })
                
              error ? reject(error) : resolve(cols)
            })
          })
          promises.push(process);
       
      return Promise.all(promises).then(content => {
        return _.union(content)
      });
    })
    var columnsResponse = await (entitydata())
    return columnsResponse[0]
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

var UUID = async(function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
})

var filterObj = async (function(mobj, fArr) {
	var fobj = {}
	for( let [i, obj] of fArr.entries()) {
		// console.log('...........................', i, '>>>>', obj)
		if (obj.trasform != '') {
			let res = await (transformFunction(mobj, obj.transform, obj.name))
			mobj[obj.name] = res
			// console.log('obj.trasform.....>>>> ', res)
		}
		for(let k in mobj) {
			if(k == obj.name) {
				if(obj.input != "") {
				// console.log(k, ' == ', obj.input)
					fobj[obj.input] = mobj[k]
				} else {
					fobj[k] = mobj[k]
				}
			}
		}
	}
	return fobj
})

var transformFunction = function (row, trans) {
	var result = '';
	try {
		result = new Function("row", trans).call(this, row)
	} catch (err){
		// console.log('Error...........', err)
	} 
	return result
}

q.process(async(job, next) => {
	try {
			// console.log('job.data\n ', JSON.stringify(job.data))
			var aurl = 'http://' + job.configData.host + ':' + job.configData.port;
			var res = []
			var instance = []
			var isDup = job.data.eDuplicate
			// var _resi = await (axios.get('http://'+job.configData.host+':'+job.configData.port+'/'))
			// console.log('11111111111111111111111111111111111111111111111', job.data.source)
			var sConn = await (createConn(job.data.source));
			//console.log('22222222222222222222222222222222222222222222222', sConn)
			var tConn = await (createConn(job.data.target, job.data.mapdata));
			// console.log(sConn, '/>>>>>>>>>>>', tConn)
			// console.log('11111111111111111111111111111111111111')
			// var _res = await (sConn.conn.table('address_line').run())
			// var _res = await (tConn.conn.collection('asd').find().toArray())
			// console.log('22222222222222222222222222222222222222')
			// console.log('_res', _res)
			for (let [i, obj] of job.data.mapdata.entries() ) {
				// console.log(obj, i)
				var sData = []
				var tData = [] 
				if(obj.target == '') {
					obj.target = obj.source
				}

					// for Getting Source Data
					if(job.data.source.selectedDb == 'mongo') {
						sData = await (sConn.conn.collection(obj.source).find().toArray())
					} else if(job.data.source.selectedDb == 'rethink') {
						// console.log('11111111111111111111111111', obj.source)
						sData = await (sConn.conn.table(obj.source).run())
						// console.log('2222222222222222222222222', sData)
					} else if(job.data.source.selectedDb == 'elastic') {
						var _res = await (sConn.conn.search({
					        index: job.data.source.dbname,
					        type: obj.source,
					        body: {
					            query: {
					                match_all: { }
					            },
					        }
					    }).then(res => {
					    	// console.log('_res.................', res)
					    	return res
					    }).catch(err => {
					    	// console.log('Error...................', err)
					    	return err
					    }))
						_res.hits.hits.forEach(function(hit){
					        var item =  hit._source;
					        item._id = hit._id;
					        sData.push(item);
					    })
					} else if (job.data.source.selectedDb == 'nedb') {
						var tname = obj.source
						var tconn = new Datastore({ filename: path.join(sConn.conn, '/' + tname + '.db'), autoload: true })
          				sData = await (tconn.cfind({}).exec())
					} else if(job.data.source.selectedDb == 'mysql') {
						var getDatabaseTables = await(getQuery('mysql','select','commonSelect'));
						getDatabaseTables = getDatabaseTables.replace('{{ table_name }}',obj.source);
						getDatabaseTables = getDatabaseTables.replace('{{ fields }}','*');

						var tableList = function () {
						  var result = []
						  
						  return new Promise((resolve, reject) => {
							sConn.conn.query(getDatabaseTables, function (error, result, fields) {
							  error? reject(error) : resolve(result)
							})
						  }).then(content => {
							return content;
						  }).catch(err=> {
							return err;
						  })     
						};
						var resTableList = await (tableList())
						// console.log('resTableList',resTableList)
						for (let [i, sObj] of resTableList.entries()) {
							instanceVal = {};         
							
							_.forEach(sObj, function (rs1,key) {
								  instanceVal[key] = rs1;                        
							})
							
							sData.push(instanceVal);							
						}
							
					}
					// console.log('sData',sData);
					// console.log('job.data.target.selectedDb',job.data.target.selectedDb);
					// inserting source data into target table
					if(job.data.target.selectedDb == 'mongo') {
						var _res = []
						var having = []
						var arrOfErr = []
						// var sId = await (getSchemaidByName(aurl, obj.target))
						for (let [i, sObj] of sData.entries()) {
							// sObj._id = sObj._id
							// delete sObj.id
							// if(sObj.hasOwnProperty('Schemaid')) {
							// 	sObj.Schemaid = sId
							// }
							if (obj.colsData.length !== 0) {
								sObj = await (filterObj(sObj, obj.colsData))
							}
							if(isDup) {
								if(sObj.hasOwnProperty('_id')) {
									var checkDup = await (tConn.conn.collection(obj.target).find().toArray())
									// console.log(checkDup)
									// var a = _.cloneDeep(sObj)
									// delete a._id
									var isExist = _.findIndex(checkDup, sObj)
									if(isExist != -1) {
										var isCopy = _.isEqual(checkDup[isExist], sObj)
										if(!isCopy) {
											var s = await (tConn.conn.collection(obj.target).insert(sObj))
											_res.push(s)	
										} else {
											having.push(sObj)
										}
									} else {
										var s = await (tConn.conn.collection(obj.target).insert(sObj))
										_res.push(s)
									}
								} else {
									var checkDup = await (tConn.conn.collection(obj.target).find({}, {_id: 0}).toArray())
									// console.log(checkDup)
									var a = _.cloneDeep(sObj)
									delete a._id
									var isExist = _.findIndex(checkDup, a)
									if(isExist != -1) {
										var isCopy = _.isEqual(checkDup[isExist], a)
										if(!isCopy) {
											var s = await (tConn.conn.collection(obj.target).insert(sObj))
											_res.push(s)	
										} else {
											having.push(sObj)
										}
									} else {
										var s = await (tConn.conn.collection(obj.target).insert(sObj))
										_res.push(s)
									}
								}
								// console.log('_res..............', _res)
							} else {
								var s = await (tConn.conn.collection(obj.target).insert(sObj).then(res => {
									return res
								}).catch(err => {
									// console.log('.....>>>>>>>> ', err)
									arrOfErr.push({data: sObj, err: err})
									return err
								}))
								_res.push(s)
							} 
						}
						// console.log('having............', having)
						console.log('_res..............', arrOfErr)
						// await (sConn.conn.collection(obj.source).find().toArray())
					} else if(job.data.target.selectedDb == 'rethink') {
						var _res = []
						var arrOfErr = []
						// var sId = await (getSchemaidByName(aurl, obj.target))
						// console.log(sData)
						for (let [i, sObj] of sData.entries()) {
							// if(sObj.hasOwnProperty('_id')) {
							// 	sObj.id = (sObj._id).toString()
							// 	sObj._id = sObj.id
							// }
							if (obj.colsData.length !== 0) {
								sObj = await (filterObj(sObj, obj.colsData))
							}
							if (isDup) {
								if (sObj.hasOwnProperty('id')) {
									var a = await (tConn.conn.table(obj.target).run())
									var isExist = _.findIndex(a, sObj)
									if(isExist == -1) {
										var s = await (tConn.conn.table(obj.target).insert(sObj).run())
										_res.push(s)		
									} else {
										var isCopy = _.isEqual(a[isExist], sObj)
										if(!isCopy) {
											var s = await (tConn.conn.table(obj.target).insert(sObj).run())
											_res.push(s)
										}
									}
								} else {
									console.log('without..........id')
									var a = await (tConn.conn.table(obj.target).without('id').run())
									var n = _.cloneDeep(sObj)
									delete n.id
									var isExist = _.findIndex(a, n)
									if(isExist == -1) {
										var s = await (tConn.conn.table(obj.target).insert(sObj).run())
										_res.push(s)		
									} else {
										var isCopy = _.isEqual(a[isExist], n)
										if(!isCopy) {
											var s = await (tConn.conn.table(obj.target).insert(sObj).run())
											_res.push(s)
										}
									}
								}
							} else {
								// console.log('>>>>> ', sObj)
								var s = await (tConn.conn.table(obj.target).insert(sObj).run().then(res => {
									if(res.errors == 1) {
										arrOfErr.push(sObj)
									}
									return res
								}).catch(err => {
									arrOfErr.push(sObj)
									return err
								}))
								_res.push(s)		
							}
						}
						console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', _res)
						console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> arrOfErr', arrOfErr)

					} else if(job.data.target.selectedDb == 'elastic') {
						var _res = []
						var arrOfErr = []
						// var sId = await (getSchemaidByName(aurl, obj.target))
						for (let [i, sObj] of sData.entries()) {
							// sObj._id = (sObj._id).toString()
							// delete sObj.id
							// if(sObj.hasOwnProperty('Schemaid')) {
							// 	sObj.Schemaid = sId
							// }
							if (obj.colsData.length !== 0) {
								sObj = await (filterObj(sObj, obj.colsData))
							}
							// var s = await (tConn.conn.index({
						 //        index: job.data.target.dbname,
						 //        type: obj.target,
						 //        body: sObj
						 //    }))
							// _res.push(s)
							if (isDup) {
								// console.log('isDup', isDup)
								if (sObj.hasOwnProperty('_id')) {
									// console.log('11111111111111111111')
									sObj._id = (sObj._id).toString()
									var a = await (tConn.conn.search({
								        index: job.data.source.dbname,
								        type: obj.source,
								        body: {
								            query: {
								                match_all: { }
								            },
								        }
								    }).then(res => {
								    	// console.log(res)
								    	var a = _.map(res.hits.hits, (d) => {
								    		var s = d._source
								    		s._id = d._id
								    		return s 
								    	})
										// console.log('22222222222222222222', a)
								    	return a
								    }).catch(err => {
								    	// console.log('>>>>>>>>>>>>>>>>>>>>>>>.', err)
								    	return []
								    }))
								    // console.log('aaaaaaaaaaaaaaa', a, '>>>>>>>>>>>>>>>', sObj)
									var isExist = _.findIndex(a, sObj)
									// console.log('isExist', isExist)
									if(isExist == -1) {
										var s = await (tConn.conn.index({
									        index: job.data.target.dbname,
									        type: obj.target,
									        body: sObj
									    }))
										_res.push(s)	
									} else {
										var isCopy = _.isEqual(a[isExist], sObj)
										if(!isCopy) {
											var s = await (tConn.conn.index({
										        index: job.data.target.dbname,
										        type: obj.target,
										        body: sObj
										    }))
											_res.push(s)
										}
									}
								} else {
									console.log('without.........._id')
									var a = await (tConn.conn.search({
								        index: job.data.source.dbname,
								        type: obj.source,
								        body: {
								            query: {
								                match_all: { }
								            },
								        }
								    }).then(res => {
								    	return _.map(res.hits.hits, (d) => {
								    		return d._source
								    	})
								    }).catch(err => {
								    	return []
								    }))
									var n = _.cloneDeep(sObj)
									delete n._id
									// console.log('...................', a, '>>>>>>>>>>>>>>>', n)
									var isExist = _.findIndex(a, n)
									// console.log('isExist.........', isExist)
									if(isExist == -1) {
										// console.log('created..............')
										var s = await (tConn.conn.index({
									        index: job.data.target.dbname,
									        type: obj.target,
									        body: sObj
									    }))
										_res.push(s)		
									} else {
										var isCopy = _.isEqual(a[isExist], n)
										if (!isCopy) {
											var s = await (tConn.conn.index({
										        index: job.data.target.dbname,
										        type: obj.target,
										        body: sObj
										    }))
											_res.push(s)		
										}
									}
								}
							} else {
								// console.log('>>>>> ', sObj)
								var s = await (tConn.conn.index({
							        index: job.data.target.dbname,
							        type: obj.target,
							        body: sObj
							    }).then(res => {
							    	return res
							    }).catch(err => {
							    	arrOfErr.push(sObj)
							    	return err
							    }))
								_res.push(s)		
							}
						}
						// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', _res)
						// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> error ', arrOfErr)
					} else if(job.data.target.selectedDb == 'mysql') {
						var _res = []
						
						// if(sObj.hasOwnProperty('_id')) {
						// 	sObj.id = (sObj._id).toString()
						// 	sObj._id = sObj.id
						// }
						
						// var sId = await (getSchemaidByName(aurl, obj.target))
						var ispri = false;
						var priObj;
						var tableStructure = await (getThisTablewithColumns(obj.target, job.data.target.dbname, tConn))
						if (tableStructure != undefined || tableStructure.length > 0) {
							var s = _.find(tableStructure, {isprimary: true})
							console.log(s)
							if (s != undefined || s.length > 0) {
								ispri = true;
								priObj = s;
							}
						}
						// console.log('priObj................', priObj)
						// console.log('....................', TableStructure)
						for (let [i, sObj] of sData.entries()) {
							if (obj.colsData.length !== 0) {
								sObj = await (filterObj(sObj, obj.colsData))
							}
							if(isDup) {
								console.log('isDup --> || on ||..............')
								// var checkpri = await (getThisTablewithColumns(obj.target, job.data.target.dbname, tConn))
								// console.log('....................', checkpri)
								var oldData = await (getSchemaRecord(tConn, obj.target))
								if (ispri) {
									// console.log('ispri--> || true || ..............')
									var myarr = [];
									for (let [i, rs] of oldData.entries()){
										delete rs[priObj.name]
										myarr.push(rs)
									}
									var dummysObj = _.cloneDeep(sObj)
									delete dummysObj[priObj.name]
									// console.log('myarr.....', myarr)
									// console.log('dummysObj previous.....', dummysObj)
									for (let key in dummysObj) {
										if (typeof dummysObj[key] == 'object') {
											dummysObj[key] = JSON.stringify(dummysObj[key])
										} else {
											dummysObj[key] = dummysObj[key]
										}
									}
									// console.log('dummysObj.....', dummysObj)
									var isExist = _.findIndex(myarr, dummysObj)
									// console.log('isExist--> || '+ isExist +' || ..............')

									if (isExist != -1) {
										// var tri1 = _.cloneDeep(myarr[isExist])
										var newObj = {}
										for (let ky in myarr[isExist]) {
											newObj[ky] = myarr[isExist][ky]
										}
										// console.log('isMatch >>>>>>> \n', newObj, '\n ...........\n', dummysObj)
										var isMatch = _.isEqual(newObj, dummysObj)
										// console.log('isMatch--> || '+ isMatch +' || ..............')

										if (!isMatch) {
											// insert
											var response = await (updateSchema(sObj, obj.target,job.data.target.dbname,tConn))
											_res.push(response)
										} 
									} else {
										// insert
										var response = await (updateSchema(sObj, obj.target,job.data.target.dbname,tConn))
										_res.push(response)
									}
								} else {
									console.log('without primary..')
									var oldData = await (getSchemaRecord(tConn, obj.target))
									var isExist = _.findIndex(oldData, sObj)
									if (isExist != -1) {
										var newObj = {}
										for (let ky in oldData[isExist]) {
											newObj[ky] = myarr[isExist][ky]
										}
										var isMatch = _.isEqual(newObj, sObj)
										if (!isMatch) {
											// insert
											var response = await (updateSchema(sObj, obj.target,job.data.target.dbname,tConn))
											_res.push(response)
										} 
									} else {
										// insert
										var response = await (updateSchema(sObj, obj.target,job.data.target.dbname,tConn))
										_res.push(response)
									}
								}
								// console.log('oldData.......................\n', oldData)s
							} else {
								var response = await (updateSchema(sObj, obj.target,job.data.target.dbname,tConn))
								// console.log('response.........mysql', response)
								_res.push(response)
							}
							// console.log('sObj',sObj,obj.target,job.data.target.dbname)
							// return false;
							// sObj.Schemaid = sId
						}
						console.log('..............._res.............\n ', _res)
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