// Initializes the `customerUploadedData` service on path `/customer-uploaded-data`
const createService = require('feathers-rethinkdb');
const hooks = require('./customer-uploaded-data.hooks');
const filters = require('./customer-uploaded-data.filters');
const socketio = require('feathers-socketio');
var r = require('rethinkdbdash')({
	port: 28015,
	host: 'localhost',
	db: 'FlowzEngine'
});

module.exports = function () {
  const app = this;
  const Model = app.get('rethinkdbClient');
  const paginate = app.get('paginate');

        app.configure(socketio(function(io) {
        io.on('connection', function(socket) {
          console.log("connected successfully.....")
          // socket.emit('customer_uploaded_data',data);
          socket.on('stream',function( data){
              console.log('Found all messages', data);
              var connection = null;
              r.table("customer_uploaded_data")
              .insert(data)
              .run()
              .then(function(response){
              	console.log('Success ',response);
								socket.emit('response',response)
              })
              .error(function(err){
              	console.log('error occurred ',err);
								socket.emit('error',error)
              })

        });

        });
        io.use(function (socket, next) {
         // Exposing a request property to services and hooks
         socket.feathers.referrer = socket.request.referrer;
         next();
       });
       }));

  const options = {
    name: 'customer_uploaded_data',
    Model,
    paginate :false
  };

  // Initialize our service with any options it requires
  app.use('/customer-uploaded-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('customer-uploaded-data');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
