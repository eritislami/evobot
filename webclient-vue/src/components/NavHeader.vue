<template>
    <div id="nav">
      <div class="navbar">
        <ul>
            <li><transition name="slideFill"><router-link class="menuItem" to="/">Home</router-link></transition></li>
            <li><a class="menuItem" v-if="!is_logged_in" :href="discord_authorize_url">Login</a></li>
            <li><a class="menuItem" v-if="is_logged_in" href="/profile">{{discord_user.username}}'s Profile</a></li>
            <li><a class="menuItem" v-if="is_logged_in" @click="logout()" href="/">Logout</a></li>
        </ul>
      </div>
    </div>
</template>

<script>
import { logout } from '../auth/discord'
import { discord } from '../../auth_config'
export default {
    computed: {
    is_logged_in: function() {
      let user = this.$store.state.user
      return Boolean(user)
    },
    discord_user: function() {
      let user = JSON.parse(localStorage.getItem('discord_user'))
      return user
    },
    discord_authorize_url: function() {
      return `https://discord.com/api/oauth2/authorize?client_id=${discord.client_id}&redirect_uri=${encodeURIComponent(discord.redirect_uri)}&response_type=code&scope=${discord.scope}`
    }
  },
  methods: {
    logout: function () {
      logout()
    }
  },
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Raleway:400,400i,700");

.navbar {
  display: flex;
  height: 5vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}

ul {
  display: flex;
  align-items: start;
  list-style-type: none;
  flex-direction: row;
}

li {
padding: 0px 0;
margin: 10px;
display: inline-block;
zoom: 1;
*display:inline;
}

.menuItem {
    --fill-color: #198CE6;
    position: relative;
    display: block;
    padding: 4px 0;
    font: 700 1.5rem Raleway, sans-serif;
    text-decoration: none;
    text-transform: uppercase;
    -webkit-text-stroke: 2px var(--fill-color);
    background: linear-gradient(var(--fill-color) 0 100%) left / 0 no-repeat;
    color: transparent;
    background-clip: text;
    transition: 0.5s linear;
}

.slideFill {
    transition: 0.5s linear;
}
</style>