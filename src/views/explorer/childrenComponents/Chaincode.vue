<template>
  <div class="chaincode">
    <Header :active="5" :netname="$store.state.netname"></Header>
  </div>
</template>

<script>
import Header from "@/components/explorer/Header";

export default {
  name: "chaincode",
  data(){
    return{
    }
  },
  components:{
    Header
  },
  beforeMount() {

  }
}
</script>

<style scoped>

</style>