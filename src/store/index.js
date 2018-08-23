import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
   state: {
      show: false
   },
  getters: {
    personInfo (state) {
      return `My name is ${state.name}, I am ${state.age}`
    }
  }
})
