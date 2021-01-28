<template>
  <div class="new-template">
    <div class="chooseTemplate">
      <div class="text">请选择模板：</div>
      <el-select v-model="templateName" placeholder="请选择">
        <el-option
            v-for="item in $store.state.templates"
            :key="item.name"
            :label="item.name"
            :value="item.name">
        </el-option>
      </el-select>
      <el-tooltip class="item" effect="dark"  placement="top">
        <div slot="content">选择已经加载的模板，可通过 <span class="a" @click="toupload">“上传模板或实例”</span>模块加载 </div>
        <i class="el-icon-question" style="font-size: 20px;"></i>
      </el-tooltip>
      <div class="btn" @click="loadForm">开始填写</div>
    </div>
    <div class="form">
      <div v-if="filling.length!=0">当前模板:{{filling}}</div>
      <el-form  :rules="rules" ref="Form" label-width="120px" >
        <el-form-item label="请输入实例名" :rules="[
          { required: true, message: '请输入实例名', trigger: 'blur' }
        ]" v-if="Form.length!=0">
          <el-input v-model="instanceName" ></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in Form" :key="index" :label="item.label+'：'">
          <el-input v-model="item.value" v-if="item.type==='string'"></el-input>
          <el-date-picker v-model="item.value" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="item.type==='date'"></el-date-picker>
          <el-input-number v-model="item.value" :precision="0" v-if="item.type==='int'" ></el-input-number>
          <el-input-number v-model="item.value" :precision="6" v-if="item.type==='float'" ></el-input-number>
          <div v-if="item.type==='object'" class="selectobj">
            <select v-model="item.value"  class="select">
              <option v-for="(instance) in instances" :key="instance.name" :label="instance.name" :value="instance.data"></option>
            </select>
            <span v-if="item.value.length!=0">{{item.value}}</span>
          </div>

          <el-form v-if="item.type==='array'">
            <el-button plain @click="addelement(item)" v-if="item.arraylength==='max'">新增元素</el-button>
              <el-form-item v-for="idx in (item.arraylength==='max'?item.value.length:item.arraylength)" :key="idx" :label="item.label+'['+idx+']'" style="margin-top: 10px">
                <el-input v-model="item.value[idx-1]" v-if="item.arraytype==='string'"></el-input>
                <el-date-picker v-model="item.value[idx-1]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="item.arraytype==='date'"></el-date-picker>
                <el-input-number v-model="item.value[idx-1]" :precision="0" v-if="item.arraytype==='int'" ></el-input-number>
                <el-input-number v-model="item.value[idx-1]" :precision="6" v-if="item.arraytype==='float'" ></el-input-number>
                <div v-if="item.arraytype==='object'" class="selectobj">
                  <select v-model="item.value[idx-1]" class="select" >
                    <option v-for="(instance) in instances" :key="instance.name" :label="instance.name" :value="instance.data"></option>
                  </select>
                  <span v-if="item.value[idx-1].length!=0">{{item.value[idx-1]}}</span>
                  <div>
                    <el-button type="danger" icon="el-icon-delete" circle v-if="item.arraylength==='max'"
                               style="margin-left: 10px;" size="small" @click="remove(index,idx-1)"></el-button>
                  </div>

                </div>
              </el-form-item>
          </el-form>
<!--          <el-form v-if="item.type==='array' && item.arraylength==='max'">-->
<!--            <el-button plain @click="addelement(item)">新增元素</el-button>-->
<!--            <el-form-item v-for="idx in item.value.length" :key="idx" :label="item.label+'['+idx+']'" >-->
<!--              <el-input v-model="item.value[idx-1]" v-if="item.arraytype==='string'"></el-input>-->
<!--              <el-date-picker v-model="item.value[idx-1]" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-if="item.arraytype==='date'"></el-date-picker>-->
<!--              <el-input-number v-model="item.value[idx-1]" :precision="0" v-if="item.arraytype==='int'" ></el-input-number>-->
<!--              <el-input-number v-model="item.value[idx-1]" :precision="6" v-if="item.arraytype==='float'" ></el-input-number>-->
<!--            </el-form-item>-->
<!--          </el-form>-->
        </el-form-item>
      </el-form >
    </div>
    <el-button type="success" round @click="generate">生成实例</el-button>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  name: "NewInstance",
  data(){
    return{
      templateName:'',
      Form: [],
      rules:{},
      filling:'',
      instanceName:'',
      instances:[]
    }
  },
  computed:{
    template(){
      let template = this.$store.state.templates.find(item=>{
        return item.name === this.templateName
      })
      return template
    }
  },
  methods:{
    toupload(){
      this.$router.replace('/upload')
    },
    loadForm(){
      this.instances.push(...this.$store.state.instances)
      this.instanceName = ''
      this.filling = this.templateName
      this.Form = []
      this.template.data.forEach((item)=>{
        if(item.datatype === 'string' ||item.datatype === 'int' || item.datatype === 'float' || item.datatype === 'date'){
          this.Form.push({label:item.fieldname,value:'',type:item.datatype})
        }else if(item.datatype === 'object'){
          this.Form.push({label:item.fieldname,value:'',type:item.datatype})
        }else if(item.datatype.indexOf('[')!==-1){
          let arraytype = item.datatype.slice(0,item.datatype.indexOf('['))
          let arraylength = item.datatype.indexOf('[]')!==-1?'max': item.datatype.slice(item.datatype.indexOf('[')+1,item.datatype.indexOf(']')) * 1
          this.Form.push({label:item.fieldname,value:[],type:'array',arraytype:arraytype,arraylength:arraylength})
        }
      })
    },
    addelement(item){
      item.value.push("")
    },
    generate(){
      console.log(this.Form);
            //生成json文件
      if(this.instanceName === ''){
        this.$message.error('请输入实例名!');
        return
      }
          let data = {}
          this.Form.forEach(item=>{
            data[item.label] = item.value
          })
            let obj = {
              name:this.instanceName,
              type:'instance',
              template:this.filling,
              data:data
            }
            let content = JSON.stringify(obj)
            let blob = new Blob([content],{type: "text/plain;charset=utf-8"})

            FileSaver.saveAs(blob,this.instanceName +'.json')
    },
    remove(FormItemIndex,arrayIndex){
      this.Form[FormItemIndex].value.splice(arrayIndex,1)
    }
  }
}
</script>

<style scoped lang="less">
.chooseTemplate{
  display: flex;
  align-items: center;
}
.a{
  text-decoration: underline;
  cursor: pointer;
}
.btn{
  cursor: pointer;
  height: 40px;
  width: 120px;
  background-color: #0984e3;
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  &:hover{
    background-color: rgba(9, 132, 227,.8);
  }
}

.form{
  width: 800px;
  background-color: #fff;
  border-radius: 5px;
}

.el-form-item{
  width: 400px;
}
.addelement{
  border:2px solid black;
  font-size: 25px;
  border-radius: 25px;
  color: black;
  cursor: pointer;
  &:hover{

  }
}

.selectobj{
  display: flex;
  //border:1px solid black;
  .select{
    font-size: 20px;
    height: 40px;
  }
  span{
    border: 1px solid black;
    line-height: 25px;
    margin-left: 15px;
  }

}

</style>