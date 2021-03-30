<template>
  <div class="transaction">
    <Header :active="4" :netname="$store.state.netname"></Header>
  </div>
</template>

<script>
import Header from "@/components/explorer/Header";

export default {
name: "Transaction",
  components:{
    Header
  }
}
</script>

<style scoped>

</style>