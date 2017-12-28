<template>
<div>
    <Row style="padding-bottom:5px">
      <Col style="float:right" >
        <Button type="primary" shape="circle" size="small" @click="goBackHandle()" icon="chevron-left">Back</Button>
      </Col>
    </Row>
    <Row style="border:2px solid #eee;padding:20px;background-color:#eee">
        <Col span="14" style="border:1px solid #eee; ">
            <Card :bordered="false">
                <p slot="title">SOURCE</p>
                <Form ref="frmSourceDbForm" :model="source" :rules="ruleValidate" :label-width="80">
                    <Row>
                        <Col span="12">
                            <FormItem label="Select DB" prop="selectedDb">
                                <!-- <Select v-model="source.selectedDb" style="width:200px" :disabled="sourceDisable">
                                    <Option v-for="item in dbList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select> -->
                                <Cascader :data="CascaderData" filterable v-model='sdatabase' @on-change="setSourceData"></Cascader>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="Database" prop="dbname">
                                <Input v-model="source.dbname" :disabled="setForInternal" :readonly="sourceDisable"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="Host" prop="host">
                                <Input v-model="source.host":disabled="setForInternal"  :readonly="sourceDisable"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="Port" prop="port">
                                <Input v-model="source.port":disabled="setForInternal"  :readonly="sourceDisable"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="Username">
                                <Input placeholder="Username":disabled="setForInternal"  v-model="source.username" :readonly="sourceDisable"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="Password">
                                <Input type="password" placeholder="Password":disabled="setForInternal"  v-model="source.password" :readonly="sourceDisable"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Button type="primary" @click="handleConnect('frmSourceDbForm')"  :disabled="sourceDisable" style="margin-left: 80px">Connect
                        <span>
                      <Icon  v-if="check_conn" :type="conn_icon" style="padding-left:5px;font-size:12px;"/>
                  </span>
                    </Button>
                </Form>
            </Card>
        </Col>
        <Col span="1">
          <Row>&nbsp;</Row>
          <Row>&nbsp;</Row>
          <Row>&nbsp;</Row>
          <Row>&nbsp;</Row>
          <Row>&nbsp;</Row>
          <Row>&nbsp;</Row>
          <Row>&nbsp;</Row>
          <Row type="flex" justify="center" align="middle">
              <Icon type="arrow-right-c" style="font-size:35px;float:center"></Icon>
          </Row>
        </Col>
        <Col span="9" style="border:1px solid #eee;">
            <Card shadow style="padding:10px">
                <p slot="title">TARGET</p>
                <div class="schema-form ivu-table-wrapper">
                    <div class="ivu-table ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tbody class="ivu-table-tbody">
                                    <tr class="ivu-table-row">
                                        <td class="" style="font-size:13px">
                                            <div class="ivu-table-cell">
                                                <b>Connection Name</b>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                {{target.connection_name}}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row">
                                        <td class="" style="font-size:13px">
                                            <div class="ivu-table-cell">
                                                <b>Database Name</b>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                {{target.dbname}}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row">
                                        <td class="" style="font-size:13px">
                                            <div class="ivu-table-cell">
                                                <b>Host</b>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                {{target.host}}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row">
                                        <td class="" style="font-size:13px">
                                            <div class="ivu-table-cell">
                                                <b>Port</b>
                                            </div>
                                        </td>
                                        <td class="">
                                            <div class="ivu-table-cell">
                                                {{target.port}}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </Card>
        </Col>
    </Row>
    <div v-if='s_collection.length > 0'>
      <div v-if="isSet">
        <Spin size="large" style="margin-left:550px"></Spin>
      </div>
      <div v-else-if="issConnect && istConnect">
        <div class="ivu-table-wrapper">
            <div class="ivu-table ivu-table-small">
                <div class="ivu-table-header">
                    <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                        <colgroup>
                            <col width="10">
                                <col width="30">
                                    <col width="30">
                                        <col width="25">
                        </colgroup>
                        <thead>
                            <tr>
                                <!-- <th class="" style="padding-left:20px">SelectTable</th> -->
                                <th class="" style="padding-left:20px">
                                  <Checkbox v-model="selectAllTable" @on-change="selTableChange"></Checkbox>
                                </th>
                                <th class="">
                                    <div class="ivu-table-cell">
                                        <span>{{source.selectedDb}} / {{source.dbname}} ( SOURCE )</span>
                                    </div>
                                </th>
                                <th class="">
                                    <div class="ivu-table-cell">
                                        <span>{{target.connection_name}} / {{target.dbname}} ( TARGET )</span>
                                    </div>
                                </th>
                                <th class="">Mapping</th>
                            </tr>
                        </thead>
                        <tbody class="ivu-table-tbody">
                            <template v-for="(item, index) in s_collection">
                                <tr class="ivu-table-row">
                                    <td class="" style="padding-left:20px">
                                        <!-- <Button @click="item.expand = true">
                                            <Icon type="chevron-right" style="margin-left: 10px;"></Icon>
                                        </Button> -->
                                        <Checkbox v-model="tableData[index].isSelect" @on-change="handleTableSelection"></Checkbox>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <span>{{item.name}}</span>
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell">
                                            <AutoComplete placeholder="input here" v-model="tableData[index].target" @on-search="fillColsData(tableData[index].target, index)" @on-select="fillColsData(tableData[index].target, index)"  style="width:200px" clearable>
                                                <Option v-for="(obj, inx) in t_collection" :value="obj.name" :key="inx">{{ obj.name }}</Option>
                                            </AutoComplete>
                                            <a v-if ="abc(index)" @click="clearField(index)">Clear</a>
                                            <!-- <i-autoComplete>
                                            <div class="demo-auto-complete-item" v-for="item in target.collection">
                                              <div class="demo-auto-complete-group">
                                                  <span>{{ item.name }}</span>
                                              </div>
                                            </div>
                                          </i-autoComplete> -->
                                                                      <!-- <Select @on-change="selectedtablelist(index)" v-model="table[index]" style="width:200px">
                                              <Option v-for="item in target.collection" :value="item.name" :key="item.name">{{ item.name }}</Option> -->
                                                                      <!-- </Select> -->
                                        </div>
                                    </td>
                                    <td class="">
                                        <div class="ivu-table-cell"v-if="tableData[index].target">
                                            <a @click="openTrasformEditor(index)">Field Mapping</a>
                                        </div>
                                    </td>
                                </tr>
                              <tr v-if="tableData[index].target && openTrasformEditorIndex === index">
                                <td colspan="4" style="padding: 15px 100px 15px 100px; background-color:#eee;">
                                  <!-- {{tableData[index].source}} -->
                                  <div class="ivu-table-wrapper">
                                    <div class="ivu-table ivu-table-small">
                                        <div class="ivu-table-header">
                                            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                                <colgroup>
                                                    <col width="10">
                                                        <col width="35">
                                                            <col width="35">
                                                                <col width="20">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th class="" style="padding-left:20px;background-color:#f8f8f9; color:#394263;font-size:13px">
                                                          <Checkbox v-model="tableData[index].isFieldSelect" @on-change="selectFiledChange"></Checkbox>
                                                        </th>
                                                        <th class="" style="background-color:#f8f8f9; color:#394263;font-size:13px">
                                                            <div class="ivu-table-cell">
                                                                <span>{{tableData[index].source}} / Fields ( SOURCE )</span>
                                                            </div>
                                                        </th>
                                                        <th class="" style="background-color:#f8f8f9; color:#394263;font-size:13px">
                                                            <div class="ivu-table-cell">
                                                                <span>{{tableData[index].target}} / Fields ( TARGET )</span>
                                                            </div>
                                                        </th>
                                                        <th class="" style="background-color:#f8f8f9; color:#394263;font-size:13px">
                                                            <div class="ivu-table-cell">
                                                                Transform
                                                            </div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class="ivu-table-tbody">
                                                    <template v-for="(mitem, i) in s_collection[index].columns">
                                                        <tr v-if="tableData[index].colsData.length > 0" class="ivu-table-row">
                                                            <td class="" style="padding-left:20px">
                                                                <Checkbox v-model="tableData[index].colsData[i].isField"  @on-change="handleFieldChange"></Checkbox>
                                                            </td>
                                                            <td class="">
                                                                <div class="ivu-table-cell">
                                                                    <span>{{mitem.name}}</span>
                                                                </div>
                                                            </td>
                                                            <td class="">
                                                                <div class="ivu-table-cell">
                                                                    <AutoComplete placeholder="input here" v-model="tableData[index].colsData[i].input" style="width:200px">
                                                                        <Option v-for="(obj1, inxx) in getFiledNames(index)" :value="obj1.name" :key="inxx">{{ obj1.name }}</Option>
                                                                    </AutoComplete>
                                                                </div>
                                                            </td>
                                                            <td class="">
                                                                <div class="ivu-table-cell">
                                                                    <a @click="openCodeMirror(i)"><Icon type="compose"></Icon></a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr v-if="openCodeMirrorEditorIndex === i" style="">
                                                            <td colspan="4" style="">
                                                              <!-- {{tableData[index].source}} -->
                                                              <div class="ivu-table-wrapper">
                                                                <div class="ivu-table ivu-table-small">
                                                                    <div class="ivu-table-header">
                                                                        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                                                            <tbody class="ivu-table-tbody">
                                                                                    <tr class="ivu-table-row">
                                                                                       <codemirror v-model='tableData[index].colsData[i].transform' :options="editorOptions" @change=""></codemirror>
                                                                                    </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </td>
                                                          </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                              </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div style="padding-top:5px">
            <Button type="primary" @click="handleImport('')" style="margin-left: 8px">Import</Button>
            <!-- <Button type="primary" @click="clearImport('')" style="margin-left: 8px">Clear</Button> -->
        </div>
      </div>
      <div v-else></div>
    </div>
    <!-- <hr><hr><hr><hr> -->
    <!-- {{sdatabase}} -->
    <!-- <hr><hr><hr><hr> -->
    <!-- {{tableData}} -->
    <!-- <hr><hr><hr><hr> -->
    <!-- {{disableCheck}} -->
    <!-- {{importedData}} -->
