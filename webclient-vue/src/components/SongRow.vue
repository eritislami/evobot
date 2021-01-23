<template>
  <tr class='songrow' :class="(idx % 2) === 0 ? '' : 'pure-table-odd'">
    <td>{{ idx+1 }}</td>
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
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
