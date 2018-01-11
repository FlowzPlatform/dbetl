// Initializes the `uploaderCSVFileMapping` service on path `/uploader-csv-file-mapping`
const createService = require('feathers-rethinkdb');
const hooks = require('./uploader-csv-file-mapping.hooks');
const filters = require('./uploader-csv-file-mapping.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'uploader_csv_file_mapping',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploader-csv-file-mapping', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploader-csv-file-mapping');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
