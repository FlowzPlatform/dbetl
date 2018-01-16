const assert = require('assert');
const app = require('../../src/app');

describe('\'myuploads\' service', () => {
  it('registered the service', () => {
    const service = app.service('myuploads');

    assert.ok(service, 'Registered the service');
  });
});
