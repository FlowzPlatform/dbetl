// Initializes the `myuploads` service on path `/myuploads`
const createService = require('./myuploads.class.js');
const hooks = require('./myuploads.hooks');
const filters = require('./myuploads.filters');
const multer = require('multer');
const multipartMiddleware = multer();
const dauria = require('dauria');

// feathers-blob service
const blobService = require('feathers-blob');
// Here we initialize a FileSystem storage,
// but you can use feathers-blob with any other
// storage service like AWS or Google Drive.
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/uploads');


// Upload Service
// app.use('/uploads', blobService({Model: blobStorage}));

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'myuploads',
    paginate
  };

  // Initialize our service with any options it requires
  // app.use('/myuploads', createService(options));
 //  app.use('/myuploads', blobService({Model: blobStorage}));
 // Upload Service with multipart support
  app.use('/myuploads',

      // multer parses the file named 'uri'.
      // Without extra params the data is
      // temporarely kept in memory
      multipartMiddleware.single('uri'),

      // another middleware, this time to
      // transfer the received file to feathers
      function(req,res,next){
        console.log('Here...................')
          req.feathers.file = req.file;
          next();
      },
      blobService({Model: blobStorage})
  );

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('myuploads');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
