// Initializes the `importTracker` service on path `/import-tracker`
const createService = require('feathers-rethinkdb');
const hooks = require('./import-tracker.hooks');
const filters = require('./import-tracker.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'import_tracker',
    Model,
    paginate : false
  };

  // Initialize our service with any options it requires
  app.use('/import-tracker', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('import-tracker');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
