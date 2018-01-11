const schema = require('./schema/schema.service.js');
const instance = require('./instance/instance.service.js');
const settings = require('./settings/settings.service.js');
// const approval = require('./approval/approval.service.js');
// const emailtemplate = require('./emailtemplate/emailtemplate.service.js');
// const schemamapping = require('./schemamapping/schemamapping.service.js');
// const flowz = require('./flowz/flowz.service.js');
// const flowzinstance = require('./flowz-instance/flowz-instance.service.js');
// const instancetest = require('./instance-test/instance-test.service.js');
const generatejsondatafile = require('./generatejsondatafile/generatejsondatafile.service.js');
const addInputToJobQue = require('./addInputToJobQue/addInputToJobQue.service.js');
const importtodb = require('./importtodb/importtodb.service.js');
const importTracker = require('./import-tracker/import-tracker.service.js');
const customerUploadedData = require('./customer-uploaded-data/customer-uploaded-data.service.js');
const importToExternalDb = require('./import-to-external-db/import-to-external-db.service.js');
const connectiondata = require('./connectiondata/connectiondata.service.js');
const databases = require('./databases/databases.service.js');
const pdmUploaderData = require('./pdm-uploader-data/pdm-uploader-data.service.js');
const uploader = require('./uploader/uploader.service.js');


const uploaderSchema = require('./uploader-schema/uploader-schema.service.js');


const uploaderCsvFiles = require('./uploader-csv-files/uploader-csv-files.service.js');


const uploaderCsvFileMapping = require('./uploader-csv-file-mapping/uploader-csv-file-mapping.service.js');


const importToJobqueue = require('./import-to-jobqueue/import-to-jobqueue.service.js');


const importToConfirm = require('./import-to-confirm/import-to-confirm.service.js');


module.exports = function() {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(schema);
  app.configure(instance);
  app.configure(settings);
  // app.configure(approval);
  // app.configure(emailtemplate);
  // app.configure(schemamapping);
  // app.configure(flowz);
  // app.configure(flowzinstance);
  // app.configure(instancetest);
  app.configure(generatejsondatafile);
  app.configure(addInputToJobQue)
  app.configure(importtodb);
  app.configure(importTracker);
  app.configure(customerUploadedData);
  app.configure(importToExternalDb);
  app.configure(connectiondata);
  app.configure(databases);
  app.configure(pdmUploaderData);
  app.configure(uploader);
  app.configure(uploaderSchema);
  app.configure(uploaderCsvFiles);
  app.configure(uploaderCsvFileMapping);
  app.configure(importToJobqueue);
  app.configure(importToConfirm);
};
