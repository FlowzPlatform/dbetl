<template>
    <Table :columns="columns1" :data="data2"></Table>
</template>
<script>
import expandRow from './expand-row.vue'
import api from '@/api'
import Emitter from '@/mixins/emitter'
import Settings from './Settings.vue'
import _ from 'lodash'
let index
export default {
  name: 'joblist',
  components: {expandRow, Settings},
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
  feathers: {
    'import-tracker': {
      updated (message) {
        let self = this
        for (var i = 0; i < self.data2.length; i++) {
          if (self.data2[i].id === message.id) {
            index = i
          }
        }
        self.data2.splice(index, 1)
        self.data2.push(message)
        var desc = _.sortBy(self.data2, 'modified')
        self.data2 = desc.reverse()
      },
      created (data) {
        let self = this
        self.data2.push(data)
        var desc = _.sortBy(self.data2, 'modified')
        self.data2 = desc.reverse()
      },
      removed (data) {
        this.init()
      }
    }
  },
  mounted () {
    var self = this
    api.request('get', '/import-tracker/').then(response => {
      for (var i = 0; i < response.data.length; i++) {
        self.data2.push(response.data[i])
      }
      var desc = _.sortBy(self.data2, 'modified')
      self.data2 = desc.reverse()
    })
  }
}
</script>
