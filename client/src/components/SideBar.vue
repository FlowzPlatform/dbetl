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

      <Row style="padding: 10px;" :gutter="16">
        <Col span="8">
          <!-- <Dropdown trigger="click" @on-click='handleCommand' style="margin-left: 20px;">
            <a href="javascript:void(0)" class="list">Sort By
                <Icon type="arrow-down-b"></Icon>
            </a>
            <DropdownMenu slot="list">
                <DropdownItem name="asc">A-Za-z</DropdownItem>
                <DropdownItem name="desc">z-aZ-A</DropdownItem>
            </DropdownMenu>
          </Dropdown> -->
          <Select @on-change="handleCommand" placeholder="Sort By" size="small" style="width:135px;">
            <!-- <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
            <Option value="asc"><span>A-Za-z</span>
              <span style="float:right;">Ascending</span>
            </Option>
            <Option value="desc"><span>z-aZ-A</span>
              <span style="float:right;">Descending</span>
            </Option>
        </Select>
        </Col>
        <Col span="16">
          <Row type="flex" justify="end">
            <Col col="8">
              <Checkbox v-model="groupby" label="groupby" size="small" style="color:#fff;margin-top:5px;">Group By</Checkbox>
            </Col>
            <Col span="8">
              <router-link to="/schema/new">
                <Button type="default" size="small" icon="plus-round">Add</Button>
              </router-link>
            </Col>
          </Row>
        </Col>
      </Row>

      <!-- <Row style="padding: 8px;" :gutter="16">
        <Col span="8">
          <router-link to="/jobs/list">
            <Button type="default" size="default">List Of Jobs</Button>
          </router-link>
        </Col>
      </Row> -->

      <!-- =============== iview Side NAV ================= -->
      <Menu theme="dark" style="max-height:800px; overflow-y: auto" width="auto">
          <Submenu :name="'dbinx'" v-for="(dbObj, dbinx) in allConnData" :key="dbinx">
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
                        <img v-else-if="insObj.imgurl === 'mysql'" :src="mysql" class="schema-icon">
                        <img v-else :src="insObj.imgurl" class="schema-icon">
                      </span>
                      {{insObj.cname}}
                  </template>
                  <MenuItem :name="'dbinx'-'insinx'-'tinx'" v-for="(tObj, tinx) in insObj.inst_data" :key="tinx">
                    <!-- <router-link :to="{ name: 'recordList', params: { id: insObj.inst_id , tname: tObj.t_name}}"> -->
                    <a @click="setData(tObj.t_name, '/recordList/'+insObj.inst_id+'/'+tObj.t_name, dbObj.db, insObj.inst_id, tObj.t_name, 'list')">
                    <span style="padding-left:20px">
                      <!-- <Icon type="play" class="ficon play"></Icon> -->
                      {{tObj.t_name}}
                    </span>
                    </a>
                    <!-- </router-link> -->
                  </MenuItem>
              </Submenu>
          </Submenu>
      </Menu>

      <!-- =============== ElementUI Side NAV ================= -->
      <!-- <el-menu default-active="1" class="el-menu-vertical-demo"  style="max-height:800px; overflow-y: auto" width="auto" @open="handleOpen" @close="handleClose" background-color="#2d2f33" text-color="#fff" active-text-color="#fff">
          <el-submenu :index="'dbinx'" v-for="(dbObj, dbinx) in allConnData">
            <template slot="title">
              <Icon type="cube"></Icon>
              {{dbObj.db}}
            </template>
            <el-submenu :index="dbinx-insinx" v-for="(insObj, insinx) in dbObj.db_data">
              <template slot="title">
                <span style="padding-left:10px">
                    <img v-if="insObj.imgurl === 'mongo'" :src="mongo" class="schema-icon">
                    <img v-else-if="insObj.imgurl === 'rethink'" :src="rethink" class="schema-icon">
                    <img v-else-if="insObj.imgurl === 'elastic'" :src="elastic" class="schema-icon">
                    <img v-else-if="insObj.imgurl === 'nedb'" :src="nedb" class="schema-icon">
                    <img v-else-if="insObj.imgurl === 'mysql'" :src="mysql" class="schema-icon">
                    <img v-else :src="insObj.imgurl" class="schema-icon">
                </span>
                  {{insObj.cname}}
              </template>
              <el-menu-item :index="dbinx-insinx-tinx" v-for="(tObj, tinx) in insObj.inst_data">
                {{tObj.t_name}}
              </el-menu-item>
            </el-submenu>
          </el-submenu>
    </el-menu> -->
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
    methods: {
       handleOpen(key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath)
      },
      init () {
        let self = this
        ConnectionData.get().then(response => {
          // console.log('response', response)
          _.forEach(response.data, (connd, cinx) => {
             _.forEach(connd.db_data, (insd, iinx) => {
              // console.log(insd)
              settings.getThis(insd.inst_id).then(res => {
                insd.cname = res.data.connection_name
                if(res.data.upldIcn == '') {
                  insd.imgurl = res.data.selectedDb
                } else {
                  insd.imgurl = res.data.upldIcn
                }
              })
            }) 
          })
          self.allConnData = response.data
          self.sideBarList = false
        }).catch(error => {
          this.$Notice.error({
            title: error,
            desc: 'connection to the server timed out',
            duration: 0
          })
        })
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
  .menu-item {
    background-color: #2b4c77;
  }
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
    float: right;
    display: none;
  }
  .menu-action-icon > div {
    margin-right:2px;
  }
  .ivu-menu-item:hover .menu-action-icon{
    display: block;
  }
  .ivu-select-dropdown {
    z-index: 905;
  }
</style>
