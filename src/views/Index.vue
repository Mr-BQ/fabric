<template>
  <div class="index">
    <el-container style="height: 100vh;overflow: hidden">
      <el-header class="header" style="height: 4rem">
        <el-row>
          <el-col :span="10" style="font-size: 1.2rem">
            基于Hyperledger Fabric的区块链构建和监控平台
          </el-col>
          <el-col :span="1" :offset="12">
            <el-avatar :size="50" :src="circleUrl" class="avatar"></el-avatar>
          </el-col>
          <el-col :span="1">
            <el-dropdown placement="bottom-start">
              <i class="el-icon-circle-plus-outline" style="font-size: 25px;line-height: 60px;cursor: pointer;color:#fff;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>profile</el-dropdown-item>
                <el-dropdown-item @click.native="logout">log out</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-container style="height: 100%">
        <el-aside>
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              text-color="#fff"
              active-text-color="#ffd04b"
              background-color="#545c64"
              @open="handleOpen"
              @close="handleClose"
              @select="menuClick"
              :router=true
              style="height: 100%">
            <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">主页</span>
            </el-menu-item>
            <el-menu-item index="/networks">
              <i class="el-icon-s-operation"></i>
              <span slot="title">我的网络</span>
            </el-menu-item>
            <el-menu-item index="/explorer">
              <i class="el-icon-coin"></i>
              <span slot="title">区块浏览器</span>
            </el-menu-item>
<!--            <el-menu-item index="/newtemplate">-->
<!--              <i class="el-icon-menu"></i>-->
<!--              <span slot="title">生成模板</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="/upload" >-->
<!--              <i class="el-icon-document"></i>-->
<!--              <span slot="title">上传模板或实例</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="/newinstance">-->
<!--              <i class="el-icon-setting"></i>-->
<!--              <span slot="title">生成实例</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="/networks">-->
<!--              <i class="el-icon-setting"></i>-->
<!--              <span slot="title">我的网络</span>-->
<!--            </el-menu-item>-->
            <el-menu-item index="/buildnetwork">
              <i class="el-icon-setting"></i>
              <span slot="title">建立网络</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main  element-loading-text="正在加载网络信息......">
<!--          <el-tabs v-model="editableTabsValue" type="card" closable @edit="handleTabsEdit">-->
<!--            <el-tab-pane-->
<!--                :key="item.name"-->
<!--                v-for="item in editableTabs"-->
<!--                :label="item.title"-->
<!--                :name="item.name"-->
<!--            >-->
<!--            </el-tab-pane>-->
<!--          </el-tabs>-->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>

        </el-main>
      </el-container>
    </el-container>
  </div>

</template>

<script>


export default {
  name: "Index",
  data() {
    return {
      editableTabsValue: '',
      editableTabs: [],
      tabIndex: 0,
      circleUrl:'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      templates:[],
      networks:[],
    }
  },
  methods: {
    logout(){
      console.log('logout');
      localStorage.removeItem('fabric-base-url')
      location.reload();
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleTabsEdit(targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: targetName,
          name: newTabName,
          content: ''
        });
        this.editableTabsValue = newTabName;
      }
      if (action === 'remove') {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
    menuClick(){
      // if(key == 2){
      //   this.$router.replace('/newtemplate')
      // }else if(key == 3){
      //   this.$router.replace('/upload')
      // }else if(key == 4){
      //   this.$router.replace('/newinstance')
      // }
    }
  },
  beforeMount() {
    // getNetinfo().then(res=>{
    //   this.loading = false
    //   console.log(res);
    //   if(res =='no net'){
    //     this.networks = []
    //   }else{
    //     res.forEach(item=>{
    //       if(item.Name.indexOf('_mininet')!==-1){
    //         this.networks.push({name:item.Name,id:item.Id})
    //       }
    //     })
    //   }
    // })
  }
}
</script>

<style scoped lang="less">
 .header{
   background-color: #3498db;
   color:#ecf0f1;
   line-height: 60px;
   .avatar{
     margin-top: 4px;
   }
 }
 .el-main{
   color: black;
   padding-bottom: 10rem;
 }



</style>
