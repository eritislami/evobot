// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import './assets/pure-min.css'
import VueRouter from 'vue-router'
import store from './store'
import router from './router'

Vue.use(VueRouter);

new Vue({
  router,
  store: store,
  beforeCreate() { this.$store.commit('updateUser')},
  render: h => h(App)
}).$mount('#app')
