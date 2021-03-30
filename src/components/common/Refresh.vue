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
      if(from.path.indexOf('dashboard') !== -1){
        vm.$router.replace('/explorer')
      }else if(from.name == 'explorer'){
        vm.$router.replace('/explorer/dashboard')
      }else{
        vm.$router.replace(from.path)
      }


    })
  }
}
</script>

<style scoped>

</style>