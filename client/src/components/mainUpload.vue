<template>
  <div>
    <Steps :current="currentStep">
       <Step content="Upload"></Step>
       <Step content="Validate"></Step>
       <Step content="Import"></Step>
   </Steps>
   <template v-if="currentStep == 0">
     <Row>
          <Col span="6">
                <vue-tabs active-tab-color="#494e6b"
                          active-text-color="#fff"
                          type="pills"
                          direction="vertical"
                          v-model="activeTab"
                          :tab-change="hideHandson()">

                     <div v-for="files in fileTypes">
                           <v-tab :title=files >
                           </v-tab>
                    </div>
                </vue-tabs>
                <div style="margin-top: 20px;position: absolute;top: 300px;">
                      <Button type="success" size="large" style="font-size:15px" :disabled="validate" @click="startValidation()">Start validation<i class="ivu-icon ivu-icon-android-arrow-dropright-circle" style="margin-left:7%"></i></Button>
                </div>
          </Col>
          <Col span="18">
            <div id="uploadCsv" style="margin-top:5%;" v-model="mObj[activeTab]">
                <div>
                    <Form>
                      <FormItem label="Select schema">
                        <Select v-model="mObj[activeTab].selected_schema" style="width:200px" @on-change="changeSchema(activeTab,mObj[activeTab].selected_schema)">
                            <Option v-for="schema in schemaList" :value="schema.value" :key="schema.value">{{ schema.label }}</Option>
                        </Select>

                        <Poptip placement="top" width="250" v-model = "mObj[activeTab].poptip_display">
                          <a @click="mObj[activeTab].poptip_display = true" v-if="mObj[activeTab].display">Untitled schema</a>
                           <div class="api" slot="content">
                             <Form inline>
                               <FormItem>
                                   <Input type="text" v-model="mObj[activeTab].new_schema" style="margin-left:-18px">
                                   </Input>
                               </FormItem>
                                  <Button type="ghost" icon="ios-checkmark" style="font-size: 25px;margin-left:-25px;" @click="validateSchema(activeTab,mObj[activeTab].new_schema)"></Button>
                                  <Button type="ghost" icon="ios-close" style="font-size: 25px;" @click="mObj[activeTab].poptip_display = false"></Button>
                           </Form>
                           </div>
                       </Poptip>
                     </FormItem>
                   </Form>
                </div>

                <div id="upload-csv-zone" v-if="mObj[activeTab].uploadDisplay">
                  <div class="file-zone" @click="upldCSV(activeTab)">
                      <span class="dz-message">Drop <span style="color: #494e6b">"{{activeTab}}"</span> files here<br/>
                          <small>(only csv files are valid.)</small>
                      </span>
                      <input type="file" id="csv-file" name="files" accept=".csv"/>
                  </div>
              </div>

              <div v-if="loading" class="demo-spin-col" style="margin-top:14px">  <Spin fix>
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin></div>

              <div  v-if="mObj[activeTab].previewDisplay">
              <h3 style="margin-bottom:1%;text-transform: capitalize;">Preview of {{activeTab}}</h3>
               <div class="schema-form ivu-table-wrapper">
                 <div class="ivu-table ivu-table-border" style="display:block;white-space: nowrap;">
                   <div class="ivu-table-body">
                     <table style="min-width:1077px;overflow-x: auto;">
                       <thead>
                         <tr>
                           <th v-for="(header,hindex) in Object.keys(mObj[activeTab].schema.structure) " v-if="!map">
                             <div>
                               <span>{{header}}</span>
                             </div>
                           </th>
                         </tr>
                         <tr>
                           <th v-for="(header,hindex) in Object.keys(mObj[activeTab].newUploadCSV[0]) " v-if="map">
                             <div>
                               <span>{{header}}</span>
                             </div>
                           </th>
                         </tr>
                       </thead>
                       <tbody class="ivu-table-tbody" v-for="(item, index) in mObj[activeTab].newUploadCSV">
                         <tr class="ivu-table-row" v-if="(index<5)">
                           <td class="" v-if="index <= mObj[activeTab].newUploadCSV.length-2" v-for="data in item" style="overflow:hidden;">{{data}}</td>
                         </tr>
                       </tbody>
                     </table>
                   </div>
                 </div>
             </div>
             <Button type="error" style="margin-top:14px;float:right;margin-left:1%;width:7%" @click="Abort(activeTab)" v-if="mObj[activeTab].headerDisplay || mObj[activeTab].newSchemaDisplay">Abort</Button>
             <Button type="success" style="margin-top:0px;color: #fff;background-color: #1fb58f;border-color: #1fb58f;margin-top:14px;float:right;width:7%" @click="ProceedToValidate(activeTab)" v-if="mObj[activeTab].headerDisplay || mObj[activeTab].newSchemaDisplay">Proceed</Button>
           </div>

            <div v-if="mObj[activeTab].headerDisplay">
            <h3 style="margin-bottom:1%;text-transform: capitalize;margin-top:5%">Headers Mapping of {{activeTab}}</h3>
             <div class="schema-form ivu-table-wrapper" >
               <div class="ivu-table ivu-table-border" >
                 <div class="ivu-table-body">
                   <table class="mapping-table" style="width:100%;overflow-y:auto;">
                     <colgroup>
                       <col width="35">
                       <col width="35">
                       <col width="30">
                     </colgroup>
                     <thead>
                       <tr>
                         <th class="">System headers</th>
                         <th class="">CSV headers</th>
                         <th class="">Transform</th>
                       </tr>
                     </thead>
                     <tbody class="ivu-table-tbody">
                       <tr class="ivu-table-row" v-for="(item,index) in mObj[activeTab].mapping">
                         <td>
                           <div class="ivu-table-cell">
                             <span>{{item.sysHeader}}</span>
                           </div>
                         </td>
                         <td>
                           <div class="ivu-table-cell">
                             <Select v-model="item.csvHeader" @on-change="mapHeader(item.sysHeader,item.csvHeader)">
                                 <Option v-for="header in mObj[activeTab].headers" :value="header" :key="header">{{ header}}</Option>
                             </Select>
                           </div>
                         </td>
                         <td class="transform-block">
                           <div class="ivu-table-cell">
                               <a  @click="modelshow(item,index)"><Icon type="compose"></Icon></a>
                           </div>
                           <div v-if="item.transformMethod" class="transform-function" title="">
                               <span>{{item.transform}}</span>
                               <span  @click="removeTransform(item,index)"><Icon type="close-circled" /></span>
                           </div>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                   <!-- {{mObj[activeTab].mapping}} -->
                 </div>
               </div>
           </div>
         </div>

         <div v-if="mObj[activeTab].newSchemaDisplay">
         <h3 style="margin-bottom:1%;text-transform: capitalize;margin-top:5%">Headers Mapping of {{activeTab}}</h3>
         <div class="schema-form ivu-table-wrapper">
           <div class="ivu-table ivu-table-border" >
             <div class="ivu-table-body">
               <table class="mapping-table" style="width:100%;overflow-y:auto;">
                 <colgroup>
                   <col width="20">
                   <col width="20">
                   <col width="20">
                   <col width="20">
                   <col width="20">
                 </colgroup>
                 <thead>
                   <tr>
                     <th class="">System headers</th>
                     <th class="">CSV headers</th>
                     <th class="">Type</th>
                     <th class="">Property</th>
                     <th class="">Transform</th>
                   </tr>
                 </thead>
                 <tbody class="ivu-table-tbody">
                   <tr class="ivu-table-row" v-for="(item,index) in mObj[activeTab].mapping">
                     <th>
                       <div class="ivu-table-cell">
                         <span>{{item.sysHeader}}</span>
                       </div>
                     </th>
                     <td>
                       <div class="ivu-table-cell">
                         <Select v-model="item.csvHeader" @on-change="mapHeader(item.sysHeader,item.csvHeader)">
                             <Option v-for="header in mObj[activeTab].headers" :value="header" :key="header">{{ header}}</Option>
                         </Select>
                       </div>
                     </td>

                     <td class="">
                       <div class="ivu-table-cell">
                         <Select v-model="item.schemaObj.type">
                             <Option v-for="type in types" :value="type" :key="type" @on-change="mapType(item.sysHeader,type)">{{ type}}</Option>
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
                             <Form-item label="MaxLength" :label-width="80" class="no-margin">
                               <Input  size="small" v-model="item.schemaObj.maxLength" ></Input>
                             </Form-item>
                             <Form-item  label="Allowed Value" :label-width="80" class="no-margin">
                                <input-tag style="margin-left:80px;width:200px" :tags="item.schemaObj.allowedValues"></input-tag>
                             </Form-item>
                             <Form-item  label="Default Value" :label-width="80" class="no-margin">
                               <Input size="small" v-model="item.schemaObj.defaultValue"></Input>
                             </Form-item>
                             <Form-item  label="regEx" :label-width="80" class="no-margin">
                               <Input size="small" v-model="item.schemaObj.regEx"></Input>
                             </Form-item>
                             <Form-item  label="label" :label-width="80" class="no-margin">
                               <Input size="small" v-model="item.schemaObj.label"></Input>
                             </Form-item>
                             <Form-item  label="" :label-width="80" class="no-margin">
                               <Checkbox style="margin-left:80px;" v-model="item.schemaObj.optional">Optional</Checkbox>
                             </Form-item>
                           </div>
                         </Poptip>
                       </div>
                     </td>

                     <td class="transform-block">
                       <div class="ivu-table-cell">
                           <a  @click="modelshow(item,index)"><Icon type="compose"></Icon></a>
                       </div>
                       <div v-if="item.transformMethod" class="transform-function" title="">
                           <span>{{item.transform}}</span>
                           <span  @click="removeTransform(item,index)"><Icon type="close-circled" /></span>
                       </div>
                     </td>
                   </tr>
                 </tbody>
               </table>
               <!-- {{mObj[activeTab].mapping}} -->
             </div>
           </div>
       </div>
     </div>

         <div id="example1" class="hot handsontable htColumnHeaders"></div>
         <table>
           <tr>
           <td class="ivu-table-row" v-for="(item, index) in mObj[activeTab].errmsg[0]"style="color:red;font-size:14px;">{{item}}</td>
         </tr>
         </table>
         <div id="hot-preview" v-if="mObj[activeTab].showHandson">
           <Button type="primary" @click="modifyData(activeTab)" style="float: right;margin-right: 20px;">Modify Data</Button>
         </div>

         <Modal  v-model="model" title="Transform" @on-ok="handleModalOk" width="900px" :mask-closable="false ">
           <Row style="padding: 10px;">
             <Col span="18">
                 <codemirror v-model="transformData" :options="editorOptions"></codemirror>
             </Col>
             <Col span="6">
               <div class="transform-method">
                 <ul>
                   <li>
                     <a href="javascript:void(0)" data-method="toUpperCase()" @click="transform">UpperCase</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="toLowerCase()" @click="transform">LowerCase</a>
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
                     <a href="javascript:void(0)" data-method="capitalize()" @click="transform" >Capitalize</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="stripHTMLTags()" @click="transform">Stripe HTML Tags</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="stripSpecialCharacter()" @click="transform">Stripe Special Character</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="formatDate('dd-mm-yyyy')" @click="transform">Date Format</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="toDecimal(2)" @click="transform">Decimal</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="toInteger()" @click="transform">Integer</a>
                   </li>
                 </ul>
               </div>
             </Col>
           </Row>
         </Modal>

        </div>
      </Col>
    </Row>
    </template>
    <template v-if="currentStep == 1">
      <Card :bordered=false style="margin-top:30px">
      <div v-if="validating" class="demo-spin-col">  <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin></div>
      <div v-if="!validating"><p style="font-size:18px">The file has been successfully validated without any error. Now you can proceed to import it into PDM.</p></div>
      <Button type="primary" @click="importToPDM()" v-if="!validating" style="font-size:15px;margin-top:25px;float:right">Import</Button>
      </Card>
    </template>
    <template v-if="currentStep == 2">
      <Card :bordered=false style="margin-top:30px">
        <div v-if="!import1" class="demo-spin-col"> <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin></div>
      <div v-if="import1"><h3>Import Completed</h3></div>
      <div v-if="import1"><p style="font-size:18px;margin-top:20px">Product data has been successfully imported into PDM. Please confirm to go for Live</p></div>
      <Button type="primary" @click="importToConfirm()"  v-if="import1" style="font-size:15px;margin-top:25px;float:right">Import to Confirm</Button>
      </Card>
    </template>
   </div>
