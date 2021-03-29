<template>
 <div class="new-template">
   <el-row>
     <el-col :span="12" :offset="2">
       <el-form :model="form" :rules="rules" ref="Form" label-width="100px" >
         <el-form-item label="模板名" prop="templateName">
           <el-input v-model="form.templateName"></el-input>
         </el-form-item>
       </el-form>
     </el-col>
   </el-row>
   <el-row>
     <el-col :span="12" :offset="4">
       <el-button type="primary" @click="addfield">新增字段</el-button>
     </el-col>
   </el-row>
   <el-row>
     <el-col :span="12" :offset="4">
       <el-table
           :data="table"
           height="350"
           border
           style="width: 100%">
         <el-table-column
             prop="fieldname"
             label="字段名"
             width="180">
         </el-table-column>
         <el-table-column
             prop="datatype"
             label="字段类型"
             width="180">
         </el-table-column>
         <el-table-column label="操作">
           <template slot-scope="scope">
             <el-button
                 size="mini"
                 @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
             <el-button
                 size="mini"
                 type="danger"
                 @click="handleDelete(scope.$index)">删除</el-button>
           </template>
         </el-table-column>
       </el-table>
       <el-alert
           title="字段不能为空"
           type="error"
           v-if="showEmptyAlert" @close="showEmptyAlert = false">
       </el-alert>
     </el-col>
   </el-row>
   <el-dialog :title="updating?'更新字段':'新增字段'" :visible.sync="dialogFormVisible" :before-close="handleClose">
     <el-form :model="dialogform" :rules="rules" ref="dialogform">
       <el-form-item label="字段名" :label-width="formLabelWidth" prop="fieldname" style="padding-right: 200px">
         <el-input v-model="dialogform.fieldname" autocomplete="off" :disabled="updating"></el-input>
       </el-form-item>
       <el-form-item label="字段类型" :label-width="formLabelWidth" prop="datatype">
         <el-select v-model="dialogform.datatype" placeholder="请选择字段类型">
           <el-option label="string" value="string"></el-option>
           <el-option label="int" value="int"></el-option>
           <el-option label="float" value="float"></el-option>
           <el-option label="array" value="array"></el-option>
           <el-option label="date" value="date"></el-option>
           <el-option label="object" value="object"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="请选择该字段的数组类型" :label-width="formLabelWidth" prop="arraytype" v-if="dialogform.datatype==='array'">
         <el-select v-model="dialogform.arraytype" placeholder="请选择该字段的数组类型">
           <el-option label="string" value="string"></el-option>
           <el-option label="int" value="int"></el-option>
           <el-option label="float" value="float"></el-option>
           <el-option label="object" value="object"></el-option>
           <el-option label="date" value="date"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="请选择该字段的数组长度" :label-width="formLabelWidth"  v-if="dialogform.datatype==='array'" prop="lengthtype">
         <el-select  v-model="dialogform.lengthtype" placeholder="请选择该字段的数组长度">
           <el-option label="不定长度" value="unlimited"></el-option>
           <el-option label="限定长度" value="limited"></el-option>
         </el-select>
       </el-form-item>
       <el-form-item label="请输入数组长度" :label-width="formLabelWidth" v-if="dialogform.datatype==='array' && dialogform.lengthtype==='limited'" prop="arraylength" style="padding-right: 200px">
         <el-input v-model.number="dialogform.arraylength" autocomplete="off"></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="resetForm('dialogform')">取 消</el-button>
       <el-button type="primary" @click="submitForm('dialogform')">确 定</el-button>
     </div>
   </el-dialog>
   <el-row>
     <el-col :span="12" :offset="9">
       <el-button type="primary" round @click="generate(Form)">生成模板</el-button>
       <el-tooltip class="item" effect="dark" content="重置表单" placement="right">
        <el-button icon="el-icon-refresh" circle @click="reset"></el-button>
       </el-tooltip>
     </el-col>
   </el-row>

 </div>
</template>

