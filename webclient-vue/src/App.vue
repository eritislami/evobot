<template>
  <div id="app">
    <div v-if="navbar_feature"><NavHeader/></div>
    <router-view></router-view>
  </div>
</template>

<script>
import {login} from './auth/discord'
import {config} from './config'
import NavHeader from './components/NavHeader'
export default {
  name: 'App',
  components: {
    NavHeader
  },
  data() {
    return {
      navbar_feature: config.navbar_feature || false
    }
  },
  mounted() {
    const fragment = new URLSearchParams(window.location.search)
    if(fragment.has("code")) {
      const code = fragment.get('code')
      login(code).then(() => {
        window.history.replaceState({}, document.title, window.location.pathname)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #81858a;
}
a {
  color: #526275
}
a:hover {
  color: #42b983;
}
body {
  background: #1A1E23;
}
</style>
