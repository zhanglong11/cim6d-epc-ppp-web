<template>
  <el-button type="text" :disabled="_.isNil(fileId)" @click="download">下载</el-button>
</template>

<script>
import { saveAs } from 'file-saver'
import api from '@/api/file'
export default {
  name: 'Download',
  props: { fileId: {}, fileName: {} },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    async download() {
      const res = await api.downloadFileById(this.fileId)
      saveAs(res.data, this.fileName ? this.fileName : 'download')
    }
  }
}
</script>

<style scoped lang="less"></style>
