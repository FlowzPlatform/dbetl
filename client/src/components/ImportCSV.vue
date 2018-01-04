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
                <Form :label-width="120">
                    <Row style="padding: 60px 0px 60px 0px">
                        <Col span="24">
                            <FormItem label="Upload CSV" >
                            <!-- <div class="upload-btn-wrapper">
                                <button class="btn"><Icon type="ios-cloud-upload-outline"></Icon> Upload CSV</button>
                                <input type="file" id="upldCSV" title="Upload CSV">
                            </div> -->
                            <div class="upload-btn-wrapper">
                                <button class="btn"><Icon type="ios-cloud-upload-outline"></Icon> Upload File</button>
                                <input type="file" id="upldCSV" title="Upload CSV" accept=".csv" />
                            </div>
                                <!-- <label for="upldCSV" class="custom-upldCSV">
                                  <i class="fa fa-cloud-upload"></i> Upload
                                </label>
                                <input id="upldCSV" type="file" accept=".csv"/> -->
                            </FormItem>
                        </Col>
                    </Row>
                    <!-- <label for="upldCSV" class="custom-upldCSV">
                      <i class="fa fa-cloud-upload"></i> Custom Upload
                    </label>
                    <input id="upldCSV" type="file" accept=".csv"/> -->
                    <!-- <Checkbox v-model="eDuplicate" style="float:right">Exclude eDuplicate records?</Checkbox> -->
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
            <Card shadow style="">
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
    
    <Form ref="frmSettings" :model="frmSettings" class="form">
    <Row v-if="frmSettings.upldCSV">
      <FormItem>
        <div id="example1" class="hot handsontable htColumnHeaders"></div>
        <table>
          <tr class="ivu-table-row" v-for="(item, index) in [errmsg[0]]" style="color:red;font-size:14px;">{{item}}</tr>
        </table>
        <div id="hot-preview" v-if="showHandson">
          <!-- <HotTable :root="root" :settings="hotSettings"></HotTable> -->

          <Button type="primary" @click="modifyData()">Modify Data</Button>
        </div>
        <div>
          <div class="schema-form ivu-table-wrapper" v-if="!showHandson && displaymessage">
            <div class="ivu-table ivu-table-border" style="display: block;white-space: nowrap;">
              <div class="ivu-table-body">
                <table style="min-width: 1077px;overflow-x: auto;">
                  <thead>
                    <tr>
                      <th v-for="(item, index) in csvData">
                        <div>
                          <span>{{item.header}}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="ivu-table-tbody">
                    <tr class="ivu-table-row" v-for="(item, index) in frmSettings.upldCSV" v-if="(index<5)">
                      <td class="" v-if="index <= frmSettings.upldCSV.length-2" v-for="data in item" style="overflow:hidden;">{{data}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
              <p style="color: grey;font-size: smaller;" >Displaying Some Data As Reference</p>
        </div>

        </div>
        <!-- <div style="float: right;">
                  <Page :total="frmSettings.upldCSV.length" :current="1"></Page>
                </div> -->
      </FormItem>

      <FormItem>

       <div>
        <h4 v-if="displaymessage">Header Details</h4>
        <div class="schema-form ivu-table-wrapper" v-if="displaymessage">
          <div class="ivu-table ivu-table-border" >
            <div class="ivu-table-body">
              <table class="mapping-table">
                <colgroup>
                  <col width="300">
                  <col width="250">
                  <col width="200">
                  <col width="50">
                  <col width="250">
                  <col width="250">
                </colgroup>
                <thead>
                  <tr>
                    <th class="">Header</th>
                    <th class="">Edit header</th>
                    <th class="">Type</th>
                    <th class="">Property</th>
                    <th class="">Notes</th>
                    <th class="">Transform</th>
                  </tr>
                </thead>
                <tbody class="ivu-table-tbody">
                  <tr class="ivu-table-row" v-for="(item, index) in headers">
                    <th>
                      <div class="ivu-table-cell">
                        <span>{{item}}</span>
                      </div>
                    </th>
                    <td>
                      <Input v-model="csvData[index].header" type="text" :value="item" :placeholder="item" size="small" class="schema-form-input">
                      </Input>
                    </td>

                    <td class="">
                      <div class="ivu-table-cell">
                        <Select @on-change="type(index)" v-model="csvData[index].type"  size="small" class="schema-form-input">
                            <Option v-for="t in optType" :value="t.value" :key="t.value">{{t.label}}</Option>
                        </Select>
                      </div>
                    </td>

                    <td class="">
                      <div class="property ivu-table-cell">
                        <Poptip placement="left" width="300">
                          <a>
                            <Icon type="edit"></Icon>
                          </a>
                          <div slot="title">
                            <h3>Property</h3></div>
                          <div slot="content">
                            <Form-item v-if="activatedProperty(index,'min')" label="Min" :label-width="80" class="no-margin">
                              <Input-number v-model="csvData[index].min" size="small"></Input-number>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'max')" label="Max" :label-width="80" class="no-margin">
                              <Input-number size="small" v-model="csvData[index].max"></Input-number>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'allowedValue')" label="Allowed Value" class="no-margin">
                              <input-tag style="margin-left:80px;width:200px" :tags="csvData[index].allowedValue"></input-tag>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'defaultValue')" label="Default Value" :label-width="80" class="no-margin">
                              <Input size="small" v-model="csvData[index].defaultValue"></Input>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'regEx')" label="regEx" :label-width="80" class="no-margin">
                              <Input v-model="csvData[index].regEx"></Input>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'placeholder')" label="Placeholder" :label-width="80" class="no-margin">
                              <Input size="small" v-model="csvData[index].placeholder"></Input>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'dependentOn')" label="Dependent On" :label-width="80" class="no-margin">
                              <div>
                                <label class="typo__label">Tagging</label>
                                <multiselect v-model="value" :options="options" :multiple="true" :custom-label="customLabel">
                                </multiselect>
                              </div>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'IsArray')" label="" :label-width="80" class="no-margin">
                              <Checkbox v-model="csvData[index].IsArray">Is Array</Checkbox>
                            </Form-item>
                            <Form-item v-if="activatedProperty(index,'optional')" label="" :label-width="80" class="no-margin">
                              <Checkbox style="margin-left:80px;" @on-change="type(index)" v-model="csvData[index].optional">Optional</Checkbox>
                            </Form-item>
                          </div>
                        </Poptip>
                      </div>
                    </td>

                    <td class="">
                      <div class="ivu-table-cell">
                        <Input type="textarea" placeholder="Notes..." size="small" class="schema-form-input"></Input>
                      </div>
                    </td>

                    <td class="transform-block">
                      <div class="ivu-table-cell">
                          <a @click="modelshow(item,index)"><Icon type="compose"></Icon></a>
                      </div>
                      <div v-if="csvData[index].transformMethod" class="transform-function" title="">
                          <span>{{csvData[index].transform}}</span>
                          <span @click="removeTransform(item,index)"><Icon type="close-circled" /></span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
      </div>
    </div>
      </FormItem>
      <FormItem>
        <Button type="primary" :loading="loadingData" v-on:click="insertCsvData(frmSettings.upldCSV)" v-if="validateButton">
                      <span v-show="!loadingData">Validate Data</span>
                      <span v-show ="loadingData">Loading...</span>
        </Button>
        <Button type="primary" @click="getData()" v-if = "getDataButton">Get Data</Button>
      </FormItem>
    </Row>
    <Modal v-model="model" title="Transform" @on-ok="handleModalOk" width="900px" :mask-closable="false ">
      <Row style="padding: 10px;">
        <Col span="18">
            <codemirror v-model='transformData' :options="editorOptions"></codemirror>
        </Col>
        <Col span="6">
          <div class="transform-method">
            <ul>
              <li>
                <a href="javascript:void(0)" data-method="toUpperCase()"  @click="transform">UpperCase</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="toLowerCase()"  @click="transform">LowerCase</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="ltrim()" @click="transform">Right Trim</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="rtrim()" @click="transform">Left Trim</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="concate()" @click="transform">Concate</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="capitalize()"  @click="transform">Capitalize</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="stripHTMLTags()"  @click="transform">Stripe HTML Tags</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="stripSpecialCharacter()"  @click="transform">Stripe Special Character</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="formatDate('dd-mm-yyyy')"  @click="transform">Date Format</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="toDecimal(2)"  @click="transform">Decimal</a>
              </li>
              <li>
                <a href="javascript:void(0)" data-method="toInteger()"  @click="transform">Integer</a>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </Modal>
  </Form>
