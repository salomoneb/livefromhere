<template>
  <main>
    <header-component></header-component>
    <ul>
      <li v-for="artist in filteredArtists" :class="{'regular': regular(artist)}">{{artist}}</li>
      <li v-if="!filteredArtists.length">No results</li>
    </ul>
  </main>
</template>

<script>
  import axios from "axios"
  import HeaderComponent from "@/components/Header"
  export default {
    components: {
      HeaderComponent
    },
    computed: {
      artists() {
        return this.$store.getters.artists
      },
      filteredArtists() {
        return this.artists.filter(artist => {
          return artist.toLowerCase().includes(this.$store.state.search)
        })
      }
    },
    methods: {
      regular(artist) {
        return this.$store.state.regulars.includes(artist)
      },
    },
  }
</script>

<style>
  li:hover {
    background-color: #ffa5dd;
  }
</style>