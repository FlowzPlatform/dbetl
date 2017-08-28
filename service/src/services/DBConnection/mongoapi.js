var mongoose = require('mongoose');
var db1 = require('./db');
let async = require('asyncawait/async');
let await = require('asyncawait/await');
var db;
var databasename = 'schema_builder';
// db1.mongo.username+':'+db1.mongo.password+'@'+
var mongoDB = 'mongodb://'+db1.mongo.host+':'+db1.mongo.port+'/'+((db1.mongo.dbname == '') ? databasename : db1.mongo.dbname);
console.log('database::::',mongoDB);

// console.log('-----',mongoose.connection.readyState);
// if(mongoose.connection.readyState >0){
// 	mongoose.disconnect();
// }
// mongoose.connect(mongoDB);
// db = mongoose.connection;

// mongoose.connect(mongoDB);
db = mongoose.createConnection(mongoDB);

// console.log('-----after---',mongoose.connection.readyState);
// console.log('Success!!!!!!!!!!!!! Mongo');
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
	choose: async(function(){
		console.log('===================MONGODB=================');
	}),
	//get methods
	getSchemaName: async(function(name) {
        console.log('mongo get SchemaName');
        var schemadata = await (db.collection('schema').find({ title: name }).toArray());
        // console.log('SchemaName',schemadata);
        return schemadata;
    }),

    getThisSchemaType: async(function(id ,type) {
        console.log('mongo get SchemaCurrent Type',type);
        var id = new mongoose.Types.ObjectId(id);
        // console.log('mongo get SchemaCurrent id:',id);           {$and: [{_id: id}, {type: type}]}
        var schemadata = await (db.collection('schema').find({_id: id},{_id:0 , title:0, templateType:0 , template:0}).toArray());
        // console.log('SchemaCurrent',schemadata[0].entity);
        var result = [];
        schemadata[0].entity.forEach(function(item, i) {
        	// console.log('item---',item);
        	if(item.type === type){
        		result.push(item);
        	}
        });
        return result;
    }),

    getThisSchemaFieldName:  async(function(id ,fieldname) {
        console.log('mongo get SchemaCurrent fieldname');
        var id = new mongoose.Types.ObjectId(id);
        // console.log('mongo get SchemaCurrent id:',id);           {$and: [{_id: id}, {type: type}]}
        var schemadata = await (db.collection('schema').find({_id: id},{_id:0 , title:0, templateType:0 , template:0}).toArray());
        // console.log('SchemaCurrent',schemadata[0].entity);
        var result = [];
        schemadata[0].entity.forEach(function(item, i) {
        	// console.log('item---',item);
        	if(item.name === fieldname){
        		result.push(item);
        	}
        });
        return result;
    }),

    getSchema: async(function() {
        console.log('mongo get Schema');
        var schemadata = await (db.collection('schema').find().toArray());
        // console.log('schemadata getSchema',schemadata);
        return schemadata;
    }),
    getThisSchema: async(function(id) {
        console.log('mongo get SchemaCurrent');
        var id = new mongoose.Types.ObjectId(id);
        // console.log('mongo get SchemaCurrent id:',id);
        var schemadata = await (db.collection('schema').find({ _id: id }).toArray());
        // console.log('SchemaCurrent',schemadata);
        return schemadata[0];
    }),
    getflowsInstance: async(function() {
        console.log('mongo get flowsInstance');
        var flowsInstance = await (db.collection('flows-instance').find().toArray());
        // console.log('flowsInstance',flowsInstance);
        return flowsInstance;
    }),
    getThisflowsInstance: async(function(id) {
        console.log('mongo get flowsInstanceCurrent');
        var id = new mongoose.Types.ObjectId(id);
        var flowsInstance = await (db.collection('flows-instance').find({ _id: id }).toArray());
        // console.log('flowsInstance',flowsInstance);
        return flowsInstance[0];
    }),

    //post methods
    postSchema: async(function(data) {
        console.log('mongo post Schema');
        // var _data = JSON.parse(data);
        // var _data = JSON.parse(data);
	    var schema = await (db.collection('schema').insert(data));			

	    // var schema = await (db.collection('schema').insert(data, function(err, result) {
	    //     if 	(err) {
	    //         console.log('Error!! from mongo post Schema');
	    //         return {success: false}
	    //     } else {
	    //         console.log('Success!! from mongo post Schema',result.ops);
	    //         return result.ops
	    //     }
	    // }));
	    // console.log('postSchema',schema)
	    return schema.ops;
    }),
    postflowsInstance: async(function(data) {
        console.log('mongo post flowsInstance');
        // var _data = JSON.parse(data);
        var flowsInstance = await (db.collection('flows-instance').insert(data));
	    // var flowsInstance = await (db.collection('flows-instance').insert(data, function(err, result) {
	    //     if (err) {
	    //         console.log('Error!! from mongo post flowsInstance');
	    //         return {success: false}
	    //     } else {
	    //         console.log('Success!! from mongo post flowsInstance');
	    //         return {success: true}
	    //     }
	    // }));
	    return flowsInstance.ops;
    }),

    //put methods
    putSchema: async(function(data, id) {
        // var _data = JSON.parse(data);
        console.log('mongo put Schema');
	    var id = new mongoose.Types.ObjectId(id);
	    // console.log('id from putSchema:',id);
	    var schema = await (db.collection('schema').updateOne({ _id: id }, { $set: data }));
	    return schema;
    }),
    putflowsInstance: async(function(data, id) {
        // var _data = JSON.parse(data);
        console.log('mongo put flowsInstance');
	    var id = new mongoose.Types.ObjectId(id);
	    // console.log('id from putflowsInstance:',id);
	    var flowsInstance = await (db.collection('flows-instance').updateOne({ _id: id }, { $set: data }));
        return flowsInstance;
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
    deleteThisSchema: async(function(id) {
        console.log('mongo delete schema');
	    var id = new mongoose.Types.ObjectId(id);
	    var schema = await (db.collection('schema').deleteOne({ _id: id }));
	    return schema;
    }),
    deleteThisflowsInstance: async(function(id) {
        console.log('mongo delete flowsInstance');
	    var id = new mongoose.Types.ObjectId(id);
	    var flowsInstance = await (db.collection('flows-instance').deleteOne({ _id: id }));
        return flowsInstance;
    })

}