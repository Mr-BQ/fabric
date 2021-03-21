<template>
  <div class="index">
    <el-container style="height: 100vh;overflow: hidden">
      <el-header class="header" style="height: 4rem">
        <el-row>
          <el-col :span="1">
            header
          </el-col>
          <el-col :span="1" :offset="20">
            <el-avatar :size="50" :src="circleUrl" class="avatar"></el-avatar>
          </el-col>
          <el-col :span="1">
            <el-dropdown placement="bottom-start">
              <i class="el-icon-circle-plus-outline" style="font-size: 25px;line-height: 60px;cursor: pointer;color:#fff;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>profile</el-dropdown-item>
                <el-dropdown-item>log out</el-dropdown-item>
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
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu>
            </el-submenu>
            <el-menu-item index="/newtemplate">
              <i class="el-icon-menu"></i>
              <span slot="title">生成模板</span>
            </el-menu-item>
            <el-menu-item index="/upload" >
              <i class="el-icon-document"></i>
              <span slot="title">上传模板或实例</span>
            </el-menu-item>
            <el-menu-item index="/newinstance">
              <i class="el-icon-setting"></i>
              <span slot="title">生成实例</span>
            </el-menu-item>
            <el-menu-item index="/buildnetwork">
              <i class="el-icon-setting"></i>
              <span slot="title">建立网络</span>
            </el-menu-item>
            <el-menu-item index="/networks">
              <i class="el-icon-setting"></i>
              <span slot="title">我的网络</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <el-tabs v-model="editableTabsValue" type="card" closable @edit="handleTabsEdit">
            <el-tab-pane
                :key="item.name"
                v-for="item in editableTabs"
                :label="item.title"
                :name="item.name"
            >
            </el-tab-pane>
          </el-tabs>
          <router-view></router-view>
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
      templates:[]
    }
  },
  methods: {
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
