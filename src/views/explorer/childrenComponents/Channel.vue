<template>
  <div class="channel">
    <Header :active="6" :netname="$store.state.netname"></Header>
  </div>
</template>

<script>
import Header from "@/components/explorer/Header";

export default {
  name: "Channels",
  components:{
    Header
  }
}
</script>

<style scoped>

</style>