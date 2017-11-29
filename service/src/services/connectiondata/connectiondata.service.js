// Initializes the `connectiondata` service on path `/connectiondata`
const createService = require('./connectiondata.class.js');
const hooks = require('./connectiondata.hooks');
const filters = require('./connectiondata.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'connectiondata',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/connectiondata', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('connectiondata');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
