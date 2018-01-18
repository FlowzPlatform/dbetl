// Initializes the `databases` service on path `/databases`
const createService = require('feathers-rethinkdb');
const hooks = require('./databases.hooks');
const filters = require('./databases.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'databases',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/databases', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('databases');
  // https://github.com/feathersjs/feathers/issues/177
  service.patched = (datatbases, params, callback) => {
    console.log('patch socket', params)
      // if(params.ids.indexOf(todo.id) !== -1) {
      //   return callback(null, todo);
      // }
    return callback(null, datatbases);
    // callback(null, false);
  };

  // service.find = (data, params, callback) => {
  //   console.log('abc')
  //   callback(new { 'abc': 123 });
  // };

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
