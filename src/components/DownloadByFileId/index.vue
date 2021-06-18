<template>
  <a @click="download"><slot>下载</slot></a>
</template>

<script>
import { saveAs } from 'file-saver'
import api from '@/api/file'
export default {
  name: 'DownloadByFileId',
  props: {
    fileId: {
      required: true
    },
    fileName: {}
  },
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

<style scoped lang="less">
a {
  font-size: 14px;
}
</style>
