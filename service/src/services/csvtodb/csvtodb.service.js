// Initializes the `csvtodb` service on path `/csvtodb`
const createService = require('feathers-rethinkdb');
const hooks = require('./csvtodb.hooks');
const filters = require('./csvtodb.filters');

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

  const options = {
    name: 'csvtodb',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/csvtodb', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('csvtodb');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
// Initializes the `customerUploadedData` service on path `/customer-uploaded-data`
// const createService = require('feathers-rethinkdb');
// const hooks = require('./csvtodb.hooks');
// const filters = require('./csvtodb.filters');
// const socketio = require('feathers-socketio');
// const config = require('../config')
// var r = require('rethinkdbdash')(config.rethinkdb);
// module.exports = function() {
//   const app = this;
//   const Model = app.get('rethinkdbClient');
//   const paginate = app.get('paginate');
//   app.configure(socketio(function(io) {
//     io.on('connection', function(socket) {
//       console.log("connected successfully.....")
//       // socket.emit('customer_uploaded_data',data);
//       socket.on('stream1', function(data) {
//         console.log('Found all messages');
//         var connection = null;
//         r.table("csvtodb")
//           .insert(data)
//           .run()
//           .then(function(response) {
//             console.log('Success ', response);
//             // socket.emit('response', response)
//           })
//           .error(function(err) {
//             console.log('error occurred ', err);
//             // socket.emit('error', error)
//           })
//       });
//     });
//     io.use(function(socket, next) {
//       // Exposing a request property to services and hooks
//       socket.feathers.referrer = socket.request.referrer;
//       next();
//     });
//   }));
//   const options = {
//     name: 'csvtodb',
//     Model,
//     paginate: false
//   };
//   // Initialize our service with any options it requires
//   app.use('/csvtodb', createService(options));
//   // Get our initialized service so that we can register hooks and filters
//   const service = app.service('csvtodb');
//   service.hooks(hooks);
//   if (service.filter) {
//     service.filter(filters);
//   }
// };
