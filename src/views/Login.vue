<template>
<div class="login">
  <div class="outter">
    <div class="logo">
      <el-avatar :size="70"> user </el-avatar>
    </div>
    <div class="inner">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="账号" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="margin:25px;">登录</el-button>
          <el-button>注册</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</div>
</template>

<script>
export default {
name: "Login",
  data(){
    return{
      form:{
        name:'',
        password:''
      },
      rules:{
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password:[
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    }
  }
}
</script>

<style scoped lang="less">
.outter{
  width: 400px;
  height: 500px;
  background-color: #ecf0f1;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border-radius: 6px;
  .logo{
    margin:10px auto;
    text-align: center;
  }
  .inner{
    width: 90%;
    margin-top: 20px;
  }
}
</style>