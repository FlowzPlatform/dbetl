const assert = require('assert');
const app = require('../../src/app');

describe('\'connectiondata\' service', () => {
  it('registered the service', () => {
    const service = app.service('connectiondata');

    assert.ok(service, 'Registered the service');
  });
});
