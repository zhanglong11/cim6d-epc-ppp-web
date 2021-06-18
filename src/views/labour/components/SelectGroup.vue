<!--
/**
任务名称：2845/【智慧工地2.0-前端】劳务管理》工人信息》列表、新增、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-2日
任务类型：1、全新代码
**/
-->
<template>
  <el-select :value="value" :disabled="disabled" @change="handleChange">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"></el-option>
    </template>
    <el-option-group v-for="group in computedList" :key="group.label" :label="group.label">
      <el-option v-for="item in group.options" :key="item.id" :label="item.name" :value="item.id"></el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  name: 'SelectGroup',
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
    },
    labourCompanyId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      list: [],
      flatList: []
    }
  },
  computed: {
    computedList() {
      let list = this.list
      if (this.labourCompanyId) {
        list = _.filter(this.list, { labourCompanyId: this.labourCompanyId })
      }
      return _.chain(list)
        .groupBy('labourCompanyName')
        .map((v, k) => ({
          label: k,
          options: v
        }))
        .values()
        .value()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.axios.labour.get('group/baseList/' + localStorage.getItem('projectId')).then(res => {
        this.list = res.data
      })
    },
    handleChange(val) {
      const selectedGroup = _.find(this.list, { id: val })
      this.$emit('update:principal', selectedGroup.principal)
      this.$emit('update:principalName', selectedGroup.principalName)
      this.$emit('update:name', selectedGroup.name)
      this.$emit('input', val)
      // console.log(val, 111)
    }
  }
}
</script>
<style lang="less" scoped></style>
