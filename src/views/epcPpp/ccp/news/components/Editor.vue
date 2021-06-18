<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>

<script>
import E from 'wangeditor'
import api from '@/api/file'
export default {
  name: 'Editor',
  props: {
    // 值
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 编辑器的值
      editorContent: ''
    }
  },
  watch: {
    value() {
      this.setContent(this.value)
    }
  },
  mounted() {
    this.editor = new E(this.$refs.editor)
    this.editor.customConfig.onchange = html => {
      this.editorContent = html
      this.$emit('input', html)
    }
    this.editor.customConfig.customUploadImg = async (files, insert) => {
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法

      // 上传代码返回结果之后，将图片插入到编辑器中
      for (let file of files) {
        let formData = new FormData()
        formData.append('file', file)
        const { data: fileId } = await api.uploadFile(formData)
        const { fileUrl } = await api.getFileList([fileId]).then(res => res.data[0])
        insert(fileUrl)
      }
    }
    this.editor.create()
  },
  methods: {
    // 设置编辑器的内容
    setContent(html) {
      this.editor.txt.html(html)
    }
  }
}
</script>

<style>
.w-e-text-container {
  height: 500px !important;
}
</style>
