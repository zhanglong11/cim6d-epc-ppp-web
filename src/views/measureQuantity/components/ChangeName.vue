<template>
  <el-dialog destroy-on-close title="批量修改名称" width="500px" :visible="visible" @close="close">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="新名称" prop="name">
        <el-input v-model="form.name" class="inputStyle"></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChangeNameDialog',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '新名称必选' }]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      await this.$refs.form.validate()
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style scoped lang="less">
.inputStyle {
  width: 300px;
}
</style>
