<template>
  <tr>
    <td class="indexCol">{{ idx+1 }}</td>
    <td>
      <a :href=song.url>{{ song.title }}</a>
    </td>
    <td>{{ song.user.username }}</td>
    <td>
      <img :src="song.user.displayAvatarURL" height="25" width="25" alt=""/>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'SongRow',
  //   props are used to pass data into this component
  props: {
    song: {},
    idx: 0
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
tr:hover {
  border: 1px solid white;
}
td {
  border: none;
  text-align: left;
}
.indexCol {
  text-align: center;
}
</style>
