<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    title="审核"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="审核意见" prop="result">
        <el-radio-group v-model="form.auditStatus">
          <el-radio :label="0">同意</el-radio>
          <el-radio :label="1">不同意</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
      <el-form-item label="附件" prop="file">
        <FileEdit v-model="form.fileIds" />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'AuditDialog',
  props: {
    visible: {}
  },
  data() {
    return {
      form: {
        auditStatus: 0
      }
    }
  },
  methods: {
    handleTabClick(tab) {},
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$message.success('操作成功')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
