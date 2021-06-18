<!--
@任务名称: 1175/上传附件的示例图去掉
@开发人员: 董渊海
@修改日期: 2020-03-23
@任务类型: 修改代码，修改比例(5%)

@bug名称: 1502/技术管理-图纸会审：上传的附件删除成功后刷新，删除的附件又显示在页面
@开发人员: 董渊海
@修改日期: 2020-04-01
@任务类型: 修改代码，修改比例(3%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2e45398b36093b41f2949e4952b109f2141c86bb
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，图纸会审 时间组件，添加时分秒；补充上传文件功能
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 787aae6116d5f7f5207cddf651b714dcf0608259
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，图纸会审 新增图纸会审界面和图纸会审详情界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-d">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div class="form-d-head">会审基本信息</div>
        <div class="form-d-body">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="会议名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入会议名称"></el-input>
              </el-form-item>
              <el-form-item label="会议时间" prop="meetingTime">
                <el-date-picker
                  v-model="form.meetingTime"
                  placeholder="请选择"
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="主持人" prop="presiderName">
                <el-input v-model="form.presiderName" placeholder="请输入主持人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="会议类型" prop="meetingType">
                <el-select v-model="form.meetingType" placeholder="请选择会议类型" style="width: 100%">
                  <el-option label="图纸预审" :value="1"></el-option>
                  <el-option label="图纸会审" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="会议地点" prop="meetingLocation">
                <el-input v-model="form.meetingLocation" placeholder="请输入会议地点"></el-input>
              </el-form-item>
              <el-form-item label="记录人" prop="recorderName">
                <el-input v-model="form.recorderName" placeholder="请输入记录人"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="会议备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入会议备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-d-gutter"></div>

        <div class="form-d-head">会审附件信息</div>
        <div class="form-d-body">
          <el-row>
            <el-col :span="12">
              <el-form-item label="电子版">
                <FileUpload :fileRecover="electronicFileList" @input="setElectronicFileId"></FileUpload>
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">
              <div class="eg-img">
                <div>示例图</div>
              </div>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="纸质版">
                <FileUpload :fileRecover="printFileList" @input="setPrintFileId"></FileUpload>
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">
              <div class="eg-img">
                <div>示例图</div>
              </div>
            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="其他">
                <FileUpload :fileRecover="otherFileList" @input="setOtherFileId"></FileUpload>
              </el-form-item>
            </el-col>
            <!--<el-col :span="12">
              <div class="eg-img">
                <div>示例图</div>
              </div>
            </el-col>-->
          </el-row>
        </div>
      </el-form>

      <div class="form-d-gutter"></div>

      <div class="form-d-button">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/drawReview'
import FileApi from '@/api/file'
export default {
  name: 'OperationDrawReview',
  data() {
    return {
      electronicFileList: [],
      printFileList: [],
      otherFileList: [],
      form: {
        id: '',
        projectId: localStorage.getItem('projectId'),
        name: '',
        meetingType: '',
        meetingTime: '',
        meetingLocation: '',
        presiderName: '',
        recorderName: '',
        remark: '',
        electronicFileId: '',
        printFileId: '',
        otherFileId: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入会议名称' }],
        meetingType: [{ required: true, message: '请选择会议类型' }],
        meetingTime: [{ required: true, message: '请选择会议时间' }],
        meetingLocation: [{ required: true, message: '请输入会议地点' }],
        presiderName: [{ required: true, message: '请输入主持人' }],
        recorderName: [{ required: true, message: '请输入记录人' }]
      }
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getDrawReviewDetail(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
          if (this.form.electronicFileId) {
            let fileIds = this.form.electronicFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.electronicFileList = res.data
              }
            })
          }
          if (this.form.printFileId) {
            let fileIds = this.form.printFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.printFileList = res.data
              }
            })
          }
          if (this.form.otherFileId) {
            let fileIds = this.form.otherFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.otherFileList = res.data
              }
            })
          }
        }
      })
    }
  },
  methods: {
    onCancel() {
      this.$router.push({ name: 'DrawReview' })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            Api.editDrawReview(this.form).then(res => {
              this.$message.success('修改成功')
              this.$router.push({ name: 'DrawReview' })
            })
          } else {
            Api.addDrawReview(this.form).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'DrawReview' })
            })
          }
        }
      })
    },
    setElectronicFileId(fileIds) {
      //console.log(fileIds)
      this.form.electronicFileId = fileIds.join(',')
    },
    setPrintFileId(fileIds) {
      //console.log(fileIds)
      this.form.printFileId = fileIds.join(',')
    },
    setOtherFileId(fileIds) {
      //console.log(fileIds)
      this.form.otherFileId = fileIds.join(',')
    }
  }
}
</script>

<style scoped lang="less"></style>
