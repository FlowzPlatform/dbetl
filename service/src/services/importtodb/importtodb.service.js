// Initializes the `importtodb` service on path `/importtodb`
const createService = require('./importtodb.class.js');
const hooks = require('./importtodb.hooks');
const filters = require('./importtodb.filters');
const socketio = require('feathers-socketio');
let shell = require('shelljs');
let elasticsearch = require('elasticsearch')
fs = require('fs');
var r = require('rethinkdb');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');



module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');


  app.configure(socketio(function(io) {
    // console.log("io....",io)
  io.on('connection', function(socket) {
    console.log("connected successfully to importdb.....")
    // socket.emit('customer_uploaded_data',data);
    socket.on('import',async function( data){
        console.log('Found all imported data', data);
        if(data.deletedFlag == true){
          console.log("inside abort.......",data)
          dbname = data.dbname || data.database_name
          if(data.hasOwnProperty('upldCSV') == false){
            console.log("called....")
            trac_id = data.id
          }
          else {
            trac_id = data.upldCSV[0].importTracker_id
          }
          if(data.selectedDb == "mongo" || data.destination == "mongo"){

            var url = 'mongodb://'+data.host+':'+data.port+'/'+dbname;
            var cnn_with_mongo = await deletedFromMongo(url,trac_id)
            console.log("cnn_with_mongo...............",cnn_with_mongo)
            socket.emit('delete',cnn_with_mongo)
          }
          else if(data.selectedDb == "rethink" || data.destination == "rethink"){
            var connection = null;
            var cnn_with_rethink = await deletedFromRethink(data.host,data.port,dbname,trac_id)
            console.log("cnn_with_rethink...............",cnn_with_rethink)
            socket.emit('delete',cnn_with_rethink)
          }
          else if(data.selectedDb == "elastic" || data.destination == "elastic"){
            let tracker_id = "\"" + trac_id+ "\""
            var cnn_with_elastic = await deletedFromElastic(data.host,data.port,dbname,tracker_id)
            console.log("cnn_with_ealstic...............",cnn_with_elastic)
            socket.emit('delete',cnn_with_elastic)
          }
        }
        else {
        fs.exists('temp', async function(exists) {
          if (exists) {} else {
            fs.mkdir('temp', async function(err) {
              if (err) {
                console.log(err);
                return false;
              } else {

              }
            })
          }
        })
        resp = writeFile(data,socket);
        return resp
      }
  });
  });
  io.use(function (socket, next) {
   // Exposing a request property to services and hooks
   socket.feathers.referrer = socket.request.referrer;
   next();
 });
 }));

  const options = {
    name: 'importtodb',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/importtodb', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('importtodb');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};

async function writeFile(data,socket) {
  let scopeFs;
  try
  {
    let file_name = 'temp/'+ Date.now() + '.json';
    fs.writeFile(file_name, JSON.stringify(data.upldCSV), async function(err, result) {
      if (err) {
        console.log(err);
      }
      console.log("file " + file_name + " written ");
      scopeFs = await saveDataToDb(file_name,data,socket)
    });
  //  scopeFs = await this.uploadToS3(file_name)

  } catch (e) {
    console.log("Cannot write file ", e);
  }

  return scopeFs;
}
var filereader = function(filename) {
  var _promise =  new Promise(function(resolve, reject) {
     fs.readFile(filename, function(err, data1) {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data1))
      })
    })
  var _data = Promise.resolve(_promise).then(function(res) {
    console.log("res", res)
    return res
  })
  return _data
}

var connectToMongo = async function(url,filename,data,host,port,selectedDb,dbname,flag,temp_id){
  var db = await (MongoClient.connect(url))
    console.log("Connected correctly to server.");
    var stdout = await (shell.exec(`mongo `+host+`:`+port+ ` --eval 'db.getMongo().getDBNames()' --quiet`))
      if(stdout.search(dbname) != -1){
        // console.log("11111111111111111")
        var response = await (db.listCollections().toArray())
           console.log("collections",response)
           for(var i=0;i<response.length;i++){
             if(response[i].name == "customerData")
             flag = true
           }
          if(flag == true){
            var result = await (db.collection("customerData").find({"importTracker_id":temp_id}).toArray())
              if(result.length > 0){
                 var obj = await (db.collection("customerData").remove({"importTracker_id":temp_id}))
                  console.log(obj.result.n + " document(s) deleted");
                  var res = await (shell.exec("mongoimport -h "+host+":"+port+" --db "+dbname+" --collection customerData --file "+filename+" --jsonArray"))
                    return res

              }
              else {
                var _res = await (shell.exec("mongoimport -h "+host+":"+port+" --db "+dbname+" --collection customerData --file "+filename+" --jsonArray"))
                return _res
              }
            // });
          }
          else{
            var res = await (shell.exec("mongoimport -h "+host+":"+port+" --db "+dbname+" --collection customerData --file "+filename+" --jsonArray"))
              return res
          }
        // })
      }
      else {
        // console.log("55555555555555")
        shell.exec("mongo "+dbname)
        var res = await (shell.exec("mongoimport -h "+host+":"+port+" --db "+dbname+" --collection customerData --file "+filename+" --jsonArray"))
        return res

      }
}

