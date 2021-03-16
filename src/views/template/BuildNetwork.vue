<template>
  <div class="build-network">
    <h1>build network</h1>
    <div class="form">
      <div class="formitem">
        <label>网络名：</label><el-input v-model="network" placeholder="网络名"></el-input>
        <div class="btn" @click="preview">预览网络信息</div>
      </div>
      <div class="formitem">
        <div class="btn" @click="addorg">
          <i class="el-icon-plus" style="font-size: 20px;font-weight: bold;margin-right: 10px"></i>点击新建组织
        </div>
      </div>
      <div class="orgform">
        <el-collapse>
          <el-collapse-item v-for="(item,index) in orgs" :key="index" style="height: 100%">
            <div slot="title">
              <i class="el-icon-remove" style="color: #e74c3c;font-size: 1rem;margin-right: 1rem" @click.stop="removeOrg(index)"></i>
              <span>{{'组织'+ (index+1)}}</span>
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
      </div>
    </div>

    <el-dialog
        title="确认网络信息"
        :visible.sync="dialogVisible"
        width="30%">
      <h3>根据你填写的内容，得到以下网络信息，请确认组织、节点、CA服务器等内容是否有误。</h3>
      <div>
        <div class="formitem">
        <label>网络名：</label><span>{{network}}</span>
      </div>
        <el-tree :data="treedata" :default-expand-all="true"></el-tree></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">返回修改</el-button>
        <el-button type="primary" @click="dialogVisible = false">生成网络</el-button>
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
    treedata:[]
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
      console.log(this.orgs);
      let instance = axios.create()
      instance({
        method:'post',
        url:'http://localhost:8888/sendJson',
        data:{
          name:this.network,
          orgs:this.orgs
        }
      }).then(res=>{
        console.log(res);
      })
    },
    preview(){
      this.dialogVisible = true
      this.orgs.forEach(org=>{
        let children = []
        if(org.hasCa){
          children.push({'label':'CA服务器：ca1.'+org.name + '.com'})
        }
        let nodes = []
        org.nodes.forEach(node=>{
          let label = node.type==='peer'?'peer节点：'+node.name + '.' + org.name + '.com':'orderer节点：'+node.name + '.' + org.name + '.ordererorg'
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
    width: 50%;
    //margin: 0 auto;
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
