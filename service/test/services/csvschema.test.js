const assert = require('assert');
const app = require('../../src/app');

describe('\'csvschema\' service', () => {
  it('registered the service', () => {
    const service = app.service('csvschema');

    assert.ok(service, 'Registered the service');
  });
});
