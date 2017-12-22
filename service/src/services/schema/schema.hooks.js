let errors = require('@feathersjs/errors');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
       hook => beforeGet(hook)
    ],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

var beforeGet = (hook) => {
  hook.params.query.userId = hook.params.user._id;
  const query = Object.assign({
    id: hook.id
  }, hook.params.query);

  return hook.app.service('databases').find({ query }).then(response => {
    if (response.data.length === 1) {
      hook.params.data = response.data[0]
    } else {
      throw new errors.BadRequest();
    }
    return hook;
  });
};