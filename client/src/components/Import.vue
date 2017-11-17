<template>
  <div>
  <Form ref="data" :model="data" :rules="ruleValidate" :label-width="80">
    <FormItem label="Select DB" prop="selectedDb">
      <Select v-model="data.selectedDb" style="width:200px">
          <Option v-for="item in data.DB" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </FormItem>
    <FormItem label="Database name" prop="dbname">
      <Input v-model="data.dbname"></Input>
    </FormItem>
    <FormItem label="Host" prop="host">
      <Input v-model="data.host"></Input>
    </FormItem>
    <FormItem label="Port" prop="port">
      <Input v-model="data.port"></Input>
    </FormItem>
    <Col span="12">
    <FormItem label="Username">
      <Input placeholder="Username" v-model="data.username"></Input>
    </FormItem>
  </Col>
  <Col span="12">
    <FormItem label="Password">
      <Input type="password" placeholder="Password" v-model="data.password"></Input>
    </FormItem>
  </Col>
    <FormItem>
      <Button type="primary" @click="Continue(data,'data')" style="margin-left: 8px">Continue
        <span>
            <Icon  v-if="check_conn" :type="conn_icon" style="padding-left:5px;font-size:12px;"/>
        </span>
      </Button>
    </FormItem>
  </Form>
  <div v-if='showtable'>
    <div class="ivu-tabs-tabpane">
      <div class="ivu-table-wrapper">
        <div class="ivu-table ivu-table-small">
          <div class="ivu-table-header">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="">
                    <div class="ivu-table-cell">
                      <span>To</span>
                    </div>
                  </th>
                  <th class="">
                    <div class="ivu-table-cell">
                      <span>From</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="ivu-table-tbody">
                <tr class="ivu-table-row"  v-for="(item, index) in schemaTitle">
                  <td class="">
                    <div class="ivu-table-cell">
                      <span>{{item}}</span>
                    </div>
                  </td>
                  <td class="">
                    <div class="ivu-table-cell">
                      <Select @on-change="selectedtablelist(index)" v-model="table[index]" style="width:200px">
                          <Option v-for="item in tableList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Button type="primary" @click="Import('')" style="margin-left: 8px">Import</Button>
  </div>
</div>
</template>
<script>
/*eslint-disable*/
import api from '../api'
    export default {
        data () {
            return {
              check_conn: false,
              conn_icon: 'load-a',
              showtable: false,
              schemaTitle: [],
              tableList: [],
              arr: [],
              source: {},
              target: {},
              importedData: {},
              table: {},
              data:{
                DB: [
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
                selectedDb: '',
                dbname: '',
                host: '',
                port: '',
                username: '',
                password: ''
              },
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
                    }, ],
                    port: [{
                      required: true,
                      message: 'Please enter port number',
                      trigger: 'blur'
                    }, ],
                  }
            }
        },
        methods: {
          selectedtablelist(index){
            this.arr.push({target:this.schemaTitle[index], source:this.table[index]})
            var self = this
          },
          Continue (data,name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.check_conn = true
                this.conn_icon = 'load-a'
                api.request('post', '/settings?check=' + data.selectedDb, data)
                .then(response => {
                  if(response.data.result == true){
                    this.conn_icon = 'checkmark'
                    this.showtable = true
                    this.$Notice.success({
                      title: 'Success Message',
                      desc: 'Connection Successfully Done. '
                    });
                    var self = this
                    var schemaList = []
                    api.request('get', '/schema').then(function(_res) {
                      _.forEach(_res.data, function(value){
                        if (value.database[1] == self.$route.params.id){
                          schemaList.push(value)
                          self.schemaTitle.push(value.title)
                        }
                      })
                    })
                    _.forEach(response.data.data, function(value){
                      self.tableList.push({"value":value.name, "label": value.name})
                    })
                    // this.tableList = response.data.data
                  } else{
                    this.conn_icon = 'close'
                    this.$Notice.error({
                      title: 'Connection Not Establish...!',
                      desc: 'Please Check Your Database..'
                    })
                  }
                })
                .catch(error => {
                  console.log(error)
                  this.$Notice.error({title: 'Error!', desc: 'Connection Error...'})
                })

              } else {

              }
            })
          },
          async Import(){
            console.log("mapdata", this.arr)
            this.target = this.data
            delete this.target.DB
            console.log("target", this.target)
            var self = this
            await api.request('get', '/settings').then(function(response) {
              _.forEach(response.data, function(value){
                _.forEach(value.dbinstance, function(value){
                  if(value.id == self.$route.params.id){
                    self.source = value
                    delete self.source.isdefault
                    delete self.source.isenable
                    delete self.source.keep_sync
                    delete self.source.notes
                    delete self.source.rdodb
                    delete self.source.rdosync
                    delete self.source.schemaData
                    delete self.source.upldCSV
                    delete self.source.upldIcn
                    console.log("source", self.source)
                  }
                })

              })
            })
            this.importedData = {target: this.source, source: this.target, mapdata: this.arr}
            console.log("final imported data", this.importedData)
          }
    }
  }
</script>
