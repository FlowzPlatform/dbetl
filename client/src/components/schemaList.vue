<template>
  <div>
  <row type="flex" justify="end">
    <router-link to="/schema/new">
      <Button type="primary" size="small" style="margin-bottom: 2px;" icon="plus">Add</Button>
    </router-link>
  </row>
    <Table size="small" :columns="schemaCol" :data="schemaData"></Table>
  </div>
</template>
<script type="text/javascript">
  import schema from '@/api/schema'
import api from '@/api'
import _ from 'lodash'
  export default {
    data () {
      return {
        schemaName: [],
        schemaData: [],
        deleteSchemaValue: 'softdel',
        schemaCol: [
          {
            title: 'Title',
            key: 'title'
          },
          {
            title: 'ID',
            key: '_id'
          },
          {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'large',
                    icon: 'play'
                  },
                  style: {
                    color: '#00C851',
                    marginRight: '3px',
                    padding: '0px',
                    fontSize: '20px'
                  },
                  on: {
                    click: () => {
                      // console.log(params.index)
                      // console.log(this.schemaName[params.index])
                      this.$router.push('schema-instance/' + this.schemaName[params.index]._id + '/new')
                    }
                  }
                }, ''),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'large',
                    icon: 'navicon-round'
                  },
                  style: {
                    color: '#ffbb33',
                    marginRight: '3px',
                    padding: '0px',
                    fontSize: '20px'
                  },
                  on: {
                    click: () => {
                      // console.log(params.index)
                      // console.log(this.schemaName[params.index])
                      // this.$router.push('schema-instance/' + this.schemaName[params.index]._id + '/new')
                      this.setData(this.schemaName[params.index].title, '/instancelist/' + this.schemaName[params.index]._id, this.schemaName[params.index]._id, 'list')
                    }
                  }
                }, ''),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'large',
                    icon: 'ios-compose-outline'
                  },
                  style: {
                    color: '#3352FF',
                    marginRight: '3px',
                    padding: '0px',
                    fontSize: '20px'
                  },
                  on: {
                    click: () => {
                      // console.log(params.index)
                      // console.log(this.schemaName[params.index])
                      // this.$router.push('schema/edit/' + this.schemaName[params.index]._id)
                      this.setData(this.schemaName[params.index].title, '/schema/edit/' + this.schemaName[params.index]._id, this.schemaName[params.index]._id, 'edit')
                    }
                  }
                }, ''),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'large',
                    icon: 'android-delete'
                  },
                  style: {
                    color: '#CC0000',
                    marginRight: '3px',
                    padding: '0px',
                    fontSize: '20px'
                  },
                  on: {
                    click: () => {
                      this.handleRemove(params.index)
                    }
                  }
                }, '')
              ])
            }
          }
        ]
      }
    },
    methods: {
      handleRemove (index) {
        this.$Modal.confirm({
          title: 'Confirm, Are you sure you want to delete?',
          // content: '<p>Are you sure you want to delete?</p>',
          width: 500,
          render: (h, params) => {
            return h('RadioGroup', {
              props: {
                vertical: true,
                value: this.deleteSchemaValue,
                size: 'large'
              },
              style: {
                paddingTop: '20px'
              },
              on: {
                'on-change': (value) => {
                  this.deleteSchemaValue = value
                  console.log('this.deleteSchemaValue', this.deleteSchemaValue)
                  // console.log(this.mongoDt[params.index].isenable);
                }
              }
            }, [
              h('Radio', {
                props: {
                  size: 'large',
                  label: 'harddel'
                }
              }, 'Delete Schema Permanently?? (With all instance Data)'),
              h('Radio', {
                props: {
                  size: 'large',
                  label: 'softdel'
                }
              }, 'Delete Schema Temporary? (Without instance Data)')
            ])
          },
          onOk: () => {
            if (this.deleteSchemaValue === 'softdel') {
              // alert(this.deleteSchemaValue)
              api.request('delete', '/schema/' + this.schemaName[index]._id + '?type=' + this.deleteSchemaValue)
                .then(response => {
                  this.$Notice.success({title: 'Success!!', desc: 'Schema Deleted...'})
                  // this.$store.dispatch('getSchema')

                  // this.schema = response.data
                  // console.log(response.data)
                  // this.schema.splice(index, 1)
                  this.schemaData.splice(index, 1)
                })
                .catch(error => {
                  this.$Notice.error({title: 'Error!!', desc: 'Schema Not Deleted...'})
                  console.log(error)
                })
            } else if (this.deleteSchemaValue === 'harddel') {
              // alert(this.deleteSchemaValue)
              api.request('delete', '/schema/' + this.schemaName[index]._id + '?type=' + this.deleteSchemaValue)
                .then(response => {
                  // this.schema = response.data
                  // this.schema.splice(index, 1)
                })
                .catch(error => {
                  console.log(error)
                })
            } else {
              this.$Message.error('Error!!')
            }
            // api.request('delete', '/schema/' + this.schema[index]._id)
            // .then(response => {
            //   // this.schema = response.data
            //   this.schema.splice(index, 1)
            // })
            // .catch(error => {
            //   console.log(error)
            // })
            // this.formSchema.entity.splice(index, 1)
          },
          onCancel: () => {
            this.deleteSchemaValue = 'softdel'
          }
        })
      },
      setData (name, url, id, type) {
        var obj = {name: name, url: url, id: id, type: type}
        var self = this
        var flag = 0
        // console.log('obj', obj)
        // console.log(this.$store.state.tabdata.length)
        this.$store.state.tabdata.forEach(function (result, i) {
          if (result.id === id && result.type === type) {
            flag = 1
            self.$store.state.activetab = i
            self.$router.push(result.url)
          }
        })
        if (flag === 0) {
          this.$store.dispatch('getTabdata', obj)
          this.$store.state.activetab = this.$store.state.tabdata.length - 1
          this.$router.push(url)
        }
      }
    },
    mounted () {
      schema.get().then(response => {
        console.log(response.data)
        this.schemaName = _.reject(response.data, { 'isdeleted': true })
        // this.schemaData = _.map(this.schemaName, m => {
        //   return {
        //     title: m.title
        //   }
        // })
        this.schemaData = response.data
      })
    }
  }
</script>