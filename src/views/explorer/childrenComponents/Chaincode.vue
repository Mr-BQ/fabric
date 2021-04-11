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
        :before-close="dialogclose"
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
        <span style="font-size: .5rem;color: grey;margin-left: 10px">请按顺序输入参数，参数间用逗号","隔开。没有参数则无需输入。</span>
      </div>
      <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem">
        <label>调用者：</label>
        <el-select v-model="invokeorg" placeholder="请选择">
          <el-option
              v-for="(item,index) in peerorg"
              :key="index"
              :label="item"
              :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem;justify-content: center" v-if="!showres">
        <el-button type="success" :loading="loading" @click="invoke">{{loading?'正在调用...':'调用'}}</el-button>
      </div>
      <div v-if="showres">
        <div class="formitem">
          <label>调用结果：</label>
          <el-tag type="success" effect="dark" style="font-size: 1rem" v-if="success">成功</el-tag>
          <el-tag type="danger" effect="dark" style="font-size: 1rem" v-else>失败</el-tag>
        </div>
        <div class="formitem">
          <label>message：</label>
          <el-input
              type="textarea"
              autosize
              readonly
              v-model="message">
          </el-input>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>

import {curchannel, getdata, invoke} from "@/Network";

export default {
  name: "chaincode",
  data(){
    return{
      chaincode:[],
      invokedialog:false,
      chaincodename:'',
      func:'',
      params:'',
      loading:false,
      success:true,
      message:'',
      showres:false,
      peerorg:[],
      invokeorg:''
    }
  },
  methods:{
    dialogclose(done){
      this.func = ''
      this.params = ''
      this.showres = false
      done()
    },
    invoke(){
      this.loading = true
      let paramStr = `"${this.func}"`
      if(this.params.trim().length != 0){
        let params = this.params.split(',')
        for(let i =0;i<params.length;i++){
          paramStr = paramStr + `,"${params[i]}"`
        }
      }
      console.log(paramStr);
      invoke(this.$store.state.netname,this.chaincodename,paramStr,this.invokeorg).then(res=>{
        let result = res
        if(result.indexOf('Error:') !== -1){
          this.success = false
          this.message = result
        }else{
          result = result.replace(/\\/g,'')
          this.success = true
          this.message = result
        }
        this.showres = true
        this.loading = false
        console.log(res);
      })
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

      url = '/peersStatus/' + curchannel
      getdata(url).then(res=>{
        console.log(res);
        res.peers.forEach(item=>{
          if(item.peer_type == 'PEER'){
            let orgname = item.server_hostname.slice(item.server_hostname.indexOf('.')+1)
            if(this.peerorg.indexOf(orgname) == -1){
              this.peerorg.push(orgname)
            }
          }
        })
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
