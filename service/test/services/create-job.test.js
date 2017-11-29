const assert = require('assert');
const app = require('../../src/app');

describe('\'createJob\' service', () => {
  it('registered the service', () => {
    const service = app.service('create-job');

    assert.ok(service, 'Registered the service');
  });
});
