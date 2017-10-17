<template>
  <div class="schema-instance">
    <!-- <div id="Editid"></div>  -->
    <!-- <Input type="text" v-model="hdnid"></Input> -->
    <Form ref="formSchemaInstance" :model="formSchemaInstance">
      <Form-item 
        label="Title" 
        prop="title"
        :label-width="100"
        :rules="{required: true, message: 'Please enter your schema title', trigger: 'blur'}">
          <Input type="text" v-model="formSchemaInstance.title"></Input>
      </Form-item>
      <schema-form :schema="formSchemaInstance.schema"></schema-form>
      <Form-item>
        <Row>
          <Col span="24">
            <Button type="dashed" long @click="handleAdd" icon="plus-round">Add</Button>
          </Col>
        </Row>
      </Form-item>
      <Form-item>
        <Button type="primary" v-model="savebutton" @click="handleSubmit('formSchemaInstance')">{{ savebutton }}</Button>
        <Button type="ghost" @click="handleReset('formSchemaInstance')" style="margin-left: 8px">Reset</Button>
      </Form-item>
    </Form>
    <div>{{formSchemaInstance}}</div>
  </div>
</template>

<script>
/*eslint-disable*/
import SchemaForm from './SchemaForm'
import api from '../api'
export default {
  name: 'schema',
  components: {
    'schema-form': SchemaForm
  },
  data () {
    return {
      formSchemaInstance: {
        title: '',
        schema: []
      },
      schema: {},
      instance: {},
      savebutton: 'Save'
    }
  },
  created () {
    if(this.$route.params.schemaid === undefined) {
      // alert('instanceid')
      this.savebutton = 'Update'
      this.fetch(this.$route.params.id)
    }
    else {
      // alert('schemaid')
      this.fetch(this.$route.params.schemaid)
    }
  },
  methods: {
    fetch (id) {
      // alert(id)
      if(this.$route.params.schemaid !== undefined) {
        api.request('get', '/schema/' + id)
        .then(response => {
          // response.data.entity.forEach((s, index) => {
          //   if (['text', 'email', 'number', 'phone', 'boolean', 'date', 'dropdown'].indexOf(s.type) === -1) {
          //     console.log('s', s)
          //     // s['schema'] = this.fetch(s.type)
          //   }
          // })
          this.schema = response.data
          console.log('this.schema', this.schema)
          // this.fetchSchemaType(id)
          this.$Loading.finish()
        })
        .catch(error => {
          console.log(error)
          this.$Loading.error()
        })
      }
      else {
        api.request('get', '/instance/' + id)
        .then(response => {
          // response.data.entity.forEach((s, index) => {
          //   if (['text', 'email', 'number', 'phone', 'boolean', 'date', 'dropdown'].indexOf(s.type) === -1) {
          //     console.log('s', s)
          //     // s['schema'] = this.fetch(s.type)
          //   }
          // })
          var self = this
          var result = response.data
          this.schema = result 
          this.formSchemaInstance.title = result.name
          // console.log(result.data.options.length)
          result.data.options.forEach(function(item, inx){
            self.handleAdd()
          })
          // this.formSchemaInstance.schema.push(response.data)
          // console.log('this.instance', this.schema)
          // this.fetchSchemaType(id)
          this.$Loading.finish()
        })
        .catch(error => {
          // console.log(error)
          this.$Loading.error()
        })
      }
    },
    handleAdd () {
      this.formSchemaInstance.schema.push(this.schema)
      // console.log('this.formSchemaInstance.schema', this.formSchemaInstance.schema)
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log('form', this.formSchemaInstance)
          this.$Message.success('success!')
          // this.hdnid = 1
        } else {
          this.$Message.error('error!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  watch: {
    '$route.params.id' (newId, oldId) {
      // fetch data
      this.fetch(newId)
    }
  }
  // watch: {
  //   '$route.params.schemaid' (newId, oldId) {
  //     // fetch data
  //     this.fetch(newId)
  //   }
  // }
}
</script>
