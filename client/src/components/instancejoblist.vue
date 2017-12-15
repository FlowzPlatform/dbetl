<template>
  <div class="instancejoblist">
    <div style="padding:10px">
      <div>
        <Row>
          <Col span="23">
            <Breadcrumb style="padding-bottom:10px">
              <BreadcrumbItem>{{crumbData.db}}</BreadcrumbItem>
              <BreadcrumbItem>{{crumbData.cname}}</BreadcrumbItem>
              <BreadcrumbItem>{{crumbData.dbname}}</BreadcrumbItem>
            </Breadcrumb>
          </Col>
          <Col span="1">
            <Button type="primary" shape="circle" size="small" @click="goBackHandle()" icon="chevron-left">Back</Button>
          </Col>
        </Row>
        <Row style="padding-bottom: 10px">
          <Table  stripe :columns="icolumns" :data="idata"></Table>
        </Row>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
import settings from '../api/settings'
import expandRow from './JobList_expandRow.vue'
const _ = require('lodash')
let moment = require('moment')
export default {
  name: 'instancejoblist',
  data () {
    return {
      radioButton: 'bydb',
      crumbData: {},
      icolumns: [
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
          title: 'Job Id',
          key: 'id',
          width: 300,
          sortable: true
        }, {
          title: 'Source',
          key: 'source',
          width: 250
          // sortable: true
        }, {
          title: 'Target',
          key: 'target',
          width: 250
          // sortable: true
        }, {
          title: 'jobCreated',
          key: 'dateCreated',
          width: 260,
          sortable: true
        }, {
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
                  percent: this.idata[params.index].progress,
                  'stroke-width': 10,
                  // 'stroke-scolor': '#111',
                  size: 35
                },
                style: {
                },
                on: {
                  click: () => {
                  }
                }
              }, [
                h('span', {
                  class: {
                    'demo-Circle-inner': true
                  },
                  style: {
                    fontSize: '10px'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, this.idata[params.index].progress + '%')
              ])
            ])
          }
        }
      ],
      idata: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let self = this
      var res = []
      // alert(self.$route.params.id)
      if (self.$route.params.id !== undefined) {
        settings.getThis(self.$route.params.id).then(__res => {
          self.crumbData.db = __res.data.selectedDb
          self.crumbData.cname = __res.data.connection_name
          self.crumbData.dbname = __res.data.dbname
        }).catch(err => {
          console.log('Error...', err)
        })
        api.request('get', '/import-to-external-db').then(response => {
          // console.log('response', response.data.data)
          _.forEach(response.data.data, (obj) => {
            if (obj.hasOwnProperty('data')) {
              if (obj.data.target.id === self.$route.params.id) {
                // console.log('...', obj)
                obj.source = obj.data.source.selectedDb + ' / ' + obj.data.source.dbname
                obj.target = obj.data.target.selectedDb + ' / ' + obj.data.target.dbname
                obj.dateCreated = moment(obj.dateCreated).fromNow()
                res.push(obj)
              }
            }
          })
          // console.log('sortBY  ', _.sortBy(res, function (o) { return o.dateCreated }).reverse())
          self.idata = _.sortBy(res, function (o) { return o.dateCreated }).reverse()
        }).catch(error => {
          this.$Notice.error({
            title: error,
            desc: 'connection to the server timed out',
            duration: 0
          })
        })
      }
    },
    goBackHandle () {
      this.$router.go(-1)
    }
  },
  feathers: {
    'import-to-external-db': {
      updated (data) {
        // console.log('connectiondata updated..', data)
        this.init()
      },
      created (data) {
        // console.log('connectiondata created..', data)
        this.init()
      },
      removed (data) {
        // console.log('connectiondata removed..', data)
        this.init()
      }
    }
  },
  'watch': {
    '$route.params.id': function (newId, oldId) {
      // this.$route.params.id = newId
      this.init()
      // this.fetch(newId)
    }
  }
}
</script>
<style>
  .ivu-table th {
    height: 44px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #394263;
    color: #fff;
  }
</style>