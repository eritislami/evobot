<template>
  <div>
    <div>
      <h2>User: {{ user.username }}</h2>
      <p>ID: {{ user.id }}</p>
      <img :src="userAvatar"/>
    </div>
  </div>
</template>

<script>
import store from '../store'
import {avatar_cdn} from  '../../auth_config'
export default {
  data: function() {
    return {
      user: store.state.user,
    }
  },
  computed: {
    userAvatar: function() {
      return `${avatar_cdn}/${store.state.user.id}/${store.state.user.avatar}.png`
    }
  },
}
</script>