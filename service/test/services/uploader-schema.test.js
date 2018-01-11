const assert = require('assert');
const app = require('../../src/app');

describe('\'uploaderSchema\' service', () => {
  it('registered the service', () => {
    const service = app.service('uploader-schema');

    assert.ok(service, 'Registered the service');
  });
});
