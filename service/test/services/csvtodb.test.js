const assert = require('assert');
const app = require('../../src/app');

describe('\'csvtodb\' service', () => {
  it('registered the service', () => {
    const service = app.service('csvtodb');

    assert.ok(service, 'Registered the service');
  });
});
