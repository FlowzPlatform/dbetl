<template>
  <div class="right col-md-6 col-sm-12 col-xs-12 col-md-offset-3">
    <h3 style="margin-top: 12px;">Choose a method for upload the data</h3>
    <Form>
       <ul class="mySection">
          <div class="row">
            <div v-for="(method,mIndex) in methods1">
            <li class="btn col-md-3" @click="methodChanged(mIndex)" @mouseover="display(method.name)" @mouseout="hide(method.name)" >
                <img src="../assets/images/tick.png" class="selected_tick" v-if="method.selected == true">
                <label class="dropbtn" :id="mIndex">
               {{method.name}}
               </label>
            </li>
          </div>
          </div>
       </ul>
       <div id="dv" class="clearfix col-md-10 col-md-offset-1 col-sm-12 col-xs-12" style="display:none">
          <Button type="ghost">×</Button>
          <img class="bulb" src="../assets/images/idea.png" />
          <p id="get"></p>
       </div>
       <div class="landing_progress">
          <Button type="primary" @click="Proceed()" :disabled="disabled">Proceed</Button>
       </div>
       <div id="display-error" style="display:none">Please choose a method of your choice.</div>
    </Form>
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
    name: 'uploader',
    components: {},
    data () {
        return {
          methods1: [
           { name: 'REPLACE',selected:false},
           { name: 'APPEND',selected:false},
           { name: 'UPSERT',selected:false},
           { name: 'UPDATE',selected:false}
         ],
         selectedMethod:'',
         disabled: true
        }
    },
    methods:{
      //to display the tick on the click of any method
       methodChanged(index){
         this.methods1[index].selected = true
         this.selectedMethod = this.methods1[index].name
         this.disabled = false
         let me = $("ul.mySection").find("#"+index)
         me.css("background-color", "#1fb58f","color","fff");

         for(let i=0;i<this.methods1.length;i++){
           if(i != index){
             this.methods1[i].selected = false
             let me1 = $("ul.mySection").find("#"+i)
             me1.css("background-color", "#494e6b","color","fff");
           }
         }
       },
       //to display the method hints(showHintsDiv)
       display(name){
         document.getElementById("dv").style.display="block";
         this.showHintsDiv(name)
       },
       //to hide the method hints(showHintsDiv)
       hide(){
         document.getElementById("dv").style.display="none";
       },
       //to display proper hint according to method
       showHintsDiv(data){
        if(data == "REPLACE") {
            $( "#get" ).html( "<p> By choosing <b>Replace</b> method you can remove all your old data and add the new one.Replace all the old products with new one.</p><table border=1 style='position:absolute;left:34%;width:37%;'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr></table>");
        }
        else if(data == "APPEND") {
            $( "#get" ).html( "<p> By choosing <b>Append</b> method you can Keep all the old products and add the new one . No old records will be updated .</p><p><table border=1 style='position:absolute;left:34%;width:37%'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'> A, B, C, D, E</td></tr></table>" );
        }
        else if(data == "UPSERT") {
            $( "#get" ).html( " <p> By choosing <b>Upsert</b> method you can Keep all the old products , update old records and add the new one .</p><p><table border=1 style='position:absolute;left:37%;width:34%'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'>A, B, <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr></table>" );
        }
        else if(data == "UPDATE") {
            $( "#get" ).html( "<p> By choosing <b>Update</b> method you can Keep all the old products and update old records . No new products can be added in this method</p><p>  <table border=1 style='position:absolute;left:34%;width:37%'><tr><th colspan='2' style='background-color:#494e6b;color:#fff;text-align:center'>Example</th></tr><tr><td> Old records </td><td> A, B, C </td></tr> <tr><td>New records </td><td> <span style='color:blue;font-weight:bold'>C'</span>, D, E</td></tr><tr><td style='background-color:#e2e2e2'> Result </td><td style='background-color:#e2e2e2'>A, B, <span style='color:blue;font-weight:bold'>C'</span> </td></tr></table>" );
        }
     },
     // creates a job in import-tracker service
     Proceed(){
       if(this.selectedMethod == ''){
         $('#display-error').fadeIn().delay(4000).fadeOut();
       }
       else{
         var obj = {
           createdAt: Date(),
           stepStatus: 'upload_pending',
           uploadType:this.selectedMethod.toLowerCase(),
           key:'pdm_uploader',
           masterJobStatus: "running",
           username: this.$store.state.user.fullname,
           user_id:this.$store.state.user._id
         }
         api.request('post', '/uploader', obj).then(res => {
           console.log("==================",res)
           id = res.data.id
           this.$router.push('/upload/' + id)
         })
       }
     }
    },
    mounted(){
      socket.emit('uploader::find', {user_id:this.$store.state.user._id,masterJobStatus:"running",key:'pdm_uploader'}, (e, data) => {
        console.log("data......",data)
        if (data.data.length !== 0) {
          this.$router.push('/landing/' + data.data[0].id)
        }
        else {
          this.$store.state.jobData = []
          
        }
      })
    }
}
</script>
<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }
ul.mySection { margin: 16px; list-style: none; }
ul.mySection li { margin: 0px 0px; display: inline-block;}
ul.mySection input[type=radio] { display: none; }
ul.mySection label {
    display: table-cell; cursor: pointer;
    width: 200px; height: 120px;
    vertical-align: middle; text-align: center;
    background-color: #494e6b;
    color:#fff
}
ul.mySection label:hover {
    background-color: #7c7e86; color: aquamarine; transition: all 0.25s;
}
/*ul.mySection label[data-v-ae883134]:active{
    background-color:  #1fb58f;
    color: #fff;
}*/
.dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 16px;
    font-size: 16px;
    border: none;
    cursor: pointer;
}
#myform {
    text-align: center;
  }
  #dv {
  height: 185px;
  margin-left: 13%;
  margin-bottom: 19px;
  width: 90px;
  width: 74%;
  margin-top: 2px;
  margin-bottom:20px !important;
  overflow: auto;
  border: 3px solid #7c7e86;
  color: black;
  text-align: center;
  padding-top: 4px;
}

@media(max-width: 480px){
  #dv{
    margin-left: 5px;
    width: 100%;
  }
}

.right[data-v-ae883134] {
    position: absolute;
    left: 10%;
    top: 60%;
    text-align: -webkit-center;
    border: 2px #7c7e86 dashed;
    width: 60%;
    margin-top:10px;
}
.bulb {
    float: left;
    padding: 10px;
    width:8%;
}
.ivu-btn-primary {
    position: relative;
    display: inline-block;
    padding: 0 25px;
    outline: none;
    border: none;
    background: #1fb58f;
    color: #fff;
    /* text-transform: uppercase; */
    letter-spacing: 1px;
    font-size: 1em;
    line-height: 3;
    margin-bottom:10px;
}
.selected_tick {
      margin-left: -65px;
      position: absolute;
}
button {margin-left: 20px;}
#display-error {
    display:none;
    background-color: #f2dede;
    border-color: #eed3d7;
    color: #b94a48;
    padding: 4px;
    margin-top: 9px;
}
.ivu-btn-ghost{
  padding: 0px 9px !important;
  float: right;
  border: 0;
}

</style>
