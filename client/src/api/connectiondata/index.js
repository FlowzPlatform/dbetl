import api from '../../api'
let model = 'connectiondata'

export default {
  get: (id, params) => {
    if (id === undefined) {
      return api.request('get', '/' + model)
    } else {
      return api.request('get', '/' + model + '/' + id)
    }
  },
  // getByNameId: (dbname, dbid) => {
  //   return api.request('get', '/' + model + '?dbname=' + dbname + '&dbid=' + dbid)
  // },
  // getAll: getAllEntity,
  getThis: (id) => {
    return api.request('get', '/' + model + '/' + id)
  },
  getRecords: (id, tname, sl, el) => {
    return api.request('get', '/' + model + '/' + id + '?schemaname=' + tname + '&&sl=' + sl + '&&el=' + el)
  },
  post: (data) => {
    return api.request('post', '/' + model, data)
  },
  put: (id, data) => {
    return api.request('put', '/' + model + '/' + id, data)
  },
  deleteThis: (id, instid, tname) => {
    return api.request('delete', '/' + model + '/' + id + '?instid=' + instid + '&&tname=' + tname)
  }
}
