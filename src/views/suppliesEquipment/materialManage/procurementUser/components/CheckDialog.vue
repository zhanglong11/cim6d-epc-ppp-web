<template>
  <el-dialog
    width="600px"
    :modal="true"
    top="10vh"
    title="验收"
    append-to-body
    :visible="visible"
    destroy-on-close
    @close="close"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="130px">
      <el-form-item label="验收结果" prop="auditStatus">
        <el-radio-group v-model="form.auditStatus">
          <el-radio :label="1">合格</el-radio>
          <el-radio :label="0">不合格</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="验收意见" prop="auditOpinion">
        <el-input v-model="form.auditOpinion" type="textarea" />
      </el-form-item>
      <el-form-item v-if="form.auditStatus === 1" label="指定到货确认人" prop="nextPersonId">
        <SelectUser
          :id.sync="form.nextPersonId"
          :value="form.nextPersonId ? { id: form.nextPersonId, label: form.nextPersonName } : null"
          :name.sync="form.nextPersonName"
          :multiple="false"
        />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '@/api/supplies/material/procurement'
export default {
  name: 'CheckDialog',
  props: {
    visible: {},
    id: {}
  },
  data() {
    return {
      form: {
        auditStatus: 1
      },
      rules: {
        auditStatus: [{ required: true, message: '必填' }],
        nextPersonId: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      await this.$refs.form.validate()
      await Api.accept({ ...this.form, ...{ purchaseId: this.id } })
      this.$message.success('操作成功')
      this.$parent.refresh()
      this.close()
    }
  }
}
</script>

<style scoped lang="less"></style>
