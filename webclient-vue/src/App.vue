<template>
  <div id="app">
    <NavHeader/>
    <h1>Main</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import {login} from './auth/discord'
import NavHeader from './components/NavHeader'
export default {
  name: 'App',
  components: {
    NavHeader
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
  color: #2c3e50;
}

body {
  background: #1A1E23;
}
</style>
