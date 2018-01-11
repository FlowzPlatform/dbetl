const assert = require('assert');
const app = require('../../src/app');

describe('\'/pdm_uploader_data\' service', () => {
  it('registered the service', () => {
    const service = app.service('pdm-uploader-data');

    assert.ok(service, 'Registered the service');
  });
});
