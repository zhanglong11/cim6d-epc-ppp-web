<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="queryForm.keyword" style="width: 360px" placeholder="公告标题/发送人" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.type" clearable placeholder="公告类型">
            <el-option v-for="item in typeList" :key="item.value" :label="item.desc" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.isRead" clearable placeholder="公告状态">
            <el-option v-for="item in readStausList" :key="item.value" :label="item.desc" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间" prop="date">
          <el-date-picker
            v-model="dateList"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择"
            end-placeholder="请选择"
            style="width: 400px"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('AddNoticeEpcPpp')" type="primary" icon="el-icon-plus" @click="addItem()"
            >新建公告
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="title" label="公告标题" min-width="140px" />
      <el-table-column prop="type" label="公告类型" min-width="140px">
        <span slot-scope="scope">
          {{ $enum.getDescByValue('NOTICE_TYPE', scope.row.type) }}
        </span>
      </el-table-column>
      <el-table-column prop="creatorName" label="发送人" min-width="140px" />
      <el-table-column prop="createTime" label="发布时间" min-width="140px" />
      <el-table-column prop="name" label="公告状态" min-width="140px">
        <template slot-scope="scope">
          {{ scope.row.isRead === 1 ? '已查看' : '未查看' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('DetailsNoticeEpcPpp')" type="text" size="mini" @click="toDetails(scope.row)"
            >查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        :page-sizes="$pageConfig.pageSizes"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>

    <!-- 消息详情模态框 start -->
    <el-dialog title="消息详情" :visible.sync="detailsModal.show">
      <el-form>
        <el-form-item label="标题" :label-width="formLabelWidth">
          {{ detailsModal.formData.title }}
        </el-form-item>
        <el-form-item label="消息类型" :label-width="formLabelWidth">
          {{ $enum.getDescByValue('NOTICE_TYPE', detailsModal.formData.type) }}
        </el-form-item>
        <el-form-item label="发布时间" :label-width="formLabelWidth">
          {{ detailsModal.formData.createTime }}
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth"> 已读 </el-form-item>
        <el-form-item label="接收人" :label-width="formLabelWidth">
          {{ detailsModal.formData.personListStr }}
        </el-form-item>
        <el-form-item label="附件" :label-width="formLabelWidth">
          <template v-for="item in detailsModal.formData.fileIdList">
            <p :key="item.fileId">
              <PreviewByFileId :fileId="item.fileId"></PreviewByFileId>
            </p>
          </template>
        </el-form-item>
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
/**
   任务名称：task#2849 【智慧工地2.0-前端】公告管理》列表、新建、编辑、详情切图及功能开发
   开发人员：耿为刚
   日期：2020-04-02
   任务类型：全新代码
   **/
import { noticeApi } from './api'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'NoticeList',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 公告类型下拉框数据
      typeList: this.$enum.getValueDescList('NOTICE_TYPE'),
      // 公告状态下拉框数据
      readStausList: [
        {
          value: 0,
          desc: '未查看'
        },
        {
          value: 1,
          desc: '已查看'
        }
      ],
      queryForm: {
        // 查询条件
        keyword: '',
        type: null,
        isRead: null,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      // 选择日期数组
      dateList: [],
      queryFormBack: {},
      dataList: [],
      total: 0,
      formLabelWidth: '120px',
      // 消息详情模态框
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
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      const result = await noticeApi.queryListNotice({
        ...this.queryForm,
        projectId: this.projectId,
        startDate: this.dateList?.[0],
        endDate: this.dateList?.[1]
      })
      const datas = result.data
      const list = datas.records || []
      this.total = datas.total
      console.log(list)
      list.map((item, index) => {
        item.receiverName = ''
      })
      this.dataList = list
    },
    // 查看详情
    toDetails(item) {
      this.detailsModal.formData = item
      this.detailsModal.show = true
      this.getDetails(item.id)
    },
    // 获取消息详情
    async getDetails(id) {
      if (!id) {
        return
      }
      let result = await noticeApi.getDetailsNotice(id)
      let datas = result.data
      let personList = datas.personList || []
      let fileIds = datas.fileIds ? datas.fileIds.split(',') : []
      let fileIdList = []
      datas.personListStr = _.map(personList, 'personName').join(',')
      fileIds.map((item, i) => {
        fileIdList.push({
          title: `附件${i + 1}`,
          fileId: item
        })
      })
      datas.fileIdList = fileIdList
      this.detailsModal.formData = datas
      this.queryList()
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.dateList = []
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.pageNumber = pageNumber
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.pageNumber = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 新建公告
    addItem() {
      this.$router.push({
        name: 'AddNoticeEpcPpp'
      })
    },
    // 删除公告
    deleteItem(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteItemSuccess(id)
        })
        .catch(() => {})
    },
    // 删除项目 - 异步
    async deleteItemSuccess(id) {
      await noticeApi.deleteNotice(id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.search()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;

  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }

  &.status-2 i {
    background: #999;
  }

  &.status-3 i {
    background: #ff9900;
  }
}
</style>
