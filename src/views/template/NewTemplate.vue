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
                 @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
   <el-dialog title="新增字段" :visible.sync="dialogFormVisible" :before-close="handleClose">
     <el-form :model="dialogform" :rules="rules" ref="dialogform">
       <el-form-item label="字段名" :label-width="formLabelWidth" prop="fieldname">
         <el-input v-model="dialogform.fieldname" autocomplete="off"></el-input>
       </el-form-item>
       <el-form-item label="字段类型" :label-width="formLabelWidth" prop="datatype">
         <el-select v-model="dialogform.datatype" placeholder="请选择字段类型">
           <el-option label="string" value="string"></el-option>
           <el-option label="int" value="int"></el-option>
           <el-option label="float" value="float"></el-option>
           <el-option label="array" value="array"></el-option>
           <el-option label="date" value="date"></el-option>
         </el-select>
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
    return{
      form:{
        templateName:''
      },
      dialogform:{
        fieldname:'',
        datatype:''
      },
      rules:{
        templateName:{ required: true, message: '请输入模板名', trigger: 'blur' },
        fieldname:{ required: true, message: '请输入字段名', trigger: 'blur' },
        datatype:{ required: true, message: '请选择字段类型', trigger: 'blur' }
      },
      table:[],
      dialogFormVisible:false,
      formLabelWidth:'120px',
      showEmptyAlert:false
    }
  },
  methods:{
    generate(){
      this.$refs['Form'].validate((valid) => {
        if(valid){
          if(this.table.length !== 0){
            //生成json文件
            let content = JSON.stringify(this.table)
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
          this.table.push({
            fieldname:this.dialogform.fieldname,
            datatype:this.dialogform.datatype
          })
          this.$refs[formName].resetFields();
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields();
    },
    handleClose(done) {
      this.$refs['dialogform'].resetFields();
      done()
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

</style>