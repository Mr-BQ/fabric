<template>
  <div class="channel">
    <el-table
        :data="channels"
        style="width: 100%">
      <el-table-column
          prop="id"
          label="ID">
      </el-table-column>
      <el-table-column
          prop="channelname"
          label="通道名">
      </el-table-column>
      <el-table-column
          prop="blocks"
          label="区块数">
      </el-table-column>
      <el-table-column
          prop="transactions"
          label="交易数">
      </el-table-column>
      <el-table-column
          label="时间">
        <template slot-scope="scope">
          <div>
            {{formatdate(new Date(scope.row.createdat),'yyyy-MM-dd hh:mm:ss')}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import {getdata} from "@/Network";
import {formatDate} from "@/utils";

export default {
  name: "Channels",
  data(){
    return{
      channels:[]
    }
  },
  methods:{
    formatdate(date,fmt){
      return formatDate(date,fmt)
    }
  },
  beforeMount() {

      let url = '/channels/info'
      getdata(url).then(res=>{
        console.log(res);
        this.channels = res.channels
      })
  }
}
</script>

<style scoped>

</style>