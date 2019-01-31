<template>
  <main>
    <h1>Hello world</h1>
    <ul>
      <li v-for="artist in shuffledArtists">{{artist}}</li>
    </ul>
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
        shows: [],
        shuffledArtists: []
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
    },
    methods: {
      shuffle(array) {
        let m = array.length, t, i

        while (m) {
          i = Math.floor(Math.random() * m--)
          t = array[m]
          array[m] = array[i]
          array[i] = t
        }
        return array
      }
    },
    mounted() {
      this.shuffledArtists = this.shuffle(this.artists)
    },
    async asyncData () {
      const { data } = await axios.get("https://5iwwhjx9hc.execute-api.us-east-1.amazonaws.com/lfh")
      return { shows: data }
    }
  }
</script>

<style>
  ul {
    padding: 0;
  }
  li {
    display: inline;
    font-size: 5vh;
    list-style: none;
  }
  li + li {
    padding-left: 0.3em;
  }

</style>