export default {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  SET_SCHEMA (state, schema) {
    state.schema = schema
  },
  SET_SETTINGS (state, settings) {
    state.settings = settings
  },
  SET_TABDATA (state, tabdata) {
    // console.log('SET_TABDATA', tabdata)
    state.tabdata.push(tabdata)
  },
  DEL_TABINDEX (state, data) {
    // console.log(data)
    state.tabdata.splice(data.index, 1)
  }
}
