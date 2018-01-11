// Initializes the `import-to-jobqueue` service on path `/import-to-jobqueue`
const createService = require('feathers-rethinkdb');
const hooks = require('./import-to-jobqueue.hooks');
const filters = require('./import-to-jobqueue.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'import_to_jobqueue',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/import-to-jobqueue', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('import-to-jobqueue');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
