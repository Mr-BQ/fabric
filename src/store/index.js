import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    templates:[],
    instances:[],
    netname:'',
    netid:''
  },
  mutations: {
    addTemplate(state,payload){
      state.templates.push(payload)
    },
    addInstance(state,payload){
      state.instances.push(payload)
    },
    setNetname(state,payload){
      state.netname = payload
    },
    setNetid(state,payload){
      state.netid = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
