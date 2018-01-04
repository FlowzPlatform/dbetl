<template>
  <div class="erow_instancelist">
      <Row>
        <!-- <Table border :columns="columns5" :data="data5" size="small"></Table> -->
        {{row}}
        <table border="1">
          <tr>
            <td v-for="r in row">
              <div v-if="checkArr(r)">
                {{r[0]}}
                <erow-instancelist :row="getNewArray(r[0])"></erow-instancelist>
              </div>
            </td>
          </tr>
        </table>
        <!-- <div class="schema-form ivu-table-wrapper">
          <div class="ivu-table ivu-table-border">
              <div class="ivu-table-body">
                  <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                      <thead>
                          <tr>
                              <th class="" v-for="item in columns5">
                                  <div class="ivu-table-cell">
                                      <span>{{item.title}}</span>
                                  </div>
                              </th>
                          </tr>
                      </thead>
                      <tbody class="ivu-table-tbody">
                          <tr class="ivu-table-row">
                              <td class="" v-for="item in columns5">
                                  <div v-if="checkArr(data5[item.key])">
                                      <expandRow :row="data5[item.key][0]"></expandRow>
                                  </div> 
                                  <div v-else class="ivu-table-cell">
                                    {{data5[item.key]}}
                                  </div>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
        </div> -->
      </Row>
  </div>
</template>
<script>

import erowInstancelist from './erow_instancelist.vue'
// var _ = require('lodash')
export default {
  name: 'erowInstancelist',
  components: {
    'erow-instancelist': erowInstancelist
  },
  props: ['row'],
  created () {
    console.log('row', JSON.stringify(this.row.Add_line[0]))
  },
  // computed: {
  //   columns5 () {
  //     var obj = []
  //     _.forEach(this.row, function (v, k) {
  //       if (k === 'id' || k === '_id' || k === 'Schemaid' || k === 'database' || k === '_index' || k === '_rowKey') {
  //       } else {
  //         obj.push({title: k, key: k})
  //       }
  //     })
  //     console.log('obj', obj)
  //     return obj
  //   },
  //   data5 () {
  //     var obj = {}
  //     _.forEach(this.row, function (v, k) {
  //       if (!(k === 'id' || k === '_id' || k === 'Schemaid' || k === 'database' || k === '_index' || k === '_rowKey')) {
  //         obj[k] = v
  //       }
  //         // self.columns5.push({title: k, key: k})
  //     })
  //     return obj
  //   }
  // },
  methods: {
    getNewArray (obj) {
      if (typeof obj === 'string') {
        obj = {'name': obj}
      }
      return obj
    },
    checkArr (obj) {
      // alert(obj)
      if (Array.isArray(obj)) {
        // alert('TRUE')
        return true
      } else {
        // alert('FALSE')
        return false
      }
    }
  }
}
</script>
<style>
    .expand-row{
        margin-bottom: 16px;
    }
</style>