var connectToElastic = async function(filename,data,host,port,selectedDb,dbname,tempid){
  esClientOption = {
      index : dbname,
      type : 'customerData'
    }

    const esUrl = "http://"+host+":"+port
    const esClient = new elasticsearch.Client({
       host: esUrl
    })
    var stdout = await(shell.exec(`curl -i -XHEAD 'http://`+host+`:`+port+`/`+dbname+`/customerData/'`))
     console.log(".......",stdout)
     if(stdout.search('200') != -1){
         console.log("yess...")
          var response = await(esClient.count({
             index: dbname,
             type: "customerData",
             body: {
               query: {
                match:{
                  importTracker_id : tempid
                }
               }
             }
           }))
            console.log(response.count)
             if(response.count > 0){
               var res = await(esClient.search({
                     index: dbname,
                     type: 'customerData',
                     body: {"query": { "match": {"importTracker_id":tempid}},"size":10000}
                   }))
             console.log("response...",res.hits.hits)
             let makeUpdateJsonObj1 = []
                 if(res != undefined &&  res.hits.hits.length > 0) {
                   res.hits.hits.forEach(function (value, index) {
                       makeUpdateJsonObj1.push({
                         delete: {
                           _index: dbname,
                           _type: "customerData",
                           _id: value._id
                         }
                     })

                   })
                   console.log("***************",makeUpdateJsonObj1)
                   if(makeUpdateJsonObj1.length > 0) {
                     let retValue = await dumpToES(makeUpdateJsonObj1,esClient)
                   }
                   var _res = await(shell.exec(`cat `+filename+ `| jq -c '.[] | {"index": {"_index": "` +dbname+ `", "_type": "customerData"}}, .' | curl -XPOST http://` +host+ `:` +port+ `/_bulk --data-binary @-`))
                   return _res
         }
      }
      else {
        var _res = await(shell.exec(`cat `+filename+ `| jq -c '.[] | {"index": {"_index": "` +dbname+ `", "_type": "customerData"}}, .' | curl -XPOST http://` +host+ `:` +port+ `/_bulk --data-binary @-`))
        return _res
      }
    }
    else {
      var _res = await(shell.exec(`cat `+filename+ `| jq -c '.[] | {"index": {"_index": "` +dbname+ `", "_type": "customerData"}}, .' | curl -XPOST http://` +host+ `:` +port+ `/_bulk --data-binary @-`))
      return _res
    }

}

var connectToRethink = async function(filename,data,host,port,selectedDb,dbname,tempid){
  var connection = null;
            var db = await(r.connect({host: host, port: port,db:dbname}))
            var connection = db;

              var getCollList = await(r.dbList().contains(dbname).run(connection))
              console.log("getCollList",tempid)
                if(getCollList == true){
                  var _res = await(r.db(dbname).tableList().contains('customerData').run(connection))
                  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> table --', _res,tempid)
                     if(_res == true){
                      var result = await(r.db(dbname).table("customerData").filter({"importTracker_id": tempid }).run(connection))
                       console.log("result",result)
                     var resultArr = await (result.toArray())
                     console.log(resultArr)
                     let res1 = JSON.stringify(resultArr, null, 2);
                     console.log("Success",res1)
                     if(res1 == '[]'){
                       console.log("inside if")
                       var res = await(shell.exec('rethinkdb import -f '+filename+ ' --table ' +dbname+ '.customerData -c' +host+ ':' +port+ ' --force'));
                       return res
                    }
                    else {
                    var deletedids = await(r.table('customerData').filter({"importTracker_id": tempid}).delete().run(connection))
                    console.log("deleted...")

                    console.log(JSON.stringify(deletedids, null, 2));
                      var res = await(shell.exec('rethinkdb import -f '+filename+ ' --table ' +dbname+ '.customerData -c' +host+ ':' +port+ ' --force'));
                      return res

                 }
             }
             else {
               var res = await(shell.exec('rethinkdb import -f '+filename+ ' --table ' +dbname+ '.customerData -c' +host+ ':' +port+ ' --force'));
               return res
             }
           }
           else {
             var res = await(shell.exec('rethinkdb import -f '+filename+ ' --table ' +dbname+ '.customerData -c' +host+ ':' +port+ ' --force'));
             return res
           }
}

