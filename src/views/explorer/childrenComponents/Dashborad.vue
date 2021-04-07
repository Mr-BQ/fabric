<template>
  <div class="dashboard">
    <div class="status">
      <div class="item" v-for="(item,index) in status" :key="index">
        <div style="font-size: 1.5rem">{{item.cn}}</div>
        <div>{{item.en}}</div>
        <div style="font-size: 2rem">{{item.val}}</div>
      </div>
    </div>

    <div style="display: flex;margin-top: 2rem">
      <div>
        <div class="nodes" style="margin-bottom: 1rem;">
          <el-card>
            <div slot="header" class="clearfix">
              <span style="font-size: 25px">节点</span>
            </div>
            <div v-for="n in nodes" :key="n.server_hostname" class="node">
              {{n.server_hostname}}
              <el-tag type="success" v-if="n.peer_type == 'PEER'" effect="dark">PEER</el-tag>
              <el-tag type="warning" v-else-if="n.peer_type == 'ORDERER'" effect="dark">ORDERER</el-tag>
            </div>
          </el-card>
        </div>
        <div class="latest3blks">
          <el-card>
            <div slot="header" class="clearfix">
              <span style="font-size: 25px">最新的三个区块</span>
            </div>
            <div>
              <div class="steps" style="width: 600px;margin-left:100px">
                <el-steps :active="3" finish-status="process" >
                  <el-step  icon="el-icon-coin"></el-step>
                  <el-step  icon="el-icon-coin"></el-step>
                  <el-step  icon="el-icon-coin"></el-step>
                </el-steps>
              </div>
              <div class="cards" style="display: flex;margin-top: 1rem">
                <el-card v-for="(item,index) in blockActivity" :key="index" style="width: 250px;margin-right: 30px">
                  <div slot="header" class="clearfix" style="color: #fff">
                    区块{{item.blocknum}}
                  </div>
                  <div class="block">
                    <span class="info">
                      <span class="label">通道名：</span>
                      <span class="val">{{item.channelname}}</span>
                    </span>
                    <span class="info">
                      <span class="label">块hash：</span>
                      <span class="val">{{item.blockhash}}</span>
                    </span>
                    <span class="info">
                      <span class="label">数据hash：</span>
                      <span class="val">{{item.datahash}}</span>
                    </span>
                    <span class="info">
                      <span class="label">上一块hash：</span>
                      <span class="val">{{item.prehash}}</span>
                    </span>
                    <span class="info">
                      <span class="label">交易数：</span>
                      <span class="val">{{item.txcount}}</span>
                    </span>
                    <span class="info">
                      <span class="label">创建时间：</span>
                      <span class="val">{{formatdate(new Date(item.createdt),'yyyy-MM-dd hh:mm:ss')}}</span>
                    </span>
                  </div>
                </el-card>
              </div>

            </div>
          </el-card>
        </div>
      </div>

      <div>
        <div class="chart" style="margin-bottom: 1rem;">
          <el-card>
            <div slot="header" class="clearfix">
              <el-tabs type="border-card">
                <el-tab-pane label="区块/小时"><div id="chart1" style="height: 350px;width: 600px"></div></el-tab-pane>
                <el-tab-pane label="区块/分钟"><div id="chart2" style="height: 350px;width: 600px"></div></el-tab-pane>
                <el-tab-pane label="交易/小时"><div id="chart3" style="height: 350px;width: 600px"></div></el-tab-pane>
                <el-tab-pane label="交易/分钟"><div id="chart4" style="height: 350px;width: 600px"></div></el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </div>
        <div class="txbyorg">
          <el-card>
            <div slot="header" class="clearfix">
              <span style="font-size: 25px">各组织提交的交易数量</span>
            </div>
            <div id="txbyorg" style="width: 600px;height: 300px"></div>
          </el-card>
        </div>
      </div>

    </div>




  </div>
</template>

<script>
import {ExplorerStatus,getdata,curchannel} from "@/Network";
import {formatDate} from "@/utils";

