import api from '../../api'
let model = 'schema'

export default {
  get: (id, schemaname) => {
    if (id === undefined) {
      return api.request('get', '/' + model).then(res => {
        return res.data.data
      })
    } else {
      if (schemaname === undefined) {
        console.log('schemaname if', schemaname)
        return api.request('get', '/' + model + '/' + id).then(res => {
          return res.data
        })
      } else {
        console.log('schemaname else', schemaname)
        return api.request('get', '/' + model + '/' + id + '?schemaname=' + schemaname).then(res => {
          return res.data
        })
      }
    }
  }
  // getByNameId: (dbname, dbid) => {
  //   return api.request('get', '/' + model + '?dbname=' + dbname + '&dbid=' + dbid)
  // },
  // getAll: getAllEntity,
  // getThis: (id) => {
  //   return api.request('get', '/' + model + '/' + id)
  // },
  // post: (data) => {
  //   return api.request('post', '/' + model, data)
  // },
  // put: (id, data) => {
  //   return api.request('put', '/' + model + '/' + id, data)
  // }
}
