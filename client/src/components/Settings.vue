<template>
<div id="app">
  <h3>Add New Connection</h3>
  <Card :bordered="true">
    <span slot="title" style="padding: 10px 10px;">
          <Steps :current="currentStep"  >
              <Step title="1" content="Create"></Step>
              <Step title="2" content="Upload"></Step>
              <Step title="3" content="Import"></Step>
          </Steps>
      </span> 
  </Card>
  <Form ref="frmSettings" :model="frmSettings" :rules="frmRule" class="form">
      <template v-if="currentStep == 0">
          <Card :bordered="true" style="">
              <span slot="title">
                  <Row>
                      <Col span="12">
                          <FormItem label="Select Database" style="margin-bottom:0px">
                              <Select v-model="frmSettings.selectedDb" @on-change="clearIcon(frmSettings.selectedDb)">
                                  <Option value="mongo" key="mdb">Mongo DB</Option>
                                  <Option value="rethink" key="rdb">Rethink DB</Option>
                                  <Option value="elastic" key="edb">ElasticSearch DB</Option>
                                  <Option value="nedb" key="ndb">Ne DB</Option>
                                  <Option value="mysql" key="mysql">MySQL DB</Option>
                              </Select>
                          </FormItem>
                      </Col>
                      <Col span="12">
                          <FormItem label="Icon" v-if="frmSettings.selectedDb" style="margin-bottom:0px">
                              <div class="demo-upload-list">
                                  <template>
                                      <img v-if="frmSettings.upldIcn" :src="frmSettings.upldIcn" >
                                      <div v-else>
                                          <img v-if="frmSettings.selectedDb === 'mongo'" :src="mongo">
                                          <img v-if="frmSettings.selectedDb === 'rethink'" :src="rethink">
                                          <img v-if="frmSettings.selectedDb === 'elastic'" :src="elastic">
                                          <img v-if="frmSettings.selectedDb === 'nedb'" :src="nedb">
                                          <img style="background-color:#283646" v-if="frmSettings.selectedDb === 'mysql'" :src="mysql">
                                      </div>
                                  </template>
                              </div>
                              <div v-if="loading" class="demo-spin-col" span="1">
                                  <Spin fix>
                                      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                                  </Spin>
                              </div>
                              <div class="upload-btn-wrapper">
                                  <button class="btn"><Icon type="ios-cloud-upload-outline"></Icon> Upload Icon</button>
                                  <input type="file" id="upldIcn" title="Upload icon" accept="image/*">
                              </div>
                          </FormItem>
                      </Col>
                  </Row>
              </span>
              <Row style="margin-top:10px;">
                  <Col span="12" style="padding-left:10px;padding-right:10px">
                      <FormItem label="Connection Name" prop="connection_name">
                          <Input placeholder="Connection Name" v-model.trim="frmSettings.connection_name"></Input>
                      </FormItem>
                      <FormItem label="Host" prop="host">
                          <Input placeholder="localhost" v-model.trim="frmSettings.host"></Input>
                      </FormItem>
                      <FormItem label="username">
                          <Input placeholder="Username" v-model.trim="frmSettings.username"></Input>
                      </FormItem>
                      <FormItem>
                          <Checkbox v-model="frmSettings.isenable" label="enable">Enable</Checkbox>
                          <span v-if="checkdefault">
                        <Checkbox v-model="frmSettings.isdefault" label="default" disabled>is Default</Checkbox>
                      </span>
                          <span v-else>
                        <Checkbox v-model="frmSettings.isdefault" label="default">is Default</Checkbox>
                      </span>
                      </FormItem>
                  </Col>
                  <Col span="12" style="padding-left:10px;padding-right:10px">
                      <FormItem label="Database Name" prop="dbname">
                          <Input placeholder="Flowz" v-model.trim="frmSettings.dbname"></Input>
                      </FormItem>
                      <FormItem label="Port" prop="port">
                          <Input placeholder="8080" v-model.trim="frmSettings.port"></Input>
                      </FormItem>
                      <FormItem label="Password">
                          <Input type="password" placeholder="Password" v-model.trim="frmSettings.password"></Input>
                      </FormItem>
                      <FormItem label="Notes">
                          <Input type="textarea" v-model.trim="frmSettings.notes"></Input>
                      </FormItem>
                      <Button type="primary" v-on:click="goToStep(1, 'frmSettings', frmSettings)">Continue
                          <!-- <span v-if="!papapaserdata">Continue</span>
                                             <span v-else>Loading...</span> -->
                          <span>
                              <Icon  v-if="check_conn" :type="conn_icon" style="padding-left:5px;font-size:12px;"/>
                          </span>
                      </Button>
                      <!-- <i class="ivu-icon ivu-icon-checkmark" style="padding-left:10px;font-size:20px;color:#5cb85c"></i>  :class="getIcon()" -->
                  </Col>
              </Row>
          </Card>
      </template>
      <template v-if="currentStep == 1">
          <Card :bordered="true" style="padding: 0px 10px;">
              <Row>
                <Col span="12">
                <FormItem prop="rdoCrt">
                  <RadioGroup v-model="frmSettings.rdoCrt" @on-change="getSchemaAll(frmSettings.rdoCrt)">
                    <Radio label="rbtCSV"><span>CSV Upload</span></Radio>
                    <Radio label="rbtDB"><span>By Database</span></Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem>
                  <Row>
                <Col span="6">
                  <!-- <FormItem prop="rdosync">
                    <RadioGroup v-model="frmSettings.rdosync" v-if="frmSettings.rdoCrt == 'rbtDB'">
                      <Radio label="rbtsync"><span>Keep Sync</span></Radio>
                    </RadioGroup>
                  </FormItem> -->
                  </Col>
                  <Col span="6">
                  <!-- <FormItem prop="keep_sync" v-if="frmSettings.rdosync == 'rbtsync' && frmSettings.rdoCrt == 'rbtDB'">
                    <Input placeholder="Everyday/Everyhour" v-model.trim="frmSettings.keep_sync"></Input>
                  </FormItem> -->
                  </Col>
                </Row>  
                </FormItem>
                <!-- <FormItem prop="rdodb">
                  <RadioGroup v-model="frmSettings.rdodb" v-if="frmSettings.rdoCrt == 'rbtDB'" @on-change="getTableAll()">
                    <Radio label="rbtCrnt"><span>Current Database</span></Radio>
                    <Radio label="rbtExstng"><span>Existing Database</span></Radio>
                  </RadioGroup>
                </FormItem> -->
                <FormItem label="Create with" v-if="frmSettings.rdoCrt == 'rbtDB' && frmSettings.rdodb == 'rbtExstng'">
                  <Select v-model="frmSettings.optCrt" @on-change="getsettingsAll(frmSettings.optCrt)">
                      <Option value="schema" key="schema">Only Schema</Option>
                      <Option value="schemaData" key="schemaData">Both Schema & Data</Option>
                  </Select>
                </FormItem>
                <FormItem v-if="frmSettings.rdoCrt == 'rbtDB'">
                    <Button type="primary" @click="handleSubmit('frmSettings')" >Create Connection</Button>
                </FormItem>
                <FormItem>
                  <Row>
                    <Col span="10" v-if="frmSettings.rdoCrt == 'rbtCSV'">
                        <h4>CSV File Upload</h4>
                        <div class="upload-btn-wrapper" v-on:click="uploadCsv()">
                          <button class="btn"><Icon type="ios-cloud-upload-outline"></Icon> Upload CSV</button>
                          <input type="file" id="upldCSV" title="Upload CSV">
                        </div>

                    </Col>
                    <Col span="10" v-if="frmSettings.rdoCrt == 'rbtDB'" style="display:none;">
                    <h4>Database Settings</h4>
                    <div class="upload-btn-wrapper">
                      <button class="btn"><Icon type="ios-cloud-upload-outline"></Icon> Upload</button>
                      <input type="file" id="upload" title="Upload">
                    </div>
                    </Col>
                  </Row>
                </FormItem>
                </Col>

                <div v-if="frmSettings.optCrt && frmSettings.rdoCrt == 'rbtDB' && frmSettings.rdodb == 'rbtExstng'">
                  <Tabs type="card" style="width: 100%;">
                    <TabPane label="mongo">
                      <Table border :columns="tabsData.mongoCols" :data="tabsData.mongoDt"></Table>
                    </TabPane>
                    <TabPane label="rethink">
                      <Table border :columns="tabsData.rethinkCols" :data="tabsData.rethinkDt"></Table>
                    </TabPane>
                    <TabPane label="elastic">
                      <Table border :columns="tabsData.elasticCols" :data="tabsData.elasticDt"></Table>
                    </TabPane>
                    <TabPane label="nedb">
                      <Table border :columns="tabsData.nedbCols" :data="tabsData.nedbDt"></Table>
                    </TabPane>
                    <TabPane label="mysqldb">
                      <Table border :columns="tabsData.mysqlCols" :data="tabsData.mysqlDt"></Table>
                    </TabPane>
                  </Tabs>
                </div>
              </Row>
              <div v-if="frmSettings.rdoCrt == 'rbtCSV'">
                  <div id="example1" class="hot handsontable htColumnHeaders"></div>
                  <table>
                    <tr class="ivu-table-row" v-for="(item, index) in errmsg" style="color:red;font-size:14px;">{{item}}</tr>
                  </table>
                  <Row>
                    <FormItem>
                      <div id="hot-preview" v-if="showHandson">
                        <!-- <HotTable :root="root" :settings="hotSettings"></HotTable> -->

                        <Button type="primary" @click="modifyData()">Modify Data</Button>
                      </div>
                      <div>
                        <h4 v-if="!showHandson && displaymessage">Preview Details<Button type="primary" icon="ios-arrow-down" class="ios-arrow-down" @click="showPreviewDetails()" v-if="!previewdetails"></Button>
                          <Button type="primary" icon="ios-arrow-up" class="ios-arrow-down" @click="hidePreviewDetails()" v-if="previewdetails"></Button></h4>
                        <div class="schema-form ivu-table-wrapper" v-if="!showHandson && displaymessage && previewdetails">
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
                      <h4 v-if="displaymessage">Header Details<Button type="primary" icon="ios-arrow-down" class="ios-arrow-down" @click="showHeaderDetails()" v-if="displaymessage && !headerDetails"></Button>
                        <Button type="primary" icon="ios-arrow-up" class="ios-arrow-down" @click="hideHeaderDetails()" v-if="displaymessage && headerDetails"></Button></h4>
                      <div class="schema-form ivu-table-wrapper" v-if="displaymessage && headerDetails">
                        <div class="ivu-table ivu-table-border" >
                          <div class="ivu-table-body">
                            <table>
                              <colgroup>
                                <col width="300">
                                <col width="300">
                                <col width="200">
                                <col width="70">
                                <col width="300">
                                <col width="100">
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
                                                            <!-- <Option value="email" key="email">Email</Option>
                                                            <Option value="number" key="number">Number</Option>
                                                            <Option value="boolean" key="boolean">Boolean</Option>
                                                            <Option value="phone" key="phone">Phone</Option>
                                                            <Option value="date" key="date">Date</Option> -->
                                                        </Select>
                                    </div>
                                  </td>

                                  <td class="">
                                    <div class="ivu-table-cell">
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
                                            <!-- <Input size="small" v-model="csvData[index].dependentOn"></Input> -->
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

                                  <td class="">
                                    <div class="ivu-table-cell">
                                      <a @click="model = true">
                                        <Icon type="compose"></Icon>
                                      </a>
                                      <Modal v-model="model" title="Transform" @on-ok="handleModalOk" width="900px">
                                        <Row>
                                          <Col span="20">Script</Col>
                                          <Col span="4">Opration</Col>
                                        </Row>
                                      </Modal>
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
                  </Row>
                  <Row>
                    <Col span="6">
                    <FormItem>
                      <Button type="primary" @click="handleSubmit('frmSettings')" v-if = "displaymessage" :disabled="!disabled">Create Connection</Button>
                      <Button type="primary" :loading="loadingData" v-on:click="insertCsvData(frmSettings.upldCSV)" v-if="validateButton">
                                    <span v-show="!loadingData">Validate Data</span>
                                    <span v-show ="loadingData">Loading...</span>
                                  </Button>
                      <Button type="primary" @click="saveData(2)" v-if="saveButton">
                        <span v-show="!loadingData">Save Data</span>
                        <span v-show ="loadingData" id="loading">Loading...</span>
                      </Button>
                      <!-- <Button type="primary" @click="importData(frmSettings)" v-if="importButton" :disabled="disableImport">

                    </Button> -->
                    </FormItem>
                    </Col>
                    <Col span="6">
                    <FormItem>
                      <Button type="primary" v-if="serverSideValidation" @click="serverSideValidation()">Server Side Validation</Button>
                    </FormItem>
                    </Col>
                  </Row>
              </div>
          </Card>
      </template>
      <template v-if="currentStep == 2">
          <Card :bordered="true" ><br>
              <div style="height:80px">
                  <span v-if="importButton" class="msg"> Click the import button to import your data to realdb</span>
                  <!-- <span v-if="!importButton && !completed"  class="msg"> Importing your data -->
                  <Spin v-if="!importButton && !completed" class="msg">
                      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                      <div>Importing your data</div>
                  </Spin>
                        <!-- </span> -->
                  <span v-if="completed" class="msg" id="msg">Import completed</span>
                  <Button type="primary" @click="importData(frmSettings)" v-if="importButton" :disabled="disableImport" style="float:right;margin-right:5%;" id="import">ImportData</Button>
                  <Button type="error" @click="undo(frmSettings)" v-if="completed"  style="float:right;margin-right:5%;">Undo Import</Button>
              </div>
          </Card>
      </template>
  </Form>
