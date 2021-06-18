<template>
  <el-dialog width="500px" top="10vh" title="变更记录" :visible="visible" @close="close">
    <div class="wrap">123</div>
    <footer slot="footer">
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChangeDetailDialog',
  props: ['visible'],
  data() {
    return {}
  },
  created() {},
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      this.close()
    }
  }
}
</script>

<style scoped lang="less"></style>
