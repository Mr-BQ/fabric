<template>
  <div class="block">
    <Header :active="3" :netname="$store.state.netname"></Header>
  </div>
</template>

<script>
import Header from "@/components/explorer/Header";
export default {
  name: "Block",
  components:{
    Header
  }

}
</script>

<style scoped>

</style>