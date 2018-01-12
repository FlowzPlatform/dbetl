<template>
  <div class="createRecord">
  	<div style="padding:20px">
      <Row style="padding-bottom:10px">
        <Col span="22">
          <Breadcrumb  separator="<b class='demo-breadcrumb-separator'>/</b>">
            <BreadcrumbItem>{{crumbData.db}}</BreadcrumbItem>
            <BreadcrumbItem>{{crumbData.cname}}</BreadcrumbItem>
            <BreadcrumbItem>{{crumbData.tname}}</BreadcrumbItem>
          </Breadcrumb>
        </Col>
        <Col span="2" >
          <Button style="float:right" type="primary" shape="circle" size="small" @click="goBackHandle()" icon="chevron-left">Back</Button>
        </Col>
      </Row>
  		<vue-json-editor v-model="jsoneditordata" :showBtns="false" @json-change="onJsonChange"></vue-json-editor>
      <div style="padding:10px">
        <Button type="primary" @click="saveHandle">Save</Button>
        <Button type="ghost" @click="cancelHandle">Cancel</Button>
      </div>
  	</div>
  </div>
</template>

<script>
import vueJsonEditor from 'vue-json-editor'
import schemaModel from '../api/schema'
import databasesModel from '../api/databases'

export default {
  name: 'createRecord',
  components: {
    'vueJsonEditor': vueJsonEditor
  },
  data () {
    return {
      jsoneditordata: {
        'name': 'flowz'
      },
      crumbData: {
        db: '',
        cname: '',
        tname: ''
      }
    }
  },
  methods: {
    goBackHandle () {
      this.$router.go(-1)
    },
    onJsonChange () {
      // console.log(this.jsoneditordata)
    },
    saveHandle () {
      console.log(this.jsoneditordata)
      if (typeof this.jsoneditordata === 'object') {
        if (!Array.isArray(this.jsoneditordata)) {
          var obj = {}
          obj.data = this.jsoneditordata
          obj.id = this.$route.params.id
          obj.tname = this.$route.params.tname
          // console.log(this.$route.params.id, this.$route.params.tname)
          schemaModel.post(obj).then(res => {
            console.log(res)
            this.$Notice.success({duration: 3, title: 'Created Successfully', desc: ''})
            this.$router.push('/recordList/' + this.$route.params.id + '/' + this.$route.params.tname)
          }).catch(err => {
            console.log('Error', err)
            this.$Notice.error({duration: 3, title: 'Network Error!', desc: ''})
          })
        } else {
          this.$Message.error('Found Array, Object required')
        }
      } else {
        this.$Message.error('Object required')
      }
    },
    cancelHandle () {
      this.$router.push('/recordList/' + this.$route.params.id + '/' + this.$route.params.tname)
    },
    init () {
      var self = this
      databasesModel.get(self.$route.params.id).then(res => {
        var sDb = res.selectedDb
        self.crumbData.cname = res.connection_name
        self.crumbData.db = sDb
        self.crumbData.tname = self.$route.params.tname
        // console.log(this.crumbData)
      })
      .catch(err => {
        console.log('Error', err)
      })
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route.params.id': function (newId, oldId) {
      this.init()
    },
    '$route.params.tname': function (newTname, oldTname) {
      this.init()
    }
  }
}
</script>
<style >
  .demo-breadcrumb-separator{
      color: #2d8cf0;
      padding: 0 5px;
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
  .jsoneditor-vue div.jsoneditor-tree {
    min-height: 100px !important;
  }
  div.jsoneditor-tree {
    overflow: hidden !important;
  }
</style>