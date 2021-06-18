<template>
  <el-dialog width="500px" top="10vh" title="导入" :visible="visible" @close="cancelDialog">
    <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      :before-upload="upload"
      :file-list="fileList"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '@/api/supplies/equipment/list'
export default {
  name: 'ImportDialog',
  components: {},
  props: ['id', 'visible'],
  data() {
    return {
      fileList: []
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    upload(file) {
      this.fileList = [file]
    },
    async submit() {
      let formData = new FormData()
      formData.append('file', this.fileList[0])
      formData.append('projectId', localStorage.getItem('projectId'))
      await Api.importEquipment(formData)
      this.$emit('update:visible', false)
      this.$message.success('操作成功')
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