var fileunlinker = function(filename) {
  console.log('filename.............', filename)
  var _promise =  new Promise(function(resolve, reject) {
     fs.unlink(filename, function(err, data1) {
        if (err) {
          reject(err);
        }
        resolve(data1)
      })
    })
  var _data = Promise.resolve(_promise).then(function(res) {
    console.log("res", res)
    return res
  })
  return _data
}
async function saveDataToDb(filename,data,socket){
  console.log("file_name.....",filename,data)
  let host = data.host
  let port = data.port
  let selectedDb = data.selectedDb || data.destination
  let dbname = data.dbname || data.database_name
  let tempid = "\"" + data.upldCSV[0].importTracker_id+ "\"" || "\"" + data.id+ "\""
  let temp_id = data.upldCSV[0].importTracker_id || data.id
  var temp_dbname = "\`" + data.dbname + "\`";
  let flag
  console.log("selectedDb",selectedDb,"dbname",dbname,temp_id)
  if(selectedDb == 'mongo'){
    console.log("inside mongo....")
    var fdata = await (filereader(filename))
    console.log('sfile................', fdata)

    var url = 'mongodb://'+host+':'+port+'/'+dbname;
    var mongocnn = await connectToMongo(url,filename,data,host,port,selectedDb,dbname,flag,temp_id)
    console.log("mongocnn...............",mongocnn)
    socket.emit('res',{stdout:mongocnn.stdout,stderr:mongocnn.stderr})
    var unlinkfile = await (fileunlinker(filename))
    console.log('unlinkfile???????????????????????', unlinkfile)
  }
  else if(selectedDb == 'rethink'){
    console.log("inside rethink....",data.id)
    var fdata = await (filereader(filename))
    console.log('sfile................', fdata)
    var connection = null;
    var rethinkcnn = await connectToRethink(filename,data,host,port,selectedDb,dbname,temp_id)
    console.log("rethinkcnn...............",rethinkcnn)
    socket.emit('res',{stdout:rethinkcnn.stdout,stderr:rethinkcnn.stderr})
    // socket.emit('_res',{stdout:rethinkcnn.stdout,stderr:rethinkcnn.stderr})
    var unlinkfile = await (fileunlinker(filename))
    console.log('unlinkfile???????????????????????', unlinkfile)
  }
  else if(selectedDb == 'elastic'){
    console.log("inside elastic....")
    var fdata = await (filereader(filename))
    console.log('sfile................', fdata)
    var connection = null;
    var elasticcnn = await connectToElastic(filename,data,host,port,selectedDb,dbname,tempid)
    console.log("elasticcnn...............",elasticcnn)
    socket.emit('res',{stdout:elasticcnn.stdout,stderr:elasticcnn.stderr})
    // socket.emit('_res',{stdout:elasticcnn.stdout,stderr:elasticcnn.stderr})
    var unlinkfile = await (fileunlinker(filename))
    console.log('unlinkfile???????????????????????', unlinkfile)
  }
}
async function dumpToES (makeProductJsonObj,esClient) {
  console.log("called...")
  let bulkRowsString = makeProductJsonObj.map(function (row) {
    console.log("-------------------------",row,"----------------------------");
    return JSON.stringify(row)
  }).join('\n') + '\n'

  return new Promise(function (resolve) {
    esClient.bulk({body: makeProductJsonObj}, function (err, resp) {
      if (!err) {
        resolve('Deleted')
        console.log("makeProductJsonObj deleted.....")
      }
    })
  })
}
var deletedFromMongo = async function(url,id){
  var db = await (MongoClient.connect(url))
    console.log("Connected correctly to server.");
    var obj = await(db.collection("customerData").remove({"importTracker_id":id}))
    console.log(obj.result.n + " document(s) deleted");
    return obj.result
}
var deletedFromRethink = async function(host,port,dbname,id){
  var connection = null;
  var db = await(r.connect({host: host, port: port,db:dbname}))
  var connection = db;
  var del_ids = await(r.table('customerData').filter({"importTracker_id": id}).delete().run(connection))
  console.log("deleted...")
  console.log(JSON.stringify(del_ids, null, 2));
  return del_ids
}

var deletedFromElastic = async function(host,port,dbname,id){
    esClientOption = {
        index : dbname,
        type : 'customerData'
      }
      const esUrl = "http://"+host+":"+port
      const esClient = new elasticsearch.Client({
         host: esUrl
      })
      var res = await(esClient.search({
            index: dbname,
            type: 'customerData',
            body: {"query": { "match": {"importTracker_id":id}},"size":10000}
          }))
    console.log("response...",res.hits.hits)
    let makeDeleteObj = []
        if(res != undefined &&  res.hits.hits.length > 0) {
          res.hits.hits.forEach(function (value, index) {
              makeDeleteObj.push({
                delete: {
                  _index: dbname,
                  _type: "customerData",
                  _id: value._id
                }
            })

          })
          console.log("***************",makeDeleteObj)
          if(makeDeleteObj.length > 0) {
            let retValue = await dumpToES(makeDeleteObj,esClient)
            return retValue
          }
        }
}
