// Initializes the `importToExternalDb` service on path `/import-to-external-db`
const createService = require('feathers-rethinkdb');
const hooks = require('./import-to-external-db.hooks');
const filters = require('./import-to-external-db.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'import_to_external_db',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/import-to-external-db', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('import-to-external-db');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
