import api from '../../api'
let model = 'settings'
export default {
  get: (db) => {
    if (db === undefined) {
      return api.request('get', '/' + model)
    } else {
      return api.request('get', '/' + model + '?dbname=' + db)
    }
  }
}
