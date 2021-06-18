<template>
  <el-select :value="value" placeholder="请选择" @change="val => $emit('input', val)">
    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<script>
export default {
  name: 'SelectDefinition',
  props: {
    value: [String, Number]
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.axios.workflow.post('activiti/process/definition/list', { page: 1, rows: 1000 }).then(res => {
      this.list = res.data.records
    })
  }
}
</script>
