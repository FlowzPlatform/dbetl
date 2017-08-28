var db = require('./db');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var databasename = ((db.rethink.dbname == "")? 'schema_builder' : db.rethink.dbname);
var r = require('rethinkdbdash')({
	username: db.rethink.username,
	password: db.rethink.password,
	port: db.rethink.port,
	host: db.rethink.host,
	db: databasename
});

// console.log('######################',((db.rethink.dbname == "")? databasename : db.rethink.dbname));

// r.dbCreate(((db.rethink.dbname == "")? databasename : db.rethink.dbname))
// .run()
// .then(function(response){
// 	console.log(response);
// })
// .error(function(err){
// 	console.log('error occured ', err);
// });

// r.db(((db.rethink.dbname == "")? databasename : db.rethink.dbname)).tableCreate('schema')
// .run()
// .then(function(response){
// 	console.log(response);
// })
// .error(function(err){
// 	console.log('error while creating table ', err);
// });
// r.db(((db.rethink.dbname == "")? databasename : db.rethink.dbname)).tableCreate('flowsinstance')
// .run()
// .then(function(response){
// 	console.log(response);
// })
// .error(function(err){
// 	console.log('error while creating table ', err);
// })
var yes = r.dbList().contains(databasename) // create db if not exists
          .do(function (dbExists) {
            return r.branch(dbExists, { created: 0 }, r.dbCreate(databasename));
          }).run().then(function () {
            return r.db(databasename).tableList().contains('schema') // create table if not exists
            .do(function (tableExists) {
              return r.branch(tableExists, { created: 0 }, r.db(databasename).tableCreate('schema'));
            }).run().then(function () {
                return r.db(databasename).tableList().contains('flowsinstance') // create table if not exists
                .do(function (tableExists) {
                  return r.branch(tableExists, { created: 0 }, r.db(databasename).tableCreate('flowsinstance'));
                }).run();
            });
          });

// console.log('Success!!!!!!!!!!!!!!!!!!!!!! Rethink',db);
module.exports = {
    choose: async(function(){
        console.log('===================RETHINKDB=================');
    }),
    getSchemaName: async(function(name) {
        console.log('rethink get SchemaName');
        var schemadata = await (r.table('schema').filter({'title': name})
            .run()
            .then(function(response){
                // console.log('response',response);
                return response;
            })
            .error(function(err){
                console.log('Error:',err);
            }))
            return schemadata;
    }),

    getThisSchemaType: async(function(id, type) {
        console.log('rethink get Schema Type');
        var schemadata = await (r.table('schema').filter({'id': id})
            .run()
            .then(function(response){
                // console.log('response',response);
                var result = [];
                response[0].entity.forEach(function(item, i) {
                    // console.log('item---',item);
                    if(item.type === type){
                        result.push(item);
                    }
                });
                return result;
            })
            .error(function(err){
                console.log('Error:',err);
            }))
            return schemadata;
    }),

    getThisSchemaFieldName: async(function(id, fieldname) {
        console.log('rethink get Schema Type');
        var schemadata = await (r.table('schema').filter({'id': id})
            .run()
            .then(function(response){
                // console.log('response',response);
                var result = [];
                response[0].entity.forEach(function(item, i) {
                    // console.log('item---',item);
                    if(item.name === fieldname){
                        result.push(item);
                    }
                });
                return result;
            })
            .error(function(err){
                console.log('Error:',err);
            }))
            return schemadata;
    }),

    getSchema: async(function() {
        console.log('rethink get Schema');
        var schemadata = await (r.table('schema')
			.run()
			.then(function(response){
				// console.log('response getSchema::',response);
        		return response;
			})
			.error(function(err){
				console.log('Error:',err);
			}))
			return schemadata;
    }),
    getThisSchema: async(function(id) {
        console.log('rethink get SchemaCurrent');
		var schemadata = await (r.table('schema').filter({'id': id}).run())
        // console.log('SchemaCurrent',id, schemadata);
        return schemadata[0];
    }),
    getflowsInstance: async(function() {
        console.log('rethink get flowsInstance');
        var flowsInstance = await (r.table('flowsinstance')
			.run()
			.then(function(response){
				// console.log('getflowsInstance:',response);
        		return response;
			})
			.error(function(err){
				console.log('Error:',err);
			}));
        return flowsInstance;
    }),
    getThisflowsInstance: async(function(id) {
        console.log('rethink get flowsInstanceCurrent');
        var flowsInstance = await (r.table('flowsinstance').filter({'id': id}).run());
        // console.log('flowsInstance',flowsInstance);
        return flowsInstance[0];
    }),

    //post methods
    postSchema: async(function(data) {
        console.log('rethink post Schema');
        // var _data = JSON.parse(data);
        // console.log('data:',_data);
        var schema = await (r.table("schema").insert(data).run());
	    console.log('########## from postSchema',schema);

	    var _id = schema.generated_keys[0];
        r.table("schema").get(_id).update({'_id': _id}).run();
	    return schema;
    }),
    postflowsInstance: async(function(data) {
        console.log('rethink post flowsInstance');
        // var _data = JSON.parse(data);
        // console.log('data:',_data);
		var flowsInstance = await (r.table("flowsinstance").insert(data).run());
	    // console.log('########## from postSchema',flowsInstance);

	    var _id = flowsInstance.generated_keys[0];
        r.table("flowsinstance").get(_id).update({'_id': _id}).run();
	    return flowsInstance;
    }),

    //put methods
    putSchema: async(function(data, id) {
        console.log('rethink put Schema');
        // var _data = JSON.parse(data);
        // console.log('data',data, id);
        data.id = id;
        // console.log('rethink put Schema',_data);
        var schema = await (r.table('schema').get(id).replace(data).run());
        return schema;
    }),
    putflowsInstance: async(function(data, id) {
        console.log('rethink put flowsInstance');
        // var _data = JSON.parse(data);
        data.id = id;
        // console.log('rethink put Schema',_data);
        var flowsinstance = await (r.table('flowsinstance').get(id).replace(data).run());
        return flowsinstance;
    }),

    //delete methods
    deleteSchema: async(function() {
        console.log('rethink delete allSchema');
	    var schema = await (r.table('schema').delete().run());
	    return schema;
    }),
    deleteThisSchema: async(function(id) {
        console.log('rethink delete schema');
	    var schema = await (r.table('schema').filter({'id': id}).delete().run());
        return schema;
    }),
    deleteflowsInstance: async(function() {
        console.log('rethink delete allSchema');
	    var flowsinstance = await (r.table('flowsinstance').delete().run());
	    return flowsinstance;
    }),
    deleteThisflowsInstance: async(function(id) {
        console.log('rethink delete flowsInstance');
	    var flowsinstance = await (r.table('flowsinstance').filter({'id': id}).delete().run());
		return flowsinstance;
    })
}