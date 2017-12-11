<template>
  <div style="width: inherit;">
    <div  style="background: rgb(54, 62, 79); height: 100%; position: fixed;width: inherit;">
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

      <!-- =============== iview Side NAV ================= -->
      <!-- <Menu theme="dark" style="max-height:800px; overflow-y: auto" width="auto">
          <Submenu v-if="dbObj.db_data.length != 0" :name="'dbinx'" v-for="(dbObj, dbinx) in allConnData" :key="dbinx">
              <template slot="title">
                  <Icon type="cube"></Icon>
                  {{dbObj.db}}
              </template>
              <Submenu :name="'dbinx'-'insinx'" v-for="(insObj, insinx) in dbObj.db_data" :key="insinx">
                  <template slot="title">
                      <span style="padding-left:10px">
                        <img v-if="insObj.imgurl === 'mongo'" :src="mongo" class="schema-icon">
                        <img v-else-if="insObj.imgurl === 'rethink'" :src="rethink" class="schema-icon">
                        <img v-else-if="insObj.imgurl === 'elastic'" :src="elastic" class="schema-icon">
                        <img v-else-if="insObj.imgurl === 'nedb'" :src="nedb" class="schema-icon">
                        <img v-else-if="insObj.imgurl === 'mysql'" :src="mysql" style="width:25px;height:25px" class="schema-icon">
                        <img v-else :src="insObj.imgurl" class="schema-icon">
                      </span>
                      {{insObj.cname}}
                  </template>
                  <MenuItem :name="'dbinx'-'insinx'-'tinx'" v-for="(tObj, tinx) in insObj.inst_data" :key="tinx">
                    <a @click="setData(tObj.t_name, '/recordList/'+insObj.inst_id+'/'+tObj.t_name, dbObj.db, insObj.inst_id, tObj.t_name, 'list')">
                    <span style="padding-left:20px">
                      {{tObj.t_name}}
                    </span>
                    </a>
                    <span class="menu-action-icon">
                      <Tooltip content="Add record" placement="top">
                          <a @click="AddRecord(dbObj.db, insObj.inst_id, tObj.t_name)">
                              <Icon type="play" class="ficon play"></Icon>
                          </a>
                      </Tooltip>
                    </span>
                  </MenuItem>
              </Submenu>
          </Submenu>
      </Menu> -->

      <!-- =============== ElementUI Side NAV ================= -->
      <el-row>
        <el-menu default-active="0" class="el-menu-vertical-demo"  style="max-height:800px; overflow-y: auto" width="auto" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu :index="getIndex(dbinx)" :key="dbinx" v-for="(dbObj, dbinx) in allConnData">
              <template slot="title">
                <Icon type="cube"></Icon>
                &nbsp;&nbsp;{{dbObj.db}}
              </template>
              <el-submenu :index="getIndex(dbinx, insinx)" :key="insinx" v-for="(insObj, insinx) in dbObj.db_data">
                <template slot="title">
                  <span style="padding-left:0px">
                      <img v-if="insObj.imgurl === 'mongo'" :src="mongo" class="schema-icon">
                      <img v-else-if="insObj.imgurl === 'rethink'" :src="rethink" class="schema-icon">
                      <img v-else-if="insObj.imgurl === 'elastic'" :src="elastic" class="schema-icon">
                      <img v-else-if="insObj.imgurl === 'nedb'" :src="nedb" class="schema-icon">
                      <img v-else-if="insObj.imgurl === 'mysql'" :src="mysql" class="schema-icon">
                      <img v-else :src="insObj.imgurl" class="schema-icon">
                  </span>
                    {{insObj.cname}}
                </template>
                <el-menu-item :index="getIndex(dbinx, insinx, tinx)" :key="tinx" v-for="(tObj, tinx) in insObj.inst_data" @click="setData(tObj.t_name, '/recordList/'+insObj.inst_id+'/'+tObj.t_name, dbObj.db, insObj.inst_id, tObj.t_name, 'list')">
                    {{tObj.t_name}}
                    <span style="float:right">
                      <el-tooltip content="Add record" placement="top">
                          <a @click="AddRecord(dbObj.db, insObj.inst_id, tObj.t_name)">
                              <!-- <i class="el-icon-caret-right ficon play"></i> -->
                              <Icon type="play" class="ficon play"></Icon>
                          </a>
                      </el-tooltip>
                    </span> 
                </el-menu-item>
              </el-submenu>
            </el-submenu>
        </el-menu>
      </el-row>
    </div>
  </div>
</template>
<script>
/*eslint-disable*/
  import ConnectionData from '../api/connectiondata'
  import settings from '../api/settings'
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
        mongo,
        rethink,
        elastic,
        nedb,
        mysql,
        // deleteSchemaValue: 'softdel'
      }
    },
    created () {
      this.init()
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
      AddRecord (db, inst_id, tname) {
        // console.log(db, inst_id, tname)
        this.$router.push('/' + inst_id + '/' + tname + '/new')
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
      // handleOpen(key, keyPath) {
      //   console.log(key, keyPath)
      // },
      // handleClose(key, keyPath) {
      //   console.log(key, keyPath)
      // },
      async init () {
        let self = this
        var mdata = await ConnectionData.get().then(response => {
          return response
        }).catch(error => {
          this.$Notice.error({
            title: error,
            desc: 'connection to the server timed out',
            duration: 3
          })
          return []
        })
        for (let [cinx, connd] of mdata.data.entries()) {
          for (let [iinx, insd] of connd.db_data.entries()) {
            var res = await settings.getThis(insd.inst_id).then(res => {
              return res
            }).catch(err => {
              return []
            })
            insd.cname = res.data.connection_name
            if(res.data.upldIcn == '') {
              insd.imgurl = res.data.selectedDb
            } else {
              insd.imgurl = res.data.upldIcn
            }
          }
        }
        self.allConnData = mdata.data
        self.sideBarList = false
      },
      handleCommand (name) {
        this.orderby = name
      },
      setData (name, url, db, inst_id, tname, type) {
        var id = db + inst_id + tname
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
</style>
