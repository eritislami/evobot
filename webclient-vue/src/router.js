import VueRouter from 'vue-router'
import Profile from './components/Profile'
import Home from './components/Home'
import store from './store'

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
        component: Profile,
        meta: {
          requiresAuth: true
        }
      }
    ],
    mode: "history"
  })
  router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
    const logged_in = store.state.logged_in
    console.log(`Logged in: ${logged_in}`)
  
    if (requiresAuth && !logged_in) {
      next('/')
    } else {
      next()
    }
  })

  export default router