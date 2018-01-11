// Initializes the `import-to-confirm` service on path `/import-to-confirm`
const createService = require('feathers-rethinkdb');
const hooks = require('./import-to-confirm.hooks');
const filters = require('./import-to-confirm.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'import_to_confirm',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/import-to-confirm', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('import-to-confirm');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
