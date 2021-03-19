<template>
  <div class="node-form">
<!--    <div class="title">节点{{index+1}}</div>-->
    <div class="formitem">
      <label>节点名：</label>

      .


      <el-input v-model="node.name" placeholder="节点名">
        <template slot="append">{{node.type=='orderer'?'.'+append+'.ordererorg':'.'+append+'.com'}}</template>
      </el-input>
    </div>
    <div class="formitem">
      <label>节点类型：</label>
      <el-select v-model="node.type" placeholder="请选择节点类型">
        <el-option label="orderer node" value="orderer"></el-option>
        <el-option label="peer node" value="peer"></el-option>
      </el-select>
    </div>
<!--    <div class="formitem">-->
<!--      <label>端口：</label><el-input v-model="node.port" placeholder="节点端口"></el-input>-->
<!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "NodeForm",
  props:{
    node:{
      type:Object,
      default(){
        return {}
      }
    },
    index:{
      type:Number,
      default:-1
    },
    append:{
      type:String,
      default:''
    }
  }
}
</script>

<style scoped lang="less">
.title{
  font-size: 1.2rem;
  margin-bottom: 1rem;
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
.formitem::before{
  content: "";
  //width: 2rem;
  font-weight: bold;
  margin-right: 5px;
  border:5px solid #42b983;
  border-radius: 5px;
}
</style>