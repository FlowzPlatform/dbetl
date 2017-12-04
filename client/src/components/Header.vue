<template>
    <Menu mode="horizontal" :theme="'primary'">
        <Row type="flex">
        <Col :span="1" v-if="toggeleEnable">
            <Row type="flex" justify="end" align="middle">
              <span @click="$store.state.sidenavtoggle = !$store.state.sidenavtoggle">
                <Icon type="navicon-round" :size="32" style="line-height: inherit;cursor:pointer"></Icon>
              </span>
            </Row>
        </Col>
        <i-col :span="5">
            <div class="f-logo">
                <img src="../assets/images/logo.png" style="width:100%;vertical-align: inherit;">
            </div>
        </i-col>
        <i-col :span="18">
            <Row type="flex" justify="end">
                <div class="layout-nav">
                    <Menu-item name="1">
                        <router-link to="/schemaList">
                            <Icon type="navicon-round" :size="14"></Icon>
                            Schema
                        </router-link>
                    </Menu-item>
                    <Menu-item name="2">
                        <router-link to="/db">
                            <Icon type="gear-b" :size="14"></Icon>
                            Settings
                        </router-link>
                    </Menu-item>
                    <Menu-item name="3">
                      <Submenu name="1">
                        <template slot="title">
                          <Icon type="person" :size="16"></Icon>
                          {{$store.state.user === null ? 'Guest' : $store.state.user.email}}
                        </template>
                        <Menu-item name="1-1">
                            <a @click="handleLogout()">
                                <Icon type="ios-locked-outline" :size="16"></Icon>
                                Logout
                            </a>
                        </Menu-item>
                    </Submenu>
                    </Menu-item>
                </div>
                </Row>
        </i-col>
        </Row>
    </Menu>
</template>
<script>
/*eslint-disable*/
import psl from 'psl'
  export default {
    computed: {
      toggeleEnable () {
        return !this.$store.state.sidenavpin || (!this.$store.state.sidenavtoggle)
      },
      user () {
          return {emailId: 'test'}
      }
    },
    methods:{
      handleLogout () {
        let location = psl.parse(window.location.hostname)
        location = location.domain === null ? location.input : location.domain
        this.$cookie.delete('auth_token', {domain: location});
        this.$store.commit('SET_TOKEN', null)
        this.$store.commit('SET_USER', null)
        this.$router.push('Login')
      }
    }
  }
</script>>
