<template>
  <div class="songtable">
    <table class="pure-table pure-table-horizontal">
        <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th colspan="2">Requestor</th>
            </tr>
        </thead>
        <tbody>
            <SongRow v-for="(item, idx) in songs" :key="idx" :idx='idx' :song='item' />
        </tbody>
    </table>
    <p>Queued music: {{ totalTime }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import SongRow from './SongRow'
import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import { db } from '../services/firebase'
Vue.use(firestorePlugin)

export default {
  name: 'SongTable',
  // props are used to pass data into this component
  //   props: {
  //     msg2: String
  //   },
  components: {
    SongRow
  },
  data () {
    return {
      songs: [],
      totalTime: '00:00',
      lastUpdated: 'Never',
      timer: ''
    }
  },
  
  firestore: {
    fred_essions: db.collection('fred_session')
  },

  created () {
    this.fetchEventsList()
    this.timer = setInterval(this.fetchEventsList, 5000)
  },
  methods: {
    fetchEventsList () {
      axios.get('https://fred.skydev.one:8081/api/queue')
        .then(res => {
          this.songs = res.data.songs
          this.totalTime = this.getTotalTime(res.data.songs.reduce((a, b) => a + parseInt(b.duration), 0)) || '00:00'
          this.lastUpdated = new Date().toString()
        })
    },
    getTotalTime (seconds) {
      return new Date(seconds * 1000).toISOString().substr(11, 8)
    },
    cancelAutoUpdate () {
      clearInterval(this.timer)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
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
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
