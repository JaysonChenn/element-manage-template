import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: {},
    isCollapse: false,
    isMobNavbarShow: false
  },
  mutations: {
    setUserInfo (state, data) {
      state.userInfo = data
    },
    setCollaspse (state) {
      state.isCollapse = !state.isCollapse
    },
    setMobNavbarShow (state) {
      state.isMobNavbarShow = !state.isMobNavbarShow
    }
  }
})

export default store
