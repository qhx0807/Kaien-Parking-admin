import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    auth:[0, 0, 0, 0, 0, 0, 0, 0],
}

export default new Vuex.Store({
  	state,
 	mutations: {
	    UPDATE_AUTH (state, status) {
	      	state.auth = status
	    }
  	},
  	actions: {
	    
	}
})