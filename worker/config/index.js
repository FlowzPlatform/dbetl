module.exports = {
  "rethinkdb": {
    "host": process.env.RDB_HOST,
    "port": process.env.RDB_PORT,
    "db": "FlowzDBETL"
  },
  "qOptions": {
    "name": "import_to_external_db",
    "masterInterval": 60000,
    "changeFeed": true,
    "concurrency": 1,
    "removeFinishedJobs": false
  },
  "flowz_table": "flowzinstance",
  "scheduler_table": "scheduler",
  "syetem_logs_table": "flowz_system_logs",
  "qJobTimeout": 3600000,
  "qJobRetryMax": 0
}