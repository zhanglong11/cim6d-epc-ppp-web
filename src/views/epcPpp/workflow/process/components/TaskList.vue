<template>
  <el-dialog title="流程详情" :visible="visible" @close="$emit('update:visible', false)">
    <ul>
      <li v-for="e in list" :key="e.id">{{ e.taskName }}</li>
    </ul>
  </el-dialog>
</template>

<script>
export default {
  name: 'TaskList',
  props: ['process', 'visible'],
  data() {
    return {
      list: []
    }
  },
  watch: {
    visible(val) {
      val && this.refresh()
    }
  },
  methods: {
    refresh() {
      this.axios.workflow
        .post('task/list/', { page: 1, rows: 100, processInstanceId: this.process.processInstanceId, taskStatus: 1 })
        .then(res => {
          this.list = res.data.records
        })
    }
  }
}
</script>
