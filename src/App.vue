<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog
        title="请设置后台ip地址"
        :visible.sync="showdialog"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div>
        <el-tag type="warning">提示</el-tag>
        <span style="margin-left: 1rem">如果第一次使用该平台，可能需要您首先设置后台的ip地址，用于数据传输和交互。</span>
        <div style="display: flex;flex-direction:column;align-items: center;">
          <el-input v-model="ip" placeholder="请输入后台ip" style="margin:1rem 0;"></el-input>
          <el-button type="primary" @click="test" :loading="loading">测试连接</el-button>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import {test} from "@/Network";

export default {
  name: 'app',
  data(){
    return{
      showdialog:true,
      ip:'',
      loading:false
    }
  },
  methods:{
    test(){
      if(this.ip.trim().length == 0){
        this.$message.error('请输入后台ip!')
        return
      }
      this.loading = true
      let baseurl = 'http://' + this.ip + ':8888'
      localStorage.setItem('fabric-base-url',baseurl)
      test().then(res=>{
        if(res == 'success'){
          this.$message.success('连接成功！')
          this.showdialog = false
          location.reload();
        }else{
          this.$message.error('连接失败，请确认ip无误或者后台是否开启！')
        }
        this.loading = false
      })
    }
  },
  beforeMount() {
    let ip = localStorage.getItem('fabric-base-url')
    if(!ip){
      this.showdialog = true
    }else{
      this.showdialog = false
    }
  }

}
</script>

<style>
*{
  margin:0;
  padding:0;
}

</style>
