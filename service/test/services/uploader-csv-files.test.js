const assert = require('assert');
const app = require('../../src/app');

describe('\'uploaderCSVFiles\' service', () => {
  it('registered the service', () => {
    const service = app.service('uploader-csv-files');

    assert.ok(service, 'Registered the service');
  });
});
