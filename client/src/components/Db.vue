<template>
    <div>
      <Tabs  v-model="tabPane">
        <TabPane label="Mongo DB" name="mongo">
            <Table border :loading="loading" size="small" :columns="mongoCol" :data="mongoDt"></Table>
        </TabPane>
        <TabPane label="Rethink DB" name="rethink">
            <Table border :loading="loading" size="small" :columns="rethinkCol" :data="rethinkDt"></Table>
        </TabPane>
        <TabPane label="Elastic Search" name="elastic">
            <Table border :loading="loading" size="small" :columns="esCol" :data="elasticDt"></Table>
        </TabPane>
        <TabPane label="Ne DB" name="nedb">
            <Table border :loading="loading" size="small" :columns="neCol" :data="nedbDt"></Table>
        </TabPane>
        <TabPane label="MySQL DB" name="mysql">
            <Table border :loading="loading" size="small" :columns="mysqlCol" :data="mysqlDt"></Table>
        </TabPane>
        <Button type="primary" icon="navicon-round" @click="gotocsvJoblist()" size="small" slot="extra">Import Tracker List</Button>
        <Button type="primary" style="margin:5px" icon="plus" @click="addSettings" size="small" slot="extra">Add</Button>
      </Tabs>
    </div>
</template>
<script>
import api from '../api'
import databasesModel from '../api/databases'
import _ from 'lodash'
export default {
  data () {
    return {
      loading: true,
      tabPane: 'mongo',
      row: '',
      mongoCol: [
        {
          title: 'Connection Name',
          key: 'connection_name'
        },
        {
          title: 'Host',
          key: 'host'
        },
        {
          title: 'Port',
          key: 'port'
        },
        {
          title: 'Database Name',
          key: 'dbname'
        },
        {
          title: 'Notes',
          key: 'notes'
        },
        {
          title: 'Import',
          key: 'import',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'upload'
                },
                style: {
                  // color: '#CC0000',
                  color: '#5cadff',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // alert(this.tabPane)
                    this.import(params.row.id)
                  }
                }
              }, ''),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'navicon-round'
                },
                style: {
                  color: '#ff9900',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    this.$router.push('/instancejoblist/' + params.row.id)
                  }
                }
              }, '')
            ])
          }
        },
        {
          title: 'Status',
          key: 'isenable',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: this.mongoDt[params.index].isenable,
                size: 'small'
              },
              on: {
                'on-change': (value) => {
                  this.mongoDt[params.index].isenable = value
                  this.$Modal.confirm({
                    title: 'Confirm',
                    loading: true,
                    content: '<p>Are you sure you want to ' + (value ? 'enable' : 'disable') + ' this database?</p>',
                    onOk: async () => {
                      let returnStatus = await this.handleEnableDisable(this.mongoDt[params.index])
                      if (returnStatus.status === 'error') {
                        this.$Notice.error({
                          title: returnStatus.message,
                          desc: this.mongoDt[params.index].connection_name + ' is not ' + (value ? 'enable' : 'disable')
                        })
                      }
                      this.$Modal.remove()
                    },
                    onCancel: () => {
                      this.mongoDt[params.index].isenable = !value
                    }
                  })
                }
              }
            })
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: ''
                },
                style: {
                  // color: '#CC0000',
                  marginRight: '10px',
                  // padding: '0px',
                  fontSize: '12px'
                },
                on: {
                  click: () => {
                    this.testConnection(this.tabPane, params.index)
                    // alert(this.tabPane)
                    // this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, 'Test'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'trash-b'
                },
                style: {
                  color: '#CC0000',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // alert(this.tabPane)
                    this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, '')
            ])
          }
        }
      ],
      mongoDt: [],
      rethinkCol: [
        {
          title: 'Connection Name',
          key: 'connection_name'
        },
        {
          title: 'Host',
          key: 'host'
        },
        {
          title: 'Port',
          key: 'port'
        },
        {
          title: 'Database Name',
          key: 'dbname'
        },
        {
          title: 'Notes',
          key: 'notes'
        },
        {
          title: 'Import',
          key: 'import',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'upload'
                },
                style: {
                  // color: '#CC0000',
                  color: '#5cadff',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // alert(params)
                    this.import(params.row.id)
                  }
                }
              }, ''),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'navicon-round'
                },
                style: {
                  color: '#ff9900',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    this.$router.push('/instancejoblist/' + params.row.id)
                  }
                }
              }, '')
            ])
          }
        },
        {
          title: 'Status',
          key: 'isenable',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: this.rethinkDt[params.index].isenable,
                size: 'small'
              },
              on: {
                'on-change': (value) => {
                  this.rethinkDt[params.index].isenable = value
                  this.$Modal.confirm({
                    title: 'Confirm',
                    loading: true,
                    content: '<p>Are you sure you want to ' + (value ? 'enable' : 'disable') + ' this database?</p>',
                    onOk: async () => {
                      let returnStatus = await this.handleEnableDisable(this.rethinkDt[params.index])
                      if (returnStatus.status === 'error') {
                        this.$Notice.error({
                          title: returnStatus.message,
                          desc: this.rethinkDt[params.index].connection_name + ' is not ' + (value ? 'enable' : 'disable')
                        })
                      }
                      this.$Modal.remove()
                    },
                    onCancel: () => {
                      this.rethinkDt[params.index].isenable = !value
                    }
                  })
                }
              }
            })
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: ''
                },
                style: {
                  // color: '#CC0000',
                  marginRight: '10px',
                  // padding: '0px',
                  fontSize: '12px'
                },
                on: {
                  click: () => {
                    this.testConnection(this.tabPane, params.index)
                    // alert(this.tabPane)
                    // this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, 'Test'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'trash-b'
                },
                style: {
                  color: '#CC0000',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // this.remove(params.index)
                    this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, '')
            ])
          }
        }
      ],
      rethinkDt: [],
      esCol: [
        {
          title: 'Connection Name',
          key: 'connection_name'
        },
        {
          title: 'Host',
          key: 'host'
        },
        {
          title: 'Port',
          key: 'port'
        },
        {
          title: 'Database Name',
          key: 'dbname'
        },
        {
          title: 'Notes',
          key: 'notes'
        },
        {
          title: 'Import',
          key: 'import',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'upload'
                },
                style: {
                  // color: '#CC0000',
                  color: '#5cadff',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // alert(this.tabPane)
                    this.import(params.row.id)
                  }
                }
              }, ''),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'navicon-round'
                },
                style: {
                  color: '#ff9900',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    this.$router.push('/instancejoblist/' + params.row.id)
                  }
                }
              }, '')
            ])
          }
        },
        {
          title: 'Status',
          key: 'isenable',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: this.elasticDt[params.index].isenable,
                size: 'small'
              },
              on: {
                'on-change': (value) => {
                  this.elasticDt[params.index].isenable = value
                  this.$Modal.confirm({
                    title: 'Confirm',
                    loading: true,
                    content: '<p>Are you sure you want to ' + (value ? 'enable' : 'disable') + ' this database?</p>',
                    onOk: async () => {
                      let returnStatus = await this.handleEnableDisable(this.elasticDt[params.index])
                      if (returnStatus.status === 'error') {
                        this.$Notice.error({
                          title: returnStatus.message,
                          desc: this.elasticDt[params.index].connection_name + ' is not ' + (value ? 'enable' : 'disable')
                        })
                      }
                      this.$Modal.remove()
                    },
                    onCancel: () => {
                      this.elasticDt[params.index].isenable = !value
                    }
                  })
                }
              }
            })
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: ''
                },
                style: {
                  // color: '#CC0000',
                  marginRight: '10px',
                  // padding: '0px',
                  fontSize: '12px'
                },
                on: {
                  click: () => {
                    this.testConnection(this.tabPane, params.index)
                    // alert(this.tabPane)
                    // this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, 'Test'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'trash-b'
                },
                style: {
                  color: '#CC0000',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // this.remove(params.index)
                    this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, '')
            ])
          }
        }
      ],
      elasticDt: [],
      neCol: [
        {
          title: 'Connection Name',
          key: 'connection_name'
        },
        {
          title: 'Host',
          key: 'host'
        },
        {
          title: 'Port',
          key: 'port'
        },
        {
          title: 'Database Name',
          key: 'dbname'
        },
        {
          title: 'Notes',
          key: 'notes'
        },
        {
          title: 'Status',
          key: 'isenable',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: this.nedbDt[params.index].isenable,
                size: 'small'
              },
              on: {
                'on-change': (value) => {
                  this.nedbDt[params.index].isenable = value
                  this.$Modal.confirm({
                    title: 'Confirm',
                    loading: true,
                    content: '<p>Are you sure you want to ' + (value ? 'enable' : 'disable') + ' this database?</p>',
                    onOk: async () => {
                      let returnStatus = await this.handleEnableDisable(this.nedbDt[params.index])
                      if (returnStatus.status === 'error') {
                        this.$Notice.error({
                          title: returnStatus.message,
                          desc: this.nedbDt[params.index].connection_name + ' is not ' + (value ? 'enable' : 'disable')
                        })
                      }
                      this.$Modal.remove()
                    },
                    onCancel: () => {
                      this.nedbDt[params.index].isenable = !value
                    }
                  })
                }
              }
            })
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: ''
                },
                style: {
                  // color: '#CC0000',
                  marginRight: '10px',
                  // padding: '0px',
                  fontSize: '12px'
                },
                on: {
                  click: () => {
                    this.testConnection(this.tabPane, params.index)
                    // alert(this.tabPane)
                    // this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, 'Test'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'trash-b'
                },
                style: {
                  color: '#CC0000',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // this.remove(params.index)
                    this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, '')
            ])
          }
        }
      ],
      nedbDt: [],
      mysqlCol: [
        {
          title: 'Connection Name',
          key: 'connection_name'
        },
        {
          title: 'Host',
          key: 'host'
        },
        {
          title: 'Port',
          key: 'port'
        },
        {
          title: 'Database Name',
          key: 'dbname'
        },
        {
          title: 'Notes',
          key: 'notes'
        },
        {
          title: 'Import',
          key: 'import',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'upload'
                },
                style: {
                  color: '#5cadff',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // alert(this.tabPane)
                    this.import(params.row.id)
                  }
                }
              }, ''),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'navicon-round'
                },
                style: {
                  color: '#ff9900',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    this.$router.push('/instancejoblist/' + params.row.id)
                  }
                }
              }, '')
            ])
          }
        },
        {
          title: 'Status',
          key: 'isenable',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('i-switch', {
              props: {
                value: this.mysqlDt[params.index].isenable,
                size: 'small'
              },
              on: {
                'on-change': (value) => {
                  this.mysqlDt[params.index].isenable = value
                  this.$Modal.confirm({
                    title: 'Confirm',
                    loading: true,
                    content: '<p>Are you sure you want to ' + (value ? 'enable' : 'disable') + ' this database?</p>',
                    onOk: async () => {
                      let returnStatus = await this.handleEnableDisable(this.mysqlDt[params.index])
                      if (returnStatus.status === 'error') {
                        this.$Notice.error({
                          title: returnStatus.message,
                          desc: this.mysqlDt[params.index].connection_name + ' is not ' + (value ? 'enable' : 'disable')
                        })
                      }
                      this.$Modal.remove()
                    },
                    onCancel: () => {
                      this.mysqlDt[params.index].isenable = !value
                    }
                  })
                }
              }
            })
          }
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small',
                  icon: ''
                },
                style: {
                  // color: '#CC0000',
                  marginRight: '10px',
                  // padding: '0px',
                  fontSize: '12px'
                },
                on: {
                  click: () => {
                    this.testConnection(this.tabPane, params.index)
                    // alert(this.tabPane)
                    // this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, 'Test'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'trash-b'
                },
                style: {
                  color: '#CC0000',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    // this.remove(params.index)
                    this.instanceRemove(this.tabPane, params.index)
                  }
                }
              }, '')
            ])
          }
        }
      ],
      mysqlDt: []
    }
  },
  methods: {
    gotocsvJoblist () {
      this.$router.push('/jobs/list')
    },
    addSettings () {
      this.$router.push('db/' + this.tabPane + '/new')
    },
    import (id) {
      this.$router.push('Dbsetting/import/' + id)
    },
    instanceRemove (db, index) {
      this.$Modal.confirm({
        title: 'Confirm',
        content: '<p>Are you sure you want to delete Connection?</p>',
        onOk: () => {
          var id = this[db + 'Dt'][index].id
          databasesModel.delete(id)
          .then(response => {
            this[db + 'Dt'].splice(index, 1)
            this.$Notice.success({title: 'Success', desc: 'Connection Deleted.....'})
          })
          .catch(error => {
            this.$Notice.error({title: 'Error', desc: error.message})
          })
        },
        onCancel: () => {
        }
      })
    },
    async handleEnableDisable (data) {
      return await databasesModel.patch(data.id, {isenable: data.isenable}).then(response => {
        return {status: 'success'}
      }).catch(error => {
        return {status: 'error', message: error.message}
      })
    },
    getSettings () {
      databasesModel.get()
      .then(response => {
        this.mongoDt = _.filter(response, {selectedDb: 'mongo'})
        this.rethinkDt = _.filter(response, {selectedDb: 'rethink'})
        this.elasticDt = _.filter(response, {selectedDb: 'elastic'})
        this.nedbDt = _.filter(response, {selectedDb: 'nedb'})
        this.mysqlDt = _.filter(response, {selectedDb: 'mysql'})
        this.loading = false
      })
      .catch(error => {
        this.$Notice.error({
          duration: 10,
          title: 'Error!!',
          desc: error.message
        })
        this.loading = false
      })
    },
    testConnection (db, index) {
      var tdata = this[db + 'Dt'][index]
      // console.log('testConnection',data)
      api.request('post', '/settings?checkconn=' + db, tdata)
        .then(res => {
          // console.log('testConnection response', res.data)
          if (res.data.hasOwnProperty('result')) {
            var title = ''
            var content = '<p>Content of dialog</p><p>Content of dialog</p>'
            var mtype = ''
            if (res.data.result) {
              title = 'Sucess!!'
              mtype = 'success'
              content = '<b>Successfully Connected to Database</b>'
            } else {
              title = 'Error!!'
              mtype = 'error'
              if (db === 'mongo') {
                content = res.data.error.message
              } else if (db === 'rethink') {
                content = res.data.error.msg
              } else if (db === 'elastic') {
                content = res.data.error.message
              } else {
                content = JSON.stringify(res.data.error)
              }
            }
            this.$Modal[mtype]({
              title: title,
              content: content,
              width: 500
            })
          } else {
            this.$Notice.error({
              duration: 10,
              title: 'Error!!',
              desc: ''
            })
          }
        })
        .catch(err => {
          this.$Notice.error({
            duration: 10,
            title: 'Error!!',
            desc: err.message
          })
        })
    }
  },
  mounted () {
    this.getSettings()
  },
  feathers: {
    'databases': {
      updated (data) {
        // console.log('connectiondata updated..', data)
        var findKey = _.findKey(this[data.selectedDb + 'Dt'], {id: data.id})
        this[data.selectedDb + 'Dt'][findKey] = data
      },
      created (data) {
        // console.log('connectiondata created..', data)
        // console.log(this[data.selectedDb + 'Dt'])
        this[data.selectedDb + 'Dt'].push(data)
      },
      removed (data) {
        // console.log('connectiondata removed..', data)
      }
    }
  }
}
</script>
<style>
.expand-row{
  margin-bottom: 16px;
}
.ivu-table-small th {
  height: 32px;
  background-color: #394263;
  color: #fff;
}
.btn {
  margin-top: 20px;
}
</style>