<template>
  <el-dialog width="500px" top="10vh" :title="activeId ? '修改' : '新建'" :visible="visible" @close="close">
    <div class="wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文件名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item v-if="pId !== 0" label="上传文件" prop="fileIds">
          <FileEdit v-model="form.fileIds" />
        </el-form-item>
      </el-form>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '../../api'
export default {
  name: 'AddModelDialog',
  props: {
    visible: {},
    documentId: {},
    activeId: {},
    activeName: {},
    fileIds: {},
    type: {},
    level: {},
    pId: {}
  },
  data() {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '必填' }],
        fileIds: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    if (!this.activeId) return
    this.refresh()
  },
  methods: {
    async refresh() {
      this.form = {
        name: this.activeName,
        fileIds: this.fileIds
      }
    },
    //取消
    close() {
      this.$emit('update:visible', false)
    },
    //提交
    async submit() {
      await this.$refs.form.validate()
      const isRoot = this.pId === 0
      let type = isRoot ? 1 : 2
      let param = { ...this.form, category: this.type, pid: this.pId, level: this.level, type }
      if (!isRoot) {
        param = { ...param, firstLevelId: this.documentId }
      }
      this.activeId ? await Api.update({ ...param, id: this.activeId }) : await Api.add(param)
      this.$message.success('操作成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped lang="less">
.wrap {
}
</style>
