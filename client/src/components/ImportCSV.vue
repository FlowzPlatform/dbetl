<template>
<div>
    <Row>
      <Breadcrumb separator=">">
        <BreadcrumbItem to="/">Home</BreadcrumbItem>
        <BreadcrumbItem>Database</BreadcrumbItem>
        <BreadcrumbItem>{{target.selectedDb}}</BreadcrumbItem>
        <BreadcrumbItem>{{target.connection_name}}</BreadcrumbItem>
      </Breadcrumb>
    </Row>
    <div>
      <Spin size="large" fix v-if="loading.fileRead"></Spin>
      <template v-if="csvPreviewData.length === 0">
        <Row>
          <Col span="24">
            <div class="csv-uploader-wrapper">
              <div class="uploader-content">
                <Row type="flex" justify="center">
                  <Col span="24">
                    <div style="text-align: center;"> 
                      <div class="uploader-icon">
                        <Icon :size="200" color="#eee" type="android-document"></Icon>
                        <Icon :size="200" type="document-text"></Icon>
                      </div>
                    </div>
                  </Col>
                  <Col span="24">
                    <div class="uploader-message">
                      Drop file here
                      <div> OR </div>
                      Choose CSV file
                    </div>
                  </Col>
                </Row>
              </div>
              <input type="file" id="upldCSV" title="Upload CSV" accept=".csv" @change="onFileChange" />
            </div>
          </Col>
        </Row>
      </template>
      <!-- Preview csv data -->
      <template v-if="csvPreviewData.length > 0">
        <template v-if="isHandson">
          <Row>
            <Col :span="24">
              <div style="overflow-x: scroll;">
                <HotTable root="test-hot" ref="testHot" :settings="hotSettings"></HotTable>
              </div>
            </Col>
          </Row>
        </template>
        <Row>
          <Col :span="24">
            <Table border size="small" :columns="csvTrasformColumns()" :data="csvPreviewTraformedData()" class="tablePreview"></Table>
          </Col>
        </Row>
        <div style="margin: 10px 0;">
          <Row>
            <Col :span="24">
              <div style="float: right;">
                <Button type="primary" v-if="isHandson" @click="handleContinue">Continue</Button>
                <Button type="primary" v-if="!isHandson" @click="handleValidation">Validate & Upload</Button>
              </div>
            </Col>
          </Row>
        </div>
        <Row>
          <Col :span="24">
            <Form ref="formNewHeaders" :model="frmNewHeaders">
              <div class="ivu-table-wrapper">
                <div class="ivu-table ivu-table-border" >
                  <div class="ivu-table-body">
                    <table style="width:100%">
                      <thead>
                        <tr>
                          <th class="">
                            <div class="ivu-table-cell">Header</div>
                          </th>
                          <th class=""><div class="ivu-table-cell">Edit header</div></th>
                          <th class=""><div class="ivu-table-cell">Type</div></th>
                          <th class=" ivu-table-column-center" style="width:100px;"><div class="ivu-table-cell">Validation</div></th>
                          <th class=""><div class="ivu-table-cell">Notes</div></th>
                          <th class=" ivu-table-column-center" style="width:100px;"><div class="ivu-table-cell">Transform</div></th>
                        </tr>
                      </thead>
                      <tbody class="ivu-table-tbody">
                        <template v-for="(item, index) in csvHeaders">
                          <tr class="ivu-table-row" >
                            <td>
                              <div class="ivu-table-cell">
                                {{item.id}}
                              </div>
                            </td>
                            <td>
                              <div class="ivu-table-cell">
                                <Input v-model="item.header" size="small"></Input>
                              </div>
                            </td>
                            <td>
                              <div class="ivu-table-cell">
                                <Select v-model="item.type"  size="small">
                                  <Option value="text" key="text">Text</Option>
                                  <Option value="email" key="email">Email</Option>
                                  <Option value="number" key="number">Number</Option>
                                  <Option value="boolean" key="boolean">Boolean</Option>
                                  <Option value="phone" key="phone">Phone</Option>
                                  <Option value="date" key="date">Date</Option>
                                </Select>
                              </div>
                            </td>
                            <td class="ivu-table-column-center">
                              <div class="ivu-table-cell">
                                <Poptip placement="left" width="400">
                                  <a>
                                    <Icon type="edit"></Icon>
                                  </a>
                                  <div slot="title">
                                    <h3>Validation Properties</h3>
                                  </div>
                                  <div slot="content">
                                    <Form-item label="Min" :label-width="90" class="no-margin">
                                      <Input-number v-model="item.min" size="small"></Input-number>
                                    </Form-item>
                                    <Form-item label="Max" :label-width="90" class="no-margin">
                                      <Input-number size="small" v-model="item.max"></Input-number>
                                    </Form-item>
                                    <Form-item label="Allowed Value" :label-width="90" class="no-margin">
                                      <InputTag :tags="item.allowedValue"></InputTag>
                                    </Form-item>
                                    <Form-item label="Default Value" :label-width="90" class="no-margin">
                                      <Input size="small" v-model="item.defaultValue"></Input>
                                    </Form-item>
                                    <Form-item label="regEx" :label-width="90" class="no-margin">
                                      <Input size="small" v-model="item.regEx"></Input>
                                    </Form-item>
                                    <Form-item label="" :label-width="90" class="no-margin">
                                      <Checkbox v-model="item.optional">Optional</Checkbox>
                                    </Form-item>
                                  </div>
                                </Poptip>
                              </div>
                            </td>
                            <td>
                              <div class="ivu-table-cell">
                                <Input type="textarea" placeholder="Notes..." v-model="item.notes" size="small"></Input>
                              </div>
                            </td>
                            <td  class="ivu-table-column-center">
                              <div class="ivu-table-cell">
                                  <a @click="renderCodemirror(item)"><Icon type="compose"></Icon></a>
                                  <!-- <codemirror v-model='item.transform' :options="editorOptions"></codemirror> -->
                              </div>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </Col>
        </Row>
      </template>
    </div>
