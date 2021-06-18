<template>
  <div class="container is-footer fixedHeight">
    <el-form inline>
      <el-form-item label="文件名称" style="width: 50%">{{ fileName }} </el-form-item>
      <el-form-item label="资料名称"> {{ documentName }}</el-form-item>
    </el-form>
    <el-card>
      <div slot="header" class="card-header">
        <span>附件信息</span>
      </div>
      <vxe-table ref="xTable" border :data="tableData">
        <vxe-table-column field="fileName" title="资料名称" min-width="200" tree-node />
        <vxe-table-column field="creatorName" title="创建人" min-width="200" />
        <vxe-table-column field="createTime" title="创建日期" min-width="200" />
        <vxe-table-column field="issueType" title="操作" min-width="200">
          <template #default="{ row }">
            <PreviewByFileId :fileId="row.id" />
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/file'
export default {
  name: 'DocumentManageDetailEpcPpp',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      tableData: [],
      documentName: '',
      fileName: ''
    }
  },
  // 生命周期 - 挂载完成
  created() {
    this.refresh()
  },
  // 方法集合
  methods: {
    //刷新
    async refresh() {
      console.log(this.$route.params)
      const { fileIds, name, fileName } = this.$route.params
      this.documentName = name
      this.fileName = fileName
      let arr = fileIds ? fileIds.split(',') : []
      let res = await Api.getFileList(arr)
      this.tableData = res.data
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style scoped></style>
