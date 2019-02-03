<template>
  <div class="wrapper">
    <sidebar></sidebar>
    <artists></artists>
  </div>
</template>

<script>
  import axios from "axios"
  import Artists from "@/components/Artists"
  import Sidebar from "@/components/Sidebar"

  export default {
    components: {
      Artists,
      Sidebar
    },
    async fetch({ store, params }) {
      const { data } = await axios.get("https://5iwwhjx9hc.execute-api.us-east-1.amazonaws.com/lfh")
      store.commit("setShows", data)
    }
  }
</script>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
  }
  .wrapper * {
    display: inline;
  }
  aside {
    flex-basis: 25%;
  }
  main, nav, h1, ul, li {
    display: inline;
    flex-basis: 75%;
    font-size: 1.2rem;
    font-weight: 400;
    text-transform: uppercase;
  }
  h1, li {
    cursor: pointer;
  }
  h1 {
    color: red;
  }
  ul {
    padding: 0;
  }
  li {
    color: blue;
    word-break: break-all;
  }
  li + li {
    margin-left: 0.3em;
  }
  input {
    height: 2rem;
    padding: 5px;
    margin: auto;
    width: 100%;
  }
  dt, dd {
    display: inline-block;
  }
  .legend-guest {

  }
</style>