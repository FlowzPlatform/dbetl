// Initializes the `customerUploadedSchema` service on path `/customerUploadedSchema`
const createService = require('feathers-mongodb');
const hooks = require('./customerUploadedSchema.hooks');
const filters = require('./customerUploadedSchema.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/customerUploadedSchema', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('customerUploadedSchema');

  mongoClient.then(db => {
    service.Model = db.collection('customerUploadedSchema');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