</div>
</template>
<script>
// import _ from 'lodash'
import _ from 'lodash'
var Schema = require('simpleschema')
const $ = require('jquery')
import Papa from 'papaparse'
import Multiselect from 'vue-multiselect'
import InputTag from 'vue-input-tag'
import moment from 'moment'
// var json2csv = require('json2csv')
// import api from '../api'
// import modelSettings from '@/api/settings'
import modelDatabases from '@/api/databases'
// import modelSchema from '@/api/schema'
// import modelImportToExternalDb from '@/api/import-to-external-db'

let res
let finalModifiedDataArray = []

export default {
  components: {
    'input-tag': InputTag,
    Multiselect
  },
  data () {
    return {
      transformMethod: '',
      transformData: '',
      modelIndex: '',
      model: false,
      getDataButton: false,
      data1: [],
      complexSchema: {},
      validateButton: false,
      displaymessage: false,
      showHandson: false,
      errmsg: [],
      loadingData: false,
      value: '',
      csvData: [],
      frmSettings: {
        upldCSV: []
      },
      optType: [{
        value: 'text',
        label: 'Text'
      }, {
        value: 'email',
        label: 'Email'
      }, {
        value: 'number',
        label: 'Number'
      }, {
        value: 'boolean',
        label: 'Boolean'
      }, {
        value: 'phone',
        label: 'Phone'
      }, {
        value: 'date',
        label: 'Date'
      }],
      headers: [],
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
      importedData: {},
      tableData: [],
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
    removeTransform: function (item, index) {
      this.modelData = 'return row["' + item + '"]'
      this.csvData[index].transformMethod = ''
      this.setTransForm()
      this.handleModalOk()
    },
    setTransForm: function () {
      this.transformData = this.modelData
      if (this.csvData[this.modelIndex].transformMethod) {
        this.dataMethod = this.csvData[this.modelIndex].transformMethod
        this.transformData = this.modelData + '.' + this.dataMethod
      }
    },
    modelshow: function (item, index) {
      this.model = true
      this.modelData = 'return row["' + item + '"]'
      this.modelIndex = index
      this.dataMethod = ''
      this.setTransForm()
    },
    transform: function (event) {
      var targetEl = event.currentTarget
      if (targetEl.getAttribute('data-method')) {
        this.dataMethod = targetEl.getAttribute('data-method')
        if (this.dataMethod) {
          this.transformData = this.modelData + '.' + this.dataMethod
        }
      }
      return this.transformData
    },
    getData () {
      console.log('self.frmSettings.upldCSV.......', this.frmSettings.upldCSV)
      var _res = _.cloneDeep(this.frmSettings.upldCSV)
      // if (_res[0] !== undefined) {
      //   var fields = _.keys(_res[0])
      //   // console.log('mydata', _res, fields)
      //   var csv = json2csv({ data: _res, fields: fields })
      //   console.log('csv', csv)
      // }
      var mydata = Papa.unparse(_res)
      console.log('mydata...............', mydata)
    },
    type () {
      this.loadingData = false
      this.validateButton = true
      this.errmsg = []
      this.data1 = []
      let headerSchema = {}
      for (var [index, item] of this.headers.entries()) {
        var self = this
        let emailValidatorFunc = function (obj, value, fieldName) {
          let re = /\S+@\S+\.\S+/
          if (value !== undefined) {
            return (re.test(value) !== true) ? 'invalid email address' : true
          }
        }
        let dateValidatorFunc = function (obj, value, fieldName) {
          let date = moment(value)
          let isValid = date.isValid()
          if (isValid !== true) return 'invalid date. please provide date in y-m-d or d-m-y format'
          date._d = moment(new Date(date._d)).format('DD/MM/YYYY')
          return
        }

        let phoneValidatorFunc = function (obj, value, fieldName) {
          let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im // eslint-disable-line
          if (value !== undefined) {
            return (re.test(value) !== true) ? 'invalid phone number' : ''
          }
        }
        let getFunctionText = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else {
            return
          }
        }
        let getFunctionEmail = function (obj, value, fieldName) {
          var func1 = emailValidatorFunc(obj, value, fieldName)
          var func2 = allowedValueValidatorFunc(obj, value, fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else {
            return
          }
        }
        let getFunctionNumber = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else {
            return
          }
        }
        let getFunctionPhone = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = phoneValidatorFunc(obj, value, fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined) {
            return func3
          } else {
            return
          }
        }
        let getFunctionDate = function (obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = dateValidatorFunc(obj, value, fieldName)
          if (func1 !== undefined) {
            return func1
          } else if (func2 !== undefined) {
            return func2
          } else if (func3 !== undefined) {
            return func3
          } else {
            return
          }
        }
        let allowedValueValidatorFunc = function (obj, value, fieldName) {
          // console.log("@@@@@@@@@@@@@@@",fieldName)
          var i
          _.forEach(self.headers, function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.csvData[i].allowedValue.length > 0) {
            if (value !== undefined) {
              let check = _.includes(self.csvData[i].allowedValue, value)
              return (!check) ? 'invalid allowedValue' : ''
            }
          }
        }

        let regExValidatorFunc = function (obj, value, fieldName) {
          var i
          _.forEach(self.headers, function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.csvData[i].regEx !== '') {
            if (value !== undefined) {
              let pttrn = new RegExp(self.csvData[i].regEx)
              if (pttrn.test(value) === false) return 'not match with regEx value'
              return
            }
          }
        }

        if (this.csvData[index].optional === true) {
          if (this.csvData[index].type === 'text') {
            headerSchema[item] = {
              type: 'string'
            }
          } else if (this.csvData[index].type === 'email') {
            headerSchema[item] = {
              type: 'string',
              validator: emailValidatorFunc
            }
          } else if (this.csvData[index].type === 'number') {
            headerSchema[item] = {
              type: 'number'
            }
          } else if (this.csvData[index].type === 'boolean') {
            headerSchema[item] = {
              type: 'boolean'
            }
          } else if (this.csvData[index].type === 'phone') {
            headerSchema[item] = {
              type: 'string',
              validator: phoneValidatorFunc
            }
          } else if (this.csvData[index].type === 'date') {
            headerSchema[item] = {
              type: 'string',
              validator: dateValidatorFunc
            }
          }
        } else if (this.csvData[index].optional === false) {
          if (this.csvData[index].type === 'text') {
            headerSchema[item] = {
              type: 'string',
              max: this.csvData[index].max,
              validator: getFunctionText
            }
          } else if (this.csvData[index].type === 'email') {
            headerSchema[item] = {
              type: 'string',
              validator: getFunctionEmail
            }
          } else if (this.csvData[index].type === 'number') {
            headerSchema[item] = {
              type: 'string',
              max: this.csvData[index].max,
              min: this.csvData[index].min,
              validator: getFunctionNumber
            }
          } else if (this.csvData[index].type === 'boolean') {
            headerSchema[item] = {
              type: 'boolean'
            }
          } else if (this.csvData[index].type === 'phone') {
            headerSchema[item] = {
              type: 'string',
              validator: getFunctionPhone
            }
          } else if (this.csvData[index].type === 'date') {
            headerSchema[item] = {
              type: 'string',
              validator: getFunctionDate
            }
          }
        }
      }
      this.complexSchema = headerSchema
    },
    insertCsvData (data) {
      var self = this
      self.loadingData = true

      setTimeout(function () {
        var schema = new Schema(self.complexSchema)
        var errcols = []
        self.userUploadedDataArray = data
        _.forEach(data, function (value, key) {
          schema.validate(value, function (err, newP, errors) {
            if (err) {
              throw err
            } else {
              if (errors.length) {
                if (!_.isEqual(Object.values(value), [''])) {
                  self.data1.push(Object.values(value))
                  let oldHeaders = _.keys(self.frmSettings.upldCSV[0])
                  _.forEach(errors, (item) => {
                    errcols.push({
                      cols: _.indexOf(oldHeaders, item.field),
                      rows: key
                    })
                    self.errmsg.push('* ' + item.message + ' at column: ' + item.field)
                  })
                  self.showHandson = true
                }
              } else {
                // console.log('row ' + key + ' successfully parsed')
              }
            }
          })
        })
        self.loadingData = false
        self.validateButton = false
        if (self.data1.length === 0) {
          document.getElementById('example1').style.display = 'none'
          self.errmsg = []
          self.$Message.success('validation successfully complited')
          self.getDataButton = true
        } else {
          // self.$Message.error('validation error')
        }
        self.showerrmsg(errcols)
        document.getElementById('hot-display-license-info').style.display = 'none'
      }, 1000)
    },
    showerrmsg (errcols) {
      var headers = []
      var example1 = document.getElementById('example1')
      _.forEach(this.csvData, (value) => {
        headers.push(value.header)
      })
      new Handsontable(example1, { // eslint-disable-line
        data: [this.data1[0]],
        // rowHeaders: true,
        colHeaders: headers,
        // rowHeaders: true,
        height: 60,
        cells: (row, col) => {
          var cellProp = {}
          _.forEach([errcols[0]], (value, key) => {
            if (col === value.cols && row === key) {
              cellProp.className = 'error'
            }
          })
          return cellProp
        }
      })
    },
    modifyData () {
      let schema = new Schema(this.complexSchema)
      let colHeaders = this.headers
      let hotSettingsData = this.data1
      // let showHandson = this.showHandson
      let errMsgArray = this.errmsg
      let userUploadedDataArr = this.userUploadedDataArray
      let newHotSettingsData = []

      errMsgArray = []
      var errcols = []
      var self = this
      _.forEach(hotSettingsData, (value, key) => {
        let valueToBeValidated = _.object(colHeaders, value)
        schema.validate(valueToBeValidated, (err, newP, errors) => {
          if (err) {} else {
            if (errors.length) {
              newHotSettingsData.push(Object.values(value))
              self.data1 = newHotSettingsData
              _.forEach(errors, (item) => {
                errcols.push({
                  cols: _.indexOf(self.headers, item.field),
                  rows: key
                })
                errMsgArray.push('* ' + item.message + ' at column: ' + item.field)
              })
              self.errmsg = errMsgArray
              self.showHandson = true
            } else {
              finalModifiedDataArray.push(newP)
              res = userUploadedDataArr.map(obj => finalModifiedDataArray.find(o => o._id === obj._id) || obj)
              userUploadedDataArr = res
            }
          }
        })
      })
      if (res !== undefined) {
        this.frmSettings.upldCSV = res
      }

      this.data = newHotSettingsData
      if (this.data.length === 0) {
        self.errmsg = []
        $('table.htCore').each(function () {
          this.remove()
        })
        document.getElementsByClassName('ht_master handsontable')[0].remove()
        document.getElementById('example1').style.display = 'none'
        this.getDataButton = true
        this.showHandson = false
        this.$Message.success('validation successfully completed')
      } else {
        $('table.htCore').each(function () {
          this.remove()
        })
        document.getElementsByClassName('ht_master handsontable')[0].remove()
        self.showerrmsg(errcols)
      }
      document.getElementById('hot-display-license-info').style.display = 'none'
    },
    customLabel (option) {
      return `${option}`
    },
    handleModalOk () {
      let methodName = this.transformData.split('.')
      this.dataMethod = methodName[1]
      if (this.dataMethod) {
        this.csvData[this.modelIndex].transform = this.transformData
        this.csvData[this.modelIndex].transformMethod = this.dataMethod
      } else {
        this.csvData[this.modelIndex].transform = this.transformData
        this.csvData[this.modelIndex].transformMethod = ''
      }
      var self = this
      self.frmSettings.upldCSV = _.map(self.uploadedCSVData, function (row, rinx) {
        return _.reduce(row, function (result, value, key) {
          let inx = _.find(self.csvData, (f) => { return (f.id === key) })
          if (inx.transform !== '') {
            var s = new Function('row', inx.transform).call(this, row) // eslint-disable-line
            result[key] = s
          } else {
            result[key] = value
          }
          return result
        }, {})
      })
    },
    activatedProperty (index, property) {
      let typePropertys = {
        'text': ['max', 'allowedValue', 'defaultValue', 'placeholder', 'regEx', 'dependentOn', 'optional'],
        'email': ['allowedValue', 'defaultValue', 'placeholder', 'dependentOn', 'optional'],
        'number': ['min', 'max', 'allowedValue', 'defaultValue', 'placeholder', 'regEx', 'dependentOn', 'optional'],
        'phone': ['allowedValue', 'defaultValue', 'placeholder', 'regEx', 'dependentOn', 'optional'],
        'boolean': ['defaultValue', 'placeholder', 'optional', 'dependentOn'],
        'date': ['allowedValue', 'defaultValue', 'mindate', 'maxdate', 'placeholder', 'regEx', 'dependentOn', 'optional']
      }

      if (typePropertys[this.csvData[index].type] === undefined) {
        return ['IsArray'].indexOf(property) >= 0
      } else {
        return typePropertys[this.csvData[index].type].indexOf(property) >= 0
      }
    },
    init () {
      var self = this
      modelDatabases.get(this.$route.params.id).then(response => {
        self.target = response // _.merge(self.target, response)
        self.importedData.source = self.source
        self.importedData.target = self.target
        // self.importedData.mapdata = []
      })
    },
    goBackHandle () {
      this.$router.go(-1)
    }
  },
  mounted () {
    var self = this
    $(document).ready(function () {
      $('#upldCSV').change(function () {
        self.csvData = []
        let fileChooser = document.getElementById('upldCSV')
        let file = fileChooser.files[0]
        Papa.parse(file, {
          header: true,
          encoding: 'UTF-8',
          complete: function (results, file) {
            results.data.optType = [{
              value: 'text',
              label: 'Text'
            }, {
              value: 'email',
              label: 'Email'
            }, {
              value: 'number',
              label: 'Number'
            }, {
              value: 'boolean',
              label: 'Boolean'
            }, {
              value: 'phone',
              label: 'Phone'
            }, {
              value: 'date',
              label: 'Date'
            }]
            self.frmSettings.upldCSV = results.data
            self.uploadedCSVData = results.data
            self.headers = Object.keys(self.frmSettings.upldCSV[0])
            for (var i = 0; i < self.headers.length; i++) {
              // console.log('123', self.complexSchema)
              self.complexSchema[self.headers[i]] = {'type': 'string'}
            }
            self.options = self.headers
            self.displaymessage = true
            self.validateButton = true
            _.forEach(self.headers, (f) => {
              self.csvData.push({
                id: f,
                header: f,
                type: 'text',
                min: 0,
                max: 0,
                allowedValue: [],
                defaultValue: '',
                dependentOn: '',
                regEx: '',
                placeholder: '',
                optional: true,
                IsArray: '',
                transform: '',
                transformMethod: ''
              })
            })
          },
          error: function (error, file) {
            console.log('Error', error)
          }
        })
      })
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
/*input[type="file"] {
    display: none;
}*/
/*.custom-upldCSV {
    display: inline-block;
    padding: 7px 12px;
    cursor: pointer;
    border-radius: 6px;
    background-color: #2d8cf0;
    transition: background-color 1s;
    font-weight: 1;
    font-size: 12px;
    color: #fff;
}
.custom-upldCSV:hover {
  background-color: #2d8cf08c;
  transition: background-color 1s;
}*/
.transform-block > .ivu-table-cell {
  display: inline-block;
  vertical-align: middle;
}

.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btn {
  border: 0.5px solid #eff0f1;
  color: #838893;
  background-color: transparent;
  padding: 1px 20px;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
}

.upload-btn-wrapper:hover .btn {
  border: 0.5px solid #2d8cf0;
  color: #2d8cf0;
  transition: color 0.5s, border 1s;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  opacity: 0;
  cursor: pointer;
  outline: none;
}
</style>