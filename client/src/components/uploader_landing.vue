<template>
  <div id="landingPageStatusReport" class="clearfix" style="overflow:auto;border: 3px solid #7c7e86;color: black;text-align: center;padding-top: 4px;margin: 50px;padding-bottom: 26px;">
    <h3 style="text-transform:uppercase;margin-top: 18px;">Welcome back,{{job[0].username}}</h3>
    <p style="margin-top: 10px;margin-bottom: 10px;font-size: 15px;">Following is the latest status of your file upload process.You can continue with your current status or abort the whole process to start again</p>
    <!-- <table class="landingStatus" border='1|1'>
      <tr>
        <td style='font-weight:bold'>
          uploadType
        </td>
        <td>
          <div class="upload-type">
            <span>
                <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'replace'"></i>
                <i class="fa fa-circle-o" v-else></i>
              Replace
            </span>
            <span>
              <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'append'"></i>
              <i class="fa fa-circle-o" v-else></i>
              Append
            </span>
            <span>
              <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'upsert'"></i>
              <i class="fa fa-circle-o" v-else></i>
              Upsert
            </span>
            <span>
              <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'update'"></i>
              <i class="fa fa-circle-o" v-else></i>
              Update
            </span>
          </div>
        </td>
      </tr>
        <tr>
          <td style='font-weight:bold'>
            Started Process at
          </td>
          <td style='font-weight:500'>
            {{job[0].created}}
          </td>
        </tr>
      </table> -->

      <div class="ivu-tabs-tabpane">
      <div class="ivu-table-wrapper">
      <div class="ivu-table">
      <div class="ivu-table-header">
        <table cellspacing="0" cellpadding="0" border='1' style="width:80%" >
          <colgroup>
            <col width="30">
            <col width="70">
          </colgroup>
            <tr>
              <td class="">
                <div class="ivu-table-cell">
                  <span style='font-weight:bold'>uploadType</span>
                </div>
              </td>
              <td class="">
                <div class="ivu-table-cell">
                <div class="upload-type">
                  <span>
                      <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'replace'"></i>
                      <i class="fa fa-circle-o" v-else></i>
                    Replace
                  </span>
                  <span>
                    <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'append'"></i>
                    <i class="fa fa-circle-o" v-else></i>
                    Append
                  </span>
                  <span>
                    <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'upsert'"></i>
                    <i class="fa fa-circle-o" v-else></i>
                    Upsert
                  </span>
                  <span>
                    <i class="fa fa-dot-circle-o" v-if="job[0].uploadType == 'update'"></i>
                    <i class="fa fa-circle-o" v-else></i>
                    Update
                  </span>
                </div>
              </div>
              </td>
            </tr>
            <tr>
              <td class="">
                <div class="ivu-table-cell">
                  <span style='font-weight:bold'>Started Process at</span>
                </div>
              </td>
              <td class="">
                <div class="ivu-table-cell">
                  <span style='font-weight:500'>{{job[0].created}}</span>
                </div>
              </td>
            </tr>
        </table>
      </div>
    </div>

    <div class="ivu-table" v-if="job[0].stepStatus !='upload_pending'">
    <div class="ivu-table-header">
      <table cellspacing="0" cellpadding="0" border='1' style="width:80%">
        <colgroup>
          <col width="25">
          <col width="25">
          <col width="25">
          <col width="25">
        </colgroup>
        <thead>
          <tr>
          <th class="">
            <div class="ivu-table-cell">
              <span style='font-weight:bold'>File</span>
            </div>
          </th>
          <th class="">
            <div class="ivu-table-cell">
              <span style='font-weight:bold'>Upload Status</span>
            </div>
          </th>
          <th class="">
            <div class="ivu-table-cell">
              <span style='font-weight:bold'>Validation Status</span>
            </div>
          </th>
          <th class="">
            <div class="ivu-table-cell">
              <span style='font-weight:bold'>Import Status</span>
            </div>
          </th>
         </tr>
       </thead>
       <tbody v-for="(item,index) in Object.keys(job[0])">
          <tr  v-if="item == 'ProductInformation' || item == 'ProductPrice' || item == 'ProductImprintData' || item == 'ProductImage' || item == 'ProductShipping' || item == 'ProductAdditionalCharges' || item == 'ProductVariationPrice'">
            <td class="">
              <div class="ivu-table-cell">
                <span style='font-weight:500px'>{{convert(item)}}</span>
              </div>
            </td>
            <td style='text-transform:capitalize;'>
                <div class="ivu-table-cell">
                <span style='font-weight:500px'>{{job[0][item].uploadStatus}}</span>
              </div>
            </td>
            <td style='text-transform:capitalize;'>
              <div class="ivu-table-cell">
               <span style='font-weight:500px'>{{job[0][item].validateStatus}}</span>
             </div>
            </td>
            <td>
              <div class="ivu-table-cell">
                <span style='font-weight:200px'>Pending</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  </div>
