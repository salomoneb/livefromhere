<template>
  <main>
    <h1>Hello world</h1>
    <p v-for="artist in artists">{{artist}}</p>
<!--     <template v-for="show in shows">
      <h2 >{{show.artists}}</h2>
      <figure>
        <audio controls :src="show.audio">Your browser does not support the <code>audio</code> element.
        </audio>
      </figure>
    </template> -->
  </main>
</template>

<script>
  import axios from "axios"
  import { mapGetters } from "vuex"

  export default {
    data() {
      return {
        shows: []
      }
    },
    computed: {
      artists() {
        let allArtists = this.shows
          .map(show => show.artists)
          .reduce((list, artist) => list.concat(artist))
        allArtists = new Set(allArtists)
        const artists = [...allArtists]
        return artists
      },
      regulars() {

      }
    },
    mounted() {
      console.log(this.$store.state.regulars)
    },
    async asyncData () {
      const { data } = await axios.get("https://5iwwhjx9hc.execute-api.us-east-1.amazonaws.com/lfh")
      return { shows: data }
    }
  }
</script>