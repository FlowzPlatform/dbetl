<template>
  <div class="SchemaMapping">
    <h5>Schema Mapping</h5>
    <Row style="padding:20px;">
        <Form ref="formMapping" :model="formMapping" :rules="ruleMapping" inline>
          <Row>
            <FormItem :label-width="75" prop="title" label="Title">
                <Input type="text" v-model="formMapping.title" placeholder="Title"></Input>
            </FormItem>
            <FormItem :label-width="75" prop="producer" label="producer ">
                    <Select v-model="formMapping.producer" disabled style="width:200px">
                        <Option v-for="item in SourceOptionDt" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
            </FormItem>
            <FormItem :label-width="75" prop="consumer" label="consumer">
                  <Select v-model="formMapping.consumer" style="width:200px" @on-change="mapStart">
                      <Option v-for="item in TargetOptionDt" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
            </FormItem>
            <FormItem :label-width="75" label="Notes">
                <Input v-model="formMapping.notes" type="textarea" placeholder="Notes..."></Input>
            </FormItem>
          </Row>
          <Row>
            <div class="schema-form ivu-table-wrapper">
            <div class="ivu-table ivu-table-border">
                <div class="ivu-table-body">
                    <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                        <colgroup>
                            <col width="35">
                                <col width="35">
                                    <col width="30">
                        </colgroup>
                        <thead>
                            <tr>
                                <th class="">
                                    <div class="ivu-table-cell">
                                        <span>Producer Fields</span>
                                    </div>
                                </th>
                                <th class="">
                                    <div class="ivu-table-cell">
                                        <span>Consumer Fields</span>
                                    </div>
                                </th>
                                <th class="">
                                    <div class="ivu-table-cell"><span>Transform</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="ivu-table-tbody">
                           <template v-for="(ent, index) in sourceSchemaEntity">
                              <tr class="ivu-table-row" >
                                  <td class="">
                                    <div class="ivu-table-cell">
                                      {{ ent.name }}
                                    </div>
                                  </td>
                                  <td class="">
                                      <div class="ivu-table-cell">
                                          <!-- <Select v-if="formMapping.consumer" v-model="formMapping.MapData[index].consumerField" size="small" class="schema-form-input">
                                              <Option v-for="(t, inx) in targetSchemaEntity" :value="t.name" :key="inx">{{ t.name }}</Option>
                                          </Select> -->
                                          <Cascader v-if="formMapping.consumer" :data="cascadDt" v-model="formMapping.MapData[index].consumerField"></Cascader>
                                      </div>
                                  </td>
                                  <td class="">
                                    <div class="ivu-table-cell">

                                      <a v-if="formMapping.consumer" @click="openTrasformEditor(index)"><Icon type="edit"></Icon>
                                      </a>
                                      
                                        <!-- <Poptip v-if="formMapping.consumer" placement="bottom-end" >
                                            <a><Icon type="edit"></Icon></a>
                                            <div slot="title"><h3>Transform</h3></div>
                                            <div slot="content">
                                              <codemirror v-model='formMapping.MapData[index].transform' :options="editorOptions" @change="onEditorCodeChange(formMapping.MapData[index].transform, index)">
                                              </codemirror>
                                            </div>
                                        </Poptip> -->
                                    </div>
                                  </td>
                              </tr>
                              <tr v-if="formMapping.consumer && openTrasformEditorIndex === index">
                                <td colspan="3">
                                  <codemirror v-model='formMapping.MapData[index].transform' :options="editorOptions" @change="onEditorCodeChange(formMapping.MapData[index].transform, index)"></codemirror>
                                </td>
                              </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
          </Row>
          <Row style="padding-top:10px;">  
            <FormItem>
                <Button type="primary" @click="saveMapping('formMapping')">Save</Button>
                <Button type="ghost" @click="resetForm">Reset</Button>
            </FormItem>
          </Row>  
        </Form>
    </Row>
    <!-- {{formMapping}} -->
    <!-- {{_sourceSchema }} -->
  </div>
</template>