</div>

      <!-- <table border='1|1' class="landingDetails" v-if="job[0].status != 'upload_pending'">
        <th>File</th><th>Upload Status</th><th>Validation Status</th><th>Import Status</th>
         <tr>
            <td>
            </td>
            <td style='text-transform:capitalize;'>
            <i class="fa fa-check-circle" style="color:green;color: #008000;font-size: 1.3em;" aria-hidden="true"></i>
            </td>
            <td style='text-transform:capitalize;'>
            <i class="fa fa-check-circle" style="color:green;color: #008000;font-size: 1.3em;text-transform:capitalize;" aria-hidden="true"></i>
            </td>
            <td>
              Pending
            </td>
        </tr>
      </table> -->

      <div class="landingBtnDiv">
        <Button type="error" class="landingAbortBtn" @click="modal1 = true">Abort</Button>
        <Button type="primary" class="landingContinuetBtn" @click="continue1()">Continue</Button>
      </div>
      <Modal v-model="modal1" width="450">
       <p slot="header" style="color:#f60;text-align:center;font-size:20px">
           <Icon type="information-circled"></Icon>
           <span>Are you sure?</span>
       </p>
       <div style="text-align:center">
           <p style="font-size:15px">All your existing uploaded file will be deleted and you have to upload the files again</p>
       </div>
       <div slot="footer">
           <Button size="medium" @click="cancel" style="background-color:#ddd">Cancel</Button>
           <Button type="error" size="medium"  @click="abort">Abort</Button>
       </div>
   </Modal>

  </div>
</template>
<script>
/*eslint-disable*/
let axios = require("axios")
import api from '../api'
import schema from '../api/schema'
import config from '@/config'
import io from 'socket.io-client'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'

let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI)
} else {
  socket = io(config.socketURI)
}
const app = feathers().configure(socketio(socket))
let id
export default {
    name: 'uploaderLanding',
    components: {},
    data () {
        return {
            job: [],
            modal1:false,
            job2: []
        }
    },
    methods:{

      //to abort the current running job
      abort(){
        let self = this
        api.request('delete', '/uploader/' + this.$route.params.id).then(res => {
          console.log("==================",res)
          self.$Notice.error({
                     title: 'Your files has been deleted'
                 });
           self.$router.push('/uploader')
          })
        .catch(error => {
          self.$Notice.error({
                     title: 'Something bad happened.Please try again later'
                 });
        })
      },
      //converts into uppercase
      convert(item){
        item = item.replace(/([A-Z])/g, ' $1').trim()
        return item
      },

      //closes the alert
      cancel(){
        this.modal1 = false
      },

      continue1(){
        this.$router.push('/upload/' + this.$route.params.id)
      }

    },

    mounted(){
      console.log("landing page.....")
      socket.emit('uploader::find', {id: this.$route.params.id}, (e, data) => {
        console.log("++++++++++++++",data.data[0])
        this.$store.state.jobData = data.data[0]
        this.job.push(data.data[0])
      })
    }
}
</script>
<style>

.upload-type > span{
  padding-right: 35px;
  font-weight: 500;
  color : #888383;
}
.landingBtnDiv{
    padding: 15px;
}
.landingAbortBtn{
  width: 160px ;
  border: none ;
  background: #b51f1f ;
  color: #fff ;
  letter-spacing: 1px ;
  line-height: 2.5;
  font-size:14px;
}

.ivu-btn-primary{
  width: 160px ;
  border: none ;
  background: #1fb58f ;
  color: #fff ;
  letter-spacing: 1px ;
  line-height: 2.5;
  font-size:14px;
}

.ivu-btn-primary:hover{
  width: 160px ;
  border: none ;
  background: #1fb58f ;
  color: #fff ;
  letter-spacing: 1px ;
  line-height: 2.5;
  font-size:14px;
}
/*.landingContinuetBtn{
    width: 160px ;
    border: none ;
    background: #1fb58f ;
    color: #fff ;
    letter-spacing: 1px ;
    line-height: 3.5 ;
}*/
button, html input[type="button"], input[type="reset"], input[type="submit"] {
    -webkit-appearance: button;
    cursor: pointer;
    font-size: 14px;
}
/*.landingStatus{
    margin:auto;
    width:850px;
    border:solid 1px #ccc;
    border-collapse: collapse;
}*/
.ivu-table table{
    margin:auto;
    /*width:850px;*/
    border:solid 1px #ccc;
    border-collapse: collapse;
}

/*.landingStatus > tr > td{
  color:#000;
  font-size:14px;
  padding:5px;
  word-break: break-all;
}*/
.ivu-table-cell{
  color:#000;
  font-size:16px;
  padding:5px;
  word-break: break-all;
  text-align:center;
}
/*.landingDetails{
  background-color: #192231;
  color: #fff;
  margin:auto;
  width:850px;
  border:solid 1px #ccc;
  border-collapse: collapse;
}*/
.ivu-table table > th > tr{
  color:#4e4e4e;
  background-color: #fff;
}
.ivu-table table >  tr{
  color:#4e4e4e;
  background-color: #fff;
}

.ivu-table th {
    height: 47px;
    white-space: nowrap;
    overflow: hidden;
    text-align:center;
    background-color: #fff;
}
/*.landingDetails > th{

}

.landingDetails > tr{
  color:#4e4e4e;
  background-color: #fff;
}
.landingDetails > tr > td{
  color:#000;
  font-size:14px;
  padding:5px;
  word-break: break-all;
  font-weight:bold;
}*/

.ivu-modal {
    width: auto;
    margin: 0 45%;
    position: relative;
    outline: 0;
    top: 284px;
}
.ivu-table-wrapper {
    position: relative !important;
    border: 0px !important;
}

</style>
