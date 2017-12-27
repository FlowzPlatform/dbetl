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
        return api.request('get', '/' + model + '/' + id).then(res => {
          return res.data
        })
      } else {
        return api.request('get', '/' + model + '/' + id + '?schemaname=' + schemaname).then(res => {
          return res.data
        })
      }
    }
  },
  // getByNameId: (dbname, dbid) => {
  //   return api.request('get', '/' + model + '?dbname=' + dbname + '&dbid=' + dbid)
  // },
  // getAll: getAllEntity,
  // getThis: (id) => {
  //   return api.request('get', '/' + model + '/' + id)
  // },
  post: (data) => {
    return api.request('post', '/' + model + '?schemaname=' + data.tname, data).then(res => {
      return res.data
    })
  },
  postData: (data) => {
    return api.request('post', '/' + model + '?check=true', data).then(res => {
      return res.data
    })
  },
  checkConn: (data) => {
    return api.request('post', '/' + model + '?checkconn=true', data).then(res => {
      return res.data
    })
  },
  put: (id, schemaname, rid, data) => {
    return api.request('put', '/' + model + '/' + id + '?schemaname=' + schemaname + '&&rid=' + rid, data).then(res => {
      return res.data
    })
  },
  delete: (id, schemaname, rid) => {
    return api.request('delete', '/' + model + '/' + id + '?schemaname=' + schemaname + '&&rid=' + rid).then(res => {
      return res.data
    })
  }
}
