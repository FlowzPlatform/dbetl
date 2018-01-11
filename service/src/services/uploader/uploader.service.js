// Initializes the `uploader` service on path `/uploader`
const createService = require('feathers-rethinkdb');
const hooks = require('./uploader.hooks');
const filters = require('./uploader.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'uploader',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/uploader', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('uploader');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
