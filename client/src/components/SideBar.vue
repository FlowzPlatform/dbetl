<template>
  <div class="sidebar">
    <div  style="background: rgb(54, 62, 79); height: 100%; position: fixed;width: inherit;">
    <!--  
      <Row style="padding: 16.3px 10px;border-bottom: 1px solid #15171b;">
        <Col :span="20" :offset="2">
          <Col :span="3">
            <Row type="flex" justify="start" align="middle">
              <a @click="$store.state.sidenavtoggle = !$store.state.sidenavtoggle">
                <Icon type="navicon-round" :size="24"></Icon>
              </a>
            </Row>
          </Col>
          <Col :span="21">
            <Row type="flex" justify="end" align="middle">
              <Tooltip :content="pinNvaigationContent" placement="left">
                <div :style="stylesPin">
                  <a @click="$store.state.sidenavpin = !$store.state.sidenavpin">
                    <Icon type="pin" :size="24" ></Icon>
                  </a>
                </div>
              </Tooltip>
            </Row>
          </Col>
        </Col>
      </Row>
      -->
      <Row v-bar class="vuebar-element">
          <div>
            <div style="padding:0px 15px 0px 15px;">
              <Spin v-if="isSet" size="large" style="align:center"></Spin> 
              <Tree v-else :data="sidebarData" :load-data="loadData" @on-select-change="onSelect" style="overflow: hidden;"></Tree>
            </div>
          </div>
      </Row>
    </div>
  </div>
</template>
<script>
  import databasesModel from '../api/databases'
  import schema from '../api/schema'
  import mongo from '../assets/images/mongo.png'
  import rethink from '../assets/images/rethink.png'
  import elastic from '../assets/images/elasticsearch.png'
  import nedb from '../assets/images/nedb.png'
  import mysql from '../assets/images/mysql.png'
  const _ = require('lodash')
  export default {
    data () {
      return {
        isSet: true,
        sidebarData: [],
        mongo,
        rethink,
        elastic,
        nedb,
        mysql,
        treeData: [],
        buttonProps: {
          type: 'ghost',
          size: 'small'
        }
      }
    },
    created () {
      this.init()
    },
    computed: {
      stylesPin () {
        let style = {}
        if (this.$store.state.sidenavpin) {
          style.transform = 'rotate(90deg)'
        }
        return style
      },
      pinNvaigationContent () {
        return !this.$store.state.sidenavpin ? 'Pin nvaigation' : 'Unpin nvaigation'
      }
    },
    feathers: {
      'databases': {
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
    methods: {
      onSelect (node) {
        // console.log(node)
        this.setData(node[0])
      },
      loadData (item, callback) {
        schema.get(item.id).then(response => {
          // console.log('response.iserror', response)
          if (response.iserror) {
            this.$Notice.error({
              duration: 3,
              title: 'Connection Error',
              desc: 'This database not connect. Please check first database.'
            })
            callback([])
          } else {
            let treeData = _.map(response, m => {
              return {
                title: m.name,
                id: item.id,
                selectedDb: item.selectedDb
              }
            })
            callback(treeData)
          }
        })
      },
      async init () {
        var connections = await databasesModel.get().then(res => {
          return res
        }).catch(e => {
          return []
        })
        this.sidebarData = _.chain(connections).filter({isenable: true}).groupBy('selectedDb').map((m, key) => {
          return {
            title: key,
            render: (h, { root, node, data }) => {
              return h('span', {
                style: {
                  width: '100%',
                  color: '#eee',
                  fontSize: '13px'
                }
              }, [
                h('span', [
                  h('img', {
                    attrs: {
                      src: this[data.title]
                    },
                    style: {
                      marginRight: '4px',
                      marginLeft: '4px',
                      width: '16px',
                      height: '16px'
                    }
                  }),
                  h('span', {
                    class: {
                      'ivu-tree-title': true
                    }
                  }, data.title)
                ])
              ])
            },
            children: _.map(m, childM => {
              return _.assign(childM, {
                title: childM.connection_name,
                loading: false,
                render: (h, { root, node, data }) => {
                  return h('span', {
                    style: {
                      width: '100%',
                      color: '#eee',
                      fontSize: '13px'
                    }
                  }, [
                    h('span', [
                      h('img', {
                        attrs: {
                          src: data.imgurl ? data.imgurl : this[data.selectedDb]
                        },
                        style: {
                          marginRight: '4px',
                          marginLeft: '4px',
                          width: '16px',
                          height: '16px'
                        }
                      }),
                      h('span', {
                        class: {
                          'ivu-tree-title': true
                        }
                      }, data.title)
                    ])
                  ])
                },
                children: []
              })
            })
          }
        }).value()
        this.isSet = false
      },
      setData (obj) {
        var url = '/recordList/' + obj.id + '/' + obj.title
        var id = obj.selectedDb + obj.id + obj.title
        var sobj = {name: obj.title, url: url, id: obj.title, type: 'list'}
        var self = this
        var flag = 0
        // console.log('obj', obj)
        // console.log(this.$store.state.tabdata.length)
        this.$store.state.tabdata.forEach(function (result, i) {
          if (result.id === id && result.type === 'list') {
            flag = 1
            self.$store.state.activetab = i
            self.$router.push(result.url)
          }
        })
        if (flag === 0) {
          this.$store.dispatch('getTabdata', sobj)
          this.$store.state.activetab = this.$store.state.tabdata.length - 1
          this.$router.push(url)
        }
      }
    }
  }
</script>
<style lang="less">
  .vuebar-element {
    height: ~"calc(100vh - 60px)";
  }
  .sidebar {
    width: inherit;
    .ivu-tree-arrow {
      color: #eee;
      font-size: 18px;
    }
    .ivu-tree-title {
      color: #eee;
      font-size: 13px; 
      vertical-align: text-bottom;
    }
    .ivu-tree-title:hover {
      color: #ffd04b;
      background-color: #576075;
    }
    .ivu-tree-title-selected {
      color: #ffd04b;
      background-color: rgb(54, 62, 79); 
    }
    .ivu-tree-title-selected:hover {
      background-color: #576075; 
    }
    .ivu-tree-action {
      display: none;
      float: right;
      margin-right: 32px;
    }
    .ivu-tree-children > li:hover > .ivu-tree-action  {
      display: block;
    }
    .ivu-tree-empty {
      color: #eee;
      font-size: 16px;
      text-align: center;
      margin-top: 10px;
    }
  }
  
</style>
