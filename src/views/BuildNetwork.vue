<template>
  <div class="build-network">
    <el-card>
    <div style="font-size: 2rem;margin-bottom: 1rem">建立网络</div>
      <div class="formitem">
        <label>网络名：</label><el-input v-model="network" placeholder="网络名"></el-input>
        <div class="btn" @click="preview">预览网络信息</div>
<!--        <el-button type="primary" @click="preview">预览网络信息</el-button>-->
      </div>
      <div class="formitem">
        <label>通道名：</label><el-input v-model="channel" placeholder="通道名"></el-input>
      </div>
<!--      <div class="formitem">-->
<!--        <div class="btn" @click="addorg">-->
<!--          <i class="el-icon-plus" style="font-size: 20px;font-weight: bold;margin-right: 10px"></i>点击新建组织-->
<!--        </div>-->
<!--      </div>-->
    </el-card>

    <el-card style="margin-top: 2rem">
      <div  class="orgform">
        <el-collapse style="margin-bottom: 1rem" v-if="orgs.length!==0">
          <el-collapse-item v-for="(item,index) in orgs" :key="index" style="height: 100%;">

            <div slot="title">
              <i class="el-icon-error" style="color: #e74c3c;font-size: 1rem;margin-right: 1rem;font-size: 1.5rem" @click.stop="removeOrg(index)"></i>
              <span style="font-size: 1.5rem">{{'组织'+ (index+1)}}</span>
            </div>

            <org-form :org="item" :index="index" @addnode="addnode">

              <div slot="nodeform">
                <el-collapse>
                  <el-collapse-item v-for="(node,idx) in orgs[index].nodes" :key="idx" >
                    <div slot="title">
                      <i class="el-icon-remove" style="color: #e74c3c;font-size: 1rem;margin-right: 1rem" @click.stop="removeNode(index,idx)"></i>
                      <span>{{'节点'+ (idx+1)}}</span>
                    </div>
                    <node-form :node="node" :index="idx" :append="item.name"></node-form>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </org-form>

          </el-collapse-item>
        </el-collapse>
        <div  @click="addorg" style="cursor: pointer;display: inline-block">
          <i class="el-icon-circle-plus" style="color: #2ecc71;font-size: 1rem;margin-right: 1rem;font-size: 1.5rem"></i>
          <span style="font-size: 1.5rem">新建组织</span>
        </div>
      </div>
    </el-card>

    <el-dialog
        title="确认网络信息"
        :visible.sync="dialogVisible"
        width="30%">
      <h3>根据你填写的内容，得到以下网络信息，请确认组织、节点、CA服务器等内容是否有误。</h3>
      <div>
        <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem" >
        <label>网络名：</label><span>{{network}}</span>
        </div>
        <div class="formitem" style="margin:1rem 0 .5rem;font-size: 1rem">
          <label>通道名：</label><span>{{channel}}</span>
        </div>
        <el-tree :data="treedata" :default-expand-all="true"></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返回修改</el-button>
        <el-button type="primary" @click="genNet">生成并启动网络</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="正在生成网络"
        :visible.sync="loading"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
      <div v-loading="loading" style="height:300px" element-loading-text="正在生成网络，预计时间5分钟，请稍等..."></div>
      <span slot="footer" class="dialog-footer">
<!--        <el-button>取消</el-button>-->
      </span>
    </el-dialog>



  </div>
</template>

<script>
import {Org,Node} from "@/entity";
import OrgForm from "@/components/Form/OrgForm";
import NodeForm from "@/components/Form/NodeForm";
import axios from 'axios'
export default {
name: "BuildNetwork",
  data(){
  return{
    network:'',
    orgs:[],
    dialogVisible:false,
    treedata:[],
    cas:[],
    peers:[],
    orderers:[],
    loading:false,
    channel:''
  }
  },
  methods:{
    removeNode(index,idx){
      this.orgs[index].nodes.splice(idx,1)
    },
    removeOrg(index){
      this.orgs.splice(index,1)
    },
    addorg(){
      this.orgs.push(new Org())
    },
    addnode(index){
      this.orgs[index].nodes.push(new Node())
    },
    genNet(){
      this.dialogVisible = false
      this.loading = true
      //loading start
      let oporg = this.orgs[0].name + '.com'

      let instance = axios.create()
      instance({
        method:'post',
        url:'http://47.115.158.68:8888/sendJson',
        data:{
          netName:this.network + '_mininet',
          channel:this.channel,
          cas:this.cas,
          peers:this.peers,
          orderers:this.orderers,
          opOrg:oporg
        }
      }).then(res=>{
        console.log(res);
        if(res.data == 'ok'){
          this.$message({
            showClose: true,
            message: '网络生成并启动成功！',
            duration:0,
            type: 'success'
          })
        }else{
          this.$message({
            showClose: true,
            message: '失败！',
            duration:0,
            type: 'error'
          })
        }
        this.loading = false
      })
    },
    preview(){
      this.treedata = []
      this.cas = []
      this.peers = []
      this.orderers = []
      this.dialogVisible = true
      this.orgs.forEach(org=>{
        let children = []
        if(org.hasCa){
          children.push({'label':'CA服务器：ca1.'+org.name + '.com'})
          this.cas.push('ca1.'+org.name + '.com')
        }
        let nodes = []
        org.nodes.forEach(node=>{
          let label
          if(node.type==='peer'){
            label = 'peer节点：'+node.name + '.' + org.name + '.com'
            this.peers.push(node.name + '.' + org.name + '.com')
          }else{
            label = 'orderer节点：'+node.name + '.' + org.name + '.ordererorg'
            this.orderers.push(node.name + '.' + org.name + '.ordererorg')
          }
          nodes.push({'label':label})
        })
        children.push({'label':'节点','children':nodes})
        this.treedata.push({'label':'组织 ' + org.name,'children':children})
      })
    }
  },
  components:{
    OrgForm,
    NodeForm
  }
}
</script>

<style scoped lang="less">
  .form{
    //border:1px solid grey;
    //width: 50%;
    //margin: 0 auto;
    margin-top: 2rem;
  }
  .formitem{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    label{
      width: 6rem;
      text-align: center;
    }
    .el-input{
      width: 50%;
    }
  }
  .btn{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 9rem;
    cursor: pointer;
    background-color: #3498db;
    border-radius: 6px;
    height: 3rem;
    width: 10rem;
    justify-content: center;
    color: #fff;
    margin-left: 2rem;
    &:hover{
      color:#eee;
      background-color: #74b9ff;
    }
  }

</style>

<style>
.el-collapse{
  border: none;
}

  .el-collapse-item div{
  border: none;
}
</style>
