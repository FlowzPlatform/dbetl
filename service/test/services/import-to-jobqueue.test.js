const assert = require('assert');
const app = require('../../src/app');

describe('\'import-to-jobqueue\' service', () => {
  it('registered the service', () => {
    const service = app.service('import-to-jobqueue');

    assert.ok(service, 'Registered the service');
  });
});
