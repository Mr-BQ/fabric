<template>
  <div class="transaction">
    <el-table
        :data="transaction"
        style="width: 100%"
        :stripe="true">
      <el-table-column
          prop="creator_msp_id"
          label="创建者"
          align="center">
      </el-table-column>
      <el-table-column
          prop="channelname"
          label="通道名"
          align="center">
      </el-table-column>
      <el-table-column
          label="交易id"
          align="center"
          :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center">
            <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{scope.row.txhash}}</div>
            <i class="el-icon-info" v-if="scope.row.txhash.length !== 0" style="cursor: pointer;" @click="txdetail(scope.row.txhash)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="type"
          label="交易类型"
          align="center">
      </el-table-column>
      <el-table-column
          prop="chaincodename"
          label="链码"
          align="center">
      </el-table-column>
      <el-table-column
          label="时间"
          align="center">
        <template slot-scope="scope">
          <div>
            {{formatdate(new Date(scope.row.createdt),'yyyy-MM-dd hh:mm:ss')}}
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        title="交易详情"
        :visible.sync="txdialog"
        width="50%"
        :close-on-click-modal="false"
    >
      <div style="overflow-y: scroll;height: 50vh;">
        <div class="info">
          <div class="label">Transaction ID:</div>
          <div class="val">{{Txdetail.txhash}}</div>
        </div>
        <div class="info">
          <div class="label">Validation Code:</div>
          <div class="val">{{Txdetail.validation_code}}</div>
        </div>
        <div class="info">
          <div class="label">Payload Proposal Hash:</div>
          <div class="val">{{Txdetail.payload_proposal_hash}}</div>
        </div>
        <div class="info">
          <div class="label">Creator MSP:</div>
          <div class="val">{{Txdetail.creator_msp_id}}</div>
        </div>
        <div class="info">
          <div class="label">Endorser:</div>
          <div class="val">{{Txdetail.endorser_msp_id}}</div>
        </div>
        <div class="info">
          <div class="label">Channel:</div>
          <div class="val">{{Txdetail.channelname}}</div>
        </div>
        <div class="info">
          <div class="label">Chaincode Name:</div>
          <div class="val">{{Txdetail.chaincodename}}</div>
        </div>
        <div class="info">
          <div class="label">Type:</div>
          <div class="val">{{Txdetail.type}}</div>
        </div>
        <div class="info">
          <div class="label">Time:</div>
          <div class="val">{{formatdate(new Date(Txdetail.createdt),'yyyy-MM-dd hh:mm:ss')}}</div>
        </div>
        <div class="info">
          <div class="label">Reads:</div>
          <div class="val">
            <json-viewer
                :value="Txdetail.read_set"
                :expand-depth=5
                :boxed="true">
            </json-viewer>
          </div>
        </div>
        <div class="info">
          <div class="label">Writes:</div>
          <div class="val">
            <json-viewer
                :value="Txdetail.write_set"
                :expand-depth=5
                :boxed="true">
            </json-viewer>
          </div>
        </div>
      </div>


    </el-dialog>
  </div>
</template>

<script>
import {curchannel, getdata, getNetinfo} from "@/Network";
import {formatDate} from "@/utils";
export default {
  name: "Transaction",
  data(){
    return{
      blocks:[],
      txdialog:false,
      Txdetail:'',
      transaction:[]
    }
  },
  methods:{
    formatdate(date,fmt){
      return formatDate(date,fmt)
    },
    txdetail(txid){
      curchannel().then(res=>{
        let curchannel = res
        let url = '/transaction/' + curchannel + '/' + txid
        getdata(url).then(res=>{
          console.log(res)
          this.Txdetail = res.row
          this.txdialog = true
        })
      })
    }
  },
  beforeMount() {
    let created_at
    getNetinfo(this.$store.state.netname.split('_')[0]).then(res=>{
      created_at = res.Created
      created_at = new Date(created_at)
      created_at.setDate(created_at.getDate() - 1)

      curchannel().then(res=>{
        let curchannel = res
        let url
        url = '/txList/' + curchannel + '/0/0?from=' + created_at + '&to=' + new Date()
        getdata(url).then(res=>{
          if(res == ''){
            this.$router.replace('/refresh')
          }
          console.log(res);
          this.transaction = res.rows
        })
      })
    })
  }

}
</script>

<style scoped lang="less">
.info{
  display: flex;
  align-items: center;
  padding: 10px 5px;
  //width: 800px;
  .label{
    font-weight: bold;
    font-size: 1rem;
    margin-right: 1rem;
    white-space: nowrap;
  }
}
.info:nth-child(even){
  background-color:#eeeeee;
}
</style>