</div>
</template>
<script>
import _ from 'lodash'
import Papa from 'papaparse'
import InputTag from 'vue-input-tag'
import modelDatabases from '@/api/databases'
import HotTable from 'vue-handsontable-official'
import SimpleSchema from 'simpleschema'

export default {
  components: {
    InputTag,
    HotTable
  },
  data () {
    return {
      isHandson: false,
      loading: {
        fileRead: false
      },
      hotSettings: {
        data: [],
        colHeaders: []
      },
      csvPreviewData: [],
      csvHeaders: [],
      csvData: [],
      frmNewHeaders: {},
      file: null,
      target: {},
      source: {
        selectedDb: 'rethink',
        dbname: 'schema_builder',
        host: 'localhost',
        port: '28015',
        username: '',
        password: ''
      },
      importedData: {},
      editorOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-light',
        lineNumbers: true,
        line: true,
        extraKeys: { 'Ctrl': 'autocomplete' },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
      },
      openModal: true,
      transformStr: '',
      transformMethod: 0,
      simpleSchemaOption: {
        text: (obj) => {
          let _result = {}
          _result.type = 'string'
          _result.key = obj.header
          _result.required = !obj.optional
          _result.notEmpty = !obj.optional
          if (obj.max) { _result.max = obj.max }
          _result.min = obj.min
          _result.validator = function (object, originalObject, castObject) {
            if (obj.allowedValue.length > 0 && _.indexOf(obj.allowedValue, originalObject) === -1) {
              return originalObject + ' is not an acceptable ' + castObject
            }
            if (obj.regEx && !(new RegExp(obj.regEx).test(originalObject))) {
              return originalObject + ' is not an valid ' + castObject
            }
            return
          }
          return _result
        },
        number: (obj) => {
          let _result = {}
          _result.type = 'number'
          _result.key = obj.header
          _result.required = !obj.optional
          _result.notEmpty = !obj.optional
          if (obj.max) { _result.max = obj.max }
          _result.min = obj.min
          _result.validator = function (object, originalObject, castObject) {
            if (obj.allowedValue.length > 0 && _.indexOf(obj.allowedValue, originalObject) === -1) {
              return originalObject + ' is not an acceptable ' + castObject
            }
            if (obj.regEx && !(new RegExp(obj.regEx).test(originalObject))) {
              return originalObject + ' is not an valid ' + castObject
            }
            return
          }
          return _result
        },
        email: (obj) => {
          let _result = {}
          _result.type = 'string'
          _result.key = obj.header
          _result.required = !obj.optional
          _result.notEmpty = !obj.optional
          if (obj.max) { _result.max = obj.max }
          _result.min = obj.min
          _result.validator = function (object, originalObject, castObject) {
            if (obj.allowedValue.length > 0 && _.indexOf(obj.allowedValue, originalObject) === -1) {
              return originalObject + ' is not an acceptable ' + castObject
            }
            if (!(new RegExp(/\S+@\S+\.\S+/).test(originalObject))) {
              return originalObject + ' is not an valid ' + castObject
            }
            return
          }
          return _result
        },
        phone: (obj) => {
          let _result = {}
          _result.type = 'string'
          _result.key = obj.header
          _result.required = !obj.optional
          _result.notEmpty = !obj.optional
          if (obj.max) { _result.max = obj.max }
          _result.min = obj.min
          _result.validator = function (object, originalObject, castObject) {
            if (obj.allowedValue.length > 0 && _.indexOf(obj.allowedValue, originalObject) === -1) {
              return originalObject + ' is not an acceptable ' + castObject
            }
            if (!(new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im).test(originalObject))) {  // eslint-disable-line
              return originalObject + ' is not an valid ' + castObject
            }
            return
          }
          return _result
        },
        date: (obj) => {
          let _result = {}
          _result.type = 'date'
          _result.key = obj.header
          _result.required = !obj.optional
          _result.notEmpty = !obj.optional
          _result.validator = function (object, originalObject, castObject) {
            if (obj.allowedValue.length > 0 && _.indexOf(obj.allowedValue, originalObject) === -1) {
              return originalObject + ' is not an acceptable ' + castObject
            }
            return
          }
          return _result
        }
      },
      gParser: undefined,
      complexSchema: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    csvTrasformColumns () {
      return _.map(this.csvHeaders, m => {
        return {
          key: m.header,
          title: m.header,
          width: 200,
          ellipsis: true
        }
      })
    },
    csvPreviewTraformedData () {
      return this.getTrasformedData(this.csvPreviewData)
    },
    getTrasformedData (data) {
      return _.map(data, m => {
        return _.reduce(m, (result, value, key) => {
          let inx = _.find(this.csvHeaders, f => { return f.id === key || f.header === key })
          if (inx.transform !== '') {
            try {
              result[inx.header] = new Function('row', inx.transform).call(this, m) // eslint-disable-line
            } catch (e) {
              result[inx.header] = 'Error!'
            }
          } else {
            result[inx.header] = value
          }
          // Default Value
          result[inx.header] = (inx.defaultValue !== '') ? inx.defaultValue : result[inx.header]
          return result
        }, {})
      })
    },
    onFileChange (e) {
      let self = this
      self.loading.fileRead = true
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      this.file = files[0]
      this.parseCSVToJSON(5, (results, file) => {
        self.csvHeaders = _.map(results.meta.fields, m => {
          return {
            id: m,
            header: m,
            type: 'text',
            min: 0,
            max: 0,
            allowedValue: [],
            defaultValue: '',
            dependentOn: '',
            regEx: '',
            optional: true,
            notes: '',
            transform: '',
            transformMethod: ''
          }
        })
        self.csvPreviewData = results.data
        self.loading.fileRead = false
      })
    },
    parseCSVToJSON (preview, callback) {
      // Convert csv to json using papa parser
      Papa.parse(this.file, {
        header: true,
        encoding: 'UTF-8',
        preview: preview,
        skipEmptyLines: true,
        complete: function (results, file) {
          callback(results, file)
        },
        error: function (error, file) {
          console.log('file', file)
          console.log('Error', error)
        }
      })
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
    renderCodemirror (item) {
      this.transformStr = item.transform || 'return row["' + item.id + '"]'
      this.$Modal.confirm({
        title: 'Write your trasform function',
        width: 70,
        render: (h) => {
          return h('div', {
            class: 'codemirror-model'
          }, [
            h('Row', {
              props: {
                gutter: 16
              }
            }, [
              h('Col', {
                props: {
                  span: 18
                },
                style: {
                  borderRight: '1px solid #ccc'
                }
              }, [
                h('codemirror', {
                  props: {
                    value: this.transformStr,
                    options: this.editorOptions
                  },
                  on: {
                    focus: (val) => {
                      this.transformMethod = 0
                    },
                    input: (val) => {
                      this.transformStr = val
                    }
                  }
                })
              ]),
              h('Col', {
                props: {
                  span: 6
                }
              }, [
                h('div', [
                  h('ul', [
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.toUpperCase()')
                          }
                        }
                      }, 'UpperCase')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.toLowerCase()')
                          }
                        }
                      }, 'LowerCase')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.trimLeft()')
                          }
                        }
                      }, 'Left Trim')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.trimRight()')
                          }
                        }
                      }, 'Right Trim')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.concat("")')
                          }
                        }
                      }, 'Concat')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.capitalize()')
                          }
                        }
                      }, 'Capitalize')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.stripHTMLTags()')
                          }
                        }
                      }, 'Strip HTML tags')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.stripSpecialCharacter()')
                          }
                        }
                      }, 'Strip special character')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.formatDate()')
                          }
                        }
                      }, 'Date format')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.toDecimal()')
                          }
                        }
                      }, 'Convert to decimal')
                    ]),
                    h('li', [
                      h('a', {
                        on: {
                          click: () => {
                            this.applyTrasformMethods('.toInteger()')
                          }
                        }
                      }, 'Convert to integer')
                    ])
                  ])
                ])
              ])
            ])
          ])
        },
        onOk: () => {
          item.transform = this.transformStr
          this.transformMethod = 0
        },
        onCancel: () => {
          this.transformMethod = 0
        }
      })
    },
    applyTrasformMethods (methodName) {
      this.transformStr = (this.transformMethod > 0) ? this.transformStr.slice(0, this.transformStr.length - this.transformMethod) + methodName : this.transformStr + methodName
      this.transformMethod = methodName.length
    },
    handleValidation () {
      let self = this
      // Set hansontable Header
      self.hotSettings.colHeaders = _.chain(self.csvHeaders).map(m => {
        return m.header
      }).value()
      console.log('self.hotSettings.colHeaders', self.hotSettings.colHeaders)
      // Set schema
      self.complexSchema = new SimpleSchema(_.chain(self.csvHeaders).map(m => {
        return self.simpleSchemaOption[m.type](m)
      }).keyBy(kb => {
        return kb.key
      }).value())
      // Parse full
      Papa.parse(this.file, {
        header: true,
        encoding: 'UTF-8',
        skipEmptyLines: true,
        // worker: true,
        complete: function (results, file) {
          console.log('self.csvData', self.csvData)
        },
        step: function (results, parser) {
          self.gParser = parser
          self.hotSettings.data = self.getTrasformedData(results.data)
          self.validateObject()
        },
        error: function (error, file) {
          console.log('file', file)
          console.log('Error', error)
        }
      })
    },
    validateObject (data) {
      let self = this
      self.complexSchema.validate(self.hotSettings.data[0], (err, newP, errors) => {
        if (err) {
          throw err
        } else if (errors.length > 0) {
          if (!self.gParser.paused()) {
            self.gParser.pause()
          }
          self.hotSettings.cells = (row, col) => {
            if (_.findIndex(self.csvHeaders, (d) => { return d.header === errors[0].field }) === col) {
              var cellProp = {}
              cellProp.className = 'hansonCellError'
              return cellProp
            }
          }
          self.isHandson = true
        } else {
          self.csvData.push(self.hotSettings.data[0])
          if (self.gParser.paused()) {
            self.gParser.resume()
          }
        }
      })
    },
    handleContinue () {
      // console.log('self.$refs.testHot', this.$refs.testHot.table.getData())
      this.validateObject()
    }
  }
}
</script>
<style lang="less">
  .codemirror-model{
    border-top: 1px solid #ccc;
    padding: 15px 15px 15px 15px;
    margin: 15px -20px -25px -20px;
    border-bottom: 1px solid #ccc;
  }
  .no-margin {
    margin: 0px;
  }
  .vue-input-tag-wrapper {
    width: 100%
  }
  .csv-uploader-wrapper {
    // border: 2px dashed #ccc;
    margin-top: 5px;
    position: relative;
    height: ~"calc(100vh - 155px)";
    .uploader-content {
      color: white;
      text-shadow: 1px 1px 2px black, 0 0 1px #2d8cf0, 0 0 5px #2d8cf0;
      display: table;
      height: inherit;
      width: 100%;
      > div {
        vertical-align: middle;
        display: table-cell;
      }
      .uploader-icon {
        display: inline-block;
        position: relative;
        i:nth-child(2) {
          position: absolute;
          top: 18px;
          transform: rotate(15deg);
          left: 20px;
          // text-shadow: 1px 1px 2px black, 0 0 1px #2d8cf0, 0 0 5px #2d8cf0;
        }
      }
      .uploader-message {
        text-align: center;
        padding: 23px 0px;
        // text-shadow: 1px 1px 2px black, 0 0 1px #2d8cf0, 0 0 5px #2d8cf0;
        text-align: center;
        font-size: 20px;
        font-weight: 600;
      }
    }
    input[type="file"] {
      opacity: 0;
      width: 100%;
      padding: 38px;
      position: absolute;
      top: 0;
      height: inherit;
    }
  }
  .hansonCellError {
    color: #ff0000;
  }
  .tablePreview td {
    height: 25px;
  }
</style>
