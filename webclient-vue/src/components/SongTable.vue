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
            <SongRow v-for="(item, idx) in fred_session.now_playing" :key="idx" :idx='idx' :song='item' />
        </tbody>
    </table>
    <p>Queued music: {{ totalTime }}</p>
  </div>
</template>

<script>
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
      fred_session: {}
    }
  },

  computed : {
    totalTime: function() {
      const time = this.fred_session.now_playing
        ? this.fred_session.now_playing.reduce((a,b) => a + parseInt(b.duration), 0)
        : 0;
      return new Date(time * 1000).toISOString().substr(11, 8);
    }
  },

  firestore: {
    fred_session: db.collection('fred_session').doc('current')
  },
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
