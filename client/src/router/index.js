import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
// import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Schema from '@/components/Schema'
import SchemaInstance from '@/components/SchemaInstance'
import InstanceList from '@/components/InstanceList'
import SchemaMapping from '@/components/SchemaMapping'
import SchemaMappingList from '@/components/SchemaMappingList'
import Settings from '@/components/Settings'
import Import from '@/components/Import'
import Db from '@/components/Db'
import Login from '@/components/Login'
import Register from '@/components/Register'
import JobList from '@/components/JobList'
import schemaList from '@/components/schemaList'
import recordList from '@/components/recordList'
import instancejoblist from '@/components/instancejoblist'
import createRecord from '@/components/createRecord'

// import FlowzList from '@/components/FlowList'
// import Instance from '@/components/instance'
Vue.use(Router)
const routes = [{
  path: '/',
  name: 'Layout',
  component: Layout,
  meta: { description: 'Overview of environment', requiresAuth: true },
  children: [{
    path: 'dashboard',
    alias: '',
    component: Dashboard,
    name: 'Dashboard',
    meta: { description: 'Overview of environment', requiresAuth: true }
  }, {
    path: 'schema/edit/:id',
    component: Schema,
    name: 'schema/edit',
    meta: { description: 'Schema' },
    props: {
      id: String,
      required: true
    }
  }, {
    path: 'schema/new',
    component: Schema,
    name: 'schema/new',
    meta: { description: 'Schema' }
  }, {
    path: 'schema-instance/:schemaid/new',
    component: SchemaInstance,
    name: 'schema-instance',
    meta: { description: 'SchemaInstance' },
    props: {
      schemaid: Number,
      required: false
    }
  }, {
    path: 'schema-instance/schemaid/:schemaid/edit/:id',
    component: SchemaInstance,
    name: 'schema-instance/edit',
    meta: { description: 'SchemaInstance' },
    props: {
      id: Number,
      required: false
    }
  }, {
    path: 'schema-mapping/:id/new',
    component: SchemaMapping,
    name: 'schema-mapping/new',
    meta: { description: 'SchemaMapping' },
    props: {
      id: Number,
      required: false
    }
  }, {
    path: 'schema-mappinglist/:id',
    component: SchemaMappingList,
    name: 'schemamappinglist',
    meta: { description: 'SchemaMappingList' },
    props: {
      id: Number,
      required: false
    }
  }, {
    path: 'instancelist/:id',
    component: InstanceList,
    name: 'instancelist',
    meta: { description: 'InstanceList' },
    props: {
      id: Number,
      required: false
    }
  }, {
    path: 'db',
    name: 'db',
    component: Db
  }, {
    path: 'db/:db/new',
    name: 'settings',
    component: Settings
  }, {
    path: 'db/:db/new/:id',
    name: 'settings',
    component: Settings,
    props: {
      id: Text,
      required: false
    }
  }, {
    path: 'schemaList',
    name: 'schemaList',
    component: schemaList
  }, {
    path: 'jobs/list',
    name: 'joblist',
    component: JobList
  }, {
    path: 'Dbsetting/import/:id',
    name: 'import',
    component: Import
  }, {
    path: 'recordList/:id/:tname',
    name: 'recordList',
    component: recordList,
    props: {
      id: Text,
      required: false
    }
  }, {
    path: ':id/:tname/new',
    name: 'createRecord',
    component: createRecord,
    props: {
      id: Text,
      required: false
    }
  }, {
    path: 'instancejoblist/:id',
    name: 'instancejoblist',
    component: instancejoblist,
    props: {
      id: Text,
      required: false
    }
  }]
}, {
  path: '/Login',
  name: 'Login',
  component: Login
}, {
  path: '/Register',
  name: 'Register',
  component: Register
}]
export default routes
