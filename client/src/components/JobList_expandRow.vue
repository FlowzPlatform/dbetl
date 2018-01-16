<template>
    <div>
      <Tabs>
        <TabPane label="Source / Destination" name="source_destination">
          <Row type="flex" justify="space-around">
            <Col span="11">
              <Card>
                <p slot="title">Source</p>
                <p>
                  <span class="small-head">DB: </span> 
                  <span class="text">{{row.data.source.selectedDb}}</span>
                </p>
                <p>
                  <span class="small-head">Database Name: </span>
                  <span class="text">{{row.data.source.dbname}}</span>
                </p>
                <p>
                  <span class="small-head">Host: </span>
                  <span class="text">{{row.data.source.host}}</span>
                </p>
                <p>
                  <span class="small-head">Port: </span>
                  <span class="text">{{row.data.source.port}}</span>
                </p>
              </Card>
            </Col>
            <Col span="11">
              <Card>
                <p slot="title">Destination</p>
                <p>
                  <span class="small-head">DB: </span> 
                  <span class="text">{{row.data.target.selectedDb}}</span>
                </p>
                <p>
                  <span class="small-head">Database Name: </span>
                  <span class="text">{{row.data.target.dbname}}</span>
                </p>
                <p>
                  <span class="small-head">Host: </span>
                  <span class="text">{{row.data.target.host}}</span>
                </p>
                <p>
                  <span class="small-head">Port: </span>
                  <span class="text">{{row.data.target.port}}</span>
                </p>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="Mapping" name="mapping">
          <Table :columns="mappingColumns" :data="mappingRow" size="small"></Table>
        </TabPane>
      </Tabs>
    </div>
</template>
<script>
  let moment = require('moment')
  import _ from 'lodash'
  import Vue from 'vue'
  export default {
    name: 'JobList_expandRow',
    props: {
      row: Object
    },
    data () {
      return {
        mappingRow: Vue.util.extend([], this.row.data.mapdata),
        test: true,
        mappingColumns: [{
          type: 'expand',
          width: 40,
          render: (h, params) => {
            return h('div', [
              h('Table', {
                props: {
                  columns: [{
                    title: 'Source Fields',
                    key: 'input'
                  }, {
                    title: 'Destination Fields',
                    key: 'name'
                  }, {
                    title: 'Transform',
                    key: 'transform',
                    align: 'center',
                    width: 100,
                    ellipsis: true,
                    render: (h, params) => {
                      return h('div', [
                        h('Button', {
                          props: {
                            type: 'text',
                            size: 'small'
                          },
                          style: {
                            marginRight: '5px'
                          },
                          on: {
                            click: () => {
                              this.$Modal.confirm({
                                render: (h) => {
                                  return h('codemirror', {
                                    props: {
                                      value: 'return abc;', // params.row.transform,
                                      options: {
                                        tabSize: 2,
                                        styleActiveLine: true,
                                        lineNumbers: true,
                                        line: true,
                                        mode: 'text/javascript',
                                        lineWrapping: true,
                                        theme: 'base16-light',
                                        readOnly: true,
                                        height: '100px'
                                      }
                                    }
                                  })
                                }
                              })
                            }
                          }
                        }, [
                          h('Icon', {
                            props: {
                              type: 'eye'
                            }
                          })
                        ])
                      ])
                    }
                  }],
                  data: params.row.colsData
                }
              })
            ])
          }
        }, {
          title: 'Source Table',
          key: 'source'
        }, {
          title: 'Destination Table',
          key: 'target'
        }, {
          title: 'Field Mapping',
          key: '_expanded',
          width: 150,
          render: (h, params) => {
            var self = this
            // <Icon type="eye"></Icon>
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: (e) => {
                    self.mappingRow[0]._expanded = !self.mappingRow[0]._expanded
                    let temp = _.clone(self.mappingRow)
                    self.mappingRow = temp
                  }
                }
              }, 'Click Here')
            ])
          }
        }],
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
  .small-head{
    font-size: 12px; font-weight: bold; color: rgb(70, 76, 91);
  }
  .text {
     font-size: 12px; color: rgb(101, 113, 128);
  }
</style>
