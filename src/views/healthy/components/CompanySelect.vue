<!--
/**
任务名称：TASK#2893 健康管理接口对接
开发人员：崔洛宜
日期：2020-04-07
任务类型：1、全新代码
**/
-->
<template>
  <el-select :value="value" :disabled="disabled" :clearable="clearable" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"> </el-option>
    </template>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"> </el-option>
  </el-select>
</template>

<script>
import Api from '../api/work-bench'
export default {
  name: 'CompanySelect',
  props: {
    hasAll: {
      type: Boolean,
      default: true
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  async created() {
    let result = await Api.getCompanyList({})
    console.log(result)
    this.list = result.data.records
  }
}
</script>
<style lang="less" scoped></style>