<script>
let _ = require('lodash')
import schema from '../api/schema'
import schemamapping from '../api/schemamapping'
import VueCodeMirror from 'vue-codemirror'
import Vue from 'vue'
// import api from '../api'
Vue.use(VueCodeMirror)
export default {
  name: 'SchemaMapping',
  data () {
    return {
      // code: '',
      openTrasformEditorIndex: -1,
      editorOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-light',
        lineNumbers: true,
        line: true,
        // keyMap: 'sublime',
        extraKeys: { 'Ctrl': 'autocomplete' },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        styleSelectedText: true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
      },
      formMapping: {
        title: '',
        producer: '',
        consumer: '',
        notes: '',
        MapData: []
      },
      ruleMapping: {
        title: [
          { required: true, message: 'Please Enter Title.', trigger: 'blur' }
        ],
        consumer: [
          { required: true, message: 'Please Select consumer.', trigger: 'blur' }
        ]
      },
      allSchema: [],
      SourceOptionDt: [],
      TargetOptionDt: [],
      _sourceSchema: {},
      _targetSchema: [],
      sourceSchemaEntity: [],
      targetSchemaEntity: [],
      cascadDt: []
    }
  },
  mounted () {
    this.fetch(this.$route.params.id)
  },
  methods: {
    openTrasformEditor (index) {
      if (this.openTrasformEditorIndex === index) {
        this.openTrasformEditorIndex = -1
        return false
      }
      this.openTrasformEditorIndex = index
    },
    onEditorCodeChange (newCode, index) {
      this.formMapping.MapData[index].transform = newCode
    },
    fetch (id) {
      var self = this
      schema.get().then((response) => {
        this.resetData()
        this.allSchema = response.data
        this._sourceSchema = _.find(this.allSchema, {_id: this.$route.params.id})
        this.sourceSchemaEntity = this._sourceSchema.entity
        this.SourceOptionDt.push({value: this._sourceSchema._id, label: this._sourceSchema.title})
        this.formMapping.producer = this._sourceSchema._id
        this._targetSchema = _.reject(this.allSchema, {_id: this.$route.params.id})
        _.forEach(this._targetSchema, function (d) {
          self.TargetOptionDt.push({value: d._id, label: d.title})
        })
      })
    },
    resetData () {
      this.SourceOptionDt = []
      this.TargetOptionDt = []
      this.formMapping.MapData = []
      this.formMapping.consumer = ''
      this.formMapping.producer = ''
      this.formMapping.notes = ''
      this.formMapping.title = ''
      this._sourceSchema = {}
      this._targetSchema = []
      this.sourceSchemaEntity = []
      this.targetSchemaEntity = []
      this.cascadDt = []
    },
    mapStart (value) {
      var self = this
      this.formMapping.consumer = value
      this.formMapping.MapData = []
      this.targetSchemaEntity = (_.find(this._targetSchema, {_id: this.formMapping.consumer})).entity
      _.forEach(this._sourceSchema.entity, function (ent) {
        self.formMapping.MapData.push({producerField: ent.name, consumerField: [], transform: ''})
      })
      _.forEach(this.targetSchemaEntity, function (ent) {
        if (!ent.customtype) {
          self.cascadDt.push({label: ent.name, value: ent.name, children: []})
        } else {
          var _child = self.getChildren(ent.type)
          // console.log('_child', _child)
          self.cascadDt.push({label: ent.name, value: ent.name, children: _child})
        }
      })
      self.cascadDt.push({label: 'Custom', value: -1, children: []})
    },
    getChildren (id) {
      var self = this
      let child = []
      schema.getThis(id).then((res) => {
        // console.log('ssf', res)
        _.forEach(res.data.entity, function (e, i) {
          // alert(e.customtype)
          if (e.customtype) {
            var s = self.getChildren(e.type)
            child.push({label: e.name, value: e.name, children: s})
          } else {
            child.push({label: e.name, value: e.name, children: []})
          }
        })
        // console.log('AAAAAAAA')
      })
      return child
    },
    saveMapping (name) {
      // var self = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formMapping)
          schemamapping.post(this.formMapping)
            .then(response => {
              this.$Notice.success({title: 'Success!!', desc: 'Mapping Saved...'})
              this.$router.push('/schema-mappinglist/' + this.$route.params.id)
            })
            .catch(error => {
              console.log(error)
              this.$Notice.error({title: 'Error!!', desc: 'Mapping Not Saved...'})
            })
        } else {
          // this.$Message.error('Error!')
        }
      })
    },
    resetForm () {
      this.fetch(this.$route.params.id)
    }
  },
  watch: {
    '$route.params.id' (newId, oldId) {
      this.fetch(newId)
    }
  }
}
</script>
<style scoped>
  .CodeMirror{
    min-height: 80vh;
  }
</style>