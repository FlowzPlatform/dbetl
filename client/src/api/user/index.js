import api from '../../api'
let model = 'usermaster'

export default {
  get: (email) => {
    return api.request('get', '/' + model + '?emailId=' + email).then(response => {
      return response.data.data
    }).catch(error => {
      throw error
    })
  },
  post: (data) => {
    return api.request('post', '/' + model, data)
  },
  put: (id, data) => {
    return api.request('put', '/' + model + '/' + id, data)
  },
  delete: (id) => {
    return api.request('delete', '/' + model + '/' + id)
  }
}
