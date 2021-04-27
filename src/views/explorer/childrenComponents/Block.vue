<template>
  <div class="block">
    <el-table
        :data="blocks"
        style="width: 100%"
        :stripe="true">
      <el-table-column
          prop="blocknum"
          label="区块号"
          width="100px"
          align="center">
      </el-table-column>
      <el-table-column
          prop="channelname"
          label="通道名"
          width="150px"
          align="center">
      </el-table-column>
      <el-table-column
          prop="txcount"
          label="交易数"
          width="100px"
          align="center">
      </el-table-column>
      <el-table-column
          prop="datahash"
          label="数据hash"
          align="center"
          :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center">
            <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{scope.row.datahash}}</div>
            <i class="el-icon-document-copy" style="cursor: pointer;" @click="copytext(scope.row.datahash)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="区块hash"
          align="center"
          :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center">
            <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{scope.row.blockhash}}</div>
            <i class="el-icon-document-copy" style="cursor: pointer;" @click="copytext(scope.row.blockhash)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="prehash"
          label="上一区块hash"
          align="center"
          :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center">
            <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{scope.row.prehash}}</div>
            <i class="el-icon-document-copy" style="cursor: pointer;" v-if="scope.row.prehash.length !== 0" @click="copytext(scope.row.prehash)"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          label="交易id"
          align="center"
          :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center">
            <div style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">{{scope.row.txhash[0]}}</div>
            <i class="el-icon-info" v-if="scope.row.txhash[0].length !== 0" style="cursor: pointer;" @click="txdetail(scope.row.txhash[0])"></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="blksize"
          label="大小(KB)"
          width="100px"
          align="center">
      </el-table-column>
    </el-table>

    <textarea id="copytext" style="position:relative;width: 0;height: 0;z-index: -100;opacity: 0;"></textarea>
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
  name: "Block",
  data(){
    return{
      blocks:[],
      txdialog:false,
      Txdetail:''
    }
  },
  methods:{
    formatdate(date,fmt){
      return formatDate(date,fmt)
    },
    copytext(text){
      let el = document.getElementById('copytext')
      el.value = text
      el.select()
      document.execCommand("Copy");
      this.$message.success('复制成功！')
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
    let created_at = new Date("2021-01-01")
    getNetinfo(this.$store.state.netname.split('_')[0]).then(()=>{
      // created_at = res.Created
      // created_at = new Date(created_at)
      // created_at.setDate(created_at.getDate() - 1)

      curchannel().then(res=>{
        let curchannel = res
        let url
        url = '/blockAndTxList/' + curchannel + '/0?from=' + created_at + '&to=' + new Date()
        getdata(url).then(res=>{
          if(res == ''){
            this.$router.replace('/refresh')
          }
          console.log(res);
          this.blocks = res.rows
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
