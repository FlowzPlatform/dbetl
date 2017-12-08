// Initializes the `generatejsondatafile` service on path `/generatejsondatafile`
const createService = require('./generatejsondatafile.class.js');
const hooks = require('./generatejsondatafile.hooks');
const filters = require('./generatejsondatafile.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'generatejsondatafile',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/generatejsondatafile', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('generatejsondatafile');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
