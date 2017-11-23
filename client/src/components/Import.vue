<template>
  <div>
    <Row :gutter="20">
    <Col span="12">
      <h1 style="text-align: center;">Source</h1>
      <br>
  <Form ref="frmSourceDbForm" :model="source" :rules="ruleValidate" :label-width="80">
    <FormItem label="Select DB" prop="selectedDb">
      <Select v-model="source.selectedDb" style="width:200px">
          <Option v-for="item in dbList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="Database name" prop="dbname">
      <Input v-model="source.dbname"></Input>
    </FormItem>
    <FormItem label="Host" prop="host">
      <Input v-model="source.host"></Input>
    </FormItem>
    <FormItem label="Port" prop="port">
      <Input v-model="source.port"></Input>
    </FormItem>
    <Col span="12">
    <FormItem label="Username">
      <Input placeholder="Username" v-model="source.username"></Input>
    </FormItem>
  </Col>
  <Col span="12">
    <FormItem label="Password">
      <Input type="password" placeholder="Password" v-model="source.password"></Input>
    </FormItem>
  </Col>
    <FormItem>
      <Button type="primary" @click="handleContinue('frmSourceDbForm')" style="margin-left: 8px">Continue
        <span>
            <Icon  v-if="check_conn" :type="conn_icon" style="padding-left:5px;font-size:12px;"/>
        </span>
      </Button>
    </FormItem>
  </Form>
</Col>
<Col span="12" >
  <h1 style="text-align: center;">Target</h1>
  <br>
  <Form :label-width="80">
    <FormItem label="Selected DB">
        <Input v-model="target.connection_name" readonly></Input>
    </FormItem>
    <FormItem label="Database name">
        <Input v-model="target.dbname" readonly></Input>
    </FormItem>
    <FormItem label="Host">
      <Input v-model="target.host" readonly></Input>
    </FormItem>
    <FormItem label="Port">
      <Input v-model="target.port" readonly></Input>
    </FormItem>
</Form>
</Col>
</Row>
  {{source.collection}}
  <div v-if='source.collection.length > 0'>
    <div class="ivu-tabs-tabpane">
      <div class="ivu-table-wrapper">
        <div class="ivu-table ivu-table-small">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
              <colgroup>
                  <col width="3">
                      <col width="25">
                          <col width="25">
              </colgroup>
              <thead>
                <tr>
                  <th class=""></th>
                  <th class="">
                    <div class="ivu-table-cell">
                      <span>{{source.selectedDb}} / {{source.dbname}}</span>
                    </div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell">
                      <span>{{target.connection_name}} / {{target.dbname}}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="ivu-table-tbody">
                <template v-for="(item, index) in source.collection">
                  <tr class="ivu-table-row">
                    <td class="">
                      <Button @click="item.expand = true"><Icon type="chevron-right" style="margin-left: 10px;"></Icon></Button>
                    </td>
                    <td class="">
                      <div class="ivu-table-cell">
                        <span>{{item.name}}</span>
                      </div>
                    </td>
                    <td class="">
                      <div class="ivu-table-cell">
                        <AutoComplete
                            placeholder="input here"
                            style="width:200px">
                            <Option v-for="item in target.collection" :value="item.name" :key="item.name">{{ item.name }}</Option>
                        </AutoComplete>
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
                  </tr>
                  <tr v-show="item.expand" class="ivu-table-row">
                    <td>
                      <table width="2200%">
                        <!-- <tbody v-for="(item1,index1) in schemaList"> -->
                        <tbody>
                          <div v-for="(item1,index1) in columns">
                            <div v-if="table[index]===item1.name">
                          <tr v-for="(item2,index2) in item1.columns">
                        <!-- <tr v-if="index===index1" v-for="(item2,index2) in item1.entity"> -->
                          <!-- <td class="ivu-table-cell">
                              <Checkbox v-model="index2">{{item2.name}}</Checkbox>
                          </td> -->

                          <td class="">
                            <div class="ivu-table-cell" >
                              <!-- <CheckboxGroup v-model="checked[item2.name]" @on-change="checkedfunction()"> -->
                                <Checkbox v-model="arr[index].colsData[index2].checked">{{item2.name}}</Checkbox>
                              <!-- </CheckboxGroup> -->
                             </div>
                          </td>
                          <td>
                            <auto-complete
                            v-model="arr[index].colsData[index2].input"
                            :data="schemaList"
                            :filter-method="filterMethod"
                            placeholder="input here"
                            style="width:200px">
                            </auto-complete>
                          </td>
                        </tr>
                      </div>
                      </div>
                      </tbody>
                      </table>
                    </td>
                  </tr>
                </template>
                </tbody>
                </table>
              </div>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Button type="primary" @click="handleImport('')" style="margin-left: 8px">Import</Button>
  </div>
