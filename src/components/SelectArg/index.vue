<!--
/**
任务名称：2845/【智慧工地2.0-前端】劳务管理》工人信息》列表、新增、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-8日
任务类型：1、复制移动代码
**/
-->
<template>
  <el-select :value="value" :disabled="disabled" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"> </el-option>
    </template>
    <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value"> </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectArg',
  props: {
    hasAll: {
      type: Boolean,
      default: false
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    argGroup: {
      type: String,
      required: true
    }
  },
  computed: {
    list() {
      return this.$store.state.systemConfig.config[this.argGroup]?.children
    }
  }
}
</script>
<style lang="less" scoped></style>
