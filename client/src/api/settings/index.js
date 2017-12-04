import api from '../../api'
let model = 'settings'
export default {
  get: (db) => {
    if (db === undefined) {
      return api.request('get', '/' + model)
    } else {
      return api.request('get', '/' + model + '?dbname=' + db)
    }
  },
  getThis: (id) => {
    return api.request('get', '/' + model + '/' + id)
  },
  getDb: (id) => {
    return api.request('get', '/' + model + '/' + id).then(response => {
      return response.data
    })
  },
  checkConnection (data) {
    return api.request('post', '/settings?check=' + data.selectedDb, data).then(response => {
      return response.data
    }).catch(error => {
      throw error.message
    })
  }
}
