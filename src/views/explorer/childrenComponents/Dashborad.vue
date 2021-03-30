<template>
  <div class="dashborad">
    <Header :active="1" :netname="$store.state.netname"></Header>
    <h1>{{status}}</h1>

  </div>
</template>

<script>
import Header from "@/components/explorer/Header";
import {ExplorerStatus} from "@/Network";
export default {
  name: "dashborad",
  data(){
    return{
      status:''
    }
  },
  components:{
    Header
  },
  beforeMount() {
    ExplorerStatus().then(res=>{

      console.log(res);
      this.status = res
    })
  }
}
</script>

<style scoped>

</style>