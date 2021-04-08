<template>
  <div class="chaincode">
    <el-table
        :data="chaincode"
        style="width: 100%">
      <el-table-column
          prop="chaincodename"
          label="链码名">
      </el-table-column>
      <el-table-column
          prop="channelName"
          label="通道名">
      </el-table-column>
      <el-table-column
          prop="path"
          label="路径">
      </el-table-column>
      <el-table-column
          prop="txCount"
          label="交易数">
      </el-table-column>
      <el-table-column
          prop="version"
          label="版本">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {curchannel, getdata} from "@/Network";

export default {
  name: "chaincode",
  data(){
    return{
      chaincode:[]
    }
  },
  beforeMount() {
    curchannel().then(res=>{
      let curchannel = res
      let url
      url = '/chaincode/' + curchannel
      getdata(url).then(res=>{
        console.log(res);
        this.chaincode = res.chaincode
      })
    })
  }
}
</script>

<style scoped>

</style>