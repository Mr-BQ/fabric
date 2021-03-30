<template>
  <div class="network">
    <Header :active="2" :netname="$store.state.netname"></Header>
  </div>
</template>

<script>
import Header from "@/components/explorer/Header";

export default {
  name: "Network",
  components:{
    Header
  }
}
</script>

<style scoped>

</style>