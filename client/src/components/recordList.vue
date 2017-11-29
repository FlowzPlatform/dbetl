<template>
  <div class="recordList">
  <f-Tab></f-Tab>
    <div style="padding:10px">
    <Row style="padding-bottom:10px">
      <Breadcrumb>
        <BreadcrumbItem>{{crumbData.db}}</BreadcrumbItem>
        <BreadcrumbItem>{{crumbData.cname}}</BreadcrumbItem>
        <BreadcrumbItem>{{crumbData.tname}}</BreadcrumbItem>
      </Breadcrumb>
    </Row>
      <Table  stripe :columns="columnsData" :data="tableData"></Table>
    </div>
    <!-- {{tableData}} -->
  </div>
</template>

<script>
import ConnectionData from '../api/connectiondata'
import settings from '../api/settings'
import Tab from './Tab'
const _ = require('lodash')
export default {
  name: 'recordList',
  components: {
    'f-Tab': Tab
  },
  data () {
    return {
      columnsData: [
        {
          title: 'ID',
          key: '_id',
          sortable: true
        },
        // {
        //   title: '',
        //   key: 'age',
        //   sortable: true
        // },
        {
          title: 'Action',
          key: 'action',
          width: 300,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              // h('Button', {
              //   props: {
              //     type: 'text',
              //     size: 'large',
              //     icon: 'ios-eye'
              //   },
              //   style: {
              //     marginRight: '3px',
              //     color: '#2d8cf0',
              //     padding: '0px',
              //     fontSize: '25px'
              //   },
              //   on: {
              //     click: () => {
              //       // console.log('AAAA', params.index)
              //       this.show(params.index)
              //     }
              //   }
              // }, ''),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'edit'
                },
                style: {
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px',
                  color: '#00C851'
                },
                on: {
                  click: () => {
                    alert(params.index)
                    // this.$router.push('/')
                    // this.show(params.index)
                  }
                }
              }, ''),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'large',
                  icon: 'trash-b'
                },
                style: {
                  color: '#CC0000',
                  marginRight: '3px',
                  padding: '0px',
                  fontSize: '20px'
                },
                on: {
                  click: () => {
                    alert(params.index)
                    // this.show(params.index)
                  }
                }
              }, '')
            ])
          }
        }
      ],
      tableData: [],
      crumbData: {}
    }
  },
  methods: {
    init () {
      // alert(this.$route.params.id + '/' + this.$route.params.tname)
      let self = this
      ConnectionData.get().then(response => {
        // console.log('response', response.data)
        settings.getThis(self.$route.params.id).then(res => {
          var insId = res.data.id
          var sDb = res.data.selectedDb
          self.crumbData.cname = res.data.connection_name
          self.crumbData.db = sDb
          self.crumbData.tname = self.$route.params.tname
          _.forEach(response.data, (connd, cinx) => {
            if (connd.db === sDb) {
              _.forEach(connd.db_data, (insd, iinx) => {
                if (insd.inst_id === insId) {
                  _.forEach(insd.inst_data, (tabled, tinx) => {
                    if (tabled.t_name === self.$route.params.tname) {
                      self.tableData = tabled.t_data
                    }
                  })
                }
              })
            }
          })
        })
      }).catch(error => {
        this.$Notice.error({
          title: error,
          desc: 'connection to the server timed out',
          duration: 0
        })
      })
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route.params.id' (newId, oldId) {
      // fetch data
      // console.log(newId)
      this.init()
    },
    '$route.params.tname' (newId, oldId) {
      // fetch data
      // console.log(newId)
      this.init()
    }
  }
}
</script>