</div>
</template>
<script>
// import _ from 'lodash'
// import api from '../api'
import modelSettings from '@/api/settings'
// import modelSchema from '@/api/schema'
export default {
  data () {
    return {
      check_conn: false,
      conn_icon: 'load-a',
      // showtable: false,
      schemaTitle: [],
      tableList: [],
      schemaList: [],
      columns: [],
      arr: [],
      // source: {},
      target: {
        collection: []
      },
      colsData: [],
      table: {},
      source: {
        selectedDb: 'rethink',
        dbname: 'rethinkinstance',
        host: 'localhost',
        port: '28015',
        username: '',
        password: '',
        collection: []
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
        }],
        port: [{
          required: true,
          message: 'Please enter port number',
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      var self = this
      modelSettings.getDb(this.$route.params.id).then(response => {
        self.target = response // _.merge(self.target, response)
        self.target.collection = []
      })
    },
    filterMethod (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    },
    // selectedtablelist (index) {
    //   var self = this
    //   this.colsData = []
    //   _.forEach(this.columns, function (value1, key1) {
    //     if (self.table[index] === value1.name) {
    //       _.forEach(value1.columns, function (value2, key2) {
    //         self.colsData.push({name: value2.name, checked: false, transform: '', input: ''})
    //       })
    //     }
    //   })
    //   console.log(this.colsData)
    //     // _.forEach(this.colsData, function(value){
    //     //   console.log(value.checked)
    //     //   if(value.checked){
    //     //
    //     //   }
    //     // })
    //   this.arr.push({target: this.schemaTitle[index], source: this.table[index], colsData: this.colsData})
    // },
    handleContinue (name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          this.check_conn = true
          this.conn_icon = 'load-a'
          this.source.collection = await modelSettings.checkConnection(this.source).then(response => {
            if (response.result) {
              return response.data
            } else {
              this.conn_icon = 'close'
              this.$Notice.error({
                title: 'Connection Not Establish...!',
                desc: 'Please Check Your Database..'
              })
              return []
            }
          }).catch(error => {
            this.$Notice.error({title: 'Error!', desc: error})
            return []
          })
          if (this.source.collection.length > 0) {
            this.conn_icon = 'checkmark'
            this.target['collection'] = await modelSettings.checkConnection(this.target).then(response => {
              if (response.result) {
                return response.data
              } else {
                this.$Notice.error({
                  title: 'Connection Not Establish...!',
                  desc: 'Please Check Your Database..'
                })
              }
            })

            // this.showtable = true
            // this.source.collection = _sourceCollection
            // this.$Notice.success({
            //   title: 'Success Message',
            //   desc: 'Connection Successfully Done. '
            // })
            // var self = this
            // var schemaList = []

            // api.request('get', '/schema').then(function (_res) {
            //   console.log('_res', _res)
            //   // _.forEach(_res.data, function (value) {
            //   //   if (value.database[1] === self.$route.params.id) {
            //   //     _.forEach(value.entity, function (value) {
            //   //       self.schemaList.push(value.name)
            //   //     })
            //   //     self.schemaTitle.push(value.title)
            //   //   }
            //   // })
            // })
            // self.columns = response.data.data
            // _.forEach(response.data, function (value) {
            //   // var from = Object.keys(value.columns)
            //   self.columns.push(value)
            //   // _.forEach(value.columns, function (value) {
            //   //   console.log("2222222", value)
            //   //   self.columns.push(value)
            //   // })
            //
            //   self.tableList.push({'value': value.name, 'label': value.name})
            // })
            // this.tableList = response.data.data
          }
        }
      })
    },
    handleImport () {
      console.log('final imported data', this.importedData)
    }
  }
}
</script>
