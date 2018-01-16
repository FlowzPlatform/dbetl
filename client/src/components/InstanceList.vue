<template>
  <div class="instancelist">
    <f-Tab></f-Tab>
    <div class="ivu-table ivu-table-border">
      <div class="ivu-table-body">
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
          <colgroup>
            <col width="70">
            <col width="30">
          </colgroup>
          <thead>
            <tr>
              <th class="">
                <div class="ivu-table-cell">
                  <span>Instance ID</span>
                </div>
              </th>
              <th class="">
                  <div class="ivu-table-cell">
                      <span>Action</span>
                  </div>
              </th>
            </tr>
          </thead>
          <tbody class="ivu-table-tbody">
            <template v-for="(value, index) in data5">
              <tr class="ivu-table-row" >
                <td class="">
                  <div class="ivu-table-cell">
                    <span style="float:left">{{ value._id }}</span>
                  </div>
                </td>
                <td class="">
                  <div class="ivu-table-cell">
                    <span v-if="openTrasformEditorIndex != -1 && index == openTrasformEditorIndex">
                      <Tooltip placement="top" content="Update">
                        <a  @click="updatedvalue(index)"><Icon  type="checkmark" style="font-size: 20px;"></Icon></a>
                      </Tooltip>
                      <a @click="remove(index)" style= 'color:red'><Icon type="android-cancel" style="font-size: 20px;"></Icon></a>
                    </span>
                    <span v-else>
                      <a @click="show(index)"><Icon  type="edit" style="font-size: 20px;"></Icon></a>
                      <a @click="remove(index)" style= 'color:red'><Icon type="android-delete" style="font-size: 20px;"></Icon></a>
                    </span>
                  </div>
                </td>
              </tr>
              <tr v-if="openTrasformEditorIndex === index">
                <td colspan="2" class="json-viewer">
                  <vue-json-editor v-model="jsoneditordata" :showBtns="false" @json-change="onJsonChange"></vue-json-editor>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
import Tab from './Tab'
import vueJsonEditor from 'vue-json-editor'
import _ from 'lodash'

export default {
  name: 'instancelist',
  components: {
    'f-Tab': Tab,
    'vueJsonEditor': vueJsonEditor
  },
  computed: {
  },
  created () {
    this.fetch(this.$route.params.id)
  },
  data () {
    return {
      finalvalue: {},
      jsoneditordata: {},
      openTrasformEditorIndex: -1,
      data5: []
    }
  },
  methods: {
    fetch (id) {
      var self = this
      api.request('get', '/instance')
      .then(response => {
        self.data5 = _.filter(response.data, (f) => { return f.Schemaid === id })
      })
      .catch(error => {
        console.log(error)
      })
    },
    show (index) {
      api.request('get', '/schema/' + this.$route.params.id)
      .then(response => {
        if (response.data.database[0] === 'mysql') {
          this.$router.push('/schema-instance/schemaid/' + this.data5[index].Schemaid + '/edit/' + this.data5[index]._id)
        } else {
          let rowid = _.cloneDeep(this.data5[index])
          delete rowid._id
          this.jsoneditordata = rowid
          if (this.openTrasformEditorIndex === index) {
            this.openTrasformEditorIndex = -1
            return false
          }
          this.openTrasformEditorIndex = index
        }
      })
    },
    remove (index) {
      api.request('delete', '/instance/' + this.data5[index]._id + '?schemaid=' + this.$route.params.id)
        .then(response => {
          this.data5.splice(index, 1)
          this.$Notice.success({
            title: 'Success',
            desc: 'SchemaInstance Deleted.....',
            duration: 2
          })
        })
        .catch(error => {
          console.log(error)
          this.$Notice.error({
            title: 'Error',
            desc: 'SchemaInstance Not Deleted.....',
            duration: 2
          })
        })
    },
    onJsonChange (value) {
      if (this.data5[this.openTrasformEditorIndex].hasOwnProperty('_id') === true) {
        value['_id'] = this.data5[this.openTrasformEditorIndex]._id
      }
      if (this.data5[this.openTrasformEditorIndex].hasOwnProperty('id') === true) {
        value['id'] = this.data5[this.openTrasformEditorIndex].id
      }
      console.log('value:', value)
      this.finalvalue = value
    },
    updatedvalue (index) {
      console.log('final value', this.finalvalue)
      this.openTrasformEditorIndex = -1
    }
  },
  watch: {
    '$route.params.id' (newId, oldId) {
      this.fetch(newId)
    }
  }
}
</script>
<style>
  .f-layout-content{
    min-height: 140px !important
  }

div.jsoneditor tr, div.jsoneditor th, div.jsoneditor td {
  height: -webkit-fill-available !important;
}
.jsoneditor-tree {
  border-color: white !important;
}
.jsoneditor-separator {
  border-right-color: white !important;
  border-bottom: white !important;
}
</style>