</template>

<script>
/*eslint-disable*/
let axios = require("axios")
import api from '../api'
import schema from '../api/schema'
import config from '@/config'
import config1 from '../../config'
import io from 'socket.io-client'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import {VueTabs, VTab} from 'vue-nav-tabs'
import InputTag from 'vue-input-tag'
import Papa from 'papaparse'
import 'vue-nav-tabs/themes/vue-tabs.css'
import _ from 'underscore'
import lodash from 'lodash'
import ProductInformationSchema from '@/schema/product_information'
import ProductPricingSchema from '@/schema/product_price'
import ProductImagesSchema from '@/schema/product_images'
import ProductImprintDataSchema from '@/schema/product_imprint_data'
import ProductShippingSchema from '@/schema/product_shipping'
import ProductVariationSchema from '@/schema/product_variation_pricing'
import ProductAdditionalChargesSchema from '@/schema/product_additional_charge'
var Schema = require('simpleschema')
const uuidV1 = require('uuid/v1');
console.log("product_info",ProductInformationSchema)
let finalModifiedDataArray = []
let res
let id
let file
let obj1
let schema_id = ''
let CSVFile_id = ''
let new_flag = 0
let err_length = 0

let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI)
} else {
  socket = io(config.socketURI)
}

const app = feathers().configure(socketio(socket))

socket.on('response', (response) => {
  console.log("socket response called......",response)
  if (response.stdout.ok == 1) {
    console.log("id....",id)
    api.request('patch', '/uploader/' + id,obj1).then(res => {
      console.log('response', res)
    })
    .catch(error => {
      console.log(error)
    })
  }
})

