<template>
  <div class="build-network">
    <h1>build network</h1>
    <div class="form">
      <div class="formitem">
        <label>网络名：</label><el-input v-model="network" placeholder="网络名"></el-input>
        <div class="btn" @click="genNet">生成网络</div>
      </div>
      <div class="formitem">
        <div class="btn" @click="addorg">
          <i class="el-icon-plus" style="font-size: 20px;font-weight: bold;margin-right: 10px"></i>点击新建组织
        </div>
      </div>
      <div class="orgform">
        <el-collapse>
          <el-collapse-item v-for="(item,index) in orgs" :key="index" :title="'组织'+ (index+1)" style="height: 100%">
            <org-form :org="item" :index="index" @addnode="addnode">

              <div slot="nodeform">
                <el-collapse>
                  <el-collapse-item v-for="(node,idx) in orgs[index].nodes" :key="idx" :title="'节点'+ (idx+1)">
                    <node-form :node="node" :index="idx" :append="item.name"></node-form>
                  </el-collapse-item>
                </el-collapse>
              </div>


            </org-form>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>






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
  }
  },
  methods:{
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