</div>
</template>

<script>
/*eslint-disable*/
const $ = require('jquery')
var Schema = require('simpleschema')
let axios = require("axios")
import Papa from 'papaparse'
import api from '../api'
import schema from '../api/schema'
import InputTag from 'vue-input-tag'
import mongo from '../assets/images/mongo.png'
import rethink from '../assets/images/rethink.png'
import elastic from '../assets/images/elasticsearch.png'
import nedb from '../assets/images/nedb.png'
import mysql from '../assets/images/mysql.png'
import Tab from './Tab'
import config from '@/config'
// let _ = require('lodash')
import _ from 'underscore'
import expandRow from './table-expand.vue'
import Emitter from '@/mixins/emitter'
import moment from "moment";
import VueMomentJS from "vue-momentjs";
import Multiselect from 'vue-multiselect'
import io from 'socket.io-client';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';

let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.serverURI, { path: '/dbetl/socket.io' })
} else {
  socket = io(config.serverURI)
}
// const socket = io(config.serverURI);
const app = feathers()
  .configure(socketio(socket));
moment().format();
// const socket = io(config.serverURI);
// const app = feathers()
//   .configure(socketio(socket));
// moment().format();

let res;
let finalModifiedDataArray = [];
let id;
let logs = []
let baseUrl = config.serverURI
let savedObj
let errors
let err
let del_err
let save_err
socket.on('response',function(res){
  console.log("++++++++++",res)
  if(res.errors == 0){
    errors = res.errors
    api.request('patch', '/import-tracker/'+id,savedObj).then(function(res){
      console.log("response",res.data)
    })
    .catch(error => {
      console.log(error);
    })
  }
})
socket.on('res',function(res){

  if(res.stderr == "" || (JSON.parse(res.stdout)).errors == false){
    err = res.stderr
    console.log("+++++++++++++++",res.stdout.search("errors"))
    if(res.stdout.search("errors") != -1){
      err = (JSON.parse(res.stdout)).errors
    }
    console.log("iiiiiiiiiiiiii",err)
    console.log("logs.....",logs)
    logs.push({date:Date(),status:"import_staging_completed"})
    var obj = {
      status: 'import_staging_completed',
      modified: Date(),
      log:logs
    }
    api.request('patch', '/import-tracker/'+id, obj).then(function(res){
      console.log("response",res.data)
      console.log("++++++++++++")
    })
    .catch(error => {
      console.log(error);
    })

  }
});
socket.on('error',function(_res){
  console.log("error.....",_res)
  save_err = _res
  // self.loadingData = false
  // self.$Notice.error({title:"Error!",desc: "Error in saving CSV...!  Kindly check your data"})
})
socket.on('delete',function(res){
  console.log('delete',res)
  if(res.ok == 1 || res.errors == 0 || res == "Deleted"){
    del_err = res
    logs.push({date:Date(),status:"import_staging_running"})
    var obj = {
      status: 'import_staging_running',
      log:logs
    }
    api.request('patch', '/import-tracker/'+id, obj).then(function(res){
      console.log("response",res.data)
      // self.importButton = true
      // // self.disabled = true
      // self.disableImport = false
      // self.completed = false
    })
    .catch(error => {
      console.log(error);
    })
  }

})


