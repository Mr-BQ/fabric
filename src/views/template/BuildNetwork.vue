<template>
  <div class="build-network">
    <h1>build network</h1>
    <div class="form">
      <div class="formitem">
        <label>网络名：</label><el-input v-model="network" placeholder="网络名"></el-input>
      </div>
      <div class="formitem">
        <div class="btn" @click="addorg">
          <i class="el-icon-plus" style="font-size: 20px;font-weight: bold;margin-right: 10px"></i>点击新建组织
        </div>
      </div>
    </div>
    <div class="orgform">
      <org-form v-for="(item,index) in orgs" :key="index" :org="item" :index="index" @addnode="addnode">
        <node-form v-for="(node,idx) in orgs[index].nodes" :key="idx" :node="node" :index="idx" slot="nodeform"></node-form>
      </org-form>
    </div>



  </div>
</template>

<script>
import {Org,Node} from "@/entity";
import OrgForm from "@/components/Form/OrgForm";
import NodeForm from "@/components/Form/NodeForm";
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
      &:hover{
        color:#eee;
        background-color: #74b9ff;
      }
    }
  }

</style>