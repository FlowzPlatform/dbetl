const assert = require('assert');
const app = require('../../src/app');

describe('\'customerUploadedData\' service', () => {
  it('registered the service', () => {
    const service = app.service('customer-uploaded-data');

    assert.ok(service, 'Registered the service');
  });
});
