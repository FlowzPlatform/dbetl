<template>
  <div style="width: inherit;">
    <div  style="background: rgb(54, 62, 79); height: 100%; position: fixed;width: inherit;">
    <!--  -->
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

      <Row style="padding-left: 15px;max-height:1000px; overflow-y: auto">  
        <Tree :data="sidebarData" :load-data="loadData" @on-select-change="onSelect" @on-toggle-expand="toggleExpand"></Tree>
      </Row>
    </div>
  </div>
</template>
<script>
  import databases from '../api/databases'
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
        orderby: 'asc',
        groupby: true,
        sideBarList: true,
        allConnData: [],
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
        // deleteSchemaValue: 'softdel'
      }
    },
    created () {
      // for connectiondata api 'init'
      // this.init()
      // for databases api
      this.startMethod()
      this.$store.dispatch('getSchema')
      this.$store.dispatch('getSettings')
    },
    computed: {
      // },
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
      'settings': {
        updated (data) {
          // console.log('connectiondata updated..', data)
          // this.init()
        },
        created (data) {
          // console.log('connectiondata created..', data)
          // this.init()
        },
        removed (data) {
          // console.log('connectiondata removed..', data)
          // this.init()
        }
      }
    },
    methods: {
      onSelect (node) {
        // console.log(tname)
        // this.setData(data.title, '/recordList/'+iObj.inst_id+'/'+tObj.t_name, mObj.db, iObj.inst_id, tObj.t_name, 'list')
      },
      loadData (item, callback) {
        console.log('item', item)
      },
      async toggleExpand (node) {
        if (node.hasOwnProperty('id') && node.expand) {
          // console.log('toggleExpand', node)
          var data = await schema.get(node.id).then(res => {
            console.log('response', res)
            return res.data
          }).catch(err => {
            console.log('Error', err)
            return []
          })
          if (data.hasOwnProperty('iserror')) {
            this.$Notice.error({duration: 3, title: 'Connection Error', desc: JSON.stringify(data.msg)})
          } else {
            var _mdata = _.map(data, (d) => {
              return {title: d.name, id: node.id, selectedDb: node.selectedDb}
            })
            console.log('this.sidebarData', this.sidebarData)
            var dbkey = _.findKey(this.sidebarData, {title: node.selectedDb})
            var iKey = _.findKey(this.sidebarData[dbkey].children, {id: node.id})
            // console.log(iKey)

            this.sidebarData[dbkey].children[iKey].children = _mdata
          }
          console.log('schema api data', data)
        }
      },
      AddRecord (db, instId, tname) {
        this.$router.push('/' + instId + '/' + tname + '/new')
      },
      getIndex (a, b, c) {
        if (a !== undefined) {
          if (b !== undefined) {
            if (c !== undefined) {
              a = a.toString()
              b = b.toString()
              c = c.toString()
              return a + '-' + b + '-' + c
            }
            a = a.toString()
            b = b.toString()
            return a + '-' + b
          }
          a = a.toString()
          return a
        }
      },
      async startMethod () {
        var mdata = await databases.get().then(res => {
          return res.data.data
        }).catch(e => {
          return []
        })
        // console.log('mdata', mdata)
        var fdata = _.filter(mdata, {isenable: true})
        var s = _.groupBy(fdata, (d) => {
          return d.selectedDb
        })
        this.sidebarData = []
        for (let key in s) {
          var makeobj = {}
          makeobj.title = key
          makeobj.render = (h, { root, node, data }) => {
            return h('span', {
              style: {
                width: '100%',
                color: '#eee',
                fontSize: '18px'
              }
            }, [
              h('span', [
                h('img', {
                  attrs: {
                    src: this[data.title]
                  },
                  style: {
                    marginRight: '8px',
                    marginLeft: '8px',
                    width: '20px',
                    height: '20px'
                  }
                }),
                h('span', {
                  class: {
                    'ivu-tree-title': true
                  }
                }, data.title)
              ])
            ])
          }
          for (let item of s[key].entries()) {
            item.title = item.connection_name
            item.imgurl = item.selectedDb
            item.render = (h, { root, node, data }) => {
              var setIcon = ''
              if (data.imgurl === 'mongo') {
                setIcon = this.mongo
              } else if (data.imgurl === 'rethink') {
                setIcon = this.rethink
              } else if (data.imgurl === 'elastic') {
                setIcon = this.elastic
              } else if (data.imgurl === 'nedb') {
                setIcon = this.nedb
              } else if (data.imgurl === 'mysql') {
                setIcon = this.mysql
              } else {
                setIcon = data.imgurl
              }
              return h('span', {
                style: {
                  width: '100%',
                  color: '#eee',
                  fontSize: '18px'
                }
              }, [
                h('span', [
                  h('img', {
                    attrs: {
                      src: setIcon
                    },
                    style: {
                      marginRight: '8px',
                      marginLeft: '8px',
                      width: '20px',
                      height: '20px'
                    }
                  }),
                  h('span', {
                    class: {
                      'ivu-tree-title': true
                    }
                  }, data.title)
                ])
              ])
            }
            item.children = [{title: ''}]
          }
          makeobj.children = s[key]
          this.sidebarData.push(makeobj)
        }
        console.log('this.sidebarData', this.sidebarData)
      },
      setData (name, url, db, instId, tname, type) {
        var id = db + instId + tname
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
    }
  }
