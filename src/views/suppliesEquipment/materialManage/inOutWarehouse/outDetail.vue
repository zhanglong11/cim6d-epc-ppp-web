<template>
  <div>
    <el-card class="box-card">
      <el-row class="row">
        <i class="el-icon-c-scale-to-original title"></i>
        <span class="title">出库单 {{ viewData.code }}</span>
        <el-button style="float: right" type="primary" @click="onEdit">编辑</el-button>
      </el-row>

      <el-row class="row">
        <el-col :span="12">领用人: {{ viewData.recipientName }}</el-col>
        <el-col :span="12">出库人: {{ viewData.creatorName }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="12">领用单位: {{ viewData.recipientCompanyName }}</el-col>
        <el-col :span="12">出库时间: {{ viewData.createTime }}</el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="24">备注: {{ viewData.remark }}</el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>验收明细</span>
      </div>

      <el-table :data="viewData.materialOutputDetailResultDTOS" style="width: 100%; margin-top: 20px">
        <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
        <el-table-column prop="code" label="材料编码" min-width="100" />
        <el-table-column prop="name" label="材料名称" min-width="100" />
        <el-table-column prop="models" label="规格型号" min-width="100" />
        <el-table-column prop="brand" label="品牌" min-width="100" />
        <el-table-column prop="unit" label="单位" min-width="100" />
        <el-table-column prop="supplier" label="供应商" min-width="100" />
        <el-table-column prop="inventoryNumber" label="库存量" min-width="100" />
        <el-table-column prop="number" label="出库量" min-width="100" />
        <el-table-column prop="usePart" label="使用部位" min-width="100" />
      </el-table>
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
date: 2020-07-02
*/
import Api from './api/index.js'

export default {
  name: 'OutWarehouseDetail',
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
      Api.getOutDetail(this.id).then(res => {
        this.viewData = res.data
      })
    },
    onEdit() {
      this.$router.push({
        path: `/supplies/materialManage/editOutWarehouse`,
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
