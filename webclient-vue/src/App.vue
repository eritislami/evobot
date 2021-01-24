<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link v-if="$auth.isAuthenticated" to="/profile">Profile</router-link>
      <a v-if="!$auth.isAuthenticated" @click.prevent="$auth.loginWithRedirect({connection: 'discord'})" href="/">Login</a>
      <a v-if="$auth.isAuthenticated" @click.prevent="$auth.logout()" href="/">Logout</a>
    </div>
    <router-view></router-view>
    <Login/>
  </div>
</template>

<script>
import Login from './components/Login'
export default {
  name: 'App',
  components: {
    Login
  },
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
</style>
