<!--
/**
任务名称：TASK#2893 健康管理接口对接
开发人员：崔洛宜
日期：2020-04-08
任务类型：1、全新代码(车牌颜色选择)
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
export default {
  name: 'VehicleTypeSelect',
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
      list: [
        { id: 1, name: '蓝牌' },
        { id: 2, name: '黄牌' },
        { id: 3, name: '新能源' }
      ]
    }
  }
}
</script>
<style lang="less" scoped></style>