</script>

<style>
  /*.menu-item {
    background-color: #2b4c77;
  }*/
  .ficon {
    font-size: 16px;
  }
  .play {
    color:#00C851;
  }
  .play: hover {
    color:#00C851;
  }
  .list {
    color:#ffbb33;
  }
  .edit {
    color:#2BBBAD;
    font-weight:800;
  }
  .delete {
    color: #CC0000;
  }
  .transform {
    color: #00C851;
  }
  .el-dropdown-menu__item {
    text-align: center;
  }
 /* .ivu-menu-vertical .ivu-menu-item, .ivu-menu-vertical .ivu-menu-submenu-title{
    position: initial;
  }*/
  .schema-icon {
    width: 16px;
    height: 16px;
    margin-right:5px;
  }
  .menu-action-icon {
    /*float: right;*/
    /*display: none;*/
  }
  .menu-action-icon > div {
    /*margin-right:2px;*/
  }
  .ivu-menu-item:hover .menu-action-icon{
    /*display: block;*/
  }

  /* element-ui sidebar*/
  .el-submenu__title {
    color: #eee;
    background-color: rgb(54, 62, 79);
  }
  .el-submenu__title:hover {
    color: #ffd04b;
    background-color: #495060;
  }
  .el-menu-item {
    color: #fff;
    background: #495060; 
  }
  .el-submenu .el-menu-item:hover, .el-submenu__title:hover {
    color: #ffd04b;
    background-color: #576075;
  }
  .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active {
    color: #ffd04b;
    background-color: #576075;
    border-right: 2px solid #ffd04b;
  }
  /*.el-menu {
    color: black;
    background-color: black;
  }*/
  .el-menu-item * {
    vertical-align: unset;
  }

  /* i-tree sidebar */ 
  .ivu-tree-arrow {
    color: #eee;
    font-size: 18px;
  }
  .ivu-tree-title {
    color: #eee;
    font-size: 18px; 
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

  .myHover {
    background: red;
  }

  .ivu-tree-action {
    display: none;
    float: right;
    margin-right: 32px;
  }

  .ivu-tree-children > li:hover > .ivu-tree-action  {
    display: block;
  }

  .icon-grid {
    margin-right: 6px;
    margin-left: 8px;
    width: 20px;
    height:20px;
    color: #eee;
    font-size: 18px;
    padding-top: 3px;
  }

</style>
