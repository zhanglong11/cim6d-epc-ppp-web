<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 28115153c02bc15ba3d221102af81d02aca94dff
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术交底 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-d">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div class="form-d-head">交底基本信息</div>
        <div class="form-d-body">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="交底名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入交底名称"></el-input>
              </el-form-item>
              <el-form-item label="交底形式" prop="disclosureForm">
                <el-select v-model="form.disclosureForm" placeholder="请选择交底形式" style="width: 100%">
                  <el-option label="书面交底" :value="1"></el-option>
                  <el-option label="会议交底" :value="2"></el-option>
                  <el-option label="样板模型交底" :value="3"></el-option>
                  <el-option label="挂牌交底" :value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="交底时间" prop="disclosureTime">
                <el-date-picker
                  v-model="form.disclosureTime"
                  placeholder="请选择"
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="交底部位" prop="disclosurePosotion">
                <el-input v-model="form.disclosurePosotion" placeholder="请输入交底部位"></el-input>
              </el-form-item>
              <el-form-item label="上传" prop="fileId">
                <FileUpload :fileRecover="fileList" @input="setFileId"></FileUpload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交底类型" prop="disclosureType">
                <el-select v-model="form.disclosureType" placeholder="请选择交底类型" style="width: 100%">
                  <el-option label="一级交底" :value="1"></el-option>
                  <el-option label="二级交底" :value="2"></el-option>
                  <el-option label="三级交底" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="交底人" prop="disclosurerName">
                <el-input v-model="form.disclosurerName" placeholder="请输入交底人"></el-input>
              </el-form-item>
              <el-form-item label="接收人" prop="accepterName">
                <el-input v-model="form.accepterName" placeholder="请输入接收人"></el-input>
              </el-form-item>
              <el-form-item label="交底内容" prop="content">
                <el-input v-model="form.content" placeholder="请输入交底内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
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
import Api from '@/api/science/scienceManage/scienceExchange'
import FileApi from '@/api/file'
export default {
  name: 'OperationScienceExchange',
  data() {
    return {
      fileList: [],
      form: {
        id: '',
        projectId: localStorage.getItem('projectId'),
        name: '',
        disclosureType: '',
        disclosureForm: '',
        disclosurerName: '',
        disclosureTime: '',
        accepterName: '',
        disclosurePosotion: '',
        content: '',
        fileId: null
      },
      formRules: {
        name: [{ required: true, message: '请输入交底名称' }],
        //disclosureType: [{ required: true, message: '请选择交底类型' }],
        disclosureForm: [{ required: true, message: '请选择交底形式' }],
        disclosurerName: [{ required: true, message: '请输入交底人' }],
        disclosureTime: [{ required: true, message: '请选择交底时间' }],
        accepterName: [{ required: true, message: '请输入接收人' }]
        //bug号：1179、修改人：董渊海、修改时间：2020-03-20
        //disclosurePosotion: [{ required: true, message: '交底部位不能为空' }],
        //content: [{ required: true, message: '交底内容不能为空' }],
        //fileId: [{ required: true, message: '请至少上传一个文件' }]
      }
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getScienceExchangeDetail(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
          if (this.form.fileId) {
            let fileIds = this.form.fileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.fileList = res.data
              }
            })
          }
        }
      })
    }
  },
  methods: {
    onCancel() {
      this.$router.push({ name: 'ScienceExchange' })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            Api.editScienceExchange(this.form).then(res => {
              this.$message.success('修改成功')
              this.$router.push({ name: 'ScienceExchange' })
            })
          } else {
            Api.addScienceExchange(this.form).then(res => {
              this.$message.success('保存成功')
              this.$router.push({ name: 'ScienceExchange' })
            })
          }
        }
      })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
