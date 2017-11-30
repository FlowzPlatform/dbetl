<template>
  <div class="recordList">
    <f-Tab></f-Tab>
    <div>
      <Row style="padding-bottom:10px">
        <Breadcrumb>
          <BreadcrumbItem>{{crumbData.db}}</BreadcrumbItem>
          <BreadcrumbItem>{{crumbData.cname}}</BreadcrumbItem>
          <BreadcrumbItem>{{crumbData.tname}}</BreadcrumbItem>
        </Breadcrumb>
      </Row>
      <Row>
        <div class="ivu-tabs-tabpane">
          <div class="ivu-table-wrapper">
            <div class="ivu-table ivu-table-border">
              <div class="ivu-table-body">
                <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                  <colgroup>
                    <col width="80">
                    <col width="20">
                  </colgroup>
                  <thead>
                    <tr>
                      <th class="">
                        <div class="ivu-table-cell">
                          <span>Instance ID</span>
                        </div>
                      </th>
                      <th class="">
                          <div class="ivu-table-cell">
                              <span>Action</span>
                          </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="ivu-table-tbody">            
                    <template v-for="(value, index) in tableData">
                      <tr class="ivu-table-row" >
                        <td class="">
                          <div class="ivu-table-cell">
                            <span style="float:left">{{ value._id }}</span>
                          </div>
                        </td>
                        <td class="">
                          <div class="ivu-table-cell">
                            <span v-if="openTrasformEditorIndex != -1 && index == openTrasformEditorIndex">
                              <Tooltip placement="top" content="Update">
                                <a @click="updatedvalue(index)"><Icon  type="checkmark" style="font-size: 20px;"></Icon></a>
                              </Tooltip>
                              <a style= 'color:red' @click="cancelHandle(index)"><Icon type="android-cancel" style="font-size: 20px;"></Icon></a>
                            </span>
                            <span v-else>
                              <a @click="show(index)"><Icon  type="edit" style="font-size: 20px;"></Icon></a>
                              <a style= 'color:red'><Icon type="android-delete" style="font-size: 20px;"></Icon></a>
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="openTrasformEditorIndex === index">
                        <td colspan="2" class="json-viewer">
                          <vue-json-editor v-model="jsoneditordata" :showBtns="false" @json-change="onJsonChange"></vue-json-editor>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Row>
      
    </div>
  </div>
</template>

<script>
import ConnectionData from '../api/connectiondata'
import settings from '../api/settings'
import Tab from './Tab'
import vueJsonEditor from 'vue-json-editor'

const _ = require('lodash')
export default {
  name: 'recordList',
  components: {
    'f-Tab': Tab,
    'vueJsonEditor': vueJsonEditor
  },
  data () {
    return {
      jsoneditordata: {},
      tableData: [],
      openTrasformEditorIndex: -1,
      // finalvalue: {},
      crumbData: {}
    }
  },
  methods: {
    show (index) {
      if (this.crumbData.db === 'mysql') {

      } else {
        let rowid = _.cloneDeep(this.tableData[index])
        if (rowid.hasOwnProperty('_id') === true) {
          delete rowid._id
        }
        if (rowid.hasOwnProperty('id') === true) {
          delete rowid.id
        }
        this.jsoneditordata = rowid
        if (this.openTrasformEditorIndex === index) {
          this.openTrasformEditorIndex = -1
          return false
        }
        this.openTrasformEditorIndex = index
      }
    },
    init () {
      // alert(this.$route.params.id + '/' + this.$route.params.tname)
      let self = this
      this.openTrasformEditorIndex = -1
      ConnectionData.get().then(response => {
        // console.log('response', response.data)
        settings.getThis(self.$route.params.id).then(res => {
          var insId = res.data.id
          var sDb = res.data.selectedDb
          self.crumbData.cname = res.data.connection_name
          self.crumbData.db = sDb
          self.crumbData.tname = self.$route.params.tname
          _.forEach(response.data, (connd, cinx) => {
            if (connd.db === sDb) {
              _.forEach(connd.db_data, (insd, iinx) => {
                if (insd.inst_id === insId) {
                  _.forEach(insd.inst_data, (tabled, tinx) => {
                    if (tabled.t_name === self.$route.params.tname) {
                      self.tableData = tabled.t_data
                    }
                  })
                }
              })
            }
          })
        })
      }).catch(error => {
        this.$Notice.error({
          title: error,
          desc: 'connection to the server timed out',
          duration: 0
        })
      })
    },
    onJsonChange (value) {
      // console.log('value.......', value)
      // if (this.tableData[this.openTrasformEditorIndex].hasOwnProperty('_id') === true) {
      //   value['_id'] = this.tableData[this.openTrasformEditorIndex]._id
      // }
      // if (this.tableData[this.openTrasformEditorIndex].hasOwnProperty('id') === true) {
      //   value['id'] = this.tableData[this.openTrasformEditorIndex].id
      // }
      // console.log('value:', value)
      // this.finalvalue = value
      this.jsoneditordata = value
    },
    updatedvalue (index) {
      var obj = {}
      if (this.tableData[this.openTrasformEditorIndex].hasOwnProperty('_id') === true) {
        this.jsoneditordata['_id'] = this.tableData[this.openTrasformEditorIndex]._id
      }
      if (this.tableData[this.openTrasformEditorIndex].hasOwnProperty('id') === true) {
        this.jsoneditordata['id'] = this.tableData[this.openTrasformEditorIndex].id
      }
      obj.inst_id = this.$route.params.id
      obj.tname = this.$route.params.tname
      obj.data = this.jsoneditordata
      var isequal = _.isEqual(this.jsoneditordata, this.tableData[this.openTrasformEditorIndex])
      // console.log('final value', this.jsoneditordata, this.tableData[this.openTrasformEditorIndex], ss)
      if (!isequal) {
        var mid
        if (obj.data.hasOwnProperty('id')) {
          mid = obj.data.id
        }
        if (obj.data.hasOwnProperty('_id')) {
          mid = obj.data._id
        }
        if (mid !== undefined) {
          ConnectionData.put(mid, obj).then(response => {
            console.log('response', response.data)
            this.$Notice.success({ title: 'Suceess!', desc: 'record updated....' })
          }).catch(error => {
            console.log(error)
            this.$Notice.error({ title: 'Error', desc: 'record not updated....' })
          })
        }
      }
      this.openTrasformEditorIndex = -1
    },
    cancelHandle (index) {
      this.openTrasformEditorIndex = -1
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route.params.id' (newId, oldId) {
      // fetch data
      // console.log(newId)
      this.init()
    },
    '$route.params.tname' (newId, oldId) {
      // fetch data
      // console.log(newId)
      this.init()
    }
  },
  feathers: {
    'connectiondata': {
      updated (data) {
        console.log('connectiondata updated..', data)
        this.init()
      },
      created (data) {
        console.log('connectiondata created..', data)
        this.init()
      },
      removed (data) {
        console.log('connectiondata removed..', data)
        this.init()
      }
    }
  }
}
</script>
<style>
  .f-layout-content{
    min-height: 171px !important
  }
	.ivu-table th {
    height: 44px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #394263;
    color: #fff;
}
div.jsoneditor tr, div.jsoneditor th, div.jsoneditor td {
  height: -webkit-fill-available !important;
}
.jsoneditor-tree {
  border-color: white !important;
}
.jsoneditor-separator {
  border-right-color: white !important;
  border-bottom: white !important;
}
.jsoneditor-vue div.jsoneditor-tree {
  min-height: 0px !important;
}
div.jsoneditor-tree {
  overflow: hidden !important;
}
</style>
