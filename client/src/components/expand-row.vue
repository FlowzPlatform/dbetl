<template>
    <div>
        <div class="ivu-tabs-tabpane">
              <div class="ivu-table-wrapper">
                <div class="ivu-table ivu-table-small">
                  <div class="ivu-table-header">
                    <table cellspacing="0" cellpadding="0" border="1" style="width:100%;">
                      <colgroup>
                        <col width="200">
                        <col width="800">
                      </colgroup>
                        <tr>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Created</span>
                            </div>
                          </th>
                          <td class="">
                            <div class="ivu-table-cell">
                              <span>{{row.created}}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Modified</span>
                            </div>
                          </th>
                          <td class="">
                            <div class="ivu-table-cell">
                              <span>{{row.modified}}</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Total Uploaded time</span>
                            </div>
                          </th>
                          <td class="">
                            <div class="ivu-table-cell">
                              <span v-if="row.log.length >= 6">{{ Math.floor(moment.duration(moment(row.log[row.log.length-1].date).diff(moment(row.log[0].date))).asHours())+" hr "+moment.duration(moment(row.log[row.log.length-1].date).diff(moment(row.log[0].date))).minutes()+" min "+moment.duration(moment(row.log[row.log.length-1].date).diff(moment(row.log[0].date))).seconds()+" sec "}}</span>
                              <span v-else>-</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>No of records</span>
                            </div>
                          </th>
                          <td class="">
                            <div class="ivu-table-cell">
                              <span v-if="row.csvDetails">{{row.csvDetails.no_of_records}}</span>
                              <span v-else>0</span>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th class="">
                            <div class="ivu-table-cell">
                              <span>Log Details</span>
                            </div>
                          </th>
                          <td class="">
                            <table cellspacing="0" cellpadding="0" style="width: 100%;" border="1">
                              <colgroup>
                                <col width="200">
                                <col width="200">
                                <col width="200">
                              </colgroup>
                              <thead>
                                <tr>
                                <th class="">
                                  <div class="ivu-table-cell">
                                    <span>Date</span>
                                  </div>
                                </th>
                                <th class="">
                                  <div class="ivu-table-cell">
                                    <span>Status</span>
                                  </div>
                                </th>
                                <th class="">
                                  <div class="ivu-table-cell">
                                    <span>Time taken</span>
                                  </div>
                                </th>
                               </tr>
                             </thead>
                             <tbody class="ivu-table-tbody">
                             <tr class="ivu-table-row" v-for="(item,index) in row.log">
                               <td class="">
                                 <div class="ivu-table-cell">
                                   <span>{{item.date}}</span>
                                 </div>
                               </td>
                               <td class="">
                                 <div class="ivu-table-cell">
                                   <span>{{item.status}}</span>
                                 </div>
                               </td>
                               <td class="">
                                 <div class="ivu-table-cell">
                                   <span v-if="index<row.log.length-1">{{ Math.floor(moment.duration(moment(row.log[index+1].date).diff(moment(row.log[index].date))).asHours())+" hr "+moment.duration(moment(row.log[index+1].date).diff(moment(row.log[index].date))).minutes()+" min "+moment.duration(moment(row.log[index+1].date).diff(moment(row.log[index].date))).seconds()+" sec "}}</span>
                                   <span v-else>-</span>
                                 </div>
                               </td>
                             </tr>
                           </tbody>
                          </table>
                          </td>
                        </tr>
                    </table>
                    <div>
                      <Button type="primary" v-if="row.status == 'import_staging_running'" @click="continueImport(row)">Continue</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    </div>
</template>
<script>
/*eslint-disable*/
var moment = require('moment');
import Settings from './Settings.vue';
import api from '../api'
import schema from '../api/schema'
let baseUrl = config.serverURI
import io from 'socket.io-client';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import Emitter from '@/mixins/emitter'
import config from '@/config'

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
let dataObj = {}
let err
let logs
let obj
socket.on('res',function(res){
  if(res.stderr == '' || (JSON.parse(res.stdout)).errors == false){
    err = res.stderr
    // console.log("+++++++++++++++",res.stdout.search("errors"))
    if(res.stdout.search("errors") != -1){
      err = (JSON.parse(res.stdout)).errors
    }
    api.request('patch', '/import-tracker/'+dataObj.id, obj).then(function(res){
      console.log("response",res.data)

    })
    .catch(error => {
      console.log(error);
    })

  }
})
    export default {
      components: {Settings},
      name: "expandRow",
        mixins: [Emitter],
        props: {
            row: Object,
            obj : dataObj
        },
        data(){
          return {
          moment : moment
        }
      },
      methods:{
        continueImport(rowObj){
          var self = this
        let upldCsv = []
        logs = rowObj.log
        console.log("continue called....",rowObj.log)
        socket.emit('customer-uploaded-data::find',{ importTracker_id: rowObj.id} ,(error, data) => {
        // console.log('Found all messages', data);
        rowObj.upldCSV = data
        console.log("Object after pushing csv.....",rowObj)
        logs.push({date:Date(),status:"import_staging_completed"})
        obj = {
          status: 'import_staging_completed',
          log:logs
        }
        dataObj = rowObj
        // console.log("data send....",dataObj)
        self.dispatch('joblist','send-data',dataObj)
        socket.emit('import',rowObj,(error,data) => {
          if(error){
            console.log(error)
            this.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
          }
        });
        setTimeout(function() {
          console.log("err",err)
          if(err == "" || err == false){
            // console.log("errr.....",err)
            self.$router.push('/db/mongo/new/'+rowObj.id);
          }
          else {
              self.$Notice.error({title: "Error!",desc:"Error in importing data to realDb...!"})
          }
        },1000)


        //
      });

       }
     },
     mounted(){

     }
    };
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
    .ivu-table td, .ivu-table th {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-top: 1px solid #e9eaec;
    border-right: 1px solid #e9eaec;
    border-bottom: 1px solid #e9eaec;
    border-left: 1px solid #e9eaec;
  }
  .ivu-btn-primary {
    color: #fff;
    background-color: #2d8cf0;
    border-color: #2d8cf0;
    float: right;
    margin-right: 5%;
    margin-bottom: 1%;
    margin-top: 1%;
    }

</style>
