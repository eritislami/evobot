<template>
  <div id="app">
    <SongTable/>
  </div>
</template>

<script>
import SongTable from './components/SongTable'

export default {
  name: 'App',
  components: {
    SongTable
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
