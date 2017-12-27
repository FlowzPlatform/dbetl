let errors = require('@feathersjs/errors');
var endecrypt = require('../encryption/security')
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
      response.data[0].password = endecrypt.decrypt(response.data[0].password)
      hook.result = response.data[0];
    } else {
      throw new errors.NotAuthenticated();
    }
    return hook;
  });
};

var beforeCreate = (hook) => {
  hook.data.userId = hook.params.user._id;
  // hook.data.userId = hook.params.headers.userId;
  hook.data.createdAt = new Date();
  hook.data.password = endecrypt.encrypt(hook.data.password)
};

var beforeUpdate = async(hook) => {
  if (!(await checkValidUser(hook))) {
    throw new errors.NotAuthenticated();
  }
};

var beforePatch = async(hook) => {
  if (!(await checkValidUser(hook))) {
    throw new errors.NotAuthenticated();
  }
};

var beforeRemove = async(hook) => {
  if (!(await checkValidUser(hook))) {
    throw new errors.NotAuthenticated();
  }
};

var checkValidUser = async(hook) => {
  hook.params.query.userId = hook.params.user._id;
  if (hook.id) {
    const query = Object.assign({
      id: hook.id
    }, hook.params.query);

    return hook.app.service('databases').find({ query }).then(response => {
      if (response.data.length === 1) {
        return true
      } else {
        return false
      }
    }).catch(e => {
      throw new errors.Forbidden()
    });
  }
};
