<template>
  <div class="instancejoblist">
    <Row type="flex" justify="space-between">
      <Col span="20">
        <Breadcrumb style="padding-bottom:10px">
          <BreadcrumbItem>{{crumbData.db}}</BreadcrumbItem>
          <BreadcrumbItem>{{crumbData.cname}}</BreadcrumbItem>
          <BreadcrumbItem>{{crumbData.dbname}}</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col span="4">
        <Row type="flex" justify="end">
          <Col span="24">
            <Button style="float: right" type="primary" shape="circle" size="small" @click="goBackHandle()" icon="chevron-left">Back</Button>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col>
        <Table :loading="loading" :columns="columns" :data="tableData" size="small" stripe></Table>
      </Col>
    </Row>
  </div>
</template>

<script>
// Generals
import _ from 'lodash'
import moment from 'moment'

// Models
import modelDatabases from '../api/databases'
import modelimportToExternalDb from '../api/import-to-external-db'

// Components
import expandRow from './JobList_expandRow.vue'
export default {
  name: 'instancejoblist',
  data () {
    return {
      loading: true,
      columns: [
        {
          type: 'expand',
          width: 40,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: 'Source',
          key: 'source',
          width: 250,
          render: (h, params) => {
            return h('div', params.row.data.source.selectedDb + ' / ' + params.row.data.source.dbname)
          }
        },
        {
          title: 'Target',
          key: 'target',
          width: 250,
          render: (h, params) => {
            return h('div', params.row.data.target.selectedDb + ' / ' + params.row.data.target.dbname)
          }
        },
        {
          title: 'jobCreated',
          key: 'dateCreated',
          sortable: true,
          render: (h, params) => {
            if (params.row.dateCreated !== undefined) {
              return h('div', [
                h('Tooltip', {
                  props: {
                    content: moment(params.row.dateCreated).format('lll')
                  }
                }, moment(params.row.dateCreated).fromNow())
              ])
            } else {
              return h('div', '--')
            }
          }
        },
        {
          title: 'status',
          key: 'status',
          width: 200,
          sortable: true
        },
        {
          title: 'Progress',
          key: 'action',
          // width: 300,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-circle', {
                props: {
                  percent: this.tableData[params.index].progress,
                  'stroke-width': 5,
                  size: 35
                }
              }, [
                h('span', this.tableData[params.index].progress + '%')
              ])
            ])
          }
        }
      ],
      crumbData: {},
      tableData: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let self = this
      if (this.$route.params.id !== undefined) {
        modelDatabases.get(self.$route.params.id).then(response => {
          this.crumbData.db = response.selectedDb
          this.crumbData.cname = response.connection_name
          this.crumbData.dbname = response.dbname
        }).catch(err => {
          console.log('Error...', err)
        })
        // Get Imported data details
        modelimportToExternalDb.get().then(response => {
          this.tableData = _.chain(response).filter(f => {
            return f.data.target.id === self.$route.params.id
          }).sortBy(s => { return s.dateCreated }).reverse().value()
          this.loading = false
        }).catch(error => {
          this.$Notice.error({
            title: error,
            desc: 'connection to the server timed out',
            duration: 0
          })
          this.loading = false
        })
      } else {
        this.$router.go(-1)
      }
    },
    goBackHandle () {
      this.$router.go(-1)
    }
  },
  feathers: {
    'import-to-external-db': {
      updated (data) {
        this.init()
      },
      created (data) {
        this.init()
      },
      removed (data) {
        this.init()
      }
    }
  },
  'watch': {
    '$route.params.id': function (newId, oldId) {
      this.init()
    }
  }
}
</script>