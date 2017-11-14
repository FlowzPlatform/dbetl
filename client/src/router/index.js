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
import Db from '@/components/Db'
import Login from '@/components/Login'
import Register from '@/components/Register'
// import FlowzList from '@/components/FlowList'
// import Instance from '@/components/instance'
Vue.use(Router)
const routes = [{
  path: '/',
  name: 'Layout',
  component: Layout,
  children: [{
    path: 'dashboard',
    alias: '',
    component: Dashboard,
    name: 'Dashboard',
    meta: { description: 'Overview of environment' }
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
