import Vue from 'vue'
import Vuex from 'vuex'
// vuex 数据本地存储，防止刷新丢失
import vuexPpersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {}
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexPpersistedstate()]
})
