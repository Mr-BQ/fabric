<template>
  <div class="containers">
    <el-card style="margin-bottom: 1rem">
      <div class="netname">{{network && network.Name.split('_')[0]}}</div>
      <div class="term">网络ID：<span>{{network && network.Id}}</span></div>
      <div class="term">创建时间：<span>{{network && dateString(new Date(this.network.Created),'yyyy-MM-dd hh:mm:ss')}}</span></div>
      <div class="option">
        <el-button type="success" plain @click="startall">启动所有节点/容器</el-button>
        <el-button type="warning" plain @click="stopall">停止所有节点/容器</el-button>
        <el-button type="primary" plain @click="ccdialogshow=true">安装链码</el-button>
        <el-button type="info" plain @click="netrestart">重启网络</el-button>
        <el-button type="danger" plain @click="alertopen">清除节点和运行文件</el-button>
      </div>
    </el-card>



    <el-card >
      <table class="table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th style="width: 20%">容器</th>
            <th style="width: 5%">状态</th>
            <th style="width: 10%">创建时间</th>
            <th style="width: 20%">镜像</th>
            <th style="width: 10%">容器ID</th>
            <th style="width: 20%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in containers" :key="index">
            <td style="width: 20%"><a href="javascript:;" :title="item.Names[0].slice(1)">{{item.Names[0].slice(1)}}</a></td>
            <td style="width: 5%;text-align: center;">
              <el-tag type="success" effect="dark" v-if="item.State=='running' && item.Status.indexOf('healthy') != -1">healthy</el-tag>
              <el-tag type="success" effect="dark" v-else-if="item.State=='running'">running</el-tag>
              <el-tag type="danger" effect="dark" v-else>stopped</el-tag>
            </td>
            <td style="width: 10%;text-align: center;">{{dateString(new Date(item.Created*1000),'yyyy-MM-dd hh:mm:ss')}}</td>
            <td style="width: 20%;text-align: center;"><a href="javascript:;" :title="item.Image">{{item.Image}}</a></td>
            <td style="width: 10%"><a href="javascript:;" :title="item.Id">{{item.Id}}</a></td>
            <td style="width: 20%;text-align: center;">
              <div>
                <el-button size="mini" type="success" :disabled="isfobidden(item.Image) || !(item.State == 'exited')" @click="option(item.Id,1,index)" :loading="starting == index" >启动</el-button>
                <el-button size="mini" type="danger" :disabled="isfobidden(item.Image) || item.State == 'exited'" @click="option(item.Id,0,index)" :loading="stopping == index">停止</el-button>
                <el-button size="mini" @click="showlogs(item,index)" :loading="gettinglogs == index">查看日志</el-button>
                <el-button size="mini" @click="showinspect(item,index)">更多信息</el-button>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </el-card>

    <el-dialog
        class="logs"
        :title="logtitle"
        :visible.sync="logshow"
        width="80%"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <el-input
          type="textarea"
          :rows="30"
          readonly
          v-model="logs">
      </el-input>
    </el-dialog>

    <el-dialog
        class="inspect"
        :title="inspecttitle"
        :visible.sync="inspectshow"
        width="80%"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div style="overflow-y: scroll;height: 50vh">
        <json-viewer
            :value="inspect"
            :expand-depth=5
            :boxed="true">
        </json-viewer>
      </div>
    </el-dialog>

    <el-dialog
        :title="dialogtitle"
        :visible.sync="loading"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div v-loading="loading" style="height:300px" :element-loading-text="dialogcontent"></div>
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
        <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem">
          <label>链码开发语言：</label>
          <el-select v-model="language" placeholder="请选择语言">
            <el-option label="go" value="go" ></el-option>
            <el-option label="java" value="java" ></el-option>
            <el-option label="node" value="node" ></el-option>
          </el-select>
        </div>
        <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem">
          <label>版本：</label><el-input v-model="version" placeholder="请输入内容"></el-input>
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
import {
  getNetinfo,
  getContainers,
  openexplorer,
  deploychaincode,
  option,
  getlogs,
  getinspect,
  netrestart, netcleanup
} from "@/Network";
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
      initFunc:'init',
      dialogtitle:'',
      dialogcontent:'正在打开区块浏览器...',
      version:'',
      starting:-1,
      stopping:-1,
      logshow:false,
      logtitle:'',
      logs:'',
      gettinglogs:-1,
      forbidden:['hyperledger/explorer-db','hyperledger/explorer','portainer/portainer-ce'],
      inspecttitle:'',
      inspectshow:false,
      inspect:'',
      gettinginspect:-1,
      language:'go'

    }
  },
  methods:{
    alertopen(){
      this.$confirm('此操作将拆除该网络并删除相关文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal:false
      }).then(() => {
        this.netcleanup()
      }).catch(() => {

      });
    },
    netrestart(){
      this.dialogtitle = ''
      this.dialogcontent = '正在重启网络，请稍等...'
      this.loading = true
      netrestart(this.network.Name).then(res=>{
        this.loading = false
        if(res == 'ok'){
          this.$message.success('重启成功！')
          this.$router.replace('/refresh')
        }else{
          this.$message.error('失败！')
        }
      })
    },
    netcleanup(){
      this.dialogtitle = ''
      this.dialogcontent = '正在清除网络，请稍等...'
      this.loading = true
      netcleanup(this.network.Name).then(res=>{
        this.loading = false
        if(res == 'ok'){
          this.$message.success('清除成功！')
          this.$router.replace('/networks')
        }else{
          this.$message.error('失败！')
        }
      })
    },
    isfobidden(name){
      name = name.split(':')[0]
      if(this.forbidden.indexOf(name) !== -1){
        return true
      }else{
        return false
      }
    },
    showinspect(item,index){
      this.gettinginspect = index
      getinspect(item.Id).then(res=>{
        this.inspect = res
        this.gettinginspect = -1
        this.inspecttitle = '查看详细信息：' + item.Names[0].slice(1)
        this.inspectshow = true
      })
    },
    showlogs(item,index){
      this.gettinglogs = index
      getlogs(item.Id).then(res=>{
        // console.log(res);
        this.logs = res
        this.gettinglogs = -1
        this.logtitle = '查看日志：' + item.Names[0].slice(1)
        this.logshow = true
      })
    },
    stopall(){
      this.dialogtitle = ''
      this.dialogcontent = '正在停止所有节点，请稍等...'
      this.loading = true
      let tostop = []
      this.containers.forEach(item=>{
        if(!this.isfobidden(item.Image) && item.State !== 'exited'){
          let promise = option(item.Id,0)
          tostop.push(promise)
        }
      })
      Promise.all(tostop).then(res=>{
        console.log(res);
        this.$message.success('成功！')
        this.loading = false
        this.$router.replace('/refresh')
      })
    },
    startall(){
      this.dialogtitle = ''
      this.dialogcontent = '正在启动所有节点，请稍等...'
      this.loading = true
      let tostart = []
      this.containers.forEach(item=>{
        if(!this.isfobidden(item.Image) && item.State == 'exited'){
          let promise = option(item.Id,1)
          tostart.push(promise)
        }
      })
      Promise.all(tostart).then(res=>{
        console.log(res);
        this.$message.success('成功！')
        this.loading = false
        this.$router.replace('/refresh')
      })
    },
    option(id,opt,index){
      if(opt == 1){
        this.starting = index
      }else if(opt == 0){
        this.stopping = index
      }
      option(id,opt).then(res=>{
        this.starting = -1
        this.stopping = -1
        if(res == 'ok'){
          if(opt == 1){
            this.$message.success('启动成功！')
          }else if(opt == 0){
            this.$message.success('停止成功！')
          }
          this.$router.replace('/refresh')
        }else{
          if(opt == 1){
            this.$message.error('启动失败！')
          }else if(opt == 0){
            this.$message.error('停止失败！')
          }
        }
      })
    },
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
      this.dialogtitle = ''
      this.dialogcontent = '正在部署链码，请稍等...'
      this.loading = true
      let form = new FormData()
      form.append('chaincode',this.fileList[0].raw)
      form.append('netname',this.network.Name)
      form.append('initfunc',this.initFunc)
      form.append('version',this.version)
      form.append('language',this.language)
      deploychaincode(form).then(res=>{
        console.log(res);
        this.loading = false
        if(res != 'ok'){
          this.$message({
            showClose: true,
            message: '失败！请重试！',
            duration:0,
            type: 'error'
          })
          return
        }
        this.fileList = []
        this.initFunc = ''
        this.version = ''
        this.ccdialogshow = false
        this.$message({
          showClose: true,
          message: '成功！请在区块信息模块查看链码信息',
          duration:0,
          type: 'success'
        })
      })
    },
    dateString(date,format){
      return formatDate(date,format)
    },
    explorer(){
      this.dialogtitle = ''
      this.dialogcontent = '正在打开区块浏览器...'
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
