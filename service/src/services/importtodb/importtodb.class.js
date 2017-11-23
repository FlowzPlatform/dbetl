/* eslint-disable no-unused-vars */
//let file = require('fs').createWriteStream('/path/to/file.jpg');
let shell = require('shelljs');
class Service {
  constructor(options) {
    this.options = options || {};
  }
  find(params) {
    return Promise.resolve([]);
  }
  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }
  create(data, params) {

    // let resp;
    // fs.exists('temp', async function(exists) {
    //   if (exists) {} else {
    //     fs.mkdir('temp', async function(err) {
    //       if (err) {
    //         console.log(err);
    //         return false;
    //       } else {
    //
    //       }
    //     })
    //   }
    // })
    // resp = writeFile(data);
    // return resp
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current)));
    // }
    // let AWS = require('aws-sdk'),
    //   fs = require('fs');
    // AWS.config.update({
    //   accessKeyId: process.env.AWSACCESSKEYID,
    //   secretAccessKey: process.env.AWSSECRETACCESSKEY
    // });
    // console.log("process.env.AWSBUCKET ", process.env.AWSBUCKET);
    // let s3 = new AWS.S3();
    // let awsparams = {
    //   Bucket: process.env.AWSBUCKET,
    //   Key: 'temp/1509343309144.json'
    // };
    // console.log("called import");
    //var file = fs.createWriteStream('../write.txt');
    // s3.getObject(awsparams , function(err, data) {
    //   if (err) console.log(err)
    //   console.log(data);
    // })
    var req = s3.getObject(awsparams, function (err) {
      if (err !== null) {
        //callback( err );
      }
    });
    req.done = false;
    req.on('httpData', function (chunk) {
      if (req.done == false) {
        console.log(chunk.toJSON());
        //fs.createWriteStream("/path")
      } else {
        console.log('data sent after done for: ');
      }
    });
    req.on('httpDone', function () {
      //shell.exec("ps axf | grep <process name> | grep -v grep ")
      if (req.done == false) {
        req.done = true;
        shell.echo('importing to database');
        //shell.exec('rethinkdb import -f data.json --table flowzPDM.customerUploadedData --force');
        shell.exec("mongoimport -h localhost:3001 --db flowzPDM --collection customerUploadedData --file dataq.json --jsonArray")
      } else {
        console.log('done called twice for ');
      }
    });
    //.createReadStream().pipe(file)
    // .on('error', function(err) {
    //     console.log("err");
    //     if (self.logger) self.logger.error("S3Dataset download error key:%s error:%@", options.fileName, error);
    //     return callback(error);
    //   })
    //   .on('httpData', function(chunk) {
    //     console.log("chunk ", chunk);
    //     //file.write(chunk);
    //   })
    //   .on('httpDone', function() {
    //     console.log("got the file");
    //     // file.end();
    //     // if (self.logger) self.logger.info("S3Dataset file download saved to %s", options.filePath);
    //     //return callback(null, done);
    //   })
    // console.log("done");
    return Promise.resolve(data);
  }
  update(id, data, params) {
    return Promise.resolve(data);
  }
  patch(id, data, params) {
    return Promise.resolve(data);
  }
  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}
module.exports = function (options) {
  return new Service(options);
};
module.exports.Service = Service;