<script>
import FileSaver from 'file-saver'
export default {
  name: "NewTemplate",
  data(){
    var checkFiledname = (rule, value, callback)=>{
      if(this.updating){
        callback()
      }
      if(this.table.find(item =>{
        return item.fieldname === value
      })){
        callback(new Error('该字段已存在！'));
      }else if(value === ''){
        callback(new Error('请输入字段名！'));
      }else{
        callback();
      }
    }
    return{
      form:{
        templateName:''
      },
      dialogform:{
        fieldname:'',
        datatype:'',
        arraytype: '',
        lengthtype:'',
        arraylength:''
      },
      rules:{
        templateName:[{ required: true, message: '请输入模板名', trigger: 'blur' }],
        fieldname:[{validator: checkFiledname, trigger: 'blur'}],
        datatype:[{ required: true, message: '请选择字段类型', trigger: 'blur' }],
        arraytype:[{ required: true, message: '请选择该字段的数组类型', trigger: 'blur' }],
        lengthtype:[{ required: true, message: '请选择该字段的数组长度', trigger: 'blur' }],
        arraylength:[{ required:true,type: 'number',min: 2,message: '长度必须为大于1的整数'}]
      },
      table:[],
      dialogFormVisible:false,
      formLabelWidth:'180px',
      showEmptyAlert:false,
      updating:false,
      updatingIndex:-1
    }
  },
  methods:{
    generate(){
      this.$refs['Form'].validate((valid) => {
        if(valid){
          if(this.table.length !== 0){
            //生成json文件
            let obj = {
              name:this.form.templateName,
              type:'template',
              data:this.table
            }
            let content = JSON.stringify(obj)
            let blob = new Blob([content],{type: "text/plain;charset=utf-8"})
            FileSaver.saveAs(blob,this.form.templateName +'.json')
            return
          }else{
            this.showEmptyAlert = true
          }
        }
        return false

      })
    },
    addfield(){
      this.dialogFormVisible = true
    },
    reset(){
      this.table = []
      this.$refs['Form'].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let datatype
          if(this.dialogform.datatype === 'array'){
            if(this.dialogform.lengthtype === 'limited'){
              datatype = this.dialogform.arraytype + '[' + this.dialogform.arraylength + ']'
            }else{
              datatype = this.dialogform.arraytype + '[]'
            }
          }else{
            datatype = this.dialogform.datatype
          }
          let obj = {
            fieldname:this.dialogform.fieldname,
            datatype:datatype
          }
          if(this.updating){
            this.table.splice(this.updatingIndex,1,obj)
          }else{
            this.table.push(obj)
          }
          this.$refs[formName].resetFields();
          this.dialogFormVisible = false
          this.updating = false
          this.updatingIndex = -1
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false
      this.updating = false
      this.updatingIndex = -1
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      this.$refs['dialogform'].resetFields();
      done()
    },
    handleEdit(index,row){
      let datatype = row.datatype.split('[')[0]
      this.dialogform.fieldname = row.fieldname
      this.dialogform.datatype = row.datatype.indexOf('[') === -1 ? datatype : 'array'
      this.dialogform.arraytype = this.dialogform.datatype === 'array'? datatype : ''
      this.dialogform.lengthtype = this.dialogform.datatype === 'array' ? (row.datatype.indexOf('[]') === -1 ? 'limited' : 'unlimited') : ''
      this.dialogform.arraylength = this.dialogform.datatype === 'array' && this.dialogform.lengthtype === 'limited'? (row.datatype.slice(row.datatype.indexOf('[')+1,row.datatype.indexOf(']')) * 1) : ''
      this.updating = true
      this.updatingIndex = index
      this.dialogFormVisible = true
    },
    handleDelete(index){
      this.table.splice(index,1)
    }
  }
}
</script>

<style scoped>
.new-template{
  color: black;
}
.el-row{
  margin-bottom: 10px;
}
.new-template{
  /*background-color: #ecf0f1;*/
}
</style>