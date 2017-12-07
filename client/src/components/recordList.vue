<template>
  <div class="recordList">
    <f-Tab></f-Tab>
    <div v-if="!setData" class="demo-spin-container">
        <Spin fix size="large"></Spin>
    </div>
    <div v-else>
      <Row style="padding-bottom:10px">
        <Col span="21">
          <Breadcrumb separator="<b class='demo-breadcrumb-separator'>/</b>">
            <BreadcrumbItem>{{crumbData.db}}</BreadcrumbItem>
            <BreadcrumbItem>{{crumbData.cname}}</BreadcrumbItem>
            <BreadcrumbItem>{{crumbData.tname}}</BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col span="3">
          Total: &nbsp;<b>{{tableData.length}}</b>        
        </Col>
      </Row>
      <Row>
        <!-- <div v-if="!setData" class="demo-spin-container">
            <Spin fix size="large"></Spin>
        </div> -->
        <!-- <Spin v-if="!setData" size="large"></Spin> -->
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
                        <td class="" >
                          <div v-if="value._id != undefined" class="ivu-table-cell">
                              <Col span="8">{{ value._id }}</Col>
                              <Col span="16">{{ getSomeValue(value) }}</Col>
                          </div>
                          <div class="ivu-table-cell" v-else style="float:left">
                              <Col span="8">{{ value.id }}</Col>
                              <Col span="16">{{ getSomeValue(value) }}</Col>
                          </div>
                        </td>
                        <td class="">
                          <div class="ivu-table-cell">
                            <span v-if="viewData[index].isUpdate">
                              <Tooltip placement="top" content="Update">
                                <a @click="updatedvalue(index)"><Icon  type="checkmark" style="font-size: 20px;"></Icon></a>
                              </Tooltip>
                              <a style= 'color:red' @click="cancelHandle(index)"><Icon type="android-cancel" style="font-size: 20px;"></Icon></a>
                            </span>
                            <span v-else>
                              <a v-if="!viewData[index].isView" @click="ToggleFunction(index)"><Icon  type="eye" style="font-size: 20px;color:#ffa500"></Icon></a>
                              <a v-else @click="ToggleFunction(index)"><Icon  type="eye-disabled" style="font-size: 20px;color:#ffa500"></Icon></a>
                              <a @click="editRecord(index)"><Icon  type="edit" style="font-size: 20px;"></Icon></a>
                              <a style= 'color:red' @click="deleteHandle(index)"><Icon type="android-delete" style="font-size: 20px;"></Icon></a>
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="viewData[index].isView">
                        <td colspan="2" class="json-viewer">
                          <div style="padding:20px; background-color:#eee">
                            <pre style="background-color:#fff">{{tableData[index]}}</pre>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="viewData[index].isUpdate">
                        <td colspan="2" class="json-viewer">
                          <div style="padding:20px; background-color:#eee">
                            <vue-json-editor v-model="viewData[index].data" :showBtns="false"></vue-json-editor>
                          </div>
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
      // finalvalue: {},
      crumbData: {
        db: '',
        cname: '',
        tname: ''
      },
      setData: false,
      viewData: []
    }
  },
  methods: {
    ToggleFunction (index) {
      this.viewData[index].isView = !this.viewData[index].isView
      this.viewData[index].isUpdate = false
    },
    getSomeValue (value) {
      var sObj = _.cloneDeep(value)
      delete sObj.id
      delete sObj._id
      // console.log('......', value, sObj)
      var s = JSON.stringify(sObj)
      // console.log(s.length)
      if (s.length <= 75) {
        return s
      } else {
        s = s.slice(0, 75)
        return s + ' ....'
      }
    },
    editRecord (index) {
      this.viewData[index].isUpdate = !this.viewData[index].isUpdate
      this.viewData[index].isView = false
    },
    init () {
      let self = this
      self.setData = false
      self.viewData = []
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
                      console.log('self.tableData', self.tableData)
                      for (var i = 0; i < tabled.t_data.length; i++) {
                        var obj = _.cloneDeep(tabled.t_data[i])
                        delete obj.id
                        delete obj._id
                        self.viewData.push({isView: false, isUpdate: false, data: obj})
                      }
                      self.setData = true
                    }
                  })
                }
              })
            }
          })
          self.setData = true
        })
      }).catch(error => {
        this.$Notice.error({
          title: error,
          desc: 'Network Error',
          duration: 0
        })
      })
    },
    // onJsonChange (value) {
    //   this.jsoneditordata = value
    // },
    updatedvalue (index) {
      var obj = {}
      if (this.tableData[index].hasOwnProperty('_id')) {
        this.viewData[index].data['_id'] = this.tableData[index]._id
      }
      if (this.tableData[index].hasOwnProperty('id')) {
        this.viewData[index].data['id'] = this.tableData[index].id
      }
      obj.inst_id = this.$route.params.id
      obj.tname = this.$route.params.tname
      obj.data = this.viewData[index].data
      var isequal = _.isEqual(this.viewData[index].data, this.tableData[index])
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
            // console.log('response', response.data)
            this.tableData[index] = obj.data
            var s = _.cloneDeep(obj.data)
            delete s._id
            delete s.id
            this.viewData[index].data = s
            this.viewData[index].isView = true
            this.$Notice.success({ title: 'Suceess!', desc: 'record updated....' })
          }).catch(error => {
            console.log(error)
            this.$Notice.error({ title: 'Error', desc: 'record not updated....' })
          })
        }
      }
      this.viewData[index].isUpdate = false
      this.viewData[index].isView = false
    },
    cancelHandle (index) {
      this.viewData[index].isUpdate = false
      this.viewData[index].isView = false
    },
    deleteHandle (index) {
      var id
      var instId = this.$route.params.id
      var tname = this.$route.params.tname

      if (this.tableData[index].hasOwnProperty('_id')) {
        id = this.tableData[index]._id
      }
      if (this.tableData[index].hasOwnProperty('id')) {
        id = this.tableData[index].id
      }
      if (id !== undefined) {
        this.$Modal.confirm({
          title: 'Confirm',
          content: '<p>Are you sure you want to delete?</p>',
          onOk: () => {
            ConnectionData.deleteThis(id, instId, tname)
              .then(response => {
                this.tableData.splice(index, 1)
                this.viewData.splice(index, 1)
                this.$Notice.success({
                  title: 'Success',
                  desc: 'SchemaInstance Deleted.....',
                  duration: 2
                })
              })
              .catch(error => {
                console.log(error)
                this.$Notice.error({
                  title: 'Error',
                  desc: 'SchemaInstance Not Deleted.....',
                  duration: 2
                })
              })
          },
          onCancel: () => {
          }
        })
      }
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route.params.id': function (newId, oldId) {
      // fetch data
      // console.log(newId)
      this.setData = false
      this.init()
    },
    '$route.params.tname': function (newId, oldId) {
      // fetch data
      // console.log(newId)
      this.setData = false
      this.init()
    }
  },
  feathers: {
    'connectiondata': {
      updated (data) {
        // console.log('connectiondata updated..', data)
        // this.setData = false
        // this.init()
      },
      created (data) {
        // console.log('connectiondata created..', data)
        this.setData = false
        this.init()
      },
      removed (data) {
        // console.log('connectiondata removed..', data)
        // this.setData = false
        // this.init()
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
.demo-breadcrumb-separator{
    color: #2d8cf0;
    padding: 0 5px;
}
.demo-spin-container{
    /*display: inline-block;*/
    width: 1400px;
    height: 300px;
    position: relative;
    /*border: 1px solid #eee;*/
}
</style>
