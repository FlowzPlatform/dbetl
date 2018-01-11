const assert = require('assert');
const app = require('../../src/app');

describe('\'pdm-tracker\' service', () => {
  it('registered the service', () => {
    const service = app.service('pdm-tracker');

    assert.ok(service, 'Registered the service');
  });
});
