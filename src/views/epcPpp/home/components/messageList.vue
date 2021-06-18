<template>
  <div>
    <div class="tab-body">
      <!-- 通知公告 start -->
      <el-form :inline="true">
        <el-form-item>
          <el-button type="text" icon="el-icon-star-off" @click="markAllRead">全部标记为已读</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="toMessage">查看全部</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="messageList" height="316" style="width: 100%">
        <el-table-column prop="title" label="公告标题" min-width="300">
          <template slot-scope="scope">
            <router-link to="" @click.native="viewMessage(scope.row, scope.$index)">{{ scope.row.title }}</router-link>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="categoryName" label="消息类型" width="150"> </el-table-column> -->
        <el-table-column prop="isRead" label="状态">
          <template slot-scope="scope">
            {{ scope.row.isRead === 1 ? '已读' : '未读' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"> </el-table-column>
        <el-table-column label="操作" width="100" align="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click.native="viewMessage(scope.row, scope.$index)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 通知公告 end -->
    </div>
    <!-- 消息详情模态框 start -->
    <el-dialog title="消息详情" :visible.sync="detailsModal.show">
      <el-form>
        <el-form-item label="标题" :label-width="formLabelWidth">
          {{ detailsModal.formData.title }}
        </el-form-item>
        <!-- <el-form-item label="消息类型" :label-width="formLabelWidth">
          {{ detailsModal.formData.categoryName }}
        </el-form-item> -->
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          {{ detailsModal.formData.createTime }}
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth"> 已读 </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          {{ detailsModal.formData.content }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailsModal.show = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 消息详情模态框 end -->
  </div>
</template>

<script>
import { homeApi } from '../api'
export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      messageTotal: 0,
      projectId: localStorage.getItem('projectId'),
      messageList: [],
      formLabelWidth: '120px',
      detailsModal: {
        show: false,
        formData: {
          createTime: '2020-08-18',
          status: 1,
          content: '2222'
        }
      }
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.queryMessage()
  },
  //方法集合
  methods: {
    // 获取通知公告
    async queryMessage() {
      let params = {
        page: 1,
        rows: 200,
        isRead: 0,
        projectId: this.projectId
      }
      let result = await homeApi.queryNoticeList(params)
      let datas = result.data || []
      console.log('获取通知公告', datas)
      this.messageTotal = datas.length
      this.messageList = datas
      this.$emit('change', this.messageTotal)
    },
    // 查看消息
    viewMessage(row, index) {
      this.detailsModal.formData = row
      this.detailsModal.show = true
      this.readMessage(row.id, index)
    },
    // 消息已读
    async readMessage(id, index) {
      await homeApi.readMessage(id)
      this.queryMessage()
    },
    // 标记全部已读
    async markAllRead() {
      let idList = _.map(this.messageList, 'id')
      await homeApi.markAllRead(idList)
      this.queryMessage()
    },
    // 查看全部
    toMessage() {
      this.$router.push({
        name: 'NoticeEpcPpp'
      })
    }
  }
}
</script>
