const schema = require('./schema/schema.service.js');
const instance = require('./instance/instance.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(schema);
  app.configure(instance);
};
