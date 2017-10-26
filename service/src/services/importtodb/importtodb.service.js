// Initializes the `importtodb` service on path `/importtodb`
const createService = require('./importtodb.class.js');
const hooks = require('./importtodb.hooks');
const filters = require('./importtodb.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'importtodb',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/importtodb', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('importtodb');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
