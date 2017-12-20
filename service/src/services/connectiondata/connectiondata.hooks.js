let async = require('asyncawait/async');
let await = require('asyncawait/await');
// const app = require('config');

module.exports = {
  before: {
    all: [
    ],
    find: [
      hook => beforeAll(hook)
    ],
    get: [],
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


var beforeAll = async(function(hook) {
  console.log(hook)
})