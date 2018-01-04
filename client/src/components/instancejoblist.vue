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
        <Table :loading="loading" :columns="columns" :data="tableData.data" size="small" border></Table>
      </Col>
      <Col>
        <div class="f-pagination">
          <div class="total-page">
            <b>Total Records:</b> {{tableData.total}}
          </div>
          <div class="page">
            <Page :total="tableData.total" :page-size="$store.state.limit" @on-change="handlePage"></Page>
          </div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
// Generals
// import _ from 'lodash'
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
          render: (h, params) => {
            return h('div', params.row.data.source.selectedDb + ' / ' + params.row.data.source.dbname)
          }
        },
        {
          title: 'Target',
          key: 'target',
          render: (h, params) => {
            return h('div', params.row.data.target.selectedDb + ' / ' + params.row.data.target.dbname)
          }
        },
        {
          title: 'jobCreated',
          key: 'dateCreated',
          width: 150,
          align: 'center',
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
          title: 'Progress',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              'class': {
                progressTooltip: true
              }
            }, [
              h('Tooltip', {
                props: {
                  content: params.row.status.charAt(0).toUpperCase() + params.row.status.slice(1)
                }
              }, [
                h('Progress', {
                  props: {
                    percent: params.row.progress,
                    strokeWidth: 5,
                    status: (params.row.status && params.row.status.toLowerCase()) === 'terminated' ? 'wrong' : 'active'
                  }
                })
              ])
              // h('i-circle', {
              //   props: {
              //     percent: this.tableData[params.index].progress,
              //     'stroke-width': 5,
              //     size: 35
              //   }
              // }, [
              //   h('span', this.tableData[params.index].progress + '%')
              // ])
            ])
          }
        }
      ],
      crumbData: {},
      tableData: [],
      skip: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handlePage (newPage) {
      this.loading = true
      this.skip = this.$store.state.limit * (newPage - 1)
      this.getTableData()
    },
    getTableData () {
      let self = this
      // Get Imported data details
      modelimportToExternalDb.get(null, {
        '$sort[dateCreated]': -1,
        $limit: this.$store.state.limit,
        $skip: this.skip,
        'data.target.id': self.$route.params.id
      }).then(response => {
        this.tableData = response
        // this.tableData = _.chain(response).filter(f => {
        //   return f.data.target.id === self.$route.params.id
        // }).sortBy(s => { return s.dateCreated }).reverse().value()
        this.loading = false
      }).catch(error => {
        this.$Notice.error({
          title: error,
          desc: 'connection to the server timed out',
          duration: 0
        })
        this.loading = false
      })
    },
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
        self.getTableData()
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
<style>
  .progressTooltip > .ivu-tooltip {
    display: block;
  }
  .progressTooltip > .ivu-tooltip > .ivu-tooltip-rel {
    display: block;
  }
</style>