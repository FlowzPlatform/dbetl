import api from '../../api'
let model = 'import-tracker'

export default {
  get: (id, schemaname) => {
    if (id === undefined) {
      return api.request('get', '/' + model).then(res => {
        return res.data
      })
    } else {
      return api.request('get', '/' + model + '/' + id).then(res => {
        return res.data
      })
    }
  }
}
