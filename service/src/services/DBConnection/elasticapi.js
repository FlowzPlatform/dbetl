var elasticsearch=require('elasticsearch');
var db1 = require('./db');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var databasename = 'schema_builder';

var client = new elasticsearch.Client( {  
    host: db1.elastic.host+':'+db1.elastic.port,
    log: 'error'
  // hosts: [
  //   'https://[username]:[password]@[localhost]:[9200]/',
  //   'https://[username]:[password]@[localhost]:[9200]/'
  // ]
});
var db = ((db1.elastic.dbname == '') ? databasename : db1.elastic.dbname);
client.indices.create({  
  index: db
})
// var check = client.indices.exists({
//     index: db
// })
// if(check){
//     console.log('!!!!!');
//     client.indices.create({
//         index: db
//     });
// }else{
//     client.indices.create({
//         index: db
//     });
// }

module.exports = {
	choose: function(){
		console.log('===================ELASTIC_DB=================');
	},
	//***********************get cuustom methods******************
	getSchemaName: async(function(name) {
        console.log('elastic get SchemaName');
        var data = [];
        var result = await( 
        client.search({
            index: db,
            type: 'schema',
            body: {
                query: {
                    match: {
                        'title' : name
                    }
                },
            }
        }))
        result.hits.hits.forEach(function(hit){
            var item =  hit._source;
            item._id = hit._id;
            data.push(item);
        })
        return data;
    }),

    getThisSchemaType: async(function(id ,type) {
        console.log('elastic get SchemaCurrent Type');
        var data = [];
        var result = await( 
        client.search({
            index: db,
            type: 'schema',
            body: {
                query: {
                    match: {
                        '_id' : id
                    }
                },
            }
        }))
        result.hits.hits.forEach(function(hit){
            hit._source.entity.forEach(function(item, i) {
             if(item.type === type){
                 data.push(item);
             }
            });
        })
        return data;
    }),

    getThisSchemaFieldName:  async(function(id ,fieldname) {
        console.log('elastic get SchemaCurrent fieldname');
        var data = [];
        var result = await( 
        client.search({
            index: db,
            type: 'schema',
            body: {
                query: {
                    match: {
                        '_id' : id
                    }
                },
            }
        }))
        result.hits.hits.forEach(function(hit){
            hit._source.entity.forEach(function(item, i) {
             if(item.name === fieldname){
                 data.push(item);
             }
            });
        })
        return data;
    }),

    //*************get methods***************
    getSchema: async(function() {
        console.log('elastic get Schema');
        var data = [];
        var result = await( 
        client.search({
            index: db,
            type: 'schema',
            body: {
                query: {
                    match_all: { }
                },
            }
        }))
        result.hits.hits.forEach(function(hit){
            var item =  hit._source;
            item._id = hit._id;
            data.push(item);
        })
        return data;
    }),
    getThisSchema: async(function(id) {
        console.log('elastic get SchemaCurrent');
        var data;
        var result = await( 
        client.search({
            index: db,
            type: 'schema',
            body: {
                query: {
                    match: {
                        '_id' : id
                    }
                },
            }
        }))
        result.hits.hits.forEach(function(hit){
            data =  hit._source;
            data._id = hit._id;
        })
        return data;
    }),
    getflowsInstance: async(function() {
        console.log('elastic get flowsInstance');
        var data = [];
        var result = await( 
        client.search({
            index: db,
            type: 'instance',
            body: {
                query: {
                    match_all: { }
                },
            }
        }))
        result.hits.hits.forEach(function(hit){
            var item =  hit._source;
            item._id = hit._id;
            data.push(item);
        })
        return data;
    }),
    getThisflowsInstance: async(function(id) {
        console.log('elastic get flowsInstanceCurrent');
        var data;
        var result = await( 
        client.search({
            index: db,
            type: 'instance',
            body: {
                query: {
                    match: {
                        '_id' : id
                    }
                },
            }
        }))
        result.hits.hits.forEach(function(hit){
            data =  hit._source;
            data._id = hit._id;
        })
        return data;
    }),

    //********************post methods***********************
    postSchema: async(function(data) {
        console.log('elastic post Schema');
        var result = await( 
        client.index({
            index: db,
            type: 'schema',
            body: data
        }))
        return result;
    }),
    postflowsInstance: async(function(data) {
        console.log('elastic post flowsInstance');
        var result = await( 
        client.index({
            index: db,
            type: 'instance',
            body: data
        }))
        return result;
    }),

    //**********************put methods************************
    putSchema: async(function(data, id) {
        var schemaid = id;
        // console.log('DATA:',data);
        var schemadata = await (
            client.index({
            index: db,
            type: 'schema',
            id: schemaid,
            body: data
        }))

        return schemadata;
    }),
    putflowsInstance: async(function(data, id) {
        var instanceid = id;
        // console.log('DATA:',data);
        var schemadata = await (client.index({
            index: db,
            type: 'instance',
            id: instanceid,
            body: data
        }))

        return schemadata;
    }),

    //******************************delete methods*************************
    // deleteSchema: async(function() {
    //     // var _data = JSON.parse(data);
    //     // console.log('elastic delete Schema');
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
    deleteThisSchema: async(function(id) {
        console.log('elastic delete this schema');
	    var schemaid = id;
        var result = await( 
        client.delete({
            index: db,
            type: 'schema',
            id: schemaid
        }))
        // console.log('result',result);
        return result;

    }),
    deleteThisflowsInstance: async(function(id) {
        console.log('elastic delete this flowsInstance');
	    var instanceid = id;
        var result = await( 
        client.delete({
            index: db,
            type: 'instance',
            id: instanceid
        }))
        // console.log('result',result);
        return result;
    })

}