import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'//统一管理拿值的东西

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user
  },
  state: {

  },
  mutations: {

  },
  actions: {

  },
  getters
})