</div>
</template>
<script>
import _ from 'lodash'
// import api from '../api'
// import modelSettings from '@/api/settings'
import modelDatabases from '@/api/databases'
import modelSchema from '@/api/schema'
import modelImportToExternalDb from '@/api/import-to-external-db'

export default {
  data () {
    return {
      isSet: true,
      issConnect: false,
      istConnect: false,
      selectAllTable: true,
      CascaderData: [],
      sdatabase: ['rethink'],
      openTrasformEditorIndex: -1,
      openCodeMirrorEditorIndex: -1,
      check_conn: false,
      setForInternal: false,
      sourceDisable: false,
      conn_icon: 'load-a',
      // showtable: false,
      // schemaTitle: [],
      tableList: [],
      schemaList: [],
      // columns: [],
      // arr: [],
      // source: {},
      target: {},
      colsData: [],
      // table: {},
      source: {
        selectedDb: 'rethink',
        dbname: 'schema_builder',
        host: 'localhost',
        port: '28015',
        username: '',
        password: ''
      },
      dbList: [
        {
          value: 'mongo',
          label: 'Mongo DB'
        },
        {
          value: 'rethink',
          label: 'Rethink DB'
        },
        {
          value: 'elastic',
          label: 'Elastic Search'
        },
        {
          value: 'nedb',
          label: 'Ne DB'
        },
        {
          value: 'mysql',
          label: 'MySQl DB'
        }
      ],
      ruleValidate: {
        selectedDb: [
            { required: true, message: 'Please select Database', trigger: 'blur' }
        ],
        dbname: [{
          required: true,
          message: 'Please enter database name',
          trigger: 'blur'
        }],
        host: [{
          required: true,
          message: 'Please enter host name',
          trigger: 'blur'
        }]
        // ,
        // port: [{
        //   required: true,
        //   message: 'Please enter port number',
        //   trigger: 'blur'
        // }
        // ]
      },
      t_collection: [],
      s_collection: [],
      importedData: {},
      tableData: [],
      disableCheck: [],
      editorOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-light',
        lineNumbers: true,
        line: true,
        // keyMap: 'sublime',
        extraKeys: { 'Ctrl': 'autocomplete' },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    handleFieldChange () {
      var unChecked = _.filter(this.tableData[this.openTrasformEditorIndex].colsData, (d) => {
        return !d.isField
      })
      this.tableData[this.openTrasformEditorIndex].isFieldSelect = !(unChecked.length > 0)
    },
    selectFiledChange (value) {
      _.forEach(this.tableData[this.openTrasformEditorIndex].colsData, (d) => {
        d.isField = value
      })
    },
    handleTableSelection () {
      var unChecked = _.filter(this.tableData, (d) => {
        return !d.isSelect
      })
      this.selectAllTable = !(unChecked.length > 0)
    },
    selTableChange (value) {
      _.forEach(this.tableData, (d) => {
        d.isSelect = value
      })
      this.openTrasformEditorIndex = -1
    },
    getFiledNames (index) {
      let _table = _.find(this.t_collection, (f) => {
        return f.name === this.tableData[index].target
      })
      if (_table) {
        return _table.columns
      } else {
        return []
      }
    },
    abc (index) {
      // if()
      // console.log('abc', this.disableCheck, index)
      return this.disableCheck[index].check
    },
    clearField (index) {
      this.openTrasformEditorIndex = -1
      this.tableData[index].target = ''
      // this.tableData[index].colsData = []
      this.disableCheck[index].check = false
    },
    init () {
      var self = this
      modelDatabases.get(this.$route.params.id).then(response => {
        self.target = response // _.merge(self.target, response)
        self.importedData.source = self.source
        self.importedData.target = self.target
        self.importedData.mapdata = []
      })
    },
    fillColsData (tSelect, index) {
      // this.openTrasformEditor(index)
      // console.log('this.tableData', this.tableData[index].target)
      // alert(tSelect)
      // var s = tSelect
      // this.tableData[index].target = s
      // console.log(tSelect, index, this.tableData[index].target)
      var _inx = _.findIndex(this.t_collection, { 'name': tSelect })
      if (_inx !== -1) {
        // this.tableData[index].tCol = this.t_collection[_inx].columns
        // console.log('this.t_collection', this.t_collection[_inx], _inx)
      }
      // console.log('t_collection', this.t_collection[index])
      // this.tableData[index].colsData = []
      // var s = this.s_collection[index].columns
      if (this.tableData[index].colsData.length === 0) {
        // console.log('this.s_collection[index].columns', this.s_collection[index].columns)
        for (let i = 0; i < this.s_collection[index].columns.length; i++) {
          var trans = 'return row["' + this.s_collection[index].columns[i].name + '"];'
          this.tableData[index].colsData.push({isField: true, name: this.s_collection[index].columns[i].name, input: this.s_collection[index].columns[i].name, transform: trans})
        }
      } else {
        _.forEach(this.tableData[index].colsData, (obj, i) => {
          // console.log(obj, i)
          obj.input = obj.name
        })
      }
    },
    openTrasformEditor (index) {
      if (this.openTrasformEditorIndex === index) {
        this.openTrasformEditorIndex = -1
        return false
      }
      this.openTrasformEditorIndex = index
      // console.log(index, this.tableData[index].target)
      this.fillColsData(this.tableData[index].target, index)
      // this.disableCheck[index].check = true
    },
    openCodeMirror (index) {
      if (this.openCodeMirrorEditorIndex === index) {
        this.openCodeMirrorEditorIndex = -1
        return false
      }
      this.openCodeMirrorEditorIndex = index
      // this.disableCheck[index].check = true
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },
    handleConnect (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          this.check_conn = true
          this.conn_icon = 'load-a'
          var sCheck = false
          this.s_collection = await modelSchema.postData(this.source).then(response => {
            this.issConnect = true
            sCheck = true
            this.sourceDisable = true
            return response
            // }
          }).catch(error => {
            console.log('error', error)
            this.issConnect = false
            this.sourceDisable = false
            this.conn_icon = 'close'
            this.$Notice.error({title: 'Error!', desc: 'Please Check Your Source Database..'})
            return []
          })
          if (sCheck) {
            for (let i = 0; i < this.s_collection.length; i++) {
              this.tableData.push({isSelect: true, isFieldSelect: true, source: this.s_collection[i].name, target: this.s_collection[i].name, colsData: []})
              this.disableCheck.push({check: false})
            }
            // console.log('this.s_collection', this.s_collection.length)
            if (this.s_collection.length > 0) {
              this.conn_icon = 'checkmark'
              this.t_collection = await modelSchema.postData(this.target).then(response => {
                // console.log('this.target', JSON.stringify(this.target))
                this.isSet = false
                // console.log('t_collection', response)
                this.istConnect = true
                return response
              }).catch(err => {
                console.log('>>>>', err)
                this.isSet = false
                this.sourceDisable = false
                this.conn_icon = 'close'
                this.istConnect = false
                this.$Notice.error({
                  title: 'Connection Not Establish...!',
                  desc: 'Please Check Your Target Database..'
                })
                return []
              })
            }
          }
        }
      })
    },
    handleImport () {
      var mData = _.cloneDeep(this.tableData)
      this.importedData.mapdata = _.reject(mData, { 'isSelect': false })
      if (this.importedData.mapdata.length === 0) {
        this.$Message.error('Please Select Table')
      } else {
        _.forEach(this.importedData.mapdata, (d) => {
          if (d.colsData.length !== 0) {
            d.colsData = _.reject(d.colsData, { 'isField': false })
          }
        })
        console.log('this.importedData', this.importedData)
        this.importedData.userId = this.$store.state.user._id
        // api.request('post', '/import-to-external-db', this.importedData).then((res) => {
        modelImportToExternalDb.post(this.importedData).then((res) => {
          this.$Notice.success({title: 'Imported!', desc: ''})
          this.$router.push('/instancejoblist/' + this.$route.params.id)
        }).catch((err) => {
          console.log('Error..', err)
          this.$Notice.error({title: 'Connection Not Establish...!', desc: 'Please Check Your Database..'})
        })
      }
    },
    clearImport () {
      // alert(this.$route.params.id)
      this.$router.push('/Dbsetting/import/' + this.$route.params.id)
    },
    setSourceData (value) {
      // console.log(value)
      if (value.length > 1) {
        // api.request('get', '/settings/' + value[1]).then(res => {
        modelDatabases.get(value[1]).then(res => {
          // console.log('response.....', res)
          this.source.selectedDb = res.selectedDb
          this.source.dbname = res.dbname
          this.source.host = res.host
          this.source.port = res.port
          this.source.username = res.username
          this.source.password = res.password
          this.setForInternal = true
        })
        .catch(err => {
          console.log('Error', err)
        })
      } else if (value.length === 1) {
        this.source.selectedDb = value[0]
        switch (value[0]) {
          case 'mongo':
            this.source.port = 27017
            break
          case 'rethink':
            this.source.port = 28015
            break
          case 'elastic':
            this.source.port = 9200
            break
          case 'nedb':
            this.source.port = 1234
            break
          case 'mysql':
            this.source.port = 3306
            break
        }
        this.setForInternal = false
      }
    },
    goBackHandle () {
      this.$router.go(-1)
    }
  },
  mounted () {
    _.forEach(this.dbList, (dbObj) => {
      if (dbObj.value !== 'nedb') {
        this.CascaderData.push({label: dbObj.label, value: dbObj.value})
      }
    })
    // api.request('get', '/settings')
    modelDatabases.get()
      .then(response => {
        var res = _.groupBy(response, 'selectedDb')
        for (var db in res) {
          // if (db !== 'nedb') {
          var obj = {}
          obj.value = db
          obj.label = db
          obj.children = []
          res[db].forEach(function (instance, i) {
            if (instance.isenable) {
              obj.children.push({label: instance.connection_name, value: instance.id})
            }
          })
          if (obj.children.length === 0) {
            obj.disabled = true
          }
          this.CascaderData.push(obj)
        // }
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  watch: {
    'tableData' (value) {
      // console.log('new value', value)
    }
  }
}
</script>
<style>
  .ivu-table th {
    height: 44px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #394263;
    color: #fff;
}
</style>