export default {
  name: "dashborad",
  data(){
    return{
      status:[{cn:'区块',en:'BLOCKS',val:'',icon:''},{cn:'交易',en:'BLOCKS',val:'',icon:''},{cn:'peer节点',en:'PEER NODES',val:'',icon:''},{cn:'链码',en:'CHAINCODES',val:'',icon:''},],
      nodes:[],
      blockActivity:[]
    }
  },
  methods:{
    formatdate(date,fmt){
      return formatDate(date,fmt)
    }
  },
  beforeMount() {
    ExplorerStatus().then(res=>{
      console.log(res);
      this.status[0].val = res.latestBlock
      this.status[1].val = res.txCount
      this.status[2].val = res.peerCount
      this.status[3].val = res.chaincodeCount
    })

    curchannel().then(res=>{
      let curchannel = res
      let url
      url = '/peersStatus/' + curchannel
      getdata(url).then(res=>{
        if(res == ''){
          this.$router.replace('/refresh')
        }
        console.log(res);
        this.nodes = res.peers
      })

      url = '/blocksByHour/' + curchannel + '/1'
      getdata(url).then(res=>{
        console.log(res);
        let echarts = require('echarts')
        let mychart = echarts.init(document.getElementById('chart1'))
        let data = []
        res.rows.forEach(item=>{
          data.push([formatDate(new Date(item.datetime),'MM-dd hh:mm'),item.count])
        })
        mychart.setOption({
          xAxis:[{
            type:'category',
            // name:'time',
          }],
          yAxis:[{
            // name:'TH/S',
            show:true
          }],
          tooltip:{
            trigger:'axis'
          },
          grid:{
            left:50,
            right:50,
            height:'50%'
          },
          // datazoom:[{
          //   type:'slider',
          //   show:true,
          //   xAxisIndex: [0],
          //   start:1,
          //   end:35
          // }
          // ],
          series:{
            name:'数量',
            type:'line',
            data:data,
            lineStyle:{
              color:'#3498db'
            },
            itemStyle:{
              color:'#3498db'
            }
          }
        })
      })

      url = '/blocksByMinute/' + curchannel + '/1'
      getdata(url).then(res=>{
        console.log(res);
        let echarts = require('echarts')
        let mychart = echarts.init(document.getElementById('chart2'))
        let data = []
        res.rows.forEach(item=>{
          data.push([formatDate(new Date(item.datetime),'hh:mm'),item.count])
        })
        mychart.setOption({
          xAxis:[{
            type:'category',
            // name:'time',
          }],
          yAxis:[{
            // name:'TH/S',
            show:true
          }],
          tooltip:{
            trigger:'axis'
          },
          grid:{
            left:50,
            right:50,
            height:'50%'
          },
          // datazoom:[{
          //   type:'slider',
          //   show:true,
          //   xAxisIndex: [0],
          //   start:1,
          //   end:35
          // }
          // ],
          series:{
            name:'数量',
            type:'line',
            data:data,
            lineStyle:{
              color:'#3498db'
            },
            itemStyle:{
              color:'#3498db'
            }
          }
        })
      })

      url = '/txByHour/' + curchannel + '/1'
      getdata(url).then(res=>{
        console.log(res);
        let echarts = require('echarts')
        let mychart = echarts.init(document.getElementById('chart3'))
        let data = []
        res.rows.forEach(item=>{
          data.push([formatDate(new Date(item.datetime),'MM-dd hh:mm'),item.count])
        })
        mychart.setOption({
          xAxis:[{
            type:'category',
            // name:'time',
          }],
          yAxis:[{
            // name:'TH/S',
            show:true
          }],
          tooltip:{
            trigger:'axis'
          },
          grid:{
            left:50,
            right:50,
            height:'50%'
          },
          // datazoom:[{
          //   type:'slider',
          //   show:true,
          //   xAxisIndex: [0],
          //   start:1,
          //   end:35
          // }
          // ],
          series:{
            name:'数量',
            type:'line',
            data:data,
            lineStyle:{
              color:'#3498db'
            },
            itemStyle:{
              color:'#3498db'
            }
          }
        })
      })

      url = '/txByMinute/' + curchannel + '/1'
      getdata(url).then(res=>{
        console.log(res);
        let echarts = require('echarts')
        let mychart = echarts.init(document.getElementById('chart4'))
        let data = []
        res.rows.forEach(item=>{
          data.push([formatDate(new Date(item.datetime),'hh:mm'),item.count])
        })
        mychart.setOption({
          xAxis:[{
            type:'category',
            // name:'time',
          }],
          yAxis:[{
            // name:'TH/S',
            show:true
          }],
          tooltip:{
            trigger:'axis'
          },
          grid:{
            left:50,
            right:50,
            height:'50%'
          },
          // datazoom:[{
          //   type:'slider',
          //   show:true,
          //   xAxisIndex: [0],
          //   start:1,
          //   end:35
          // }
          // ],
          series:{
            name:'数量',
            type:'line',
            data:data,
            lineStyle:{
              color:'#3498db'
            },
            itemStyle:{
              color:'#3498db'
            }
          }
        })
      })

      url = '/txByOrg/' + curchannel
      getdata(url).then(res=>{
        let echarts = require('echarts')
        let mychart = echarts.init(document.getElementById('txbyorg'))
        let data = []
        res.rows.forEach(item=>{
          data.push({name:item.creator_msp_id,value:item.count})
        })
        mychart.setOption({
          tooltip:{
            trigger:'item'
          },
          grid:{
            left:50,
            right:50,
            height:'50%'
          },

          // datazoom:[{
          //   type:'slider',
          //   show:true,
          //   xAxisIndex: [0],
          //   start:1,
          //   end:35
          // }
          // ],
          series:{
            name:'数量',
            type:'pie',
            data:data,
            radius: [20, 100],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            }
          }
        })
      })

      url = '/blockActivity/' + curchannel
      getdata(url).then(res=>{
        this.blockActivity = res.row
      })

    })




  }
}
</script>

<style scoped lang="less">
.dashboard{
  //border:1px solid black;
}
.status{
  display: flex;
  border:2px solid black;
  justify-content: space-around;
  .item{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.node{
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
}

.node:nth-child(odd){
  background-color: #bdc3c7;
}

.node:nth-child(even){
  background-color: #ecf0f1;
}
.block{
  width: 200px;
  display: flex;
  flex-direction: column;
  .info{
    //display: flex;
    word-break: break-word;
    margin-bottom: 1rem;
    .label{
      font-weight: bold;
    }
    .val{

    }
  }
}

</style>

<style lang="less">
 .cards{
   .el-card__header{
     background-color: #34495e;
   }
 }
</style>