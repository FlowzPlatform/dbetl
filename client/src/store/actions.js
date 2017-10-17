import api from '../api'
// import _ from 'lodash'
export default {
  getSchema ({ commit }) {
    commit('SET_SCHEMA', [])
    api.request('get', '/schema')
      .then(response => {
        // console.log('hdhd::', _.reject(response.data, { 'isdeleted': true }))
        commit('SET_SCHEMA', response.data)
      })
      .catch(error => {
        console.log(error)
        commit('SET_SCHEMA', [])
      })
  },
  getSettings ({ commit }) {
    commit('SET_SETTINGS', [])
    api.request('get', '/settings')
      .then(response => {
        commit('SET_SETTINGS', response.data)
      })
      .catch(error => {
        console.log(error)
        // commit('SET_SETTINGS', [])
      })
  },
  getTabdata ({commit}, text) {
    commit('SET_TABDATA', text)
    // console.log('getTabdata', text)
  },
  delTabIndex ({commit}, text) {
    commit('DEL_TABINDEX', text)
  }
}
