import api from '../../api'
let model = 'import-to-external-db'
export default {
  get: (id) => {
    if (id === undefined) {
      return api.request('get', '/' + model).then(response => {
        return response.data.data
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
