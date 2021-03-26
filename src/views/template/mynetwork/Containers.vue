<template>
  <div class="containers">
    <el-card style="margin-bottom: 1rem">
      <div class="netname">{{network && network.Name.split('_')[0]}}</div>
      <div class="term">网络ID：<span>{{network && network.Id}}</span></div>
      <div class="term">创建时间：<span>{{network && dateString(new Date(this.network.Created),'yyyy-MM-dd hh:mm:ss')}}</span></div>
      <div class="option">
        <el-button type="success" plain >启动网络</el-button>
        <el-button type="primary" plain @click="ccdialogshow=true">安装链码</el-button>
        <el-button type="info" plain >重启网络</el-button>
        <el-button type="warning" plain >拆除网络</el-button>
        <el-button type="danger" plain >清除节点和运行文件</el-button>
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

    <el-dialog
        title="安装链码"
        :visible.sync="ccdialogshow"
        width="50%"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div>
        <div class="formitem">
          <label>链码部署网络：</label><span>{{network && network.Name.split('_')[0]}}</span>
        </div>
        <div class="formitem">
          <label>请上传链码：</label>
          <el-upload
              action=""
              :on-remove="handleRemove"
              :on-change="handleChange"
              :file-list="fileList"
              :auto-upload="false">
            <el-button slot="trigger" size="small" type="success">选取文件</el-button>
<!--            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
            <div slot="tip" class="el-upload__tip">只能上传后缀名为tar.gz的压缩文件，文件名为链码名称，例如sample.tar.gz</div>
          </el-upload>
        </div>
        <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem">
          <label>链码初始化方法名：</label><el-input v-model="initFunc" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deploycc">部署链码</el-button>
      </span>
    </el-dialog>
<!--    <a href="http://47.115.158.68:7201" target="_blank" v-show="false" id="explorer"></a>-->
  </div>
</template>

<script>
import {getNetinfo,getContainers,openexplorer,deploychaincode} from "@/Network";
import {formatDate} from "@/utils";

export default {
name: "containers",
  data(){
    return{
      containers:[],
      network:null,
      loading:false,
      ccdialogshow:false,
      fileList:[],
      initFunc:'init'
    }
  },
  methods:{
    handleChange(file){
      if(this.fileList.length !== 0){
        this.fileList.pop()
      }
      this.fileList.push(file)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    deploycc(){
      let form = new FormData()
      form.append('chaincode',this.fileList[0].raw)
      form.append('netname',this.network.Name)
      form.append('initfunc',this.initFunc)
      deploychaincode(form).then(res=>{
        console.log(res);
      })
    },
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
