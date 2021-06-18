<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: a507473d4f952fcd918921c4507df17554a0fb5d
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术方案 新增技术方案界面和技术方案详情界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 4c2c837122d4ac3fc5ec1b3aac88920a5a1f8d41
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术方案、计量器具采购 发起人查看的详情页，添加审核结果
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.name }}详情</div>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>方案类型</span>
            <span v-if="data.schemeType === 1">施工组织设计</span>
            <span v-else-if="data.schemeType === 2">专项施工方案</span>
            <span v-else-if="data.schemeType === 3">超过一定规模的专项施工方案</span>
            <span v-else-if="data.schemeType === 4">施工方案</span>
          </div>
          <div>
            <span>方案状态</span>
            <span v-if="data.status === 0">草稿</span>
            <span v-else-if="data.status === 1">电子版待审核</span>
            <span v-else-if="data.status === 2">电子版已通过</span>
            <span v-else-if="data.status === 3">电子版已驳回</span>
            <span v-else-if="data.status === 4">纸质版待审核</span>
            <span v-else-if="data.status === 5">纸质版已通过</span>
            <span v-else-if="data.status === 6">纸质版已驳回</span>
          </div>
        </div>
        <div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="remark">
            <span>方案备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-b">
      <div class="detail-b-head">方案附件</div>
      <div class="detail-b-file">
        <FileRecord labelName="电子版记录" :fileRecover="electronicFileList"></FileRecord>
      </div>
      <div v-if="data.status === 2" class="detail-b-file">
        <div style="display: flex; margin-top: 15px">
          <span class="itemLabel">纸质版记录</span>
          <FileUpload v-model="fileIdsList" :fileRecover="paperFileList"></FileUpload>
        </div>
      </div>
      <div v-else class="detail-b-file">
        <FileRecord labelName="纸质版记录" :fileRecover="paperFileList"></FileRecord>
      </div>
    </div>

    <!-- <div v-if="data.status === 2 || data.status === 3 || data.status === 5 || data.status === 6" class="audit-a">
      <div class="audit-a-head">审核结果</div>
      <div class="audit-a-des">
        <div>
          <div>
            <span>审核结果</span>
            <span v-if="data.status === 0">草稿</span>
            <span v-else-if="data.status === 1">电子版待审核</span>
            <span v-else-if="data.status === 2">电子版已通过</span>
            <span v-else-if="data.status === 3">电子版已驳回</span>
            <span v-else-if="data.status === 4">纸质版待审核</span>
            <span v-else-if="data.status === 5">纸质版已通过</span>
            <span v-else-if="data.status === 6">纸质版已驳回</span>
          </div>
          <div>
            <span>审核意见</span>
            <span>{{ renderOpinion }}</span>
          </div>
        </div>
        <div style="display: flex;">
          <div style="padding-right: 10px; color: #c1c1c1;">文件列表</div>
          <div style="margin-top: -6px;">
            <FileList :ids="getFileId" />
          </div>
        </div>
      </div>
    </div>-->

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleBack">返回</el-button>
      <el-button v-if="data.status === 2" type="primary" @click="handleCheckPaper">提交纸质版审核</el-button>
      <el-button v-if="isCheck" type="primary" @click="approval()">审核</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/audit/scienceProject'
import FileApi from '@/api/file'
export default {
  name: 'ScienceProjectDetail',
  data() {
    return {
      electronicFileList: [],
      paperFileList: [],
      fileIdsList: [], //纸质版文件id
      data: {
        id: '',
        name: '',
        schemeType: '',
        creatorName: '',
        createTime: '',
        remark: '',
        electronicFileId: null,
        paperFileId: null
      }
    }
  },
  computed: {
    renderOpinion() {
      let opinion = ''
      if (this.data.status === 2 || this.data.status === 3) {
        opinion = this.data.electronicAuditOpinion
      } else if (this.data.status === 5 || this.data.status === 6) {
        opinion = this.data.printAuditOpinion
      }
      return opinion
    },
    getFileId() {
      let ids = ''
      if (this.data.status === 2 || this.data.status === 3) {
        ids = this.data.electronicAuditFileId
      } else if (this.data.status === 5 || this.data.status === 6) {
        ids = this.data.printAuditFileId
      }
      return ids
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    console.log(id)
    console.log(isCheck)
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getScienceProjectDetailAuditResult(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
          if (this.data.electronicFileId) {
            let fileIds = this.data.electronicFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.electronicFileList = res.data
              }
            })
          }
          if (this.data.paperFileId) {
            let fileIds = this.data.paperFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.paperFileList = res.data
              }
            })
          }
        }
      })
    }
  },
  methods: {
    handleEdit() {
      this.$router.push({ name: 'ScienceProjectEdit', params: { id: this.data.id } })
    },
    handleBack() {
      this.$router.push({ name: 'ScienceProject' })
    },
    async handleCheckPaper() {
      if (!this.fileIdsList.length) {
        this.$message.error('请选择纸质版文件')
        return
      }
      let res = await Api.uploadPaperScienceProject({ id: this.id, paperFileId: this.fileIdsList.join(',') })
      if (res.code === 200) {
        this.$message.success('提交成功')
        this.$router.back()
      }
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less">
.itemLabel {
  padding-right: 10px;
  color: #c1c1c1;
  width: 80px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  white-space: nowrap;
  text-align: right;
}
</style>
