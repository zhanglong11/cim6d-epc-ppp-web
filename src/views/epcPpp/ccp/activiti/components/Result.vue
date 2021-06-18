<template>
  <div>
    <el-dialog title="活动成果" :visible="visible" @close="close">
      <el-form>
        <el-form-item label="活动标题">{{ data.title }}</el-form-item>
        <el-form-item v-if="manage" label="活动成果附件">
          <Upload
            style="width: 200px; display: inline-block"
            :accept="accept"
            isOnlyButton
            multiple
            btnText="上传附件"
            @input="val => add(val)"
          ></Upload>
        </el-form-item>
      </el-form>
      <vxe-table v-if="list.length" :data="list" max-height="400">
        <vxe-table-column title="文件名">
          <template #default="{ row }">
            <Preview :file="row">{{ row.fileName }}</Preview>
          </template>
        </vxe-table-column>
        <vxe-table-column
          width="120px"
          title="大小"
          field="fileSize"
          :formatter="({ cellValue }) => fileSize(cellValue)"
        ></vxe-table-column>
        <vxe-table-column width="140px" title="上传时间" field="createTime"></vxe-table-column>
        <vxe-table-column title="上传人" width="120px" field="creatorName"></vxe-table-column>
        <vxe-table-column title="操作" width="120px">
          <template #default="{ row, rowIndex }">
            <Download :file="row">
              <el-button icon="el-icon-download" type="primary"></el-button>
            </Download>
            <el-button
              v-if="manage"
              icon="el-icon-delete"
              type="danger"
              sizi="mini"
              @click="remove(rowIndex)"
            ></el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
      <footer slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../api'
import fileApi from '@/api/file'
import fileSize from 'filesize'
export default {
  name: 'Result',
  props: {
    manage: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      ids: ''
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.refresh()
      }
    },
    ids() {
      if (this.ids) {
        fileApi.getFileList(this.ids.split(',')).then(res => (this.list = res.data))
      } else {
        this.list = []
      }
    }
  },
  methods: {
    fileSize,
    refresh() {
      api.getCcpActivitiResultById(this.data.id).then(res => (this.ids = _.map(res.data.fileDTOList, 'id').join(',')))
    },
    async add(val) {
      this.ids = _.union(this.ids.split(',').concat(val.split(',')))
        .filter(e => e)
        .join(',')
    },
    remove(rowIndex) {
      let data = this.ids.split(',')
      data.splice(rowIndex, 1)
      this.ids = data.join(',')
    },
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {
      await api.addCcpActivitiResult({ achievementFileIds: this.ids, id: this.data.id })
      this.$message.success('成功')
      this.close()
    }
  }
}
</script>

<style scoped lang="less">
.img-list {
  margin: 0 -10px;
  .el-image {
    margin: 10px;
  }
}
</style>
<style>
.img-list.attachment-dialog .el-icon-circle-close {
  color: red;
}
</style>
