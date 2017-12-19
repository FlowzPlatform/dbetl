let errors = require('@feathersjs/errors');
module.exports = {
  before: {
    all: [],
    find: [
      hook => beforeFind(hook)
    ],
    get: [
      hook => beforeGet(hook)
    ],
    create: [
      hook => beforeCreate(hook)
    ],
    update: [
      hook => beforeUpdate(hook)
    ],
    patch: [
      hook => beforePatch(hook)
    ],
    remove: [
      hook => beforeRemove(hook)
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [

    ],
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

let beforeFind = (hook) => {
  if (hook.params.user) {
    hook.params.query.userId = hook.params.user._id;
  }
};

var beforeGet = (hook) => {
  hook.params.query.userId = hook.params.user._id;
  const query = Object.assign({
    id: hook.id
  }, hook.params.query);

  return hook.app.service('databases').find({ query }).then(response => {
    if (response.data.length === 1) {
      hook.result = response[0];
    } else {
      throw new errors.BadRequest();
    }
    return hook;
  });
};

var beforeCreate = (hook) => {
  hook.data.userId = hook.params.user._id;
  // hook.data.userId = hook.params.headers.userId;
  hook.data.createdAt = new Date();
};

var beforeUpdate = () => {
  throw new errors.NotImplemented();
};

var beforePatch = () => {
  throw new errors.NotImplemented();
};

var beforeRemove = (hook) => {
  hook.params.query.userId = hook.params.user._id;
  if (hook.id) {
    const query = Object.assign({
      id: hook.id
    }, hook.params.query);

    return hook.app.service('databases').find({ query }).then(response => {
      if (response.data.length !== 1) {
        throw new errors.BadRequest();
      }
    });
  }
};
