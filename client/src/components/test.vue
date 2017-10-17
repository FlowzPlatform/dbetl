<template>
  <div class="test">
    <Row>
        <!-- <Table border :columns="columns5" :data="data5" size="small"></Table> -->
        <!-- {{row}}
        <table border="1">
          <tr>
            <td v-for="r in row">
              <div v-if="checkArr(r)">
                {{r[0]}}
                <test :row="getNewArray(r[0])"></test>
              </div>
            </td>
          </tr>
        </table> -->
        
        
          <div class="schema-form ivu-table-wrapper" >
            <div class="ivu-table ivu-table-border">
              <div class="ivu-table-body">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <thead>
                    <tr>
                      <!-- <th>
                          <div class="ivu-table-cell-expand ivu-table-cell-expand-expanded" style="width:20px;margin-left:10px;"><i class="ivu-icon ivu-icon-ios-arrow-right"></i></div> 
                      </th> -->
                      <th class="" v-for="item in getColumn(row)" style="text-align:center;">
                        <div class="ivu-table-cell">                    
                          <span>{{item}}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="ivu-table-tbody">
                    <!-- <template v-for="r in row"> -->
                      <tr class="ivu-table-row" > 
                      <!-- <td> 
                      <div class="ivu-table-cell-expand ivu-table-cell-expand-expanded" style="width:20px;margin-left:10px"><i class="ivu-icon ivu-icon-ios-arrow-right"></i></div> 
                      </td>  -->              
                        <td class="" v-for="item in getData(row)" style="text-align:center;">
                          <div class="ivu-table-cell" v-if="checkArr(item)">
                            <div v-for="obj in getNewArray(item)">
                              <test :row="obj"></test>
                            </div>
                          </div>
                          <div v-else>
                            {{item}}
                          </div>
                        </td>   
                      </tr>
                    <!-- </template> -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        
        
    </Row>
  </div>
</template>

<script>
/*eslint-disable*/
import Test from './test'
import _ from 'lodash'

  export default {
    name: 'test',
    props: ['row'],
    components: {
      'test': Test
      // draggable
    },
    computed: {
      columns5 () {
        var obj = []
        _.forEach(this.row, function (v, k) {
          if (k === 'id' || k === '_id' || k === 'Schemaid' || k === 'database' || k === '_index' || k === '_rowKey') {
          } else {
            obj.push({title: k, key: k})
          }
        })
        console.log('obj', obj)
        return obj
      },
      data5 () {
        var obj = {}
        _.forEach(this.row, function (v, k) {
          if (!(k === 'id' || k === '_id' || k === 'Schemaid' || k === 'database' || k === '_index' || k === '_rowKey')) {
            obj[k] = v
          }
            // self.columns5.push({title: k, key: k})
        })
        return obj
      }
    },
    methods: {
      getColumn (obj) {
        var cols = []
        _.forEach(obj, function (v, k) {
          if (k === 'id' || k === '_id' || k === 'Schemaid' || k === 'database' || k === '_index' || k === '_rowKey') {
          } else {
            cols.push(k)
          }
        })
        return cols
        // var keys = _.keys(obj)
        // _.forEach(keys, (k, i) => {
        //   // console.log('>>>>>>>>>>>>>>>>>>>>>>>>',k, i)
        //   if (k === 'id' || k === '_id' || k === 'Schemaid' || k === 'database') {
        //     // console.log('index', _.findIndex(keys, k))
        //     keys.splice(i, 1)
        //   }
        // })
        // console.log("keys",keys)
        // return keys
      },
      getData (obj) {
        var data = []
        _.forEach(obj, function (v, k) {
          if (k === 'id' || k === '_id' || k === 'Schemaid' || k === 'database' || k === '_index' || k === '_rowKey') {
          } else {
            data.push(v)
          }
        })
        return data
        console.log("!!!!!!!!!!!!!!!!!!!")
      },
      getNewArray (obj) {
        if (typeof obj === 'string') {
          obj = {'name': obj}
        }
        return obj
        // console.log('new obj', JSON.stringify(obj))
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
<style type="text/css">
  .ivu-table table {
    table-layout: inherit;
  }
</style>