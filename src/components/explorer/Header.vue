<template>
  <div class="header">
    <div style="font-size: 2rem;font-weight: bold;">
      <span style="color: #1abc9c">BLOCK </span>
      <span style="color: #fdcb6e">EXPLORER</span>
    </div>

    <div class="terms">
      <div class="term" v-for="(item,index) in terms" :key="index" :class="{'active':active==index+1}" @click="termclick(index+1)">{{item}}</div>
    </div>

    <div style="font-size: 1.5rem;color: #00b894;display: flex;align-items: center">
      当前网络：{{netname.split('_')[0]}}
      <el-button type="danger" plain style="margin-left: 1rem" @click="stopExplorer">停止</el-button>
    </div>

    <el-dialog
        :title="dialog.title"
        :visible.sync="loadingexlorer"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div v-loading="loadingexlorer" style="height:300px" :element-loading-text="dialog.text"></div>
      <span slot="footer" class="dialog-footer">
<!--        <el-button>取消</el-button>-->
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {stopexplorer} from "@/Network";

export default {
  name: "Header",
  props:{
    netname:{
      type:String,
      default:'Net'
    },
    active:{
      type:Number,
      default:1
    }
  },
  data(){
    return{
      terms:['仪表盘','网络节点','区块','交易','链码','通道'],
      loadingexlorer:false,
      dialog: {}
    }
  },
  methods:{
    stopExplorer(){
      this.dialog = {
        title:'正在关闭区块浏览器',
        text:'正在关闭'+this.netname.split('_')[0]+'区块浏览器，请稍等......'
      }
      this.loadingexlorer = true
      stopexplorer(this.netname).then(res=>{
        if(res != 'ok'){
          this.$message({
            showClose: true,
            message: '失败！',
            duration:0,
            type: 'error'
          })
        }else{
          this.$message({
            showClose: true,
            message: '已关闭！',
            duration:0,
            type: 'success'
          })
        }
        this.loadingexlorer = false
        this.$router.replace('/refresh')
      })
    },
    termclick(index){
      if(index == this.active){
        return
      }
      switch (index){
        case 1 :
          this.$router.replace('/explorer/dashboard');break
        case 2 :
          this.$router.replace('/explorer/network');break
        case 3 :
          this.$router.replace('/explorer/block');break
        case 4 :
          this.$router.replace('/explorer/transaction');break
        case 5 :
          this.$router.replace('/explorer/chaincode');break
        case 6 :
          this.$router.replace('/explorer/channel');break
        default :
          this.$router.replace('/explorer/dashboard');break

      }
    }
  }
}
</script>

<style scoped lang="less">
  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .terms{
    display: flex;
    margin-left: 2rem;
    .term{
      cursor: pointer;
      font-size: 1.8rem;
      margin-right: 2em;
      color: #636e72;
      &:hover{
        transform: scale(1.2);
        color:#0984e3;
      }
    }
    .active{
      transform: scale(1.2);
      color:#0984e3 ;
    }
  }

</style>