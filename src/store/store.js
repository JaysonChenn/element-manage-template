import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    mesInfo: {},
    currentRoute: {}
  },
  mutations: {
    setUserInfo (state, data) {
      state.userInfo = data
    },
    setMesInfo (state, data) {
      state.mesInfo = data
    },
    setCurrentRoute (state, data) {
      state.currentRoute = data
    }
  }
})

export default store
