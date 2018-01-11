const assert = require('assert');
const app = require('../../src/app');

describe('\'uploaderCSVFileMapping\' service', () => {
  it('registered the service', () => {
    const service = app.service('uploader-csv-file-mapping');

    assert.ok(service, 'Registered the service');
  });
});
