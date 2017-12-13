const assert = require('assert');
const app = require('../../src/app');

describe('\'databases\' service', () => {
  it('registered the service', () => {
    const service = app.service('databases');

    assert.ok(service, 'Registered the service');
  });
});
