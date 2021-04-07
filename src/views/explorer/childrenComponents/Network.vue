<template>
  <div class="network">
    <el-table
        :data="nodes"
        style="width: 100%">
      <el-table-column
          prop="server_hostname"
          label="节点名">
      </el-table-column>
      <el-table-column
          prop="requests"
          label="url">
      </el-table-column>
      <el-table-column
          prop="peer_type"
          label="节点类型">
      </el-table-column>
      <el-table-column
          prop="mspid"
          label="MSP ID">
      </el-table-column>
      <el-table-column
          label="账本高度" align="center">
        <el-table-column
            prop="ledger_height_high"
            label="High">
        </el-table-column>
        <el-table-column
            prop="ledger_height_low"
            label="Low">
        </el-table-column>
        <el-table-column
            prop="ledger_height_unsigned"
            :formatter="formatBoolean"
            label="Unsigned">
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {curchannel, getdata} from "@/Network";

export default {
  name: "Network",
  data(){
    return{
      nodes:[]
    }
  },
  methods:{
    formatBoolean(row, column, cellValue){
      if(cellValue === true){
        return 'true'
      }else if(cellValue === false){
        return 'false'
      }else{
        return cellValue
      }
    }
  },
  beforeMount() {
    curchannel().then(res=>{
      let curchannel = res
      let url
      url = '/peersStatus/' + curchannel
      getdata(url).then(res=>{
        if(res == ''){
          this.$router.replace('/refresh')
        }
        console.log(res);
        this.nodes = res.peers
      })
    })
  }
}
</script>

<style scoped>

</style>