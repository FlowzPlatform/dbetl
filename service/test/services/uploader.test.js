const assert = require('assert');
const app = require('../../src/app');

describe('\'uploader\' service', () => {
  it('registered the service', () => {
    const service = app.service('uploader');

    assert.ok(service, 'Registered the service');
  });
});
