<template>
  <el-dialog width="500px" top="10vh" title="验收填写" :visible="visible" @close="cancelDialog">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="验收内容" prop="acceptResult">
        <el-input v-model="form.acceptResult" type="textarea" />
      </el-form-item>
      <el-form-item label="验收结果" prop="acceptState">
        <el-radio-group v-model="form.acceptState">
          <el-radio v-for="item in acceptStatus" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '@/api/supplies/maintenance/repair'
import acceptStatus from '../lib/acceptStatus'
export default {
  name: 'FinishDialog',
  props: ['id', 'visible'],
  data() {
    return {
      form: {},
      acceptStatus,
      rules: {
        acceptResult: [{ required: true, message: '必选' }],
        acceptState: [{ required: true, message: '必选' }]
      }
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    async submit() {
      await this.$refs.form.validate()
      await Api.accept({ ...this.form, repairId: this.id })
      this.$emit('update:visible', false)
      this.$message.success('操作成功')
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped></style>
