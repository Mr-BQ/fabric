<template>
  <div class="containers">
    <el-card style="margin-bottom: 1rem">
      <div class="netname">{{network && network.Name}}</div>
      <div class="term">网络ID：<span>{{network && network.Id}}</span></div>
      <div class="term">创建时间：<span>{{dateString(new Date(this.network.Created),'yyyy-MM-dd hh:mm:ss')}}</span></div>
      <div class="option">
        <el-button type="primary" plain @click="explorer">启动区块浏览器</el-button>
      </div>
    </el-card>



    <el-card >
      <table class="table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th style="width: 20%">容器</th>
            <th style="width: 10%">状态</th>
            <th style="width: 20%">创建时间</th>
            <th style="width: 30%">镜像</th>
            <th style="width: 10%">容器ID</th>
            <th style="width: 20%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in containers" :key="index">
            <td style="width: 20%"><a href="javascript:;" :title="item.Names[0].slice(1)">{{item.Names[0].slice(1)}}</a></td>
            <td style="width: 10%;text-align: center;">{{item.State}}</td>
            <td style="width: 20%;text-align: center;">{{dateString(new Date(item.Created*1000),'yyyy-MM-dd hh:mm:ss')}}</td>
            <td style="width: 30%;text-align: center;"><a href="javascript:;" :title="item.Image">{{item.Image}}</a></td>
            <td style="width: 10%"><a href="javascript:;" :title="item.Id">{{item.Id}}</a></td>
            <td style="width: 20%;text-align: center;">操作</td>
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
    dateString(date,format){
      return formatDate(date,format)
    },
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
    font-size: 1.2rem;
  }
  td{
    a{
      display: block;
      text-align: left;
      line-height: 2rem;
      //word-break: break-word;
      padding: 1rem;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: none;
      color: inherit;
    }


  }

  tbody tr,thead{
      display: table;
      width:100%;
      table-layout:fixed;
  }

  thead{
      width: calc( 100% - 1rem );
      background-color: #2ecc71;
      height: 3rem;
      color: #fff;
  }
  tbody{
    display: block;
    height: 500px;
    overflow-y: auto;

    tr:nth-child(even){
      background-color: #ecf0f1;
    }
  }

}
</style>
