<template>
  <div>
    <div v-if="isPlaying" class="songtable">
      <table class="pure-table pure-table-horizontal">
          <thead>
              <tr>
                <th class="numberColumn">#</th>
                <th class="titleColumn">Title</th>
                <th class="requestorColumn" colspan="2">Requestor</th>
              </tr>
          </thead>
          <transition-group tag="tbody" name="songRow">
              <SongRow v-for="(item, idx) in fred_session.now_playing" :key="'song'+idx" :idx='idx' :song='item' />
          </transition-group>
      </table>
      <br />
      <p>Queued music: {{ totalTime }}</p>
    </div>
    <div v-if="!isPlaying">
      <h1>Add some music!</h1>
    </div>
  </div>
</template>

<script>
import SongRow from './SongRow'
import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import { db } from '../services/firebase'
import { vue_config } from '../../auth_config'
Vue.use(firestorePlugin)
const fred_session_collection = vue_config.fred_session_collection || 'fred_session';
const fred_session_current_doc = vue_config.fred_session_current_doc || 'current';

export default {
  name: 'SongTable',
  components: {
    SongRow
  },
  data () {
    return {
      fred_session: {},
    }
  },

  computed : {
    totalTime: function() {
      const time = this.fred_session.now_playing
        ? this.fred_session.now_playing.reduce((a,b) => a + parseInt(b.duration), 0)
        : 0;
      return time
        ? new Date(time * 1000).toISOString().substr(11, 8)
        : "00:00";
    },
    isPlaying: function() {
      return this.fred_session && this.fred_session.now_playing && this.fred_session.now_playing.length > 0
    }
  },

  firestore: {
    fred_session: db.collection(fred_session_collection).doc(fred_session_current_doc)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
th {
  background-color: #1A1E23;
  color: white;
  border: none;
  text-align: center;
}
.numberColumn {
  width: 10%;
}
.titleColumn {
  width: 50%;
}
.requestorColumn {
  width: 20%;
}
table {
  margin-left: auto;
  margin-right: auto;
  border: none;
}
.songRow-enter-active, .songRow-leave-active {
  transition: all 1s;
}
.songRow-enter, .songRow-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