export default {
  name: 'Settings',
  mixins: [Emitter],
  components: {
    'input-tag': InputTag,
    'f-tab': Tab,
    expandRow,
    Multiselect
  },
  props: {
    checked: {
      type: Boolean,
      default: true
    },
    obj: Object
  },
  data() {
    const validatePort = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please enter port number'));
      } else {
        if ((this.frmSettings.selectedDb === 'rethink' && value === '9200') || (this.frmSettings.selectedDb === 'rethink' && value === '27017') || (this.frmSettings.selectedDb === 'rethink' && value === '8080') || (this.frmSettings.selectedDb ===
            'mongo' && value === '9200' || this.frmSettings.selectedDb ===
            'mongo' && value === '28015')) {
          callback(new Error('Please enter valid port'));
        } else {
          callback();
        }
      }
    };
    const validateConn_name = async(rule, value, callback) => {
      var res = await this.validateName(value, this.frmSettings.selectedDb)
      // console.log('res..// ', res)
      if (res === 'yes') {
        callback(new Error('Already Exist....'))
      } else {
        callback();
      }
    };
    return {
      checkdefault: false,
      check_conn: false,
      conn_icon: 'load-a',
      displaymessage: false,
      value: "",
      options: [],
      validateButton: false,
      // parsedata: [],
      saveButton: false,
      importButton: true,
      serverSideValidation: false,
      showHandson: false,
      expandValue: false,
      currentStep: 0,
      check: this.checked,
      expand: false,
      moment : moment,
      disabled: false,
      disableImport : false,
      headerDetails: true,
      previewdetails: true,
      completed : false,
      frmSettings: {
        isenable: true,
        connection_name: 'connection_'+ moment().unix(),
        host: 'localhost',
        port: '',
        dbname: 'defaultdb',
        username: '',
        password: '',
        selectedDb: '',
        upldIcn: '',
        upldCSV: [],
        optCrt: '',
        rdoCrt: '',
        rdodb: '',
        rdosync: '',
        keep_sync: '',
        notes: '',
        Database: [],
        schemaData: [],
        isdefault: false
      },
      schemaAllData: [],
      loading: false,
      frmRule: {
        connection_name: [{
          required: true,
          message: 'Please enter connection name',
          trigger: 'blur'
        },
        { validator: validateConn_name, trigger: 'blur' }
        ],
        host: [{
          required: true,
          message: 'Please enter host name',
          trigger: 'blur'
        }, ],
        port: [
        // {
        //   required: true,
        //   message: 'Please enter port number',
        //   trigger: 'blur'
        // },
        { validator: validatePort, trigger: 'blur' }
        ],
        dbname: [{
          required: true,
          message: 'Please enter database name',
          trigger: 'blur'
        }],
        rdoCrt: [{
          required: true,
          message: 'Please Select optio',
          trigger: 'blur'
        }, ],
      },
      mongo,
      rethink,
      elastic,
      nedb,
      mysql,
      model: false,
      csvData: [],
      errmsg: [],
      headers: [],
      complexSchema: {},
      data1: [],
      userUploadedDataArray: [],
      loadingData: false,
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
      allSetting: [],
      allSchema: [],
      tabsData: {
        mongoCols: [],
        mongoDt: [],
        rethinkCols: [],
        rethinkDt: [],
        elasticDt: [],
        elasticCols: [],
        nedbDt: [],
        nedbCols: [],
        mysqlDt: [],
        mysqlCols: []
      },
      keys: []
    }
  },
  methods: {
    checkdefaultfun: async function() {
      // console.log('................')
      var _res = await api.request('get', '/settings')
      var dbins_l = 0
      for(let db in _res.data) {
        dbins_l += _res.data[db].dbinstance.length
      }
      // console.log(dbins_l)
      if(dbins_l === 0) {
        // return false
        this.checkdefault = true
        this.frmSettings.isdefault = true
      }
    },
    showHeaderDetails () {
      this.headerDetails = true
    },
    showPreviewDetails () {
        this.previewdetails = true
    },
    hideHeaderDetails () {
      this.headerDetails = false
    },
    hidePreviewDetails () {
        this.previewdetails = false
    },
    validateName: async function(value, db) {
      // console.log('value', value, db)
      var _res = await api.request('get', '/settings?dbname=' + db)
      // console.log('_res/// ', _res.data)
      var flag = false
      for (let i = 0; i < _res.data.length; i++) {
        if (_res.data[i].connection_name === value) {
          flag = true
        }
      }
      if (!flag) {
        return 'no'
      } else {
        return 'yes'
      }
    },
    uploadCsv() {
      let self = this
      // console.log("uploadCsv called....")
      $(document).ready(function() {
        $('#upldCSV').change(function() {
          // console.log("called")
          let fileChooser = document.getElementById('upldCSV');
          let file = fileChooser.files[0];

          Papa.parse(file, {
            header: true,
            encoding: "UTF-8",
            complete: function(results, file) {
              console.log(results.data)
              // console.log("Parsing complete:", results.data, file);
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


              self.frmSettings.upldCSV = results.data;
              // console.log("--------------------->", self.frmSettings.upldCSV, self.frmSettings.upldCSV)
              self.headers = Object.keys(self.frmSettings.upldCSV[0]);
              // console.log("*************",self.headers)
              for(var i=0;i<self.headers.length;i++){
                self.complexSchema[self.headers[i]] = {"type":"string"}
              }
              // console.log("self.complexSchema................",self.complexSchema)
              self.options = self.headers;
              self.displaymessage = true
              self.validateButton = true
              console.log("self.options ", self.options);
              _.forEach(self.headers, (f) => {
                self.csvData.push({
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
                  transform: ''
                })
              })
              logs.push({date:Date(),status:"upload_completed"})
              var obj = {
                status: 'upload_completed',
                modified: Date(),
                log:logs
              }
              api.request('patch', '/import-tracker/'+id, obj).then(function(res){
                console.log("response",res.data)
              })
              .catch(error => {
                console.log(error);
              })
            },
            error: function(error, file) {
              console.log("Error", error);
            }
          });
        });
      });
    },

    customLabel(option) {
      return `${option}`
    },
    getSchemaAll: function(value) {
      // // alert(value)
      // if (value === 'rbtDB') {
      //     schema.get()
      //         .then((response) => {
      //             this.allSchema = response.data
      //             console.log(response.data)
      //         })
      //         .catch(error => {
      //             console.log(error)
      //         })
      // }
    },
    type(index) {
      var arr = [];

      console.log("iiiiiiiiiiiiiiiiiii",this.csvData[index].type)
      // console.log("dsav",this.csvData.length)
      // _.forEach(this.csvData, function(value){
      //   console.log("hiiiii",value)
      //   arr.push(type=value.type)
      // })
      // this.model1 = this.csvData[index].type
      this.validateButton = true
      this.loadingData = false
      this.errmsg = [];
      this.data1 = [];
      let headerSchema = {}

      for (var [index, item] of this.headers.entries()) {
        var self = this
        let emailValidatorFunc = function(obj, value, fieldName) {
          let re = /\S+@\S+\.\S+/;
          if (value != undefined) {
            if (re.test(value) != true) return 'invalid email address';
            return;
          }
        };
        let dateValidatorFunc = function(obj, value, fieldName) {
          let date = moment(value);
          let isValid = date.isValid();
          if (isValid != true) return 'invalid date. please provide date in y-m-d or d-m-y format';
          date._d = moment(new Date(date._d)).format('DD/MM/YYYY')
          return;
        }

        let phoneValidatorFunc = function(obj, value, fieldName) {
          let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          // console.log(value);
          if (value != undefined) {
            if (re.test(value) != true) return 'invalid phone number';
            return;
          }
        }
        let getFunctionText = function(obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          if (func1 != undefined) {
            return func1
          } else if (func2 != undefined) {
            return func2
          } else {
            return;
          }
        }
        let getFunctionEmail = function(obj, value, fieldName) {
          var func1 = emailValidatorFunc(obj, value, fieldName)
          var func2 = allowedValueValidatorFunc(obj, value, fieldName)
          if (func1 != undefined) {
            return func1
          } else if (func2 != undefined) {
            return func2
          } else {
            return;
          }
        }
        let getFunctionNumber = function(obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          if (func1 != undefined) {
            return func1
          } else if (func2 != undefined) {
            return func2
          } else {
            return;
          }
        }
        let getFunctionPhone = function(obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = phoneValidatorFunc(obj, value, fieldName)
          if (func1 != undefined) {
            return func1
          } else if (func2 != undefined) {
            return func2
          } else if (func3 != undefined) {
            return func3
          } else {
            return;
          }
        }
        let getFunctionDate = function(obj, value, fieldName) {
          var func1 = allowedValueValidatorFunc(obj, value, fieldName)
          var func2 = regExValidatorFunc(obj, value, fieldName)
          var func3 = dateValidatorFunc(obj, value, fieldName)
          if (func1 != undefined) {
            return func1
          } else if (func2 != undefined) {
            return func2
          } else if (func3 != undefined) {
            return func3
          } else {
            return;
          }
        }
        let allowedValueValidatorFunc = function(obj, value, fieldName) {
          // console.log("@@@@@@@@@@@@@@@",fieldName)
          var i;
          _.forEach(self.headers, function(value, key) {
            if (fieldName == value) {
              i = key;
            }
          })
          console.log("aaaaaaaaaaaaaaaaaa", self.csvData[i].allowedValue)
          if (self.csvData[i].allowedValue.length > 0) {
            if (value != undefined) {
              let check = _.includes(self.csvData[i].allowedValue, value)
              if (!check) return 'invalid allowedValue';
              return;
            }
          }
        };

        let regExValidatorFunc = function(obj, value, fieldName) {
          console.log("rrrrrrrrrrrrrrr")
          var i;
          _.forEach(self.headers, function(value, key) {
            if (fieldName == value) {
              i = key;
            }
          })
          if (self.csvData[i].regEx !== '') {
            if (value != undefined) {
              let pttrn = new RegExp(self.csvData[i].regEx)
              if (pttrn.test(value) == false) return 'not match with regEx value'
              return;
            }
          }
        };

        if (this.csvData[index].optional == true) {
          if (this.csvData[index].type == 'text') {
            headerSchema[item] = {
              type: 'string'
            };
          } else if (this.csvData[index].type == 'email') {
            //headerSchema[item] = {type:'string',regEx:/^[a-z0-9_.]+[@][a-z]+[.][a-z][a-z]+$/};
            headerSchema[item] = {
              type: 'string',
              validator: emailValidatorFunc
            };
          } else if (this.csvData[index].type == 'number') {
            headerSchema[item] = {
              type: 'number'
            };
          } else if (this.csvData[index].type == 'boolean') {
            headerSchema[item] = {
              type: 'boolean'
            };
          } else if (this.csvData[index].type == 'phone') {
            headerSchema[item] = {
              type: 'string',
              validator: phoneValidatorFunc
            };
          } else if (this.csvData[index].type == 'date') {
            headerSchema[item] = {
              type: 'string',
              validator: dateValidatorFunc
            };
          }
        } else if (this.csvData[index].optional == false) {
          if (this.csvData[index].type == 'text') {
            headerSchema[item] = {
              type: 'string',
              max: this.csvData[index].max,
              validator: getFunctionText
            };
          } else if (this.csvData[index].type == 'email') {
            headerSchema[item] = {
              type: 'string',
              validator: getFunctionEmail
            };
          } else if (this.csvData[index].type == 'number') {
            headerSchema[item] = {
              type: 'string',
              max: this.csvData[index].max,
              min: this.csvData[index].min,
              validator: getFunctionNumber
            };
          } else if (this.csvData[index].type == 'boolean') {
            headerSchema[item] = {
              type: 'boolean'
            };
          } else if (this.csvData[index].type == 'phone') {
            headerSchema[item] = {
              type: 'string',
              validator: getFunctionPhone
            };
          } else if (this.csvData[index].type == 'date') {
            headerSchema[item] = {
              type: 'string',
              validator: getFunctionDate
            };
          }
        }

      }
      this.complexSchema = headerSchema
      console.log("++++++++++",this.complexSchema,this.headers )
    },
    insertCsvData(data) {
      var self = this
      self.loadingData = true
      logs.push({date:Date(),status:'validation_running'})
      var obj = {
        status: 'validation_running',
        log: logs
      }
      api.request('patch', '/import-tracker/'+id, obj).then(function(res){
        console.log("response",res.data)
      })
      .catch(error => {
        console.log(error);
      })

      setTimeout(function() {
        // alert(this.validatingData)
        var schema = new Schema(self.complexSchema)

        // var data1 = []
        var errcols = []

        self.userUploadedDataArray = data;
        // console.log(">>>> this.complexSchema " , self.complexSchema);

        var schema = new Schema(self.complexSchema)
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.data ' , data);
        // console.log(">>>>>>>>>>>>>>> userUploadedDataArray" , this.userUploadedDataArray);
        // console.log("new headers ", this.headers);
        // modify headers as per the changes
        // asign new data to the data object


        _.forEach(data, function(value, key) {
          schema.validate(value, function(err, newP, errors) {
            if (err) {
              throw err;
            } else {
              if (errors.length) {
                // console.log("Validation errors!");
                // console.log("error at : "+ JSON.stringify(errors) + " on row "+ key);
                // errrows.push(key)
                self.data1.push(Object.values(value))
                // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",self.data1)

                // self.errmsg.push("error at : "+ JSON.stringify(errors) + " on row "+ key)
                // console.log("*****************errmsg",self.errmsg);
                let old_headers = _.keys(self.frmSettings.upldCSV[0]);
                _.forEach(errors, (item) => {

                  // console.log("}}}}}}}}}}}}}}}}}",new headers)
                  errcols.push({
                    cols: _.indexOf(old_headers, item.field),
                    rows: key
                  })
                  // console.log("}}}}}}}}}}}}}}}}}",item.field)
                  // console.log("@@@@@@@@@@@@@@@@@@",item.message)
                  self.errmsg.push("* " + item.message + " at column: " + item.field)
                  // console.log("!!!!!!!!!!!!!!!!!!",self.errmsg)
                  // console.log("123456",errcols)
                })
                self.showHandson = true

              } else {
                console.log("newP:");
                // console.log( newP );
              }
            }
          });
        })
        self.loadingData = false
        self.validateButton = false
        // .log("@@@@@@@@@@@@",self.data1)
        if (self.data1.length == 0) {
          document.getElementById("example1").style.display = "none";
          self.errmsg = []
          self.$Message.success('validation successfully complited');
          self.headerDetails = false
          self.saveButton = true
          logs.push({date:Date(),status:'validation_completed'})
          var obj = {
            status: 'validation_completed',
            modified: Date(),
            log:logs
          }
          api.request('patch', '/import-tracker/'+id, obj).then(function(res){
            console.log("response",res.data)
          })
          .catch(error => {
            console.log(error);
          })
        } else {
          self.$Message.error('validation error');
        }
        self.showerrmsg(errcols)
        document.getElementById("hot-display-license-info").style.display = "none";
      }, 1000)
    },
    showerrmsg(errcols) {
      var headers = []
      var
        example1 = document.getElementById('example1'),
        hot;
      _.forEach(this.csvData, function(value) {
        headers.push(value.header)
      })
      hot = new Handsontable(example1, {
        data: this.data1,
        // rowHeaders: true,
        colHeaders: headers,
        // rowHeaders: true,
        height: 300,
        cells: function(row, col) {
          var cellProp = {};
          _.forEach(errcols, function(value, key) {
            if (col === value.cols && row === key) {
              cellProp.className = 'error'
            }
          });
          return cellProp;
        }
      });
    },
    modifyData() {

      let schema = new Schema(this.complexSchema)
      let colHeaders = this.headers;
      let hotSettingsData = this.data1;
      let showHandson = this.showHandson;
      let errMsgArray = this.errmsg;
      let userUploadedDataArr = this.userUploadedDataArray;
      let newHotSettingsData = [];

      errMsgArray = [];
      var errcols = [];
      var self = this;
      // console.log("valueToBeValidat hotSettingsData " , hotSettingsData);
      // console.log("valueToBeValidat colHeaders " , colHeaders);
      _.forEach(hotSettingsData, function(value, key) {
        let valueToBeValidated = _.object(colHeaders, value)
        schema.validate(valueToBeValidated, function(err, newP, errors) {
          if (err) {} else {
            if (errors.length) {
              // console.log("Validation errors!");
              // console.log("error at : "+ JSON.stringify(errors) + " on row "+ key);
              newHotSettingsData.push(Object.values(value))
              // console.log("newHotSettingsData ",newHotSettingsData);
              self.data1 = newHotSettingsData;
              _.forEach(errors, (item) => {
                errcols.push({
                  cols: _.indexOf(self.headers, item.field),
                  rows: key
                })
                errMsgArray.push("* " + item.message + " at column: " + item.field)
                // errMsgArray.push("error at field:"+item.field+ "  message:"+item.message)
              })
              self.errmsg = errMsgArray;
              // errMsgArray.push("error at : "+ JSON.stringify(errors) + " on row "+ key)

              showHandson = true
            } else {
              // console.log("modified data " , newP);
              // console.log("userUploadedDataArray ", userUploadedDataArr)
              finalModifiedDataArray.push(newP);
              // console.log("11111111111",finalModifiedDataArray)
              res = userUploadedDataArr.map(obj => finalModifiedDataArray.find(o => o._id === obj._id) || obj);
              // console.log("FINAL MODIFIED ARRAY AFTER CORRECTION ", res);
              userUploadedDataArr = res;
            }
          }
        });
      })
      // console.log("@@@@@@res " , res);
      if (res != undefined) {
        this.frmSettings.upldCSV = res;
      }

      this.data = newHotSettingsData;
      if (this.data.length == 0) {
        self.errmsg = []
        $('table.htCore').each(function() {
          this.remove()
        })
        document.getElementsByClassName("ht_master handsontable")[0].remove();
        document.getElementById("example1").style.display = "none";
        // document.getElementById("hot-display-license-info").style.display = "none";
        this.saveButton = true
        // alert("proceed")
        this.showHandson = false;
        this.$Message.success('validation successfully completed');
        this.headerDetails = false;
        logs.push({date:Date(),status:'validation_completed'})
        var obj = {
          status: 'validation_completed',
          modified: Date(),
          log:logs
        }
        api.request('patch', '/import-tracker/'+id, obj).then(function(res){
          console.log("response",res.data)
        })
        .catch(error => {
          console.log(error);
        })
      } else {
        // $('.ht_clone_top handsontable').remove()
        $('table.htCore').each(function() {
          this.remove()
        })
        document.getElementsByClassName("ht_master handsontable")[0].remove();
        self.showerrmsg(errcols)
        self.$Message.error('validation error');
      }
      document.getElementById("hot-display-license-info").style.display = "none";
    },
    saveData(step) {
      this.$Loading.start();
      var self = this;
      self.loadingData = true
      setTimeout(function() {
        self.$Loading.finish();
      }, 3000)
      var self = this;
      console.log(self.frmSettings.upldCSV)
      // console.log("schema ", this.complexSchema)
      for(var i=0;i<self.frmSettings.upldCSV.length;i++){
        self.frmSettings.upldCSV[i].importTracker_id = id
      }

      socket.emit('stream', self.frmSettings.upldCSV, (error,data) => {
        if(error){
          console.log(error)
          self.$Notice.error({title:"Error!",desc: "Error in saving CSV...!"})
        }
      });
      logs.push({date: Date(),status:'import_staging_running'})
      savedObj = {
        csvDetails: {
          no_of_records:self.frmSettings.upldCSV.length
        },
        status: "import_staging_running",
        modified: Date(),
        log:logs
      }

      setTimeout(function() {
        console.log("errors",errors)
        if(errors == 0){
          self.loadingData = false
          self.saveButton = false
          self.currentStep = step
        }
        else if(save_err != ""){
            self.loadingData = false
            $Notice.error({title:"Error!",desc: "Error in saving CSV...!  Kindly check your data"})
        }
        else {
          self.loadingData = false
          $Notice.error({title:"Error!",desc: "Error in saving CSV...!  Kindly check your data"})
        }
      },3000)

    },
    undo(data){
      // alert("1")
      var self = this
      console.log(data)
      data["deletedFlag"] = true
      console.log("id.......",id)
      if(this.$route.params.id != undefined){
        id = this.$route.params.id
        socket.emit('import-tracker::find',{ id: id} ,(error, data1) => {
        data = data1[0]
        data["deletedFlag"] = true
        logs = data1[0].log

      socket.emit('import',data,(error,data) => {
          // console.log("dattaaaa...",data)
          if(error){
            console.log(error)
            this.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
          }
        })

        setTimeout(function() {
          // console.log("del_err",del_err)
        if(del_err.ok == 1 || del_err.errors == 0 || del_err == "Deleted"){
              self.importButton = true
              self.disableImport = false
              self.completed = false
        }
        else {
            self.$Notice.error({title: "Error!",desc:"Error in deleting the records!"})
        }
      },1000)

      })
      }
      else {
        socket.emit('import',data,(error,data) => {
          if(error){
            console.log(error)
            this.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
          }
        })

        setTimeout(function() {
          console.log("del_err",del_err)
        if(del_err.ok == 1 || del_err.errors == 0 || del_err == "Deleted"){
              self.importButton = true
              self.disableImport = false
              self.completed = false
        }
        else {
            self.$Notice.error({title: "Error!",desc:"Error in deleting the records!"})
        }
      },1000)
      }

    },

    importData(data){
      var self = this
      if(data == undefined || (data.upldCSV == undefined || data.upldCSV.length == 0) && this.$route.params.id != undefined){
        id = this.$route.params.id
        socket.emit('import-tracker::find',{ id: id} ,(error, data3) => {
        data = data3[0]
        logs = data3[0].log
        self.importButton = false
        data["deletedFlag"] = false
        console.log(data)

        socket.emit('customer-uploaded-data::find',{importTracker_id:id},(error,csvdata)=>{
          data["upldCSV"] = csvdata
          socket.emit('import',data,(error,data) => {
            if(error){
              console.log(error)
              self.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
            }
          });

          setTimeout(function() {
            console.log("err",err)
            if(err == "" || err == false){
              console.log("errr.....",err)
              self.disabled = true
               self.disableImport = true
               self.completed = true
            }
              else {
                self.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
              }
          },1000)


      })
    })
      }
     else {
      self.importButton = false
      data["deletedFlag"] = false
      // console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ else",data.log)
        socket.emit('import',data,(error,data) => {
          if(error){
            console.log(error)
            self.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
          }
        });

        setTimeout(function() {
          console.log("err",err)
          if(err == "" || err == false){
            console.log("errr.....",err)
            self.disabled = true
             self.disableImport = true
             self.completed = true
          }
            else {
              self.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
            }
        },1000)

      }

    },
    getsettingsAll: function(value) {
      this.tabsData = {
        mongoCols: [],
        mongoDt: [],
        rethinkCols: [],
        rethinkDt: [],
        elasticDt: [],
        elasticCols: [],
        nedbDt: [],
        nedbCols: [],
        mysqlDt: [],
        mysqlCols: []
      }
      api.request('get', '/settings')
        .then(response => {
          this.allSetting = response.data
          _.forEach(this.allSetting, (dbInst, db) => {
            if (dbInst.dbinstance.length != 0) {
              this.tabsData[db + 'Cols'].push({
                type: 'expand',
                width: 50,
                render: (h, params) => {
                  return h(expandRow, {
                    props: {
                      row: {
                        db: db,
                        dbData: this.tabsData[db + 'Dt'][params.index]
                      },
                      id: this.tabsData[db + 'Dt'][params.index].id,
                      index: params.index,
                      db: 'mongo'
                    }
                  })
                }
              })
              this.tabsData[db + 'Cols'].push({
                title: 'Select',
                width: 80,
                align: 'center',
                render: (h, params) => {
                  return h('Checkbox', {
                    props: {
                      value: params.row.checked
                    },
                    on: {
                      'on-change': (value) => {
                        if (value == true) {
                          this.check = value
                          // console.log("this.selectSchema",this.selectSchema);
                          // this.frmSettings.push(this.selectSchema);
                        } else {
                          this.check = value
                        }

                        // this.enableDbInstance(this.tabPane, params.index, value)
                      }
                    }
                  })
                }
              })
              _.forEach(dbInst.dbinstance[0], (v, k) => {
                this.tabsData[db + 'Cols'].push({
                  title: k,
                  key: k
                })
              })
            }
            this.tabsData[db + 'Dt'] = _.map(this.allSetting[db].dbinstance, m => {
              return {
                checked: true,
                _expanded: false,
                dbname: m.dbname,
                host: m.host,
                id: m.id,
                isdefault: m.isdefault,
                isenable: m.isenable,
                notes: m.notes,
                port: m.port,
                rdoCrt: m.rdoCrt,
                upldIcn: m.upldIcn
              }
            })
          })
        })
        .catch(error => {
          console.log(error);
        })

    },
    importdata: function() {
      //console.log('GiveMeData', this)
      this.frmSettings.schemaData = []

      if (this.expandValue == false) {
        console.log('false')
        _.forEach(this.allSetting, (dbInst, db) => {
          for (var index in this.tabsData[db + 'Dt']) {
            schema.getByNameId(db, this.tabsData[db + 'Dt'][index].id).then(response => {
              console.log('schemaData', response.data)
              this.schemaAllData = _.map(response.data, (m) => {
                return {
                  _id: m._id,
                  title: m.title
                }
              })
              this.frmSettings.schemaData.push(this.schemaAllData)
            })

          }
        })
      } else {
        console.log('true')
        this.broadcast('table-expand', 'giveMeData', this)
      }
    },
    acceptData: function(data) {
      console.log('accept data call')
      console.log('data', data.data)
      var sdata = data.data
      this.frmSettings.schemaData.push(sdata)
    },
    getTableAll: function() {

    },
    createJob: function(data){
      console.log(data.selectedDb,data.connection_name,data.host,data.port,data.username)
      var obj = {
        source: "rethinkdb",
        destination: data.selectedDb,
        connection_name: data.connection_name,
        host: data.host,
        port: data.port,
        username: data.username,
        status: 'upload_pending',
        modified: Date(),
        log: {
          startedAt: Date(),
          UploadStatus: 'upload_pending'
        }
      }
      api.request('post', '/import-tracker', obj).then(function(res){
        console.log("response",res.data)
        id = res.data.id
      })
    },
    goToStep: function(step, name, data) {
      var self = this
      logs = []
      this.$refs[name].validate((valid) => {
        if (valid) {
            this.check_conn = true
            this.conn_icon = 'load-a'
            api.request('get', '/Settings?dbname=' + data.selectedDb).then(function(_res) {
              var flag = false
              var c_name = ''
              _.map(_res.data, function(instance) {
                if(instance.host == data.host && instance.port == data.port && instance.dbname == data.dbname){
                    flag = true
                    c_name = instance.connection_name
                }
              })
              // console.log('flag = ', flag, c_name)
              if (!flag){
                // api.request('post', '/settings?check=' + data.selectedDb, data)
                //   .then(response => {
                    // console.log('CheckConnection', response.data)
                    // if(response.data.result){
                        self.conn_icon = 'checkmark'
                        self.currentStep = step;
                        console.log(data.selectedDb,data.connection_name,data.host,data.port,data.username)
                        logs.push({date: Date(),status: 'upload_pending'})
                        var obj = {
                          source: "rethinkdb",
                          destination: data.selectedDb,
                          connection_name: data.connection_name,
                          database_name : data.dbname,
                          host: data.host,
                          port: data.port,
                          username: data.username,
                          status: 'upload_pending',
                          created: Date(),
                          log: logs
                        }
                        api.request('post', '/import-tracker', obj).then(function(res){
                          console.log("response",res.data)
                          id = res.data.id
                        })
                        .catch(error => {
                          console.log(error);
                          self.$Notice.error({title: 'Error!',desc: 'Error in importing...!'})
                        })
                    // } else {
                    //     self.conn_icon = 'close'
                    //     self.$Notice.error({title: 'Connection Not Establish...!', desc: 'Please Check Your Database..'})
                    // }
                  // })
                  // .catch(error => {
                  //   console.log(error)
                  //   self.$Notice.error({title: 'Error!', desc: 'Connection Error...'})
                  // })
              } else {
                self.conn_icon = 'close'
                self.$Notice.error({title: 'Connection already Exist!', desc: 'with connection name :: ' + c_name})
              }

            })
        }
      })
    },
    clearIcon(value) {
        this.frmSettings.upldIcn = ''
        // alert(value)
        if (value === 'mongo') {
          this.frmSettings.port = '27017'
        } else if (value === 'rethink') {
          this.frmSettings.port = '28015'
        } else if (value === 'elastic') {
          this.frmSettings.port = '9200'
        } else if (value === 'nedb') {
          this.frmSettings.port = '8080'
        } else if (value === 'mysql') {
          this.frmSettings.port = '3306'
        }
    },
    handleModalOk() {
      console.log('OK');

    },
    enable(value) {
      this.tabsData = {
        mongoCols: [],
        mongoDt: [],
        rethinkCols: [],
        rethinkDt: [],
        elasticDt: [],
        elasticCols: [],
        neDt: [],
        neCols: []
      }
      _.forEach(this.allSchema, (obj) => {
        _.forEach(this.frmSettings.Database, (db) => {
          // obj.database[0] == db
          // alert(db)
          if (obj.database[0] == db) {
            this.tabsData[db + 'Dt'].push(obj)
            _.forEach(obj, (v, k) => {
              this.tabsData[db + 'Cols'].push({
                title: k,
                key: k
              })
            })
            // this.keys = Object.keys(this.obj)
          }
        })
      })
      console.log('this.tabsData', this.tabsData)
    },

    dbcall() {
      if (document.getElementById('mongo').checked) {
        return result.mongo
      }
    },
    getPostObj(mObj) {
      // console.log('Calling.........................', mObj)
      var obj = {}
      _.forEach(mObj, (v, k) => {
        if (k === 'isenable' || k === 'connection_name' || k === 'host' || k === 'port' || k === 'dbname' || k === 'username' || k === 'password' || k === 'upldIcn' || k === 'notes' || k === 'isdefault' || k === 'selectedDb') {
          obj[k] = v
        }
      })
      return obj
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let guid = (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
          let obj = this.getPostObj(this.frmSettings);
          obj.id = guid;
          api.request('post', '/settings', obj)
            .then(response => {
              // this.$Message.success('Success');
              if (response.data == 'Exist') {
                this.$Notice.error({
                  duration: 5,
                  title: 'Alredy Exist!!',
                  desc: 'Connection Alredy exist...'
                })

              } else {
                this.$Notice.success({
                  duration: 3,
                  title: 'Success!!',
                  desc: 'Connection Created...'
                })
                this.$router.push('/db');

              }
            })
            .catch(error => {
              // this.$Message.error('Error!!');
              this.$Notice.error({
                duration: 3,
                title: 'Error!!'
              })
              console.log(error)
              this.loading = false
            })
        } else {
          // this.$Message.error('Error!');
          this.$Notice.error({
            duration: 2,
            title: 'Error!!',
            desc: 'Please enter inputs!'
          })

        }
      })
    },
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    activatedProperty(index, property) {
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
        // console.log(typePropertys[this.csvData[index].type].valueOf(property))
        return typePropertys[this.csvData[index].type].indexOf(property) >= 0
      }
    },
    handleSchemaChange(value) {
      console.log('test', value)
      this.tabsData.mongoDt[value.index].checked = value.value
      console.log('this.tabsData.mongoDt', this.tabsData.mongoDt)
    },
    getData(value){
      console.log("dataa cameeeeeeeeeeeeeeee...",value)
    },
    expands(data) {
      this.expandValue = data
    }
  },
  mounted() {
    this.checkdefaultfun()
    // console.log(this.$route.params.id)
    if(errors == 0){
          self.loadingData = false
          self.saveButton = false
          self.currentStep = step
    }
    if(this.$route.params.id == undefined){
    this.frmSettings.selectedDb = this.$route.params.db;
    this.$on('schemaData', this.acceptData)
    this.$on('expandTrue', this.expands)

    var self = this;

    $(document).ready(function() {
      $('#upldIcn').change(function() {
        let bucket = new AWS.S3({
          params: {
            Bucket: 'airflowbucket1/obexpense/expenses'
          }
        });
        let fileChooser = document.getElementById('upldIcn');
        let file = fileChooser.files[0];

        if (file) {
          self.loading = true;
          var params = {
            Key: file.name,
            ContentType: file.type,
            Body: file
          };
          bucket.upload(params).on('httpUploadProgress', function(evt) {
            console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total) + '%');
          }).send(function(err, data) {
            if (err) {
              alert(err);
            }
            self.frmSettings.upldIcn = data.Location;
            self.loading = false;
          })
        }
      });
    });
  }
  else {

    socket.emit('import-tracker::find',{id:this.$route.params.id} ,(error, data) => {
    console.log('dataaaaa......', data);
    if (data.length != 0){
    var step = 2
    this.currentStep = step
    if(data[0].status == "import_staging_completed"){
      console.log("**********************")
      this.completed = true
      this.importButton = false
      this.disableImport = true
    }
    else if(data[0].status == "import_staging_running"){
      console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
      // this.importData()
      // this.importButton = false
      // this.completed = false
      // this.disableImport = true
    }
  }
  })
  }
},
  created() {
    this.$on('on-schema-change', this.handleSchemaChange);
    // this.$on('data',this.getData)

  }
}
</script>

<style>

.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
}
.demo-spin-col{
    height: 100px;
    position: relative;
    border: 1px solid #eee;
}
.ivu-card-body {
  padding: 0px;
}

.process {
  color: rgb(45, 183, 245)
}

.created {
  color: #5cb85c
}

.rejected {
  color: #ff5500
}

.no-margin {
  margin: 0px;
}

.form {
  margin-top: 50px;
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.demo-spin-col {
  height: 10px;
  position: relative;
}

.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
  margin-right: 4px;
}

.demo-upload-list img {
  width: 100%;
  height: 100%;
}

.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, .6);
}

.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}

.demo-upload-list-cover i {
  color: #fff;
  font-size: 10px;
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

.handsontable td.error {
  /*color: #33691E;
      background: #DCEDC8;*/
  border: 2px solid red;
  outline: none;
}

.htCore {
  min-width: 100%!important;
}

#example1 {
  width: 100%!important;
}

.ivu-card-head {
  border-bottom: 1px solid #e9eaec;
  /*padding: 13px 16px;*/
  line-height: 1;
}
.ios-arrow-down{
color: #1f2d3d;
background-color: white;
border-color: white;
}
.msg{
  font-size:18px;
  margin-left:3%;
}
</style>
