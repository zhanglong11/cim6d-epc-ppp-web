<template>
  <div>
    <el-card class="comments">
      <div slot="header" class="clearfix">
        <span>批注</span>
        <el-button v-if="canAdd" style="float: right" type="primary" size="mini" @click="showModal">新增批注</el-button>
      </div>
      <el-table :data="dataList" style="width: 100%">
        <el-table-column prop="creatorName" label="批注人" min-width="180"> </el-table-column>
        <el-table-column prop="content" label="批注内容" show-overflow-tooltip min-width="360"> </el-table-column>
        <el-table-column prop="createTime" label="批注时间" min-width="180"> </el-table-column>
        <el-table-column prop="fileIds" label="批注附件" min-width="150">
          <template slot-scope="scope">
            <AttachmentDialog :ids="scope.row.fileIds"></AttachmentDialog>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.creator === userId"
              size="small"
              icon="el-icon-delete"
              type="danger"
              @click="deleteItem(scope.row, scope.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" style="margin-top: 10px">
        <div class="toolbar" style="display: flex; justify-content: space-between">
          <div class="num">
            共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
            <el-button type="text primary" class="el-icon-refresh" @click="search()"></el-button>
          </div>
          <el-pagination
            :current-page="queryForm.page"
            :page-sizes="[10, 20]"
            :page-size="queryForm.rows"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="changeSize"
            @current-change="search"
          />
        </div>
      </div>
    </el-card>
    <!-- 新增批注 - 模态框 start -->
    <el-dialog title="新增批注" :visible.sync="modalStatus">
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="批注内容" prop="content">
          <el-input v-model="formData.content" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="批注附件">
          <Upload
            v-if="modalStatus"
            accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.jpeg,.png"
            isOnlyButton
            :limit="5"
            multiple
            @input="changeUpload"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="modalStatus = false">取 消</el-button>
        <el-button size="medium" type="primary" :loading="btnLoading" @click="save()">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 新增批注 - 模态框 end -->
  </div>
</template>

<script>
import Api from './commentsApi'
export default {
  props: {
    // 业务数据主键id
    id: {
      type: [String, Number],
      default: ''
    },
    // 类型
    type: {
      type: String,
      default: ''
    },
    canAdd: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalStatus: false,
      queryForm: {
        dataId: this.id,
        module: this.type,
        page: 1,
        projectId: this.$store.state.project.projectId,
        rows: 10
      },
      total: 0,
      // 批注列表
      dataList: [],
      // 提交表单数据
      formData: {
        content: '',
        dataId: this.id, // 业务数据主键id
        fileIds: '',
        module: this.type, // 业务模块
        projectId: this.$store.state.project.projectId // 项目id
      },
      formDataBack: {},
      rules: {
        content: [{ required: true, message: '请输入批注内容', trigger: 'blur' }]
      },
      btnLoading: false // 拦截多次点击
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    // 当前登录用户id
    userId() {
      return this.$store.state.user.id
    }
  },
  mounted() {
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init() {
      Object.assign(this.formDataBack, this.formData)
      this.queryList()
    },
    // 显示模态框
    showModal() {
      Object.assign(this.formData, this.formDataBack)
      this.modalStatus = true
    },
    // 查询批注列表
    async queryList() {
      let result = await Api.queryCommonCommentList(this.queryForm)
      let datas = result.data
      let list = datas.records || []
      this.dataList = list
      this.total = datas.total
      this.updateCommentStatus(datas.total ? 1 : 0)
    },
    // 改变每页显示条数
    changeSize(size) {
      this.queryForm.rows = size
      this.search()
    },
    // 查询
    search(page = 1) {
      this.queryForm.page = page
      this.queryList()
    },
    // 图片上传成功
    changeUpload(fileIds) {
      this.formData.fileIds = fileIds
    },
    // 删除批注
    deleteItem(item, index) {
      this.$confirm('确认要删除吗？', {
        title: '温馨提示',
        type: 'error',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        callback: action => {
          if (action === 'confirm') {
            this.deleteCommonComment(item.id)
          }
        }
      })
    },
    // 删除批注 - 异步
    async deleteCommonComment(id) {
      await Api.deleteCommonComment(id)
      this.$notify({
        title: '提示',
        message: '操作成功',
        type: 'success'
      })
      this.search()
    },
    // 保存
    save() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          // if (!this.formData.fileIds) {
          //   this.$message.error('请上传批注附件')
          //   return
          // }
          this.addCommonComment()
        }
      })
    },
    // 添加批注
    async addCommonComment() {
      try {
        this.btnLoading = true
        await Api.addCommonComment(this.formData)
        this.modalStatus = false
        this.btnLoading = false
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success'
        })
        this.search()
      } catch (e) {
        this.btnLoading = false
      }
    },
    // 修改施工日志批注状态 @author sunshihao
    async updateCommentStatus(commentStatus) {
      let params = {
        id: this.id,
        commentStatus
      }
      await this.axios[Api[this.type].key].post(Api[this.type]['url'], params)
    }
  }
}
</script>
<style lang="less" scoped>
.comments {
  margin-top: 15px;
}
.comments-list {
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0;
  }
  /deep/.el-form-item__content {
    color: #999;
  }
}
</style>
