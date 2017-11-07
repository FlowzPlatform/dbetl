/* eslint-disable no-unused-vars */
const fs = require("fs")
const path = require('path')
const config = require("config")
const shell = require('shelljs');

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



    async create(data, params) {
        let respAws;
        fs.exists('temp', async function(exists) {
            console.log("exists ", exists);
            if (exists) {} else {
                fs.mkdir('temp', async function(err) {
                    if (err) {
                        console.log("3 Date.now() ", Date.now());
                        console.log(err);
                        return false;
                    } else {

                    }
                })
            }
        })
      }
    })
    respAws = await this.writeFile(data);
    return respAws
  }


  async writeFile(data) {
    let scopeFs;
    try
    {
      let file_name = 'temp/' + Date.now() + '.json';
      fs.writeFile(file_name, JSON.stringify(data), async function(err, result) {
        if (err) {
          console.log(err);
        }
        console.log("file " + file_name + " written ");
      });
    //  scopeFs = await this.uploadToS3(file_name)
      scopeFs = await this.saveDataToMongo(file_name)
    } catch (e) {
      console.log("Cannot write file ", e);
    }


    async writeFile(data) {
        let scopeFs;
        try {
            let file_name = 'temp/' + Date.now() + '.json';
            fs.writeFile(file_name, JSON.stringify(data), async function(err, result) {
                if (err) {
                    console.log(err);
                }
                console.log("file " + file_name + " written ");
            });
            scopeFs = await this.uploadToS3(file_name)
        } catch (e) {
            console.log("Cannot write file ", e);
        }

        return scopeFs;
    }

    async uploadToS3(filename) {
        let uploadS3Res;
        var AWS = require('aws-sdk'),
            fs = require('fs');

    return new Promise(function(resolve, reject) {

      fs.readFile(filename, function(err, data) {
        if (err) {
          reject(err);
        }

        var base64data = new Buffer(data, 'binary');
        var s3 = new AWS.S3();
        s3.putObject({
          Bucket: process.env.AWSBUCKET,
          Key: filename,
          Body: base64data,
          ACL: 'public-read'
        }, function(resp) {
          uploadS3Res = {
            "res": arguments
          }
          fs.unlink(filename, function(err, result) {
            if (err) throw err;
          });
          resolve(uploadS3Res)
        });

        return new Promise(function(resolve, reject) {
            fs.readFile(filename, function(err, data) {
                if (err) {
                    reject(err);
                }
                var base64data = new Buffer(data, 'binary');
                var s3 = new AWS.S3();
                s3.putObject({
                    Bucket: config.get("awsBucket"),
                    Key: filename,
                    Body: base64data,
                    ACL: 'public-read'
                }, function(resp) {
                    //console.log(resp);
                    console.log(arguments);
                    uploadS3Res = {
                        "res": arguments,
                        msg: 'Successfully uploaded file to S3.',
                        code: 200
                    }
                    fs.unlink(filename, function(err, result) {
                        if (err) throw err;
                    });
                    resolve(uploadS3Res)
                });
            })
        })
    }

  async saveDataToMongo(filename) {
    return new Promise(function(resolve, reject) {
      fs.readFile(filename, function(err, data) {
        if (err) {
          reject(err);
        }
        shell.exec("mongoimport -h localhost:3001 --db flowzPDM --collection customerUploadedData --file "+filename+" --jsonArray");

        fs.unlink(filename, function(err, result) {
          if (err) throw err;
        });
        resolve("saved to database")
      })

    })
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

module.exports = function(options) {
    return new Service(options);
};

module.exports.Service = Service;
