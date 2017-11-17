<template>
  <div class="instancelist">
  	<f-Tab></f-Tab>
    <!-- <h2>Instance List</h2> -->
     <!-- <div v-if="data5.length > 0">
    <test :row="data5"></test>
  </div> -->
  <Table border :columns="columns5" :data="data5"></Table>
  </div>
</template>

<script>
/*eslint-disable*/
import api from '../api'
import Tab from './Tab'
import test from './test.vue'
import _ from 'lodash'

export default {
  name: 'instancelist',
  components: {
    'f-Tab': Tab,
    'test': test
  },
  computed: {
  },
  created () {
    this.fetch(this.$route.params.id)
  },
  data () {
    return {
      columns5: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(test, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: 'Instance ID',
          key: '_id',
          sortable: true
        },
        {
          title: 'Action',
          key: 'action',
          width: 400,
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
                  	// alert(params.index)
                    // this.$router.push('/')
                    this.show(params.index)
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
                    this.remove(params.index)
                  }
                }
              }, '')
            ])
          }
        }
      ],
      data5: [
      ]
    }
  },
  methods: {
    fetch (id) {
      var self = this
      // alert(id)
      api.request('get', '/instance')
      .then(response => {
        // this.schema = response.data
        // this.schema.splice(index, 1)
        self.data5 = _.filter(response.data, (f) => { return f.Schemaid === id })
      })
      .catch(error => {
        console.log(error)
      })
    },
    show (index) {
    	console.log(this.data5[index]._id)
    	this.$router.push('/schema-instance/edit/'+this.data5[index]._id)
    },
    remove (index) {
      api.request('delete', '/instance/' + this.data5[index]._id)
        .then(response => {
      		this.data5.splice(index, 1)
		      this.$Notice.success({
		          title: 'Success',
		          desc: 'SchemaInstance Deleted.....',
		          duration: 2
		      })
        })
        .catch(error => {
          console.log(error)
          this.$Notice.error({
		          title: 'Error',
		          desc: 'SchemaInstance Not Deleted.....',
		          duration: 2
		      })
        })
    }
  },
  watch: {
    '$route.params.id' (newId, oldId) {
      // fetch data
      this.fetch(newId)
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
