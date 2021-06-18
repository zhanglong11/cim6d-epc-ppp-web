<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="文件类型">
          <el-select v-model="filterForm.fileType" style="width: 150px">
            <el-option label="图片" :value="1"></el-option>
            <el-option label="视频" :value="2"></el-option>
            <el-option label="文档" :value="3"></el-option>
            <el-option label="压缩包" :value="4"></el-option>
            <el-option label="其它" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位">
          <SelectCompany
            :id.sync="filterForm.partyMemberCompanyId"
            v-model="filterForm.receivePersonCompany"
            :multiple="false"
            style="width: 200px"
          ></SelectCompany>
        </el-form-item>
        <el-form-item label="上传时间">
          <DateRange
            :start-time.sync="filterForm.exportStartTime"
            :end-time.sync="filterForm.exportEndTime"
          ></DateRange>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filterForm.name"
            style="width: 300px"
            placeholder="文件名称/上传者姓名"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-reset" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="tooltips">
      <div>
        <el-button
          v-if="$hasPower('EpcPppCcpDataAdd')"
          icon="el-icon-upload"
          type="primary"
          @click="editDialogVisible = true"
          >上传资料</el-button
        >
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm" size="medium">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="name" title="文件名称"></vxe-table-column>
      <vxe-table-column field="fileType" title="文件类型" width="100"></vxe-table-column>
      <vxe-table-column field="downloadTimes" title="文件下载次数" width="100"></vxe-table-column>
      <vxe-table-column field="creatorName" title="上传者姓名" width="100"></vxe-table-column>
      <vxe-table-column
        title="上传者所属单位"
        :formatter="({ row }) => row.partyMemberCompanyName + (row.partyMemberDepartmentName || '')"
      ></vxe-table-column>
      <vxe-table-column field="createTime" title="上传时间" width="160"></vxe-table-column>
      <vxe-table-column title="操作" width="200">
        <template #default="{ row }">
          <PreviewByFileId type="text" :fileId="row.fileId">查看</PreviewByFileId>
          <el-button v-if="$hasPower('EpcPppCcpDataDownload')" type="text" @click="download(row)">下载</el-button>
          <el-button v-if="$hasPower('EpcPppCcpDataRemove')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <Edit v-if="editDialogVisible" :visible.sync="editDialogVisible"></Edit>
  </div>
</template>

<script>
import api from '../api'
import fileApi from '@/api/file'
import Edit from './components/Edit'
import { saveAs } from 'file-saver'
import SelectCompany from '../components/SelectCompany'
export default {
  name: 'CcpData',
  components: { Edit, SelectCompany },
  // 这里存放数据
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request: api.getCcpData,
      // 当前活动行的数据
      activeRow: {},
      // 编辑弹窗是否显示
      editDialogVisible: false
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  methods: {
    // 刷新
    refresh() {
      this.$refs.table.refresh()
    },
    // 删除
    remove(list) {
      this.$remove(
        idList => {
          return api.removeCcpDataById(idList.join(','))
        },
        list,
        null,
        null,
        '确定要删除资料'
      ).then(res => this.refresh())
    },
    // 重置筛选框
    reset() {
      this.$refs.table.reset()
    },
    // 查看
    view(row) {
      this.viewDialogVisible = true
      this.activeRow = _.cloneDeep(row)
    },
    async download(row) {
      const { data: file } = await fileApi.downloadFileById(row.fileId)
      saveAs(file, row.name + '.' + row.fileType)
      await api.downloadCcpDataById(row.id)
    }
  }
}
</script>

<style scoped lang="less"></style>
