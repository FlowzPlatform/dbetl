<template>
    <Table :loading="loading" :columns="columns" :data="tableData" size="small" border></Table>
</template>
<script>
// General
import Emitter from '@/mixins/emitter'
import _ from 'lodash'
import moment from 'moment'

// Model
import importTrackerModel from '@/api/importTracker'

// Component
import expandRow from './expand-row.vue'
import Settings from './Settings.vue'

let index
export default {
  name: 'joblist',
  components: {expandRow, Settings},
  mixins: [Emitter],
  data () {
    return {
      loading: true,
      columns: [
        {
          type: 'expand',
          width: 20,
          render: (h, params) => {
            console.log('params', params)
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        // {
        //   title: 'Id',
        //   key: 'id'
        // },
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
        },
        {
          title: 'Created',
          key: 'created',
          width: 170,
          render: (h, params) => {
            if (params.row.created !== undefined) {
              return h('div', [
                h('Tooltip', {
                  props: {
                    content: params.row.created
                  }
                }, moment(params.row.created).format('lll'))
              ])
            } else {
              return h('div', '--')
            }
          }
        }
      ],
      tableData: []
    }
  },
  feathers: {
    'import-tracker': {
      updated (message) {
        let self = this
        for (var i = 0; i < self.tableData.length; i++) {
          if (self.tableData[i].id === message.id) {
            index = i
          }
        }
        self.tableData.splice(index, 1)
        self.tableData.push(message)
        var desc = _.sortBy(self.tableData, 'modified')
        self.tableData = desc.reverse()
      },
      created (data) {
        this.tableData.push(data)
        this.tableData = _.chain(this.tableData).sortBy('modified').reverse().value()
      },
      removed (data) {
        this.init()
      }
    }
  },
  mounted () {
    importTrackerModel.get().then(response => {
      this.tableData = _.chain(response).sortBy('created').reverse().value()
      this.loading = false
    })
  }
}
</script>
