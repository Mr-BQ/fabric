<template>
<div class="upload">
  <div class="left">
    <el-upload
      action="/newtemplate"
      :on-change="filechange"
      :auto-upload="false"
      :file-list="fileList"
      multiple
      :show-file-list="false">
    <el-button size="small" type="primary">点击上传模板或实例</el-button>
    <div slot="tip" class="el-upload__tip">只能上传JSON文件</div>
  </el-upload>
    <div class="tables">
      <div class="table" v-if="$store.state.templates.length!=0">
        <div class="title">已加载的模版</div>
        <table border="0" cellpadding="0" cellspacing="0">
          <thead>
          <tr>
            <th v-for="(item,index) in headers[0]" :key="index">{{item}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in this.$store.state.templates" :key="index">
            <td @click="showDetail(index,'templates')" class="detail">{{item.name}}</td>
            <td>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(index,'templates')">删除</el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="table" v-if="$store.state.instances.length!=0">
        <div class="title">已加载的实例</div>
        <table border="0" cellpadding="0" cellspacing="0">
          <thead>
          <tr>
            <th v-for="(item,index) in headers[1]" :key="index">{{item}}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in this.$store.state.instances" :key="index">
            <td @click="showDetail(index,'instances')" class="detail">{{item.name}}</td>
            <td>{{item.template}}</td>
            <td>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(index,'instances')">删除</el-button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-button type="primary" round @click="$router.replace('/newinstance')" v-if="$store.state.templates.length!=0">去生成实例</el-button>
  </div>
  <div class="right" v-if="preview!=''">
    <div>{{preview.type === 'template'?'模板':'实例'}}{{preview.name}}</div>
    <json-viewer :value="preview" :expand-depth=6 boxed></json-viewer>
<!--    <pre>{{preview}}</pre>-->
  </div>
</div>
</template>

<script>
export default {
  name: "Upload",
  data(){
    return{
      fileList:[],
      jsonObj:null,
      headers:[['模板名','操作'],['实例名','所属模板','操作']],
      preview:''
    }
  },
  methods:{
    filechange(file){
      if(!(file.raw.type == 'application/json')) {
        this.$message.error('上传模板只能为JSON格式!');
        return
      }else{
        let reader = new FileReader()
        reader.readAsText(file.raw)
        reader.onload = ()=>{
          this.jsonObj = JSON.parse(reader.result)
          if(this.jsonObj.type === 'template'){
            if(this.checkName(this.jsonObj.name,'templates')){
              this.$message.error(this.jsonObj.name+'模板已经加载!');
              return
            }
            this.$store.commit('addTemplate',this.jsonObj)
          }else{
            if(this.checkName(this.jsonObj.name,'instances')){
              this.$message.error(this.jsonObj.name+'实例已经加载!');
              return
            }
            this.$store.commit('addInstance',this.jsonObj)
          }
        }
      }
    },
    handleDelete(index,tbname){
      console.log(index);
      this.$store.state[tbname].splice(index,1)
    },
    checkName(name,tbname){
      if(this.$store.state[tbname].length === 0){
        return false
      }
      return this.$store.state[tbname].some(item=>{
        return item.name === name
      })
    },
    showDetail(index,tbname){
      this.preview = this.$store.state[tbname][index]
    }
  }
}
</script>

<style scoped lang="less">
.upload{
  display: flex;
  .left{
    width: 40%;
    //border:1px solid black;
  }
  .right{
    font-size: 15px;
    width: 50%;
    //border:1px solid black;
    padding: 0 10px;
    pre{
      font-family: "Microsoft JhengHei";
    }

  }
}

  .table{
    .title{
      width: 50px;
      font-size: 25px;
      width: 100%;
    }
    thead{
      th{
        width: 150px;
        height: 50px;
        background-color: #0984e3;
        color:#fff;
      }
    }
    tbody{
      td{
        width: 150px;
        height: 50px;
        background-color: #74b9ff;
        color:#fff;
        text-align: center;
      }
    }
  }

  .detail{
    cursor: pointer;
    &:hover{
      text-decoration: underline;
    }
  }
</style>