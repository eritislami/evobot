// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Profile from './components/Profile'
import Home from './components/Home'
import './assets/pure-min.css'
import VueRouter from 'vue-router'
import { domain, clientId } from '../auth_config.json'
import { Auth0Plugin } from './auth'

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    VueRouter.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
});

var router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile
    }
  ],
  mode: "history"
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   components: { App },
//   template: '<App/>'
// })
