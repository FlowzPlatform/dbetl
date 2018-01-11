// Initializes the `uploaderSchema` service on path `/uploader-schema`
const createService = require('feathers-rethinkdb');
const hooks = require('./uploader-schema.hooks');
const filters = require('./uploader-schema.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'uploader_schema',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploader-schema', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploader-schema');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
