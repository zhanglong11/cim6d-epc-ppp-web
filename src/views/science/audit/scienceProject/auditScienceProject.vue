<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: c74fbf3de4b81339a547e1cd8afef48ea5ce7327
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术方案审核 搜索的时间组件添加时分秒，审核和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="$route.params.id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.name }}</div>
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
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
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
      <div class="detail-b-file">
        <FileRecord labelName="纸质版记录" :fileRecover="paperFileList"></FileRecord>
      </div>
    </div>

    <div class="audit-a">
      <!--<div class="audit-a-head">审核结果</div>
      <el-form ref="form" class="audit-a-form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div style="display: flex;">
          <div style="flex: 1">
            <el-form-item label="审核结果" prop="auditStatus">
              <el-radio-group v-model="form.auditStatus">
                <el-radio :label="1">已通过</el-radio>
                <el-radio :label="0">已驳回</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="auditOpinion">
              <el-input v-model="form.auditOpinion" type="textarea" :rows="2" placeholder="请输入审核意见"></el-input>
            </el-form-item>
          </div>
          <div style="flex: 1">
            <el-form-item label="文件上传">
              <FileUpload @input="setFileId" />
            </el-form-item>
          </div>
        </div>
      </el-form>-->
      <CheckCard :id="$route.params.id" ref="checkCard" @emit="changeAudit"></CheckCard>
    </div>

    <div class="detail-c">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/audit/scienceProject'
import FileApi from '@/api/file'
export default {
  name: 'AuditScienceProject',
  data() {
    return {
      electronicFileList: [],
      paperFileList: [],
      data: {
        id: '',
        name: '',
        schemeType: '',
        creatorName: '',
        createTime: '',
        remark: '',
        electronicFileId: null,
        paperFileId: null
      },
      form: {
        auditStatus: '',
        auditOpinion: '',
        auditFileId: null
      },
      formRules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      }
    }
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
    handleCancel() {
      this.$router.push({ name: 'ScienceProjectAudit' })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.auditStatus = this.form.auditStatus ? true : false
          this.form.id = this.data.id

          //根据不同的状态，调用不同的提交接口
          if (this.data.status === 1) {
            //电子版待审核时：提交
            this.form.electronicAuditOpinion = this.form.auditOpinion
            this.form.electronicAuditFileId = this.form.auditFileId
            Api.submitScienceProjectElectronicAudit(this.form).then(res => {
              this.$message.success('电子版待审核：提交成功')
              this.$router.push({ name: 'ScienceProjectAudit' })
            })
          } else if (this.data.status === 4) {
            //纸质版待审核时：提交
            this.form.printAuditOpinion = this.form.auditOpinion
            this.form.printAuditFileId = this.form.auditFileId
            Api.submitScienceProjectPaperAudit(this.form).then(res => {
              this.$message.success('纸质版待审核：提交成功')
              this.$router.push({ name: 'ScienceProjectAudit' })
            })
          }
        }
      })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.auditFileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
