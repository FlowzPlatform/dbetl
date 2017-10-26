<template>
  <div class="schema-instance">
    <Form ref="formSchemaInstance" :model="formSchemaInstance">
      <!-- <Form-item 
        label="Title" 
        prop="name"
        :label-width="100"
        :rules="{required: true, message: 'Please enter your schema title', trigger: 'blur'}">
          <Input type="text" v-model="formSchemaInstance.name"></Input>
      </Form-item> -->
       <!-- <div class="drag">
        <draggable :list="formSchemaInstance.data">
          <transition-group>
            <div v-for="(element, i) in formSchemaInstance.data" :key="i">
                <schema-form :schemainstance="formSchemaInstance"></schema-form>
            </div>
          </transition-group>
        </draggable>
     </div> -->
     <schema-form :schemainstance="formSchemaInstance"></schema-form>
      <Form-item>
        <Row>
          <Col span="24">
            <!-- <Button type="dashed" long @click="handleAdd" icon="plus-round">Add</Button> -->
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Button type="primary" v-model="savebutton" @click="handleSubmit('formSchemaInstance')">{{ savebutton }}</Button>
        <Button type="ghost" @click="handleReset('formSchemaInstance')" style="margin-left: 8px">Reset</Button>
      </Form-item>
    </Form>
    {{formSchemaInstance.data}}
    {{savebutton}}
  </div>
</template>

<script>
import SchemaForm from './SchemaForm'
import Schema from '../api/schema'
import Instance from '../api/instance'
import _ from 'lodash'
export default {
  name: 'schema',
  components: {
    'schema-form': SchemaForm
    // draggable
  },
  props: ['id', 'instanceid', 'processid'],
  data () {
    return {
      loading: false,
      formSchemaInstance: {
        // name: '',
        data: [],
        entity: []
      },
      schema: {},
      entity: [],
      savebutton: 'Save',
      instanceData: {}
    }
  },
  created () {
    if (this.id === undefined) {
      if (this.$route.params.schemaid === undefined) {
        this.savebutton = 'Update'
        this.fetch(this.$route.params.id)
      } else {
        this.fetch(this.$route.params.schemaid)
      }
    } else {
      if (this.$route.params.schemaid === undefined) {
        this.savebutton = 'Update'
        this.fetch(this.$route.params.id)
      } else if (this.$route.params.schemaid !== undefined) {
        this.fetch(this.$route.params.schemaid)
      } else {
        this.fetch(this.id)
      }
    }
  },
  methods: {
    getChildData (id) {
      // alert(id)
      var arrObj = []
      var self = this
      Schema.getThis(id)
        .then(response => {
          var _res = response.data
          var obj = {}
          // obj.id = self.getGuid();
          obj.database = _res.database
          obj.Schemaid = _res._id
          _.forEach(_res.entity, function (v) {
            if (v.customtype) {
              obj[v.name] = self.getChildData(v.type)
            } else {
              if (v.type === 'number') {
                obj[v.name] = 1
              } else {
                obj[v.name] = ''
              }
            }
          })
          arrObj.push(obj)
        })
        .catch(error => {
          console.log('Errorrr', error)
        })
      return arrObj
    },
    async getChildEntity (id) {
      var self = this
      var res = []
      var _res = await Schema.getThis(id)
      for (let [index, entity] of _res.data.entity.entries()) {
        if (entity.customtype) {
          _res.data.entity[index]['entity'] = await self.getChildEntity(entity.type)
        }
      }
      res.push(_res.data)
      return res
    },
    async fetch (id) {
      // alert(id)
      var self = this
      if (this.$route.params.id !== undefined) {
        console.log('Hii', this.$route.params.id)
        var instanceres = await Instance.getThis(this.$route.params.id)
        console.log('instancedata', instanceres.data)
        this.instanceData = instanceres.data
        var schemares = await Schema.getThis(instanceres.data.Schemaid)
        console.log('response', schemares.data.entity)
        id = instanceres.data.Schemaid
      }
      // else {
      var response = await Schema.getThis(id)
      // console.log('this.$route.params.schemaid', response)
      this.formSchemaInstance.data = []
      this.schema = response.data
      this.entity = this.schema.entity
      this.formSchemaInstance.entity = this.schema.entity
      for (let [index, entity] of self.formSchemaInstance.entity.entries()) {
        if (entity.customtype) {
          self.formSchemaInstance.entity[index]['entity'] = await self.getChildEntity(entity.type)
        }
      }
      this.handleAdd()
      // }
    },
    handleAdd () {
      var self = this
      if (this.$route.params.id !== undefined) {
        var D = []
        D.push(this.instanceData)
        this.formSchemaInstance.data = D
      } else {
        var obj = {}
        obj.database = this.schema.database
        obj.Schemaid = this.schema._id
        _.forEach(this.entity, function (v) {
          if (v.customtype) {
            obj[v.name] = self.getChildData(v.type)
          } else {
            if (v.type === 'number') {
              obj[v.name] = 1
            } else {
              obj[v.name] = ''
            }
          }
        })
        this.formSchemaInstance.data.push(obj)
      }
    },
    makeObj () {
      var obj = this.schema
      obj.Schemaid = this.schema._id
      // delete obj._id
      // delete obj.id
      obj.data = this.formSchemaInstance.data
      // obj.name = this.formSchemaInstance.name
      return obj
    },
    handleSubmit (name) {
      var obj = this.makeObj()
      console.log('QQQQQQQQQQQQ', obj)
      this.$Loading.start()
      Instance.post({ instanceid: this.instanceid, processid: this.processid, data: obj.data })
        .then(response => {
          console.log('response', response.data)
          this.$Notice.success({title: 'success!', desc: 'Instance Saved...'})
          this.$Loading.finish()
        })
        .catch(error => {
          console.log('Error', error)
          this.$Notice.error({title: 'Error!', desc: 'Instance Not Saved...'})
          this.$Loading.error()
        })
    },
    handleReset (name) {
      // this.$refs[name].resetFields()
      this.fetch(this.$route.params.schemaid)
    }
  },
  watch: {
    '$route.params.schemaid' (newId, oldId) {
      // fetch data
      this.fetch(newId)
    }
  }
}
</script>