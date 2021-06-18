<!--
@bug名称: 1175/上传附件的示例图去掉
@开发人员: 董渊海
@修改日期: 2020-03-23
@任务类型: 修改代码，修改比例(5%)

@bug名称: 1476/技术管理-编辑技术方案：上传的附件删除成功后刷新，删除的附件又显示在页面
@开发人员: 董渊海
@修改日期: 2020-04-01
@任务类型: 修改代码，修改比例(3%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: a507473d4f952fcd918921c4507df17554a0fb5d
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术方案 新增技术方案界面和技术方案详情界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-d">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div class="form-d-head">方案基本信息</div>
        <div class="form-d-body">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="方案名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入方案名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="方案类型" prop="schemeType">
                <el-select v-model="form.schemeType" placeholder="请选择方案类型" style="width: 100%">
                  <el-option label="施工组织设计" :value="1"></el-option>
                  <el-option label="专项施工方案" :value="2"></el-option>
                  <el-option label="超过一定规模的专项施工方案" :value="3"></el-option>
                  <el-option label="施工方案" :value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="方案备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入方案备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="form-d-gutter"></div>

        <div class="form-d-head">方案附件信息</div>
        <div class="form-d-body">
          <el-row>
            <el-col :span="12">
              <el-form-item label="电子版">
                <FileUpload
                  :disabled="!(form.id === '') && !(form.status === 0)"
                  :fileRecover="electronicFileList"
                  @input="setElectronicFileId"
                ></FileUpload>
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
                <FileUpload
                  :disabled="!(form.status === 2)"
                  :fileRecover="paperFileList"
                  @input="setPaperFileId"
                ></FileUpload>
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
        <el-button v-if="form.id === '' || form.status === 0" type="primary" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSaveSubmit">保存并提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/scienceProject'
import FileApi from '@/api/file'
export default {
  name: 'OperationScienceProject',
  data() {
    return {
      electronicFileList: [],
      paperFileList: [],
      form: {
        id: '',
        projectId: localStorage.getItem('projectId'),
        name: '',
        schemeType: '',
        remark: '',
        electronicFileId: '',
        paperFileId: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入方案名称' }],
        schemeType: [{ required: true, message: '请选择方案类型' }]
      }
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getScienceProjectDetail(this.form.id).then(res => {
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
          if (this.form.paperFileId) {
            let fileIds = this.form.paperFileId.split(',')
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
    onCancel() {
      this.$router.push({ name: 'ScienceProject' })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          Api.saveScienceProject(this.form).then(res => {
            this.$message.success('保存成功')
            this.$router.push({ name: 'ScienceProject' })
          })
        }
      })
    },
    handleSaveSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id === '' || this.form.status === 0) {
            //电子版保存提交，草稿状态 变更为 电子版待审核
            Api.saveSubmitScienceProjectElectronic(this.form).then(res => {
              this.$message.success('保存提交成功')
              this.$router.push({ name: 'ScienceProject' })
            })
          } else if (this.form.status === 2) {
            //纸质版保存提交，电子版已通过状态 变更为 纸质版待审核
            Api.saveSubmitScienceProjectPaper(this.form).then(res => {
              this.$message.success('保存提交成功')
              this.$router.push({ name: 'ScienceProject' })
            })
          }
        }
      })
    },
    setElectronicFileId(fileIds) {
      //console.log(fileIds)
      this.form.electronicFileId = fileIds.join(',')
    },
    setPaperFileId(fileIds) {
      //console.log(fileIds)
      this.form.paperFileId = fileIds.join(',')
    }
  }
}
</script>

<style scoped lang="less"></style>
