<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">
                   <Table border :columns="schemaCols" :data="schemaData"></Table>
                </span>
            </Col>
        </Row>
    </div>
</template>
<script>
import schema from '../api/schema'
import _ from 'lodash'
import Emitter from '@/mixins/emitter'
export default {
  name: 'table-expand',
  mixins: [ Emitter ],
  data () {
    return {
      newdata: [],
      schemaCols: [
        {
          title: 'Select',
          key: 'checked',
          width: 80,
          align: 'center',
          render: (h, params) => {
            // this.schemaData[params.index]['checked'] = true
            // console.log('params', params)
            // params.row.checked = true
            return h('Checkbox', {
              props: {
                value: params.row.checked
              },
              on: {
                'on-change': (value) => {
                  this.schemaData[params.index].checked = value
                  this.dispatch('Settings', 'on-schema-change', { db: this.db, index: this.index, value: _.filter(this.schemaData, (f) => { return f.checked }).length > 0 })
                  // this.checked = false
                  if (value === true) {
                    this.selectSchema.push(this.schemaData[params.index])
                    console.log('-->', this.selectSchema)
                  } else {
                    // let a = _.includes(this.selectSchema, {'_id': params.row._id})
                    _.remove(this.selectSchema, {'_id': params.row._id})
                    console.log('##########', this.selectSchema)
                  }
                }
              }
            })
          }
        },
        {
          title: 'Title',
          key: 'title'
        },
        {
          // title: 'Id',
          key: '_id'
        }
      ],
      schemaData: [],
      selectSchema: [],
      allschema: []
    }
  },
  props: {
    db: String,
    row: Object,
    index: Number,
    id: String
  },
  methods: {
    sendData () {
      this.newdata = _.map(this.schemaData, (m) => {
        return {
          _id: m._id,
          title: m.title
        }
      })
      console.log('sendData...')
      console.log('!!!!!!!!!!!!!!!!!', this.newdata)
      this.dispatch('Settings', 'schemaData', {data: this.newdata})
      console.log('data sent...')
    }
  },
  mounted () {
    console.log('hello expand', this.schemaData)
    this.dispatch('Settings', 'expandTrue', {data: true})
    this.$on('giveMeData', this.sendData)
    schema.getByNameId(this.row.db, this.row.dbData.id).then(response => {
      this.allschema = response.data._id
      this.schemaData = _.map(response.data, (m) => {
        return {
          _id: m._id,
          title: m.title,
          checked: true
        }
      })
    })
  }
}
</script>
<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>