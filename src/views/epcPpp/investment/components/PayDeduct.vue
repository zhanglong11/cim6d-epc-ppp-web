<template>
  <div>
    <el-tabs :value="activeName" @tab-click="handleClick">
      <template v-if="contractType != 1">
        <el-tab-pane label="项目清单(支付)" name="oo">
          <OrderProject
            :paymentId="paymentId"
            :contractId="contractId"
            :isEdit="isEdit"
            @getPayMoney="
              data => {
                orderProjectMoney = data
              }
            "
          ></OrderProject>
        </el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane label="分部分项工程和单价措施项目清单(支付)" name="first">
          <PartialProjectUnitPriceMeasuresList
            :paymentId="paymentId"
            :contractId="contractId"
            :isEdit="isEdit"
            @getPayMoney="
              data => {
                projectMoney = data
              }
            "
          ></PartialProjectUnitPriceMeasuresList>
        </el-tab-pane>
        <el-tab-pane label="总价措施(支付)" name="second">
          <TotalPriceMeasure
            :paymentId="paymentId"
            :contractId="contractId"
            :isEdit="isEdit"
            @getPayMoney="
              data => {
                totalMoney = data
              }
            "
          ></TotalPriceMeasure>
        </el-tab-pane>
        <el-tab-pane label="计日工(支付)" name="third">
          <DayLabor
            :paymentId="paymentId"
            :contractId="contractId"
            :isEdit="isEdit"
            @getPayMoney="
              data => {
                dayMoney = data
              }
            "
          ></DayLabor>
        </el-tab-pane>
      </template>
      <el-tab-pane label="索赔项目(支付)" name="fourth">
        <ClaimProject
          ref="claim"
          :paymentId="paymentId"
          :contractId="contractId"
          :isEdit="isEdit"
          @getPayMoney="
            data => {
              claimMoney = data
            }
          "
        ></ClaimProject>
      </el-tab-pane>
      <el-tab-pane label="迟付款金额(支付)" name="fifth">
        <DelayPay
          :paymentId="paymentId"
          :contractId="contractId"
          :isEdit="isEdit"
          @getPayMoney="
            data => {
              delayMoney = data
            }
          "
        ></DelayPay>
      </el-tab-pane>
      <el-tab-pane label="其他（支付）" name="sixth">
        <OtherPay
          :paymentId="paymentId"
          :contractId="contractId"
          :isEdit="isEdit"
          @getPayMoney="
            data => {
              otherMoney = data
            }
          "
        ></OtherPay>
      </el-tab-pane>
      <el-tab-pane label="保证金(扣款)" name="qi">
        <SecurityDeposit
          :paymentId="paymentId"
          :contractId="contractId"
          :isEdit="isEdit"
          @getDeductMoney="
            data => {
              securityMoney = data
            }
          "
        ></SecurityDeposit>
      </el-tab-pane>
      <el-tab-pane label="预付款(扣款)" name="ba">
        <Prepayment
          :paymentId="paymentId"
          :contractId="contractId"
          :isEdit="isEdit"
          @getDeductMoney="
            data => {
              prepaymentMoney = data
            }
          "
        ></Prepayment>
      </el-tab-pane>
      <el-tab-pane label="违约赔偿(扣款)" name="jiu">
        <BreakContractClaim
          :paymentId="paymentId"
          :contractId="contractId"
          :isEdit="isEdit"
          @getDeductMoney="
            data => {
              breakMoney = data
            }
          "
        ></BreakContractClaim>
      </el-tab-pane>
      <el-tab-pane label="其它(扣款)" name="shi">
        <OtherDeduct
          :paymentId="paymentId"
          :contractId="contractId"
          :isEdit="isEdit"
          @getDeductMoney="
            data => {
              otherDeductMoney = data
            }
          "
        ></OtherDeduct>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PartialProjectUnitPriceMeasuresList from './payDeductComponents/PartialProjectUnitPriceMeasuresList'
import OrderProject from './payDeductComponents/OrderProject'
import TotalPriceMeasure from './payDeductComponents/TotalPriceMeasure'
import DayLabor from './payDeductComponents/DayLabor'
import ClaimProject from './payDeductComponents/ClaimProject'
import DelayPay from './payDeductComponents/DelayPay'
import OtherPay from './payDeductComponents/OtherPay'
import SecurityDeposit from './payDeductComponents/SecurityDeposit'
import Prepayment from './payDeductComponents/Prepayment'
import BreakContractClaim from './payDeductComponents/BreakContractClaim'
import OtherDeduct from './payDeductComponents/OtherDeduct'

export default {
  name: 'PayDeduct', //支付与扣款
  components: {
    PartialProjectUnitPriceMeasuresList,
    OrderProject,
    TotalPriceMeasure,
    DayLabor,
    ClaimProject,
    DelayPay,
    OtherPay,
    SecurityDeposit,
    Prepayment,
    BreakContractClaim,
    OtherDeduct
  },
  props: {
    paymentId: {
      type: [Number, String],
      default: ''
    },
    contractId: {
      type: [Number, String],
      default: ''
    },
    /**
     任务名称：BUG1285 合同计量与支付-不同的合同类型和支付阶段，对应的内容不一样
     开发人员：崔洛宜
     日期：2020-03-24
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    contractType: {
      type: [Number, String],
      default: 1
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      orderProjectMoney: 0,
      projectMoney: 0,
      totalMoney: 0,
      dayMoney: 0,
      claimMoney: 0,
      delayMoney: 0,
      otherMoney: 0,
      securityMoney: 0,
      prepaymentMoney: 0,
      breakMoney: 0,
      otherDeductMoney: 0
    }
  },
  computed: {
    activeName() {
      return Number(this.contractType) !== 1 ? 'oo' : 'first'
    }
  },
  created() {},
  methods: {
    getTotalAmount() {
      let total = 0
      total =
        Number(this.orderProjectMoney) +
        Number(this.projectMoney) +
        Number(this.totalMoney) +
        Number(this.dayMoney) +
        Number(this.claimMoney) +
        Number(this.delayMoney) +
        Number(this.otherMoney) -
        Number(this.securityMoney) -
        Number(this.prepaymentMoney) -
        Number(this.breakMoney) -
        Number(this.otherDeductMoney)
      return total
    },
    handleClick(tab, event) {}
  }
}
</script>
<style lang="less" scoped></style>
