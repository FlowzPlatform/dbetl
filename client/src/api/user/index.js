import api from '../../api'
let model = 'usermaster'

export default {
  get: (email) => {
    return api.request('get', '/' + model + '?emailId=' + email).then(response => {
      return response.data.data
    }).catch(error => {
      throw error
    })
  }
}
