<template>
  <div style="max-width: 1200px">
    <vxe-table :data="tableData" auto-resize>
      <vxe-table-column field="fileName" title="附件名称" min-width="200"> </vxe-table-column>
      <vxe-table-column field="fileSizeText" title="大小" width="100"> </vxe-table-column>
      <vxe-table-column field="createTime" title="上传时间" width="180"> </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人" width="180"> </vxe-table-column>
      <vxe-table-column field="address" title="操作" width="180">
        <template #default="{ row }">
          <Preview :file="{ fileUrl: row.fileUrl, id: row.id }" style="margin-right: 3px"></Preview>
          <Download :file="{ name: row.fileName, id: row.id }"></Download>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import api from '@/api/file'
import fileSize from 'filesize'
export default {
  name: 'FileTable',
  components: {},
  props: {
    ids: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  watch: {
    ids: {
      immediate: true,
      handler() {
        this.getFileList()
      }
    }
  },
  created() {},
  methods: {
    //获取文件列表
    async getFileList() {
      let arr = this.ids ? this.ids.split(',') : []
      if (!arr.length) return
      let fileRes = (await api.getFileList(arr)).data || []
      fileRes.forEach(file => (file.fileSizeText = fileSize(file.fileSize)))
      this.tableData = fileRes
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-card__header {
  padding: 2px 10px;
  min-height: 30px;
}
</style>
