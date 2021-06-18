<template>
  <div>
    <el-card class="box-card">
      <el-row class="row">
        <i class="el-icon-c-scale-to-original title"></i>
        <span class="title">入库单 {{ viewData.code }}</span>
        <el-button style="float: right" type="primary" @click="onEdit">编辑</el-button>
      </el-row>

      <el-row class="row">
        <el-col :span="12">入库单编号: {{ viewData.code }}</el-col>
        <el-col :span="12">入库人: {{ viewData.creatorName }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">入库类型: {{ viewData.type === '1' ? '领用还回' : '采购入库' }}</el-col>
        <el-col :span="12">入库时间: {{ viewData.createTime }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">备注: {{ viewData.remark }}</el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>入库明细</span>
      </div>

      <el-table :data="viewData.materialInputDetailResult" style="width: 100%; margin-top: 20px">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
        <el-table-column prop="materialId" label="材料编码" min-width="100" />
        <el-table-column prop="name" label="材料名称" min-width="100" />
        <el-table-column prop="models" label="规格型号" min-width="100" />
        <el-table-column prop="unit" label="单位" min-width="100" />
        <el-table-column prop="brand" label="品牌" min-width="100" />
        <el-table-column prop="supplier" label="供应商" min-width="100" />
        <el-table-column prop="inventoryNumber" label="库存量" min-width="100" />
        <el-table-column prop="number" label="入库数量" min-width="100" />
        <el-table-column prop="univalence" label="单价" min-width="100" />
        <el-table-column prop="combinedPrice" label="合价" min-width="100" />
      </el-table>

      <h2 style="margin-top: 20px">入库金额（元）：{{ viewData.money }}</h2>
    </el-card>

    <div class="footerButton">
      <el-button @click="goBack">返回</el-button>
      <!-- <el-button type="primary" @click="onSave">保存</el-button> -->
    </div>
  </div>
</template>
<script>
/*
author: 许雷
date: 2020-06-30
*/
import Api from './api/index.js'

export default {
  name: 'InWarehouseDetail',
  data() {
    return {
      viewData: {},
      id: '', //当前页面入库单id
      tableData: []
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getInfo()
  },
  methods: {
    getInfo() {
      Api.getInDetail(this.id).then(res => {
        this.viewData = res.data
      })
    },
    onEdit() {
      //进入新建页面,和编辑页面共用
      this.viewData.type = this.viewData.type.toString()
      this.$router.push({
        path: `/supplies/materialManage/editInWarehouse`,
        query: {
          formData: this.viewData
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    },
    // onSave() {
    //   //保存成功跳转
    //   this.$router.go(-1)
    // },
    indexMethod(index) {
      return index + 1
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  font-size: 18px;
  font-weight: bolder;
}
.row {
  margin-bottom: 20px;
}
</style>
