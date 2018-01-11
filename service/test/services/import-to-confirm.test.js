const assert = require('assert');
const app = require('../../src/app');

describe('\'import-to-confirm\' service', () => {
  it('registered the service', () => {
    const service = app.service('import-to-confirm');

    assert.ok(service, 'Registered the service');
  });
});