export default {
    name: 'mainUpload',
    components: { VueTabs,VTab,'input-tag': InputTag,},
    data () {
        return {
          currentStep:0,
          map : false,
          fileTypes: ["Product Variation Price","Product Information","Product Price","Product Imprint Data","Product Image","Product Shipping","Product Additional Charges"],
          activeTab: 'Product Information',
          validate:true,
          types: ["string","number","boolean","date","url","phone","pin-code"],
          existingSchemaData :[],
          validating : true,
          validation_completed: false,
          import1 :false,
          loading: false,
          transformData: '',
          transformMethod: '',
          modelIndex: '',
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
            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
            autofocus: true
          },
          model: false,
          schemaList: [
                    {
                        value: '--Add new--',
                        label: '--Add new--'
                    }
                ],
          mObj:{
          'Product Information':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled schema',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductInformationSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: []
          },
          'Product Price':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled schema',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductPricingSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr : []

          },
          'Product Imprint Data':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled schema',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductImprintDataSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: []
          },
          'Product Image':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled schema',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductImagesSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: []
          },
          'Product Shipping':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled schema',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductShippingSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: []
          },
          'Product Additional Charges':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled schema',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductAdditionalChargesSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: []
          },
          'Product Variation Price':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled schema',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductVariationSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: []
          }
        }
    }
  },
    methods:{
      hideHandson(){
        let self = this
          // console.log("88888888888888",self.activeTab,self.mObj[self.activeTab].errDisplay,err_length)
          if(err_length != 0){
            if(self.mObj[self.activeTab].errDisplay == false ){
              document.getElementById('example1').style.display = 'none'
            }
            else if(self.mObj[self.activeTab].errDisplay == true ){
              document.getElementById('example1').style.display = 'block'
            }

          }
      },
      setTransForm: function () {
        // console.log("settransform called...")
        this.transformData = this.modelData
        // console.log("this.transformData",this.transformData)
        if (this.mObj[this.activeTab].mapping[this.modelIndex].tranformMethod) {
          // console.log("if called")
          this.dataMethod = this.mObj[this.activeTab].mapping[this.modelIndex].tranformMethod
          this.transformData = this.modelData + '.' + this.dataMethod
          // console.log("this.transformData",transformData)
        }
      },
      modelshow: function (item, index) {
        // console.log("item...",item,"index....",index)
        this.model = true
        this.modelData = 'return row["' + item.sysHeader + '"]'
        this.modelIndex = index
        this.dataMethod = ''
        this.setTransForm()
      },
      handleModalOk () {
          let methodName = this.transformData.split('.')
          this.dataMethod = methodName[1]
          // console.log("this.datMethod....",methodName[1],this.transformData)
          if (this.dataMethod) {
            console.log(this.mObj[this.activeTab].mapping[this.modelIndex])
            this.mObj[this.activeTab].mapping[this.modelIndex].transform = this.transformData
            this.mObj[this.activeTab].mapping[this.modelIndex].transformMethod = this.dataMethod
          } else {
            this.mObj[this.activeTab].mapping[this.modelIndex].transform = this.transformData
            this.mObj[this.activeTab].mapping[this.modelIndex].transformMethod = ''
          }
          var self = this

          self.mObj[self.activeTab].newUploadCSV = _.map(self.mObj[self.activeTab].csv_arr, function (row, rinx) {
            // console.log("called..")
            return _.reduce(row, function (result, value, key) {
              let inx = _.find( self.mObj[self.activeTab].mapping, (f) => { return (f.sysHeader === key) })
              if (inx.transform !== '') {
                  // console.log("called..1")
                var s = new Function('row', inx.transform).call(self, row) // eslint-disable-line
                result[key] = s
              } else {
                result[key] = value
              }
              return result
            }, {})
          })
      },
      removeTransform: function (item, index) {
        this.modelData = 'return row["' + item.sysHeader + '"]'
        this.mObj[this.activeTab].mapping[index].transformMethod = ''
        this.setTransForm()
        this.handleModalOk()
      },
      transform: function (event) {
        // console.log("transform called....")
        var targetEl = event.currentTarget
        if (targetEl.getAttribute('data-method')) {
          this.dataMethod = targetEl.getAttribute('data-method')
          if (this.dataMethod) {
            this.transformData = this.modelData + '.' + this.dataMethod
          }
        }
        return this.transformData
      },
      getSelectedHeaders(header,data){
        return data.filter((el) => {
          if(header == el)
          return el
        })
      },
      mapHeader(sysHeader,csvHeader){
        let self = this
        let tab = self.activeTab
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",sysHeader,csvHeader)
        for(let i=0;i<self.mObj[tab].uploadCSV.length;i++){
           for(let key in self.mObj[tab].uploadCSV[i]){
             if(key == csvHeader){
                self.mObj[tab].newUploadCSV[i][sysHeader] = self.mObj[tab].uploadCSV[i][key]
              }
           }
         }

        // console.log("updated csv after changing mapping..............",self.mObj[tab].mapping)
      },
      startValidation(){
        let self = this
        self.currentStep = 1
        let obj2
        api.request('get', '/uploader/'+ id).then(response => {
          console.log('response', response)
          obj2 = response.data
          if(response.data.hasOwnProperty("ProductInformation")){
            let Prod_info = response.data["ProductInformation"]
            delete obj2["ProductInformation"]
            Prod_info.validateStatus = "completed"
            obj2["ProductInformation"] = Prod_info
            // console.log("Prod_info.....",Prod_info)
          }
          if(response.data.hasOwnProperty("ProductPrice")){
            let Prod_pricing = response.data["ProductPrice"]
            delete obj2["ProductPrice"]
            Prod_pricing.validateStatus = "completed"
            obj2["ProductPrice"] = Prod_pricing
            // console.log("Prod_pricing.....",Prod_pricing)
          }
          if(response.data.hasOwnProperty("ProductImprintData")){
            let Prod_data = response.data["ProductImprintData"]
            delete obj2["ProductImprintData"]
            Prod_data.validateStatus = "completed"
            obj2["ProductImprintData"] = Prod_data
            // console.log("Prod_data.....",Prod_data)
          }
          if(response.data.hasOwnProperty("ProductImage")){
            let Prod_images = response.data["ProductImage"]
            delete obj2["ProductImage"]
            Prod_images.validateStatus = "completed"
            obj2["ProductImage"] = Prod_images
            // console.log("Prod_images.....",Prod_images)
          }
          if(response.data.hasOwnProperty("ProductShipping")){
            let Prod_shipping = response.data["ProductShipping"]
            delete obj2["ProductShipping"]
            Prod_shipping.validateStatus = "completed"
            obj2["ProductShipping"] = Prod_shipping
            // console.log("Prod_shipping.....",Prod_shipping)
          }
          if(response.data.hasOwnProperty("ProductAdditionalCharges")){
            let Prod_charges = response.data["ProductAdditionalCharges"]
            delete obj2["ProductAdditionalCharges"]
            Prod_charges.validateStatus = "completed"
            obj2["ProductAdditionalCharges"] = Prod_charges
            // console.log("Prod_charges.....",Prod_charges)
          }
          if(response.data.hasOwnProperty("ProductVariationPrice")){
            let Prod_var_price = response.data["ProductVariationPrice"]
              delete obj2["ProductVariationPrice"]
            Prod_var_prices.validateStatus = "completed"
            obj2["ProductVariationPrice"] = Prod_var_price
            // console.log("Prod_var_price.....",Prod_var_price)
          }

          obj2.stepStatus = "validation_completed"
          console.log("obj2.....",obj2)
          api.request('put', '/uploader/'+ id,obj2).then(res => {
            console.log('response', res)
            self.validating = false
          })

        })
      },
      importToPDM(){
        this.currentStep = 2
        let jobQueue_obj = {
                "queue" : {
                  "name": "uploaderJobQue"
                },
                "jobs" : [
              		{
              			"importTrackerId":id,
              			"userdetails":{
              				    "id": this.$store.state.user._id,
              		        "username": this.$store.state.user.username,
              		        "fullname": this.$store.state.user.fullname,
              		        "email": this.$store.state.user.email,
              		        "password": this.$store.state.user.password
              			}
              		}
              	]
              }

              api.request('post', '/import-to-jobqueue/',jobQueue_obj).then(res => {
                console.log('jobqueue response', res)
                let importObj = {
                  stepStatus : "import_in_progress"
                }
                api.request('patch', '/uploader/'+ id,importObj).then(res => {
                  console.log('response', res)
                })
                .catch(error => {
                  console.log(error)
                })
              })
              .catch(error => {
                console.log(error)
              })

        //
      },
      importToConfirm(){
        let jobQueue_obj = {
                "queue" : {
                  "name": "uploaderJobQueConfirm"
                },
                "jobs" : [
              		{
              			"importTrackerId":id,
              			"userdetails":{
              				    "id": this.$store.state.user._id,
              		        "username": this.$store.state.user.username,
              		        "fullname": this.$store.state.user.fullname,
              		        "email": this.$store.state.user.email,
              		        "password": this.$store.state.user.password
              			}
              		}
              	]
              }

              api.request('post', '/import-to-confirm/',jobQueue_obj).then(res => {
                console.log('jobqueue response', res)
              })
              .catch(error => {
                console.log(error)
              })
      },
      mapType(sysHeader,type){
        console.log("***************map type called******",sysHeader,type)
      },
      changeSchema(tab,value){
        console.log("------value-----",tab,value)
        if(value == "--Add new--"){
          console.log("called.....")
          this.mObj[tab].display = true
          this.mObj[tab].new_flag = 1
          if(this.mObj[tab].uploadDisplay){
            this.mObj[tab].headerDisplay = false
            this.mObj[tab].newSchemaDisplay = false
          }
          else{
            this.mObj[tab].headerDisplay = false
            this.mObj[tab].newSchemaDisplay = true
          }

          // this.mObj[tab].previewDisplay = true

          // this.mObj[tab].schemaList.push({"value" : this.mObj[tab].new_schema,"label": this.mObj[tab].new_schema})
          // this.mObj[tab].selected_schema = this.mObj[tab].new_schema
          if(tab == 'Product Information'){
            this.mObj[tab].schema = ProductInformationSchema
            // console.log("***********",this.mObj[tab].schema)
            // this.mObj[tab].uploadDisplay = false
            // this.mObj[tab].newSchemaDisplay = true
            // this.mObj[tab].previewDisplay = true
          }
          else if(tab == 'Product Price'){
            this.mObj[tab].schema = ProductPricingSchema
          }
          else if(tab == 'Product Imprint Data'){
            this.mObj[tab].schema = ProductImprintDataSchema
          }
          else if(tab == 'Product Image'){
            this.mObj[tab].schema = ProductImagesSchema
          }
          else if(tab == 'Product Shipping'){
            this.mObj[tab].schema = ProductShippingSchema
          }
          else if(tab == 'Product Additional Charges'){
            this.mObj[tab].schema = ProductAdditionalChargesSchema

          }
          else if(tab == 'Product Variation Price'){
            this.mObj[tab].schema = ProductVariationSchema

          }

          let mapObj = this.generateHeadersandMapping(tab)
          // console.log("++++++++++++++++++ mapObj ++++++++++++++++++",mapObj)

        }
        else{
          let currentSelectedSchema = this.mObj[tab].selected_schema
          this.existingSchemaData = []
          api.request('get', '/uploader-schema/').then(res => {
            // console.log("res....",res)
            this.existingSchemaData = res.data.data
            // console.log("this.existing/////",this.existingSchemaData)
            let currentschema = _.filter(this.existingSchemaData, function(o) { return o.name == currentSelectedSchema; });
            // console.log("==============currentschema=================",currentschema)
            if(currentschema.length != 0){
              schema_id = currentschema[0].id
              this.mObj[tab].schema = new Schema(currentschema[0].schema)
              // console.log("***********",this.mObj[tab].schema)
              this.mObj[tab].display = false

              if(this.mObj[tab].uploadDisplay){
                this.mObj[tab].newSchemaDisplay = false
                this.mObj[tab].headerDisplay = false
              }
              else if(this.mObj[tab].previewDisplay && !this.mObj[tab].headerDisplay && !this.mObj[tab].newSchemaDisplay){
                this.mObj[tab].newSchemaDisplay = false
                this.mObj[tab].headerDisplay = false
              }
              else{
                this.mObj[tab].newSchemaDisplay = false
                this.mObj[tab].headerDisplay = true
              }

              // this.mObj[tab].previewDisplay = true
              this.getMapping(tab)
            }
          })
          .catch(error => {
            console.log(error)
          })
        }
      },
      getMapping(tab){
         if(this.mObj[tab].selected_schema != '--Add new--'){
          //  console.log("this.mObj[tab].selected_schema",this.mObj[tab].selected_schema)
           this.map = true
           this.mObj[tab].mapping = []
           socket.emit('uploader-csv-file-mapping::find', {fileTypeId : this.mObj[tab].selected_schema}, (e, data) => {
            //  console.log("data......",data)
             this.mObj[tab].mapping = data.data[0].mapping
             let schema_keys = _.keys(this.mObj[tab].schema.structure);
            //  console.log("schema_keys.....",schema_keys)
             if(this.mObj[tab].uploadCSV.length != 0){
               this.mObj[tab].newUploadCSV = []
               for(let i=0;i<this.mObj[tab].uploadCSV.length;i++){
                 let obj = {}
                  for(let key in this.mObj[tab].uploadCSV[i]){
                    for(let j=0;j<this.mObj[tab].mapping.length;j++){
                      if(this.mObj[tab].mapping[j].csvHeader == key){
                          obj[this.mObj[tab].mapping[j].sysHeader] = this.mObj[tab].uploadCSV[i][key]
                      }
                      else if(!obj.hasOwnProperty(this.mObj[tab].mapping[j].sysHeader)){
                           obj[this.mObj[tab].mapping[j].sysHeader] = ''
                      }
                    }
                  }
                  obj["_id"] = uuidV1()
                  this.mObj[tab].newUploadCSV.push(obj)
               }


             let index = this.mObj[tab].newUploadCSV.length - 1
              this.mObj[tab].newUploadCSV.splice(index, 1)
              this.mObj[tab].csv_arr = this.mObj[tab].newUploadCSV
                console.log("newUploadcsv +++++++++++++++", this.mObj[tab].newUploadCSV)
                for(let k=0;k<this.mObj[tab].mapping.length;k++){
                 if(this.mObj[tab].mapping[k].transform != ""){
                   this.transformData = this.mObj[tab].mapping[k].transform
                   this.modelIndex = k
                   this.handleModalOk()
                 }
               }
              }

           })
         }
      },
      validateSchema(tab,schema){
        if(schema == '' || schema == null){
          this.$Notice.error({
                 title: 'Empty values not allowed'
             });
        }
        else if(schema == 'Untitled schema'){
          this.$Notice.error({
                 title: 'Please write new schema name'
             });
        }
        else{
          let flag = false
          for(let i=0;i<this.schemaList.length;i++){
            if(this.schemaList[i].value == schema){
              this.$Notice.error({
                     title: 'This schema name already exists'
                 });
              flag = true
            }
          }
          if(flag == false){
             this.mObj[tab].poptip_display = false
             this.schemaList.push({"value" : schema,"label": schema})
             this.mObj[tab].selected_schema = schema
             this.mObj[tab].new_flag = 1
          }
        }
      },
      upldCSV(tab){
        let self = this

        $(document).ready(function () {
          $('#csv-file').change(function () {
            // console.log("called uploadcsv",tab)
            let fileChooser = document.getElementById('csv-file')
            // console.log("fileChooser....",fileChooser)
            file = fileChooser.files[0]
            // console.log("file....",file)
            self.loading = true
            self.mObj[tab].uploadDisplay = false
            if (_.contains(self.mObj[tab].allowedFileType, file.type)) {
              Papa.parse(file, {
                // quotes: false,
	              // quoteChar: '"',
                // delimiter: ",",
                header: true,
                dynamicTyping: true,
                encoding: "UTF-8",
                skipEmptyLines: false,
                chunk: function(results, streamer) {
                  // console.log("recordss======",results.data)
                  self.mObj[tab].uploadCSV = results.data
                  // console.log("====uploadCSV====",self.mObj[tab].uploadCSV)
                  self.mObj[tab].headers = Object.keys(self.mObj[tab].uploadCSV[0])
                  self.mObj[tab].headers.push("_id")
                  // console.log("+++++++++++++++++++++",self.mObj[tab].uploadCSV)
                  if(self.mObj[tab].new_flag == 1){
                    // console.log("if called.....",self.mObj[tab].new_flag)



                    self.mObj[tab].mapping = []
                    console.log("self.mObj[tab].schema",self.mObj[tab].schema)

                    self.generateHeadersandMapping(tab)
                    self.mObj[tab].newSchemaDisplay = true
                    self.mObj[tab].previewDisplay = true
                    self.loading = false
                  }
                  else{
                    console.log("else called.....",self.mObj[tab].new_flag)

                      // self.mObj[tab].uploadDisplay = false
                      self.mObj[tab].headerDisplay = true
                      self.mObj[tab].previewDisplay = true

                      if(self.mObj[tab].newSchemaDisplay){
                        self.mObj[tab].newSchemaDisplay = false
                      }
                        self.loading = false

                    self.mObj[tab].mapping = []

                    self.getMapping(tab)


                  }




                }
              })
            }
            // results.data.optTproceedTovalidateype = [{
            //   value: 'text',
            //   label: 'Text'
            // }, {
            //   value: 'email',
            //   label: 'Email'
            // }, {
            //   value: 'number',
            //   label: 'Number'
            // }, {
            //   value: 'boolean',
            //   label: 'Boolean'
            // }, {
            //   value: 'phone',
            //   label: 'Phone'
            // }, {
            //   value: 'date',
            //   label: 'Date'
            // }]

            // self.mObj[tab].uploadCSV = results.data

            })
            })
    },
    generateHeadersandMapping(tab){
      let self = this
      let schema_keys = _.keys(self.mObj[tab].schema.structure);
      // console.log("schema_keys.....",schema_keys)
      // self.mObj[tab].headers.push("_id")
      self.mObj[tab].newUploadCSV = []
      for(let i=0;i<self.mObj[tab].uploadCSV.length;i++){
        let obj = {}
         for(let key in self.mObj[tab].uploadCSV[i]){
          //  console.log("key....",key,"value....",self.mObj[tab].uploadCSV[i][key])
           for(let j=0;j<schema_keys.length;j++){
             if(schema_keys[j] == key.toLowerCase()){
                 obj[schema_keys[j]] = self.mObj[tab].uploadCSV[i][key]
             }
             else if(!obj.hasOwnProperty(schema_keys[j])){
                  obj[schema_keys[j]] = ''
             }
           }
         }
         obj["_id"] = uuidV1()
         self.mObj[tab].newUploadCSV.push(obj)
        //  self.mObj[tab].previewDisplay = true
        //  console.log("++++++++++newuploadCSV............ ",Object.keys(self.mObj[tab].newUploadCSV[0]))
      }
      let index = self.mObj[tab].newUploadCSV.length - 1
      self.mObj[tab].newUploadCSV.splice(index,1)

        //  console.log("newUploadcsv +++++++++++++++", self.mObj[tab].newUploadCSV)
          self.mObj[tab].csv_arr = self.mObj[tab].newUploadCSV

      // console.log("schema.....",self.mObj[tab].schema.structure)
      self.mObj[tab].mapping =[]
      for(let key in self.mObj[tab].schema.structure){
        self.mObj[tab].mapping.push({'sysHeader':key,"schemaObj": self.mObj[tab].schema.structure[key],"csvHeader":"","transform":"","transformMethod":""})
      }

      for(var i=0;i<self.mObj[tab].headers.length;i++){

         if(_.findIndex(self.mObj[tab].mapping, {'sysHeader': self.mObj[tab].headers[i].toLowerCase()}) != -1){
           let index =_.findIndex(self.mObj[tab].mapping, {'sysHeader':  self.mObj[tab].headers[i].toLowerCase()})

           self.mObj[tab].mapping[index]['csvHeader'] = self.mObj[tab].headers[i]
         }
      }
      //  _.map(self.mObj[tab].mapping,function(o) { if(o.csvHeader == undefined) return o.csvHeader = "--NA--"; })
      // console.log("mapping after....",self.mObj[tab].mapping)
      //  self.mObj[tab].previewDisplay = true
      return self.mObj[tab].mapping;
    },
    ProceedToValidate(tab){
      let self = this
      let errcols = []
      // console.log("======= proceed called =====",self.mObj[tab].newUploadCSV)
      let dateValidatorFunc = function (obj, value, fieldName) {
              if(value != "" || value != undefined){
               let date = moment(value)
               console.log("date.....",date)
               let isValid = date.isValid()
               if (isValid != true) return 'invalid date. please provide date in y-m-d format'
               date._d = moment(new Date(date._d)).format('YYYY/MM/DD')
               return
             }
      }
      let urlValidatorFunc = function (obj, value, fieldName) {

                if (value != "" || value != undefined) {
                  let re = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
                  console.log("value......",value)
                  if(re.test(value) !== true)
                  return 'invalid url'
                  else
                  return
                }
              }

      let emailValidatorFunc = function (obj, value, fieldName) {
        if(value !== undefined || value !== ""){
          let re = /\S+@\S+\.\S+/
          if(re.test(value) !== true)
          return  'invalid email address'
          else
          return
        }
      }

      let phoneValidatorFunc = function (obj, value, fieldName) {
        let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im // eslint-disable-line
        if (value !== undefined || value !== "") {
          if(re.test(value) !== true)
          return 'invalid phone number'
          else
          return
        }
      }

      let pincodeValidatorFunc = function (obj, value, fieldName) {
        let re = /^[0-9]{1,6}$/ // eslint-disable-line
        if (value !== undefined || value !== "") {
          if(re.test(value) !== true)
          return 'invalid pin-code'
          else
          return
        }
      }

      let getFunctionDate = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = dateValidatorFunc(obj, value, fieldName)
        var func4 =  defaultValidatorFunc(obj, value, fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        } else {
          return
        }
      }

      let getFunctionUrl = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = urlValidatorFunc(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else {
          return
        }
      }

      let getFunctionEmail = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = emailValidatorFunc(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else {
          return
        }
      }

      let getFunctionPhone = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = phoneValidatorFunc(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else {
          return
        }
      }

      let getFunctionPincode = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = getFunctionPincode(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else {
          return
        }
      }

      let getFunctionText = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = defaultValidatorFunc(obj, value, fieldName)
        var func4 = maxLengthValidatorFunc(obj, value, fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined){
            return func3
        } else if(func4 !== undefined){
           return func4
        }else {
          return
        }
      }

      let allowedValueValidatorFunc = function (obj, value, fieldName) {
        var i
        _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
          if (fieldName === value) {
            i = key
          }
        })
        if (self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues.length > 0) {
          if (value !== undefined) {
            let check = _.includes(self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues, value)
            console.log("check",check)
            if(check != true)
            return  'invalid allowedValue'
            else {
              return
            }
          }
        }
      }

      let defaultValidatorFunc = function (obj, value, fieldName) {
        // console.log("%%%%%%%%%%%%%%55555")
        var i
        _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
          if (fieldName === value) {
            i = key
          }
        })
        if (self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue !== '') {
          // console.log("default value called from if.....")
          if (value == "")
            return  'default value should be ' + self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue
            else
              return
          }
        }

        let maxLengthValidatorFunc = function (obj, value, fieldName) {
          console.log("max length called")
          var i
          _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.mObj[self.activeTab].mapping[i].schemaObj.maxLength !== '') {
            if (value !== undefined && typeof(value) == "string") {
              let check = value.length
              if(check != self.mObj[self.activeTab].mapping[i].schemaObj.maxLength)
              return  'invalid maxLength'
              else {
                return
              }
            }
          }
          }

      let regExValidatorFunc = function (obj, value, fieldName) {
        var i
        _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
          if (fieldName === value) {
            i = key
          }
        })
        if (self.mObj[self.activeTab].mapping[i].schemaObj.regEx !== '') {
          if (value !== undefined) {
            let pttrn = new RegExp(self.mObj[self.activeTab].mapping[i].schemaObj.regEx)
            if (pttrn.test(value) === false) return 'not match with regEx value'
            return
          }
        }
      }

        console.log("add new called ***********************",self.mObj[tab].mapping)
        let schema_Obj = {}
        _.forEach(self.mObj[tab].mapping, function (value, key) {
          if(value.schemaObj.optional == true){
            console.log("optional true called during property validation......")
              if(value.schemaObj.type == 'date'){
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: dateValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if(value.schemaObj.type == 'url'){
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: urlValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'email') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: emailValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'phone') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: phoneValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'pin-code') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: pincodeValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else{
                schema_Obj[value.sysHeader] = {type: value.schemaObj.type,label: value.schemaObj.type,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
          }
          else if(value.schemaObj.optional == false) {
            console.log("optional false called during property validation......")
            if(value.schemaObj.type == 'date'){
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionDate,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if(value.schemaObj.type == 'url'){
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionUrl,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'email') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionEmail,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'phone') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPhone,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'pin-code') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPincode,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else{
              schema_Obj[value.sysHeader] = {type: value.schemaObj.type,label: value.schemaObj.type,validator: getFunctionText,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
          }
        })
        self.mObj[tab].schema = new Schema(schema_Obj)
        // console.log("$$$$$$$$$$$$$$ new schema $$$$$$$$$$$$$$$$$",schema)


        // console.log("schema...............",schema)
        // var errcols = []
         err_length = 0
        _.forEach(self.mObj[tab].newUploadCSV, function (value, key) {
          // console.log("calleed...")
          self.mObj[tab].schema.validate(value, function (err, newP, errors) {
            if (err) {
              throw err
            } else {
              if (errors.length) {
                err_length = errors.length
                // console.log("errors in validation....",key,value,err_length)
                // console.log("Validation errors!",errors.length)

                if (!_.isEqual(Object.values(value), [""])) {
                  // console.log("error+++++++++++++++",Object.values(value),Object.keys(value))
                  self.mObj[tab].data1.push(Object.values(value))
                  self.mObj[tab].headers1.push(Object.keys(value))
                  // console.log("^^^^^^^self.mObj[tab].headers1",self.mObj[tab].headers1)
                  let oldHeaders = _.keys(self.mObj[tab].newUploadCSV)
                  _.forEach(errors, (item) => {
                    errcols.push({
                      cols: _.indexOf(oldHeaders, item.field),
                      rows: key
                    })
                    self.mObj[tab].errmsg.push('* ' + item.message + ' at column: ' + item.field)
                  })
                  // console.log("======errmsg====",self.mObj[tab].errmsg)
                  self.mObj[tab].headerDisplay = false
                  self.mObj[tab].newSchemaDisplay = false
                  self.mObj[tab].previewDisplay = false
                  self.mObj[tab].uploadDisplay = false
                  self.mObj[tab].showHandson = true
                  self.mObj[tab].errDisplay = true
                  self.showerrmsg(errcols,tab)
                }
              } else {
                // console.log('row ' + key + ' successfully parsed')
              }
            }
          })
        })

      if(err_length == 0){
        // console.log("++++++++++++++ called without error")
        self.mObj[tab].headerDisplay = false
        self.mObj[tab].newSchemaDisplay = false
        self.mObj[tab].previewDisplay = false
        self.mObj[tab].uploadDisplay = false
        self.loading = true
        self.saveData(tab)
      }
    },
    Abort(tab){
      let self = this
      self.mObj[tab].uploadCSV = []
      self.mObj[tab].headerDisplay = false
      self.mObj[tab].newSchemaDisplay = false
      self.mObj[tab].previewDisplay = false
      self.mObj[tab].uploadDisplay = true
    },
    showerrmsg (errcols,tab,schema) {
      // console.log("called...... showerrmsg")
      var example1 = document.getElementById('example1')
      // console.log(".......................",this.mObj[tab].data1[0])
      // _.forEach(, (value) => {
      //   headers.push(value.toLowerCase())
      // })
      // console.log("haeders......showerrmsg")
      new Handsontable(example1, { // eslint-disable-line
        data: [this.mObj[tab].data1[0]],
        // rowHeaders: true,
        colHeaders:this.mObj[tab].headers1[0],
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
      document.getElementById('example1').style.display = 'block'
      document.getElementById('hot-display-license-info').style.display = 'none'
    },
    modifyData (tab) {
      console.log("modify data called....")
      let schema = this.mObj[tab].schema
      let colHeaders = this.mObj[tab].headers1[0]
      // console.log("headers.....",colHeaders)
      let hotSettingsData = this.mObj[tab].data1
      // let showHandson = this.showHandson // eslint-disable-line
      let errMsgArray = this.mObj[tab].errmsg
      let userUploadedDataArr = this.mObj[tab].newUploadCSV
      let newHotSettingsData = []

      errMsgArray = []
      var errcols = []
      var self = this
      // console.log("valueToBeValidat hotSettingsData " , hotSettingsData)
      // console.log("valueToBeValidat colHeaders " , colHeaders)
      _.forEach(hotSettingsData, (value, key) => {
        let valueToBeValidated = _.object(colHeaders, value)
        // console.log("value to be validated....",value,"key.....",key)
        schema.validate(valueToBeValidated, (err, newP, errors) => {
          if (err) {} else {
            if (errors.length) {
              console.log("Validation errors called from modify....!",key)
              // console.log("error at : "+ JSON.stringify(errors) + " on row "+ key)
              newHotSettingsData.push(Object.values(value))
              // console.log("newHotSettingsData ",newHotSettingsData)
              self.mObj[tab].data1 = newHotSettingsData
              // console.log("========= self.mObj[tab].data1",self.mObj[tab].data1)
              _.forEach(errors, (item) => {
                errcols.push({
                  cols: _.indexOf(colHeaders, item.field),
                  rows: key
                })
                errMsgArray.push('* ' + item.message + ' at column: ' + item.field)
                // errMsgArray.push("error at field:"+item.field+ "  message:"+item.message)
              })
              self.mObj[tab].errmsg = errMsgArray
              // errMsgArray.push("error at : "+ JSON.stringify(errors) + " on row "+ key)
              // showHandson = true
            } else {
              // console.log("=====errmsg====",self.mObj[tab].errmsg[0])
              let modified_field = self.mObj[tab].errmsg[0].substring(self.mObj[tab].errmsg[0].indexOf(":") + 1);
              modified_field = modified_field.trim()
              // console.log("modified field.....",modified_field)
              let modifiedField_data = newP[modified_field]
              let modified_id = newP._id
              // console.log("modified data " , newP,modifiedField_data,modified_id)
              // console.log("userUploadedDataArray ", userUploadedDataArr)
              let new_arr = []
              lodash.transform(userUploadedDataArr, function(result, n) {
                  if (n._id == modified_id) {
                      n[modified_field] =  modifiedField_data
                  }
                  new_arr.push(n)
                  })
              //  console.log("res",new_arr)

              // finalModifiedDataArray.push(newP)
              // console.log("11111111111",finalModifiedDataArray)
              // res = userUploadedDataArr.map(obj => finalModifiedDataArray.find(o => o._id === obj._id) || obj)
              // console.log("res......",res)
              userUploadedDataArr = []
              userUploadedDataArr = new_arr
              //  console.log("userUploadedDataArr......",userUploadedDataArr)
            }
          }
        })
      })
      // console.log("@@@@@@res " , res)
      if (res !== undefined) {
        this.mObj[tab].newUploadCSV = res
        // console.log("++++++updated csv......",this.mObj[tab].newUploadCSV)
      }

      // console.log("newHotSettingsData..............",newHotSettingsData)
      if (newHotSettingsData.length == 0) {
        // console.log("modify if called.....")
        self.mObj[tab].errmsg = []
        $('table.htCore').each(function () {
          this.remove()
        })
        // document.getElementsByClassName('ht_master handsontable')[0].remove()
        document.getElementById('example1').style.display = 'none'
        // document.getElementById("hot-display-license-info").style.display = "none"
        // this.saveButton = true
        // alert("proceed")
        self.mObj[tab].showHandson = false
        self.mObj[tab].errDisplay = false
        self.loading = true
        self.saveData(tab)
        // this.$Message.success('validation successfully completed')
        // this.headerDetails = false
        // logs.push({date: Date(), status: 'validation_completed'})
        // var obj = {
        //   status: 'validation_completed',
        //   modified: Date(),
        //   log: logs
        // }
        // api.request('patch', '/import-tracker/' + id, obj).then(function (res) {
        //   console.log('response', res.data)
        // })
        // .catch(error => {
        //   console.log(error)
        // })
      } else {
        // $('.ht_clone_top handsontable').remove()
        $('table.htCore').each(function () {
          this.remove()
        })
        document.getElementsByClassName('ht_master handsontable')[0].remove()
        self.showerrmsg(errcols,tab)
        // self.$Message.error('validation error')
      }
      document.getElementById('hot-display-license-info').style.display = 'none'
    },
    saveData(tab){
      let self = this
      if(self.mObj[tab].new_flag == 1){
        let schemaobj = {
          name : self.mObj[tab].selected_schema,
          schema: self.mObj[tab].schema.structure,
          createdAt: Date(),
          updatedAt: Date(),
          username: self.$store.state.user.email
        }

        api.request('post', '/uploader-schema/',schemaobj).then(res => {
            console.log('response', res)
            schema_id = res.data.id
            console.log("schema_id....",schema_id)
            let CSVFileObj = {
              name : file.name,
              size: file.size,
              totalNoOfRecords: self.mObj[tab].newUploadCSV.length,
              createdAt: Date(),
              updatedAt: Date(),
              deletedAt:'',
              username: self.$store.state.user.email,
            }
            api.request('post', '/uploader-csv-files/',CSVFileObj).then(result => {
              console.log('response', result)
              CSVFile_id = result.data.id
              console.log("-------csv_file_id-------",CSVFile_id)

              let mappingObj = {
                mapping : self.mObj[tab].mapping,
                fileTypeId : self.mObj[tab].selected_schema,
                createdAt : Date(),
                updatedAt : Date(),
                deletedAt : '',
                username : self.$store.state.user.email
              }

              api.request('post', '/uploader-csv-file-mapping/' ,mappingObj).then(response => {
                console.log('response', response)

                let name = tab.replace(/\s+/, "")
                console.log("name...",name)
                obj1 = {}
                obj1[name] = {
                  id: CSVFile_id,
                  schema_id : schema_id,
                  uploadStatus:"completed",
                  validateStatus: "pending",
                  uploadedAt: Date(),
                  totalNoOfRecords: self.mObj[tab].newUploadCSV.length
                }

                var newCSV = _.map(self.mObj[tab].newUploadCSV, function(element) {
                  return _.extend({}, element, {username: self.$store.state.user.email,"import-tracker_id":id,"fileID":CSVFile_id});
                });
                console.log("newCSV.......",newCSV)

                self.loading = false
                self.mObj[tab].previewDisplay = true
                self.validate = false

                let obj= {
                  "activetab" : tab,
                  "newCSV": newCSV
                }
                socket.emit('pdmData', obj, (err, data) => {
                  if (err) {
                    console.log(err)
                    self.$Notice.error({title: 'Error!', desc: 'Error in saving the data!'})
                  }
                })
              })
              .catch(error => {
                console.log(error)
              })

            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error)
        })
      }
      else {

        let CSVFileObj = {
          name : file.name,
          size: file.size,
          totalNoOfRecords: self.mObj[tab].newUploadCSV.length,
          createdAt: Date(),
          updatedAt: Date(),
          deletedAt:'',
          username: self.$store.state.user.email,
        }
        api.request('post', '/uploader-csv-files/',CSVFileObj).then(result => {
          console.log('response', result)
          CSVFile_id = result.data.id
          console.log("-------csv_file_id-------",CSVFile_id)

          obj1 = {}
          let name = tab.replace(/\s+/, "")
          obj1[name] = {
            id: CSVFile_id,
            schema_id : schema_id,
            uploadStatus:"completed",
            validateStatus: "pending",
            uploadedAt: Date(),
            totalNoOfRecords: self.mObj[tab].newUploadCSV.length
          }

          var newCSV = _.map(self.mObj[tab].newUploadCSV, function(element) {
            return _.extend({}, element, {username: self.$store.state.user.email,"import-tracker_id":id,"fileID":CSVFile_id});
          });
          console.log("newCSV.......",newCSV)
          self.loading = false
          self.mObj[tab].previewDisplay = true
          self.validate = false
          let obj= {
            "activetab" : tab,
            "newCSV": newCSV
          }
          socket.emit('pdmData', obj, (err, data) => {
            if (err) {
              console.log(err)
              self.$Notice.error({title: 'Error!', desc: 'Error in saving the data!'})
            }
          })
      })
      .catch(error => {
        console.log(error)
      })

    }
  }
  },
  feathers: {
    'uploader': {
      updated (message) {
          let self = this
          console.log("messages....",message)
          if(message.stepStatus == "import_to_confirm"){
            self.import1 = true
          }
      }
    }
  },
    mounted(){
      let self = this
      id = self.$route.params.id
      self.loading = true
      // if(this.$store.state.jobData != []){
      //
      //   let jobData = this.$store.state.jobData
      //     console.log("+++++++++jobData+++",jobData)
      //   if(jobData.stepStatus == 'upload_pending'){
      //     this.currentStep = 0
      //     if(jobData.stepStatus == 'upload_pending'){
      //       if(Object.keys(jobData).indexOf("ProductInformation") >= 0){
      //         api.request('get', '/pdm-uploader-data/?import_tracker_id=' + jobData.id + '&tables=uploaderProductinformation').then(res => {
      //           console.log("%%%%%%%%%%%%%",res)
      //           self.mObj["Product Information"].newUploadCSV = res.data
      //           self.mObj["Product Information"].headers = Object.keys(res.data[0])
      //           self.map = true
      //           self.mObj["Product Information"].uploadDisplay = false
      //           self.mObj["Product Information"].previewDisplay = true
      //
      //         })
      //       }
      //       if(Object.keys(jobData).indexOf("ProductPrice") >= 0){
      //         api.request('get', '/pdm-uploader-data/?import_tracker_id=' + jobData.id + '&tables=uploaderProductprice').then(res => {
      //           console.log("%%%%%%%%%%%%%",res)
      //           self.mObj["Product Price"].newUploadCSV = res.data
      //           self.mObj["Product Price"].headers = Object.keys(res.data[0])
      //           self.map = true
      //           self.mObj["Product Price"].uploadDisplay = false
      //           self.mObj["Product Price"].previewDisplay = true
      //         })
      //       }
      //       if(Object.keys(jobData).indexOf("ProductImprintData") >= 0){
      //         api.request('get', '/pdm-uploader-data/?import_tracker_id=' + jobData.id + '&tables=uploaderProductimprintdata').then(res => {
      //           console.log("%%%%%%%%%%%%%",res)
      //           self.mObj["Product Imprint Data"].newUploadCSV = res.data
      //           self.mObj["Product Imprint Data"].headers = Object.keys(res.data[0])
      //           self.map = true
      //           self.mObj["Product Imprint Data"].uploadDisplay = false
      //           self.mObj["Product Imprint Data"].previewDisplay = true
      //         })
      //       }
      //       if(Object.keys(jobData).indexOf("ProductShipping") >= 0){
      //         api.request('get', '/pdm-uploader-data/?import_tracker_id=' + jobData.id + '&tables=uploaderProductshipping').then(res => {
      //           console.log("%%%%%%%%%%%%%",res)
      //           self.mObj["Product Shipping"].newUploadCSV = res.data
      //           self.mObj["Product Shipping"].headers = Object.keys(res.data[0])
      //           self.map = true
      //           self.mObj["Product Shipping"].uploadDisplay = false
      //           self.mObj["Product Shipping"].previewDisplay = true
      //         })
      //       }
      //       if(Object.keys(jobData).indexOf("ProductImage") >= 0){
      //         api.request('get', '/pdm-uploader-data/?import_tracker_id=' + jobData.id + '&tables=uploaderProductimage').then(res => {
      //           console.log("%%%%%%%%%%%%%",res)
      //           self.mObj["Product Image"].newUploadCSV = res.data
      //           self.mObj["Product Image"].headers = Object.keys(res.data[0])
      //           self.map = true
      //           self.mObj["Product Image"].uploadDisplay = false
      //           self.mObj["Product Image"].previewDisplay = true
      //         })
      //       }
      //       if(Object.keys(jobData).indexOf("ProductAdditionalCharges") >= 0){
      //         api.request('get', '/pdm-uploader-data/?import_tracker_id=' + jobData.id + '&tables=uploaderProductadditionalcharges').then(res => {
      //           console.log("%%%%%%%%%%%%%",res)
      //           self.mObj["Product Additional Charges"].newUploadCSV = res.data
      //           self.mObj["Product Additional Charges"].headers = Object.keys(res.data[0])
      //           self.map = true
      //           self.mObj["Product Additional Charges"].uploadDisplay = false
      //           self.mObj["Product Additional Charges"].previewDisplay = true
      //         })
      //       }
      //       if(Object.keys(jobData).indexOf("ProductVariationPrice") >= 0){
      //         api.request('get', '/pdm-uploader-data/?import_tracker_id=' + jobData.id + '&tables=uploaderProductvariationprice').then(res => {
      //           console.log("%%%%%%%%%%%%%",res)
      //           self.mObj["Product Variation Price"].newUploadCSV = res.data
      //           self.mObj["Product Variation Price"].headers = Object.keys(res.data[0])
      //           self.map = true
      //           self.mObj["Product Variation Price"].uploadDisplay = false
      //           self.mObj["Product Variation Price"].previewDisplay = true
      //         })
      //       }
      //          self.validate = false
      //     }
      //   }
      //   else if(jobData.stepStatus == 'validation_completed'){
      //     this.currentStep = 1
      //   }
      //   else {
      //     this.currentStep = 2
      //   }
      // }
      api.request('get', '/uploader-schema/').then(res => {
        self.existingSchemaData = res.data.data
        let schemaNames = _.map(res.data.data, 'name');
        _.forEach(schemaNames,(value,key) => {
            self.schemaList.push({"value":value,"label":value})
        })
        self.schemaList = self.schemaList.reverse()
        // console.log("self.schemaList.....",self.schemaList)
        if(schemaNames.length == 0){
          self.mObj["Product Information"].selected_schema = "--Add new--"
          self.mObj["Product Price"].selected_schema = "--Add new--"
          self.mObj["Product Imprint Data"].selected_schema = "--Add new--"
          self.mObj["Product Image"].selected_schema = "--Add new--"
          self.mObj["Product Shipping"].selected_schema = "--Add new--"
          self.mObj["Product Additional Charges"].selected_schema = "--Add new--"
          self.mObj["Product Variation Price"].selected_schema = "--Add new--"
          self.loading = false
          self.mObj["Product Information"].uploadDisplay = true
          self.mObj["Product Price"].uploadDisplay = true
          self.mObj["Product Imprint Data"].uploadDisplay = true
          self.mObj["Product Image"].uploadDisplay = true
          self.mObj["Product Shipping"].uploadDisplay = true
          self.mObj["Product Additional Charges"].uploadDisplay = true
          self.mObj["Product Variation Price"].uploadDisplay = true
        }
        else{
          self.mObj["Product Information"].selected_schema = self.schemaList[0].value
          self.mObj["Product Price"].selected_schema = self.schemaList[0].value
          self.mObj["Product Imprint Data"].selected_schema = self.schemaList[0].value
          self.mObj["Product Image"].selected_schema = self.schemaList[0].value
          self.mObj["Product Shipping"].selected_schema = self.schemaList[0].value
          self.mObj["Product Additional Charges"].selected_schema = self.schemaList[0].value
          self.mObj["Product Variation Price"].selected_schema = self.schemaList[0].value
          self.loading = false
          self.mObj["Product Information"].uploadDisplay = true
          self.mObj["Product Price"].uploadDisplay = true
          self.mObj["Product Imprint Data"].uploadDisplay = true
          self.mObj["Product Image"].uploadDisplay = true
          self.mObj["Product Shipping"].uploadDisplay = true
          self.mObj["Product Additional Charges"].uploadDisplay = true
          self.mObj["Product Variation Price"].uploadDisplay = true

        }


      })
      .catch(error => {
        console.log(error)
      })


    }
}
</script>
<style>
.ivu-steps-item.ivu-steps-status-process .ivu-steps-content {
    color: #337ab7;
    position: absolute;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-content:hover{
  color: #494e6b;
}
.ivu-steps-item.ivu-steps-status-wait .ivu-steps-content {
    color: #777;
    font-size: 14px;
    font-weight: bold;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: #494e6b;
    background-color: #494e6b;
    width: 40px;
    height: 40px;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner>.ivu-steps-icon {
    color: #fff;
    vertical-align: -webkit-baseline-middle;
}
.ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner>.ivu-steps-icon {
    color: #777;
    vertical-align: -webkit-baseline-middle;
}
.ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner {
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-color: #777;
}
.vue-tabs .nav-stacked > li{
    border: 1px solid #ddd !important;
    border-radius: 5px;
    padding-left: 0px !important;
    color: #494e6b;
    width: 160%;
    margin-top: 30%;
    margin-bottom: -2px;
}
.vue-tabs .nav > li span.title {
    display: flex;
    justify-content: center;
    font-size: 15px;
}
.ivu-form-item {
    margin-bottom: 15px;
    vertical-align: top;
    zoom: 1;
    /*margin-left:-4%;*/
}
.ivu-form .ivu-form-item-label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 15px;
    color: #495060;
    line-height: 1;
    padding: 10px 12px 10px 0;
    box-sizing: border-box;
}
.ivu-input {
    display: inline-block;
    margin-left: 68px;
    width: 60%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    margin-top: 4%;
}
.ivu-btn-ghost {
    color: #495060;
    background-color: transparent;
    border-color: #fff;
    padding-left: 0px;
    padding-right: 0px;
}
.ivu-btn-ghost:hover {
    color: #495060;
    background-color: transparent;
    border-color: #fff;
    padding-left: 0px;
    padding-right: 0px;
}

.ivu-upload-drag {
  background: #fff;
  border: 2px dashed #494e6b;
  border-radius: 0px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color .2s ease;
  /*margin-left: -3%;*/
}
.ivu-upload-drag:hover {
  background: #fff;
  border: 2px dashed #494e6b;
  border-radius: 0px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color .2s ease;
}

#msg{
  position: absolute;
  font-weight: 500;
  font-size: 25px;
  top: 35%;
  text-align: center;
  width: 100%;
  color: #98878f;
  display: block;
}

#small{
  font-size: 60%;
  color: #bbb;;
  position:relative;
  margin-top: 6%;
  text-align:center;
  font-size: 15px;
  /*margin-left: -3%;*/
}
.ivu-upload-list-file {
    padding: 4px;
    color: #495060;
    border-radius: 4px;
    transition: background-color .2s ease-in-out;
    overflow: hidden;
    position: relative;
    display:none;
}
.ivu-btn-success {
    margin-top: 60%;
    color: #fff;
    background-color: #1fb58f;
    border-color: #1fb58f;
    width: 152%;
}
.ivu-btn-success:disabled {
    margin-top: 60%;
    color: #fff;
    background-color: #1fb58f;
    border-color: #1fb58f;
    width: 152%;
}
#upload-csv-zone>.file-zone {
  border: 2px dashed #494e6b;
  position: relative;
  margin-bottom: 15px;
}

