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
<!--      <el-table-column-->
<!--          prop="path"-->
<!--          label="路径">-->
<!--      </el-table-column>-->
      <el-table-column
          prop="txCount"
          label="交易数">
      </el-table-column>
      <el-table-column
          prop="version"
          label="版本">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="chaincodename=scope.row.chaincodename;invokedialog=true">调用链码</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
        title="调用链码"
        :visible.sync="invokedialog"
        width="50%"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div class="formitem">
        <label>调用链码：</label><span>{{chaincodename}}</span>
      </div>
      <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem">
        <label>方法名：</label><el-input v-model="func" placeholder="请输入内容"></el-input>
      </div>
      <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem">
        <label>参数：</label><el-input v-model="params" placeholder="参数1,参数2,参数3,...,参数n"></el-input>
        <span style="font-size: .5rem;color: grey;margin-left: 10px">请按顺序输入参数，参数间用逗号","隔开</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {curchannel, getdata} from "@/Network";

export default {
  name: "chaincode",
  data(){
    return{
      chaincode:[],
      invokedialog:false,
      chaincodename:'',
      func:'',
      params:''
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

<style scoped lang="less">
.formitem{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
label{
  width: 20%;
  text-align: center;
  font-size: 1.2rem;
}
.el-input{
  width: 50%;
  font-size: 1rem;
}
span{
  font-size: 1.2rem;
}
}
</style>