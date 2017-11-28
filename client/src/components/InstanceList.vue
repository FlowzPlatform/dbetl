<template>
  <div class="instancelist">
    <f-Tab></f-Tab>
    <div class="ivu-table ivu-table-border">
      <div class="ivu-table-body">
        <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
          <colgroup>
            <col width="35">
            <col width="35">
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
                    <a @click="show(index)"><Icon type="edit" style="font-size: 20px;"></Icon></a>
                    <a @click="remove(index)" style= 'color:red'><Icon type="android-delete" style="font-size: 20px;"></Icon></a>
                  </div>
                </td>
              </tr>
              <tr v-if="openTrasformEditorIndex === index">
                <td colspan="2" class="json-viewer">
                  <vue-json-editor v-model="row" :showBtns="false" @json-change="onJsonChange"></vue-json-editor>
                  <!-- <codemirror :options="editorOptions" v-model="code1" @change = 'onEditorCodeChange(code1)'></codemirror> -->
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
// import test from './test.vue'
import _ from 'lodash'
export default {
  name: 'instancelist',
  components: {
    'f-Tab': Tab,
    // 'test': test,
    'vueJsonEditor': vueJsonEditor
  },
  computed: {
  },
  created () {
    this.fetch(this.$route.params.id)
  },
  data () {
    return {
      code1: '',
      // json: {
      //   msg: 'demo of jsoneditor'
      // },
      row: {},
      openTrasformEditorIndex: -1,
      // editorOptions: {
      //   tabSize: 4,
      //   mode: 'application/json',
      //   theme: 'base16-light',
      //   lineNumbers: true,
      //   line: true,
      //   extraKeys: { 'Ctrl': 'autocomplete' },
      //   foldGutter: true,
      //   gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      //   styleSelectedText: true,
      //   highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
      // },
      data5: []
    }
  },
  methods: {
    onJsonChange (value) {
      console.log('value:', value)
    },
    // onEditorCodeChange (newCode) {
    //   this.code1 = newCode
    //   console.log('this is new code', this.code1)
    // },
    // looping (data) {
    //   var self = this
    //   var value1 = ''
    //   _.forEach(data, function (value) {
    //     for (var entry in value) {
    //       value1 += entry + ':' + value[entry] + ','
    //       if (typeof (value[entry]) === 'object') {
    //         value1 = self.looping(value[entry])
    //         data += entry + ': {' + value1 + '}'
    //       } else {
    //         data = value1
    //       }
    //     }
    //   })
    //   return data
    // },
    fetch (id) {
      var self = this
      // alert(id)
      api.request('get', '/instance')
      .then(response => {
        // this.schema = response.data
        // this.schema.splice(index, 1)
        self.data5 = _.filter(response.data, (f) => { return f.Schemaid === id })
        console.log('self.data5', self.data5)
      })
      .catch(error => {
        console.log(error)
      })
    },
    show (index) {
      // this.$router.push('/schema-instance/edit/'+this.data5[index]._id)
      api.request('get', '/schema/' + this.$route.params.id)
      .then(response => {
        if (response.data.database[0] === 'mysql') {
          this.$router.push('/schema-instance/schemaid/' + this.data5[index].Schemaid + '/edit/' + this.data5[index]._id)
        } else {
          this.row = this.data5[index]
          // var output = ''
          // for (var entry in this.row) {
          //   if (typeof (this.row[entry]) === 'object') {
          //     var result = this.looping(this.row[entry])
          //     this.row[entry] = '{' + result + '}'
          //   }
          //   output += entry + ':' + this.row[entry] + '\n'
          //   this.code1 = '{' + output + '}'
          // }
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
    }
  },
  watch: {
    '$route.params.id' (newId, oldId) {
      // fetch data
      this.fetch(newId)
    }
  }
}
</script>
<style>
  .f-layout-content{
    min-height: 140px !important
  }
	.ivu-table th {
    height: 44px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #394263;
    color: #fff;
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
