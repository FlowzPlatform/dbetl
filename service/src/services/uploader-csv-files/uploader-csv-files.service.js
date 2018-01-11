// Initializes the `uploaderCSVFiles` service on path `/uploader-csv-files`
const createService = require('feathers-rethinkdb');
const hooks = require('./uploader-csv-files.hooks');
const filters = require('./uploader-csv-files.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'uploader_csv_files',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploader-csv-files', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploader-csv-files');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
