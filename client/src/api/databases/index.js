import api from '../../api'
let model = 'databases'
export default {
  get: () => {
    return api.request('get', '/' + model)
  },
  getThis: (id) => {
    return api.request('get', '/' + model + '/' + id)
  },
  post: (data) => {
    return api.request('post', '/' + model, data)
  },
  put: (id, data) => {
    return api.request('put', '/' + model + '/' + id, data)
  },
  patch: (id, data) => {
    return api.request('patch', '/' + model + '/' + id, data)
  },
  delete: (id) => {
    return api.request('delete', '/' + model + '/' + id)
  },
  getDb: (id) => {
    return api.request('get', '/' + model + '/' + id).then(response => {
      return response.data
    })
  },
  checkConnection (data) {
    return api.request('post', '/databases?check=' + data.selectedDb, data).then(response => {
      return response.data
    }).catch(error => {
      throw error.message
    })
  }
}
