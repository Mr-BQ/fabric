<template>
  <div class="containers">
    <h1>网络:{{network.Name}}</h1>
    <el-button type="primary" plain @click="explorer">打开区块浏览器</el-button>
    <el-table
        :data="containers"
        style="width: 100%">
      <el-table-column
          prop="Names[0]"
          label="容器" >
        <template slot-scope="scope">
          {{containers[scope.$index].Names[0].slice(1)}}
        </template>
      </el-table-column>
      <el-table-column
          prop="Id"
          label="容器ID">
      </el-table-column>
      <el-table-column
          prop="State"
          label="状态">
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
        // let el = document.getElementById('explorer')
        // el.click()

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
  }
}
</script>

<style scoped>

</style>
