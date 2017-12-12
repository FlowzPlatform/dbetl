<template>
    <Table :columns="columns1" :data="data2"></Table>
</template>
<script>
/*eslint-disable*/
import expandRow from './expand-row.vue';
let axios = require("axios")
import api from '../api'
import schema from '../api/schema'
// import io from 'socket.io-client';
// import feathers from 'feathers/client';
// import socketio from 'feathers-socketio/client';
import Emitter from '@/mixins/emitter'
import Settings from './Settings.vue';
import config from '@/config'
var _ = require("underscore");
// const socket = io(config.serverURI);
// const app = feathers()
//   .configure(socketio(socket));
let index
export default {
    name: 'joblist',
    components: { expandRow,Settings},
    mixins: [Emitter],
    data () {
        return {
            columns1: [
                {
                    type: 'expand',
                    width: 20,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: 'Source',
                    key: 'source'
                },
                {
                    title: 'Destination',
                    key: 'destination'
                },
                {
                    title: 'Database_Name',
                    key: 'database_name'
                },
                {
                    title: 'Connection_Name',
                    key: 'connection_name'
                },
                {
                    title: 'Host',
                    key: 'host'
                },
                {
                    title: 'Port',
                    key: 'port'
                },
                {
                    title: 'Status',
                    key: 'status'
                }
            ],
            data2: []
        }
    },
    methods:{
      getData(value){
        // console.log("dataa cameeeeeeeeeeeeeeee...",value)
        // this.broadcast("Settings","data",value)
      }
    },
    feathers: {
      'import-tracker': {
        updated (message) {
            let self = this
            // console.log("messages....",message)
            for(var i=0;i<self.data2.length;i++){
                if(self.data2[i].id == message.id){
                    index = i
                }
            }
            // console.log("index",index)

            self.data2.splice(index, 1);
            // console.log("message after splicing...",self.data2)
            self.data2.push(message)
            var desc = _.sortBy(self.data2, 'modified');
            self.data2 = desc.reverse()


        },
        created (data) {
          let self = this
          // console.log('connectiondata created..', data)
          // console.log("data.....",data)
         self.data2.push(data)
         var desc = _.sortBy(self.data2, 'modified');
         self.data2 = desc.reverse()
        },
        removed (data) {
          // console.log('connectiondata removed..', data)
          this.init()
        }
      }
    },
    mounted(){
      var self = this
      this.$on('send-data',this.getData)
      api.request('get', '/import-tracker/').then(function(response){
        // console.log("response",response.data)
        for(var i=0;i<response.data.length;i++){
          self.data2.push(response.data[i])
        }
        // console.log("------------>",self.data2)
         var desc = _.sortBy(self.data2, 'modified');
         self.data2 = desc.reverse()
      })

      // console.log("------------>",self.data)
    //   app.service("import-tracker").on("created", (data) => {
    //      console.log("data.....",data)
    //      self.data2.push(data)
    //      var desc = _.sortBy(self.data2, 'modified');
    //      self.data2 = desc.reverse()
    //       // console.log("%%%%%%%%%%%%%%%%%%%%%",self.data2)
    //    })



    //    app.service("import-tracker").on("updated", (message) => {
    //     console.log("messages....",message)
    //     for(var i=0;i<self.data2.length;i++){
    //       if(self.data2[i].id == message.id){
    //         index = i
    //       }
    //     }
        // console.log("index",index)

    //     self.data2.splice(index, 1);
    //     // console.log("message after splicing...",self.data2)
    //       self.data2.push(message)
    //       var desc = _.sortBy(self.data2, 'modified');
    //       self.data2 = desc.reverse()
    //       // console.log("message after pushing data",self.data2)
    //   })
    }
}
</script>
<style scoped>
</style>
