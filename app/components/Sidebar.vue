<template>
  <aside>
    <input v-model="search"/>
    <dl>
      <dt>Guest</dt>
      <dd class="legend-guest"></dd>
      <dt>Regular</dt>
      <dd class="legend-regular"></dd>
    </dl>
  </aside>
</template>

<script>
  export default {
    computed: {
      search: {
        get() {
          return this.$store.state.search
        },
        set(val) {
          return this.$store.commit("setSearch", val)
        }
      }
    }
  }
</script>

<style>
</style>