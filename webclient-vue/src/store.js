import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        logged_in: Boolean(JSON.parse(localStorage.getItem('discord_user'))),
        user: {}
    },
    mutations: {
        updateUser(state) {
            let user = JSON.parse(localStorage.getItem('discord_user'))
            this.state.logged_in = Boolean(user)
            this.state.user = user
        }
    }
})