#upload-csv-zone>.file-zone>input[type="file"] {
  width: 100%;
  height: 200px;
  opacity: 0;
}

#upload-csv-zone .dz-spinner {
  display: none;
}

#upload-csv-zone.onprogress .dz-spinner {
  position: absolute;
  font-weight: 500;
  font-size: 25px;
  top: 23%;
  text-align: center;
  width: 100%;
  color: #98878f;
  display: block;
}

#upload-csv-zone .dz-message {
  position: absolute;
  font-weight: 500;
  font-size: 25px;
  top: 35%;
  text-align: center;
  width: 100%;
  color: #98878f;
  display: block;
}

#upload-csv-zone .dz-message>small {
  font-size: 60%;
  color: #bbb;
}

#upload-csv-zone.onprogress .dz-message {
  display: none;
}

.ivu-table-wrapper {
    position: relative;
    border: 1px solid #dddee1;
    border-bottom: 0;
    border-right: 0;
    /*margin-left: -3%;*/
}
.ivu-table th {
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: black;
    color: #fff;
    font-size: 13px;
    padding: 9px;
}
.ivu-table td {
    background-color: #fff;
    transition: background-color .2s ease-in-out;
    font-size: 13px;
    padding: 9px;
}
.handsontable thead {
    box-sizing: content-box;
    -webkit-box-sizing: content-box;
    background-color: black;
    color: #fff;
    font-size: 14px;
}
#example1 {
  width: 100%!important;
}
.handsontable td.error {

  border: 2px solid red;
  outline: none;
}

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

</style>
