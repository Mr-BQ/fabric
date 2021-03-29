<template>
<div class="refresh"></div>
</template>

<script>
export default {
  name: "Refresh",
  beforeRouteEnter(to,from,next){
    next(vm => {
      // if(from.path.indexOf('/profile')!==-1){
      //   vm.$router.replace('/')
      // }else{
      //
      // }
      vm.$router.replace(from.path)
    })
  }
}
</script>

<style scoped>

</style>