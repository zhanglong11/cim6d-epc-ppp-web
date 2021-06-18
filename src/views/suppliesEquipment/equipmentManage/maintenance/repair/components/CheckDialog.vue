<template>
  <el-dialog width="500px" top="10vh" title="保养验证" :visible="visible" @close="cancelDialog">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="审核结果" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见" prop="optionContent">
        <el-input v-model="form.optionContent" type="textarea" />
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
export default {
  name: 'FinishDialog',
  props: ['id', 'visible'],
  data() {
    return {
      form: {},
      rules: {
        status: [{ required: true, message: '必选' }],
        opinion: [{ required: true, message: '必选' }]
      }
    }
  },
  created() {
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      console.log(res)
      this.form = _.omit(res.data, ['status', 'opinion'])
    },
    cancelDialog() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    async submit() {
      await this.$refs.form.validate()
      await Api.check({ ...this.form, id: this.id })
      this.$emit('update:visible', false)
      this.$message.success('操作成功')
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped></style>
