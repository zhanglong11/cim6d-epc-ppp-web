<template>
  <div class="indexWrapper">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <img
            src="http://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&f=JPEG?w=1280&h=853"
            alt="未知错误"
            width="30px"
            height="30px"
            style="border-radius: 50%; vertical-align: middle"
          />
          <span>{{ headData.name }}</span>
        </h6>
      </div>
      <div class="status-box">
        <el-button-group> </el-button-group>
        <!-- <el-button type="primary" style="margin-left: 20px" @click="() => {}">编辑</el-button>-->
      </div>
    </div>
    <div class="divWrapper">
      <el-row>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">合同编号</div>
            <div class="lrCellValue">{{ headData.contractCode }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">支付阶段</div>
            <div class="lrCellValue">
              {{
                headData.paymentStage !== null && headData.paymentStage !== undefined
                  ? paymentStatus.filter(item => item.value === headData.paymentStage)[0].label
                  : ''
              }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建人</div>
            <div class="lrCellValue">{{ headData.creatorName }}</div>
          </div>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <div class="infoCellLabel">状态</div>
          <div class="infoCellValue">
            {{
              headData.status !== null && headData.status !== undefined
                ? payStatus.filter(item => item.value === headData.status)[0].label
                : ''
            }}
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel" style="width: 125px">申请金额合计(元)</div>
            <div class="lrCellValue">{{ headData.totalAmount }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">支付时间</div>
            <div class="lrCellValue">{{ headData.paymentTime }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建时间</div>
            <div class="lrCellValue">{{ headData.createTime }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">备注</div>
            <div class="lrCellValue">{{ headData.remark }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--
      /**
         任务名称：BUG1285 合同计量与支付-不同的合同类型和支付阶段，对应的内容不一样
         开发人员：崔洛宜
         日期：2020-03-24
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
    -->
    <!--<div class="divWrapper tabContainerOuter">
      <PayDeduct :paymentId="paymentId" :contractId="contractId" :isEdit="isEdit"></PayDeduct>
    </div>-->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleCancel">返回</el-button>
      <template v-else>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>
<script>
/**
 任务名称：BUG1285 合同计量与支付-不同的合同类型和支付阶段，对应的内容不一样
 开发人员：崔洛宜
 日期：2020-03-24
 BUG类型：测试人员发现的研发自测未通过引起的BUG
 **/
//import PayDeduct from './components/PayDeduct'
import Api from '@/api/contract/contractMeasurementPayment'
import paymentStatus from '@/lib/paymentStatus' //支付阶段
import payStatus from '@/lib/payStatus' //付款状态
export default {
  name: 'BaseDetail',
  /**
   任务名称：BUG1285 合同计量与支付-不同的合同类型和支付阶段，对应的内容不一样
   开发人员：崔洛宜
   日期：2020-03-24
   BUG类型：测试人员发现的研发自测未通过引起的BUG
   **/
  components: {},
  data() {
    return {
      id: '',
      isCheck: false,
      headData: {},
      activeName: 'first',
      tableData: [],
      total: 50,
      pageSize: 10,
      currentPage: 1,
      paymentStatus: paymentStatus,
      payStatus: payStatus
    }
  },
  mounted() {
    let { id, row, isCheck, isEdit } = this.$route.params
    this.id = row.id || id
    this.isEdit = isEdit
    this.paymentId = this.id
    this.contractId = row.contractId
    this.isCheck = isCheck
    console.log(this.id, this.$route.params, row, isCheck, isEdit)
    this.getDetail(this.id)
  },
  methods: {
    getDetail(id) {
      Api.getContractMeasurementPaymentById(id).then(res => {
        if (res.code === 200) {
          this.headData = res.data
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleCancel() {
      this.$router.back()
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    },
    handleEmitForm(data) {
      Api.handleCheck(data).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  display: flex;
  background: #fff;
  padding: 10px;

  .title {
    margin: 0;
    padding: 10px;
    font-size: 20px;

    span {
      padding-left: 10px;
    }
  }

  .content {
    flex: 1;
  }

  .status-box {
    width: 400px;
    padding: 10px;
    text-align: right;
  }
}
.divWrapper {
  padding: 20px 50px;
  .infoCellLabel {
    font-size: 14px;
    color: #cccccc;
    height: 30px;
    line-height: 30px;
  }
  .infoCellValue {
    font-size: 16px;
  }
  .lrCellInfo {
    display: flex;
    height: 40px;
    .lrCellLabel {
      color: #cccccc;
      margin-right: 10px;
    }
    .lrCellValue {
      flex: 1;
    }
  }
}
.tabContainerOuter {
  height: 500px !important;
  overflow: auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
