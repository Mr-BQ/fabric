<template>
  <div class="explorer" v-loading="loading" element-loading-text="正在加载网络信息......" >
    <el-card v-if="!explorer && !loading">
      <span>请选择网络：</span>
      <el-select v-model="network" placeholder="请选择网络">
        <el-option v-for="(item,index) in networks" :key="index" :label="item.name.split('_')[0]" :value="item.name.split('_')[0]" ></el-option>
      </el-select>
      <el-button type="primary" plain style="margin-left: 2rem" @click="openExplorer">启动区块浏览器</el-button>
    </el-card>

    <div v-else-if="explorer && !loading">
<!--      <el-card >-->
<!--        <span>区块浏览器：<span style="font-weight: bold">{{explorer.split('_')[0]}}</span></span>-->
<!--        <el-button type="warning" plain style="margin-left: 1rem" @click="stopExplorer">停止</el-button>-->
<!--      </el-card>-->
      <el-card style="margin-bottom: 1rem">
        <Header :active.sync="active" :netname="$store.state.netname" @itemclick="itemclick"></Header>
      </el-card>
      <el-card>
        <Dashboard v-if="active == 1"/>
        <Network v-else-if="active == 2" />
        <Block v-else-if="active == 3" />
        <Transaction v-else-if="active == 4" />
        <Chaincode v-else-if="active == 5" />
        <Channel v-else-if="active == 6" />
      </el-card>
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
import {currentexolorer, getNetinfo, openexplorer} from "@/Network";
import Header from "@/components/explorer/Header";
import Dashboard from "@/views/explorer/childrenComponents/Dashborad";
import Network from "@/views/explorer/childrenComponents/Network";
import Block from "@/views/explorer/childrenComponents/Block";
import Transaction from "@/views/explorer/childrenComponents/Transaction";
import Chaincode from "@/views/explorer/childrenComponents/Chaincode";
import Channel from "@/views/explorer/childrenComponents/Channel";
export default {
  name: "Explorer",
  data(){
    return{
      loading:true,
      networks:[],
      network:'',
      loadingexlorer:false,
      explorer:null,
      dialog:{
        title:'正在启动区块浏览器',
        text:'正在为'+this.network+'启动区块浏览器，请稍等......'
      },
      active:1
    }
  },
  methods:{
    itemclick(index){
      this.active = index
    },
    openExplorer(){
      this.dialog = {
        title:'正在启动区块浏览器',
        text:'正在为'+this.network+'启动区块浏览器，请稍等......'
      }
      this.loadingexlorer = true
      openexplorer(this.network).then(res=>{
        setTimeout(()=>{
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
              message: '区块浏览器启动成功！',
              duration:0,
              type: 'success'
            })

          }
          this.loadingexlorer = false
          this.$router.replace('/refresh')
        },5000)


        // this.$router.replace('/refresh')
        // let el = document.getElementById('explorer')
        // el.click()



        // explorerlogin(this.network.Name).then(res=>{
        //   console.log(res);
        // })
      })
    }
  },
  beforeMount() {
    getNetinfo().then(res=>{
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
      currentexolorer().then(res=>{
        this.explorer = res
        console.log(res);
        if(this.explorer !== null){
          let id = ''
          for(let i;i < this.networks.length;i++){
            if(this.networks[i].name == this.explorer){
              id = this.networks[i].id
            }
          }
          this.$store.commit('setNetname',this.explorer)
          this.$store.commit('setNetid',id)

        }

      })
      this.loading = false
    })
  },
  components:{
    Header,
    Dashboard,
    Network,
    Block,
    Transaction,
    Chaincode,
    Channel
  }
}
</script>

<style scoped>

</style>
