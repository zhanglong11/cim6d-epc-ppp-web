<template>
  <el-dialog title="审核" width="500px" :visible="visible" @close="close">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="审核结果" prop="result">
        <el-radio-group v-model="form.result">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见">
        <el-input v-model="form.optionContent" type="textarea" :autoSize="{ minRows: 2, maxRows: 10 }"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'AuditDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: {
      type: [String, Array],
      default: null
    }
  },
  data() {
    return {
      form: {},
      rules: {
        result: [{ required: true, message: '必选' }]
      }
    }
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      await this.axios.material.post('equipmentPurchase/updateLease', {
        id: this.id,
        ...this.form
      })
      this.$message.success('操作成功')
      this.$parent.refresh()
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
