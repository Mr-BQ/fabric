<template>
    <div class="org">
<!--      <div class="title">组织{{index+1}}</div>-->
      <div class="formitem">
        <label>组织名：</label>
        <el-input v-model="org.name" placeholder="组织名"></el-input>
      </div>
      <div class="formitem">
        <label>组织类型：</label>
        <el-select v-model="org.type" placeholder="请选择组织类型">
          <el-option label="Orderer Organization" value="Orderer"></el-option>
          <el-option label="Peer Organization" value="Peer"></el-option>
        </el-select>
      </div>
      <div class="formitem">
        <label>CA服务器端口：</label><el-input v-model="org.caPort" placeholder="CA服务器端口"></el-input>
      </div>
      <div class="formitem">
        <label>节点信息：</label>
        <div class="btn" @click="addnode(index)">新增节点</div>
      </div>
      <div class="nodeform">
        <slot name="nodeform"></slot>
      </div>
    </div>
</template>

<script>
export default {
  name: "OrgForm",
  props:{
    org:{
      type:Object,
      default(){
        return {}
      }
    },
    index:{
      type:Number,
      default:-1
    }
  },
  methods:{
    addnode(index){
      this.$emit('addnode',index)
    }
  }
}
</script>

<style scoped lang="less">
  .org{
    .title{
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    .formitem::before{
      content: "";
      //width: 2rem;
      font-weight: bold;
      margin-right: 5px;
      border:5px solid #0984e3;
      border-radius: 5px;
    }
  }
  .formitem{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    label{
      width: 8rem;
      text-align: center;
    }
    .el-input{
      width: 40%;
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

  .nodeform{
    margin-left: 2rem;
  }

</style>