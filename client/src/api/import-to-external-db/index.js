import api from '../../api'
let model = 'import-to-external-db'
export default {
  get: (id = null, params = null) => {
    if (id === null) {
      return api.request('get', '/' + model, null, params).then(response => {
        return response.data
      })
    } else {
      return api.request('get', '/' + model + '/' + id).then(response => {
        return response.data
      })
    }
  },
  post: (data) => {
    return api.request('post', '/' + model, data).then(response => {
      return response.data
    })
  }
}
