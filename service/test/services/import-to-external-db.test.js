const assert = require('assert');
const app = require('../../src/app');

describe('\'importToExternalDb\' service', () => {
  it('registered the service', () => {
    const service = app.service('import-to-external-db');

    assert.ok(service, 'Registered the service');
  });
});
