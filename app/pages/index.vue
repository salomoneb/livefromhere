<template>
  <div>
    <h1>Hello worl asdkld</h1>
    <p v-for="artist in artists">{{artist}}</p>
<!--     <template v-for="show in shows">
      <h2 >{{show.artists}}</h2>
      <figure>
        <audio controls :src="show.audio">Your browser does not support the <code>audio</code> element.
        </audio>
      </figure>
    </template> -->
  </div>
</template>

<script>
  import axios from "axios"
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
          .reduce((all, current) => all.concat(current))
        allArtists = new Set(allArtists)
        const artists = [...allArtists]
        return artists
      }
    },
    asyncData ({ params }) {
      return axios.get("https://5iwwhjx9hc.execute-api.us-east-1.amazonaws.com/lfh").then(response => {
        return {shows: response.data}
      })
    }
  }
</script>