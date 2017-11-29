
console.log("hooks called...")
module.exports = {
  before: {
    all: [
    ],
    find: [],
    get: [],
    create: [
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [
    ],
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

function postData(hook){
  console.log("************",hook.data)
  console.log("#############",hook)
}
