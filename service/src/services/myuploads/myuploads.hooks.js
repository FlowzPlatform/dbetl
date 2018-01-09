const dauria = require('dauria');
var Papa = require('papaparse');
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      context => beforeCreate(context)
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

let beforeCreate = function (context) {
  if (!context.data.uri && context.params.file) {
    var file = context.params.file;
    Papa.parse(this.file, {
        header: true,
        encoding: 'UTF-8',
        preview: 5,
        skipEmptyLines: true,
        complete: function (results, file) {
          console.log('result', results.data)
        },
        error: function (error, file) {
          console.log('file', file)
          console.log('Error', error)
        }
      })
      // console.log('file', file);
    const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
    context.data = { uri: uri };
  }
}
