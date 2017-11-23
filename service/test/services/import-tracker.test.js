const assert = require('assert');
const app = require('../../src/app');

describe('\'importTracker\' service', () => {
  it('registered the service', () => {
    const service = app.service('import-tracker');

    assert.ok(service, 'Registered the service');
  });
});
