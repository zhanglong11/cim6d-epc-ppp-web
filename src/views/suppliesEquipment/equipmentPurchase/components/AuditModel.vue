<template>
  <el-dialog
    width="600px"
    :title="'审核'"
    :visible="visible"
    @close="
      () => {
        $emit('update:visible', false)
      }
    "
  >
    <el-form ref="form" :model="form" :rules="rules" class="form" label-width="160px">
      <el-form-item label="审核结果" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="2">通过</el-radio>
          <el-radio :label="3">驳回</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见">
        <el-input v-model="form.optionContent" type="textarea" :autoSize="{ minRows: 2, maxRows: 10 }"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="onOk">审核</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '../api/index'
import equipmentTypeList from '../../lib/equipmentTypeList'
export default {
  name: 'AuditModel',
  props: {
    visible: Boolean,
    id: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      form: {},
      rules: {
        status: [{ required: true, message: '审核结果必选' }]
      }
    }
  },
  created() {},
  methods: {
    async onOk() {
      await this.$refs.form.validate()
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
