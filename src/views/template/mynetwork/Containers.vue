<template>
  <div class="containers">
    <el-card>
      <div class="netname">{{network && network.Name}}</div>
      <div class="term">网络ID：<span>{{network && network.Id}}</span></div>
      <div class="term">创建时间：<span>{{creatDate}}</span></div>
    </el-card>

    <div class="option">
      <el-button type="primary" plain @click="explorer">启动区块浏览器</el-button>
    </div>

    <el-card>
      <table class="table">
        <thead>
          <tr>
            <th>容器</th>
            <th>容器ID</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in containers" :key="index">
            <td>{{item.Names[0].slice(1)}}</td>
            <td>{{item.Id}}</td>
            <td>{{item.State}}</td>
            <td>操作</td>
          </tr>
        </tbody>
      </table>
    </el-card>



    <el-dialog
        title=""
        :visible.sync="loading"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div v-loading="loading" style="height:300px" element-loading-text="正在打开区块浏览器..."></div>
      <span slot="footer" class="dialog-footer">
<!--        <el-button>取消</el-button>-->
      </span>
    </el-dialog>
    <a href="http://47.115.158.68:7201" target="_blank" v-show="false" id="explorer"></a>
  </div>
</template>

<script>
import {getNetinfo,getContainers,openexplorer} from "@/Network";
import {formatDate} from "@/utils";

export default {
name: "containers",
  data(){
    return{
      containers:[],
      network:null,
      loading:false
    }
  },
  methods:{
    explorer(){
      this.loading = true
      openexplorer(this.network.Name).then(res=>{
        this.loading = true
        if(res != 'ok'){
          this.$message.error('失败！')
          return
        }

        this.loading = false
        let el = document.getElementById('explorer')
        el.click()



        // explorerlogin(this.network.Name).then(res=>{
        //   console.log(res);
        // })
      })
    }
  },
  beforeMount() {
    getNetinfo(this.$route.params.id).then(res=>{
      console.log(res);
      this.network = res
    })
    getContainers(this.$route.params.id).then(res=>{
      console.log(res);
      this.containers = res
    })
  },
  watch:{
    '$route'(to){
      getNetinfo(to.params.id).then(res=>{
        console.log(res);
        this.network = res
      })
      getContainers(to.params.id).then(res=>{
        console.log(res);
        this.containers = res
      })
    }
  },
  computed:{
    creatDate(){
      return formatDate(new Date(this.network.Created),'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>

<style scoped lang="less">
.netname{
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: .5rem;
}
.term{
  font-size: 1.2rem;
  color: grey;
  margin-bottom: .5rem;
}
.option{
  margin-top: 1rem;
}

.table{
  th{
    width: 25%;
  }
  td{
    text-align: center;
    border:1px solid black;
  }
}
</style>