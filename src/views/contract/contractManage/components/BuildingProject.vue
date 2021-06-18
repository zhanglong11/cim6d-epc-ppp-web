<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--
        /**
                 任务名称：TASK#2791 3月3号注释
                 开发人员：崔洛宜
                 日期：2020-03-03
                 任务类型：注释
                 **/
      -->
      <el-tab-pane label="分布分项工程和单价措施项" name="first1"
        ><SubProjectsUnitPrice :contractId="contractId" categoryCode="1"></SubProjectsUnitPrice
      ></el-tab-pane>
      <el-tab-pane label="总价措施项目清单" name="second2">
        <TotalPriceProjectList :contractId="contractId" categoryCode="1"></TotalPriceProjectList>
      </el-tab-pane>
      <el-tab-pane label="暂列资金明细表" name="third3">
        <TemporaryList :contractId="contractId" categoryCode="1"></TemporaryList>
      </el-tab-pane>
      <el-tab-pane label="材料（工程设备）暂估单价及调整表" name="fourth4">
        <MaterialPriceResizeList :contractId="contractId" categoryCode="1"></MaterialPriceResizeList>
      </el-tab-pane>
      <el-tab-pane label="专业工程暂估单价及调整表" name="fifth5">
        <ProfessionProjectPriceResizeList :contractId="contractId" categoryCode="1"></ProfessionProjectPriceResizeList>
      </el-tab-pane>
      <!--
            /**
           任务名称：TASK#2826 3月5号注释
           开发人员：崔洛宜
           日期：2020-03-31
           任务类型：注释
           **/
        -->
      <el-tab-pane label="计日工表" name="sixth5">
        <DayLaborOrder :contractId="contractId" categoryCode="1"></DayLaborOrder>
      </el-tab-pane>
      <el-tab-pane label="总承包服务费计价表" name="seventh5">
        <ContractInventoryContractServiceFee
          :contractId="contractId"
          categoryCode="1"
        ></ContractInventoryContractServiceFee>
      </el-tab-pane>
      <el-tab-pane label="规费税金项目计价表" name="eight5">
        <ContractInventoryTaxItem :contractId="contractId" categoryCode="1"></ContractInventoryTaxItem>
      </el-tab-pane>
      <el-tab-pane label="主要材料价格表" name="nine5">
        <ContractInventoryMaterialPrice :contractId="contractId" categoryCode="1"></ContractInventoryMaterialPrice>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SubProjectsUnitPrice from './components/SubProjectsUnitPrice'
import TotalPriceProjectList from './components/TotalPriceProjectList'
import TemporaryList from './components/TemporaryList'
import MaterialPriceResizeList from './components/MaterialPriceResizeList'
import ProfessionProjectPriceResizeList from './components/ProfessionProjectPriceResizeList'
import DayLaborOrder from './components/DayLaborOrder'
import ContractInventoryContractServiceFee from './components/ContractInventoryContractServiceFee'
import ContractInventoryTaxItem from './components/ContractInventoryTaxItem'
import ContractInventoryMaterialPrice from './components/ContractInventoryMaterialPrice'
export default {
  name: 'BuildingProject',
  components: {
    SubProjectsUnitPrice,
    TotalPriceProjectList,
    TemporaryList,
    MaterialPriceResizeList,
    ProfessionProjectPriceResizeList,
    /**
     任务名称：TASK#2826 3月5号注释
     开发人员：崔洛宜
     日期：2020-03-31
     任务类型：注释
     **/
    DayLaborOrder,
    ContractInventoryContractServiceFee,
    ContractInventoryTaxItem,
    ContractInventoryMaterialPrice
  },
  /**
   任务名称：TASK#2790 3月2号注释
   开发人员：崔洛宜
   日期：2020-03-02
   任务类型：注释
   **/
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      activeName: 'first1'
    }
  },
  created() {
    console.log(this.contractId)
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="less" scoped></style>
