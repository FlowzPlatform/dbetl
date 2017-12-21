import api from '../../api'
let model = 'databases'
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
  },
  put: (id, data) => {
    return api.request('put', '/' + model + '/' + id, data).then(response => {
      return response.data
    })
  },
  patch: (id, data) => {
    return api.request('patch', '/' + model + '/' + id, data).then(response => {
      return response.data.data
    })
  },
  delete: (id) => {
    if (id === undefined) {
      return api.request('delete', '/' + model).then(response => {
        return response.data.data
      })
    } else {
      return api.request('delete', '/' + model + '/' + id).then(response => {
        return response.data
      })
    }
  }
}
