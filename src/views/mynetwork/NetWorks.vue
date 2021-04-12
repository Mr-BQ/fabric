<template>
  <div class="mynetwork" :v-loading="loading">
    <el-table
        :data="networks"
        style="width: 100%">
      <el-table-column
          label="网络">
        <template slot-scope="scope">
          <span>{{scope.row.name.split('_')[0]}}</span>
        </template>
      </el-table-column>
      <el-table-column
          prop="id"
          label="网络ID">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="detail(scope.row.name)"
              type="text">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getNetinfo} from "@/Network";

export default {
  name: "NetWorks",
  data(){
    return{
      networks:[],
      loading:true
    }
  },
  methods:{
    detail(name){
      name = name.split('_')[0]
      this.$router.replace("/networks/" + name)
    }
  },
  beforeMount() {
    getNetinfo().then(res=>{
      this.loading = false
      console.log(res);
      if(res =='no net'){
        this.networks = []
      }else{
        res.forEach(item=>{
          if(item.Name.indexOf('_mininet')!==-1){
            this.networks.push({name:item.Name,id:item.Id})
          }
        })
      }
    })
  }
}
</script>
<style scoped>

</style>
