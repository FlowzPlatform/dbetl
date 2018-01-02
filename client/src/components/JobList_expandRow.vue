<template>
    <div>
        <div class="ivu-tabs-tabpane">
          <div class="ivu-table-wrapper">
            <div class="ivu-table ivu-table-small">
              <div class="ivu-table-header">
                <table cellspacing="0" cellpadding="0" border="1" style="width:100%;">
                  <colgroup>
                    <col width="200">
                    <col width="800">
                  </colgroup>
                    <tr>
                      <th class="">
                        <div class="ivu-table-cell">
                          <span>Job Finished</span>
                        </div>
                      </th>
                      <td class="">
                        <div class="ivu-table-cell">
                          <span>{{getFinishDate(row.dateFinished)}}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th class="">
                        <div class="ivu-table-cell">
                          <span>Source Connection</span>
                        </div>
                      </th>
                      <td class="">
                        <table cellspacing="0" cellpadding="0" style="width: 100%;" border="1">
                          <colgroup>
                            <col width="20">
                            <col width="20">
                            <col width="20">
                            <col width="20">
                          </colgroup>
                          <thead>
                            <tr>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>DB</span>
                              </div>
                            </th>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>Databasename</span>
                              </div>
                            </th>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>Host</span>
                              </div>
                            </th>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>Port</span>
                              </div>
                            </th>
                           </tr>
                         </thead>
                         <tbody class="ivu-table-tbody">
                         <tr class="ivu-table-row">
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.source.selectedDb}}
                             </div>
                           </td>
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.source.dbname}}
                             </div>
                           </td>
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.source.host}}
                             </div>
                           </td>
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.source.port}}
                             </div>
                           </td>
                         </tr>
                       </tbody>
                      </table>
                      </td>
                    </tr>
                    <tr>
                      <th class="">
                        <div class="ivu-table-cell">
                          <span>Target Connection</span>
                        </div>
                      </th>
                      <td class="">
                        <table cellspacing="0" cellpadding="0" style="width: 100%;" border="1">
                          <colgroup>
                            <col width="20">
                            <col width="20">
                            <col width="20">
                            <col width="20">
                            <col width="20">
                          </colgroup>
                          <thead>
                            <tr>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>DB</span>
                              </div>
                            </th>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>Connection Name</span>
                              </div>
                            </th>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>Databasename</span>
                              </div>
                            </th>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>Host</span>
                              </div>
                            </th>
                            <th class="">
                              <div class="ivu-table-cell">
                                <span>Port</span>
                              </div>
                            </th>
                           </tr>
                         </thead>
                         <tbody class="ivu-table-tbody">
                         <tr class="ivu-table-row">
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.target.selectedDb}}
                             </div>
                           </td>
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.target.connection_name}}
                             </div>
                           </td>
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.target.dbname}}
                             </div>
                           </td>
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.target.host}}
                             </div>
                           </td>
                           <td class="">
                             <div class="ivu-table-cell">
                              {{row.data.target.port}}
                             </div>
                           </td>
                         </tr>
                       </tbody>
                      </table>
                      </td>
                    </tr>
                    <tr>
                      <th class="">
                        <div class="ivu-table-cell">
                          <span>Mapping</span>
                        </div>
                      </th>
                      <td class="">
                        <!-- <div class="ivu-table-cell"> -->
                          <div class="ivu-tabs-tabpane">
                            <div class="ivu-table-wrapper">
                              <div class="ivu-table ivu-table-small">
                                <div class="ivu-table-header">
                                  <table cellspacing="0" cellpadding="0" border="1" style="width:100%;">
                                    <!-- <colgroup>
                                      <col width="40">
                                      <col width="40">
                                      <col width="20">
                                    </colgroup> -->
                                    <thead>
                                      <tr>
                                        <th class="">
                                          <div class="ivu-table-cell">
                                            <span>Source Table</span>
                                          </div>
                                        </th>
                                        <th class="">
                                          <div class="ivu-table-cell">
                                            <span>Destination Table</span>
                                          </div>
                                        </th> 
                                        <th class="">
                                          <div class="ivu-table-cell">
                                            <span>Field Mapping</span>
                                          </div>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody class="ivu-table-tbody">
                                      <template v-for="(obj, index) in row.data.mapdata" >
                                        <tr class="ivu-table-row">
                                          <td class="">
                                            <div class="ivu-table-cell">
                                              {{obj.source}}
                                            </div>
                                          </td>
                                          <td class="">
                                            <div class="ivu-table-cell">
                                              {{obj.target}}
                                            </div>
                                          </td>
                                          <td class="">
                                            <div class="ivu-table-cell">
                                              <a v-if="obj.colsData.length != 0" @click="openTrasformEditor(index)"> Click Here</a>
                                            </div>
                                          </td>
                                        </tr>
                                        <tr v-if="openTrasformEditorIndex === index" class="ivu-table-row">
                                          <td colspan="3" style="padding: 15px 100px 15px 100px; background-color:#eee;">
                                            <!-- {{tableData[index].source}} -->
                                            <div class="ivu-table-wrapper">
                                              <div class="ivu-table ivu-table-small">
                                                  <div class="ivu-table-header">
                                                      <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                                          <!-- <colgroup> -->
                                                              <!-- <col width="10"> -->
                                                                  <!-- <col width="50"> -->
                                                                      <!-- <col width="50"> -->
                                                                          <!-- <col width="25"> -->
                                                          <!-- </colgroup> -->
                                                          <thead>
                                                              <tr>
                                                                  <th class="" style="background-color:#f8f8f9; color:#394263;font-size:13px">
                                                                      <div class="ivu-table-cell">
                                                                          <span> Source Fields</span>
                                                                      </div>
                                                                  </th>
                                                                  <th class="" style="background-color:#f8f8f9; color:#394263;font-size:13px">
                                                                      <div class="ivu-table-cell">
                                                                          <span> Destinstion Fields (name / input)</span>
                                                                      </div>
                                                                  </th>
                                                              </tr>
                                                          </thead>
                                                          <tbody class="ivu-table-tbody">
                                                              <template v-for="(record, inx) in row.data.mapdata[index].colsData">
                                                                  <tr class="ivu-table-row">
                                                                      <td class="">
                                                                          <div class="ivu-table-cell">
                                                                              <span>{{record.name}}</span>
                                                                          </div>
                                                                      </td>
                                                                      <td class="">
                                                                          <div class="ivu-table-cell">
                                                                            <span>{{record.name}} <b>/</b> {{record.input}} </span>
                                                                          </div>
                                                                      </td>
                                                                  </tr>
                                                              </template>
                                                          </tbody>
                                                      </table>
                                                  </div>
                                              </div>
                                              </div>
                                          </td>
                                        </tr>
                                      </template>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        <!-- </div> -->
                      </td>
                    </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
  let moment = require('moment')
  export default {
    name: 'JobList_expandRow',
    props: {
      row: Object
    },
    data () {
      return {
        openTrasformEditorIndex: -1
      }
    },
    methods: {
      openTrasformEditor (index) {
        if (this.openTrasformEditorIndex === index) {
          this.openTrasformEditorIndex = -1
          return false
        }
        this.openTrasformEditorIndex = index
      },
      getFinishDate (date) {
        return moment(date).format('MMMM Do YYYY, h:mm:ss a')
      }
    },
    mounted () {
    }
  }
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
