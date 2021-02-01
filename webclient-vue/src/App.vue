<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <a v-if="!is_logged_in" href="https://discord.com/api/oauth2/authorize?client_id=701591092730134528&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=identify">Login</a>
      <a v-if="is_logged_in" href="/profile">{{discord_user.username}}'s Profile</a>
      <a v-if="is_logged_in" @click="logout()" href="/">Logout</a>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {logout, login} from './auth/discord'
export default {
  name: 'App',
  components: {
    
  },
  methods: {
    logout: function () {
      logout()
    }
  },
  computed: {
    is_logged_in: function() {
      let user = this.$store.state.user
      return Boolean(user)
    },
    discord_user: function() {
      let user = JSON.parse(localStorage.getItem('discord_user'))
      return user
    },
    test: function () {
      return this.$store.state.test
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
  color: #2c3e50;
}
</style>
