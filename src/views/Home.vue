<template>
  <div class="home">
    <div style="display: flex;justify-content: space-around">
      <el-card class="box-card">
        <div class="item">
          <span class="key">后台ip</span>
          <div style="display: flex;align-items: center">
            <span class="val" style="margin-right: .5rem">{{showip?ip:'***.***.***.***'}}</span>
            <img src="../assets/view.svg" alt="" v-if="showip" @click="showip = !showip" style="width: 1.5rem">
            <img src="../assets/view_off.svg" alt="" v-else @click="showip = !showip" style="width: 1.5rem">
          </div>
          <div style="display: flex;align-items: center;margin-top: .5rem">
            <div style="height: 1rem;width: 1rem;background-color: #2ecc71;border-radius: 1rem;box-shadow: 0px 0px 4px 1px  #2ecc71" v-if="connected"></div>
            <div style="height: 1rem;width: 1rem;background-color: #e74c3c;border-radius: 1rem;box-shadow: 0px 0px 4px 1px  #e74c3c" v-else></div>
            <span style="margin-left: .5rem">{{connected?'连接正常':'连接失败'}}</span>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="item">
          <span class="key">容器管理服务</span>
          <span class="val">
            {{portainerup?'已开启':'未开启'}}
            <i class="el-icon-success" v-if="portainerup" style="color: #2ecc71"></i>
            <i class="el-icon-error" v-else style="color: #e74c3c"></i>
          </span>

        </div>
      </el-card>
      <el-card class="box-card">
        <div class="item">
          <span class="key">区块浏览器</span>
          <span class="val">
            {{explorer}}
            <i class="el-icon-error" v-if="explorer == '未开启'" style="color: #e74c3c"></i>
            <i class="el-icon-success" v-else style="color: #2ecc71"></i>
          </span>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="item">
          <span class="key">网络数量</span>
          <span class="val">{{netcount}}</span>
        </div>
      </el-card>
    </div>
    <div style="margin-top: 2rem">
      <el-card>
        <div slot="header" class="clearfix">
          <span style="font-size: 1.5rem">使用说明</span>
        </div>
        <div class="readme">
          <p class="paragraph">本平台是基于<el-link type="primary" target="_blank" href="https://www.hyperledger.org/use/fabric"> Hyperledger Fabric </el-link>和<el-link type="primary" target="_blank" href="https://github.com/hyperledger-labs/minifabric"> Mini Fabric </el-link>实现的区块链构建和管理平台，主要功能有区块链构建（包括定义和启动）、区块链节点管理、链码调用、区块和交易信息查看。</p>
          <p class="paragraph">使用之前请将后台jar包放置在要部署区块链的服务器上，并运行该jar包。后台默认运行端口8888。</p>
          <p class="paragraph">区块链运行依赖于<el-link type="primary" target="_blank" href="https://www.docker.com/"> docker </el-link>等环境，请确保服务器安装足够的依赖。</p>
          <p class="paragraph">初次使用该平台，需设置后台ip地址，该ip会储存在本地，之后无需设置。可点击右上角“log out”清除本地储存的后台ip并重新设置。</p>
          <p class="paragraph">构建一个新网络所需时间较长，请耐心等待。</p>
          <p class="paragraph">容器管理服务大部分情况下处于开启状态，如果未开启，在打开“我的网络”模块时会自动开启。</p>
          <p class="paragraph">如后台连接失败，请检查网络是否可用或后台是否开启。如后台ip已变更，请点击右上角“log out”清除本地储存的后台ip并重新设置。</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import {currentexolorer, getNetinfo, portainerup, test} from "@/Network";

export default {
name: "DashBoard",
  data(){
    return{
      showip:false,
      portainerup:false,
      explorer:'未开启',
      netcount:'0',
      connected:false
    }
  },
  computed:{
    ip(){
      return localStorage.getItem('fabric-ip')
    }
  },
  beforeMount() {
    currentexolorer().then(res=>{
      if(res == ''){
          this.explorer = '未开启'
      }else{
        this.explorer = res.split('_')[0]
      }
    })

    getNetinfo().then(res=>{
      if(res =='no net'){
        this.netcount = 0
      }else{
        this.netcount = 0
        res.forEach(item=>{
          if(item.Name.indexOf('_mininet')!==-1){
            this.netcount++
          }
        })
      }
    })

    portainerup().then(res=>{
      this.portainerup = res
    })

    test().then(res=>{
      if(res == 'success'){
        this.connected = true
      }else{
        this.connected = false
      }
    })




  }
}
</script>

<style scoped lang="less">
.item{
  display: flex;
  flex-direction: column;
  align-items: center;
  .key{
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  .val{
    font-size: 1.5rem;
  }
}

.box-card{
  width: 24%;
}

.readme{
  font-size: 1.2rem;
  p{
    margin-bottom: 1rem;
  }
}

.paragraph:before{
  display: inline-block;
  content: "";
  //width: 1rem;
  //height: 1rem;
  //font-weight: bold;
  height: 1rem;
  width: 1rem;
  background-color: #686de0;
  margin-right: 5px;
  //border:10px solid #0984e3;
  border-radius: 10px;

}
</style>
