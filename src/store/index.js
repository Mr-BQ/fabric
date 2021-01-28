import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    templates:[],
    instances:[]
  },
  mutations: {
    addTemplate(state,payload){
      state.templates.push(payload)
    },
    addInstance(state,payload){
      state.instances.push(payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
