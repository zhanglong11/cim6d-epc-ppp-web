<!--
/**
任务名称：2845/【智慧工地2.0-前端】劳务管理》工人信息》列表、新增、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-3日
任务类型：1、全新代码
**/
-->
<template>
  <el-select :value="value" :disabled="disabled" @change="val => $emit('input', val)">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"></el-option>
    </template>
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SelectCompany',
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
    status: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      list: []
    }
  },
  created() {
    this.axios.labour
      .post('company/list', { page: 1, rows: 100000, projectId: localStorage.getItem('projectId') })
      .then(res => {
        this.list = res.data.records
      })
  }
}
</script>
<style lang="less" scoped></style>
