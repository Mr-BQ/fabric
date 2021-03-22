<template>
  <div class="mynetwork">
    <el-table
        :data="networks"
        style="width: 100%">
      <el-table-column
          prop="name"
          label="网络">
      </el-table-column>
      <el-table-column
          prop="id"
          label="网络ID">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button
              @click.native.prevent="detail(scope.row)"
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
      networks:[]
    }
  },
  methods:{
    detail(row){
      this.$router.replace("/networks/" + row.id)
    }
  },
  beforeMount() {
    getNetinfo().then(res=>{
      console.log(res);
      res.forEach(item=>{
        if(!item.Portainer){
          this.networks.push({name:item.Name,id:item.Id})
        }
      })
    })
  }
}
</script>
<style scoped>

</style>
