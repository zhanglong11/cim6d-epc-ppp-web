<template>
  <div class="outerContainer indexWrapper">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-row>
          <el-col :span="12">
            <div class="formWrapper">
              <el-form-item label="付款单名称" label-width="160px" prop="name">
                <el-input v-model="form.name" placeholder="请输入付款单名称" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="付款类型" label-width="160px" prop="type">
                <SelectList v-model="form.type" :self-list="payType" :hasAllOption="false"></SelectList>
              </el-form-item>
              <el-form-item label="付款方" label-width="160px" prop="payerCompanyName">
                <el-input v-model="form.payerCompanyName" disabled placeholder="潜江PPP项目公司" class="inputStyle">
                </el-input>
              </el-form-item>
              <el-form-item label="收款方" label-width="160px" prop="receivingSideCompanyName">
                <el-input
                  v-model="form.receivingSideCompanyName"
                  disabled
                  placeholder="潜江PPP项目公司"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="申请金额(元)" label-width="160px" prop="applyMoney">
                <el-input-number
                  v-model="form.applyMoney"
                  :min="0"
                  placeholder="请输入申请金额"
                  :controls="false"
                  :precision="2"
                  class="inputStyle"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>

              <!--              <el-form-item label="支付时间" label-width="160px" prop="paymentTime">-->
              <!--                <el-date-picker-->
              <!--                  v-model="form.paymentTime"-->
              <!--                  type="date"-->
              <!--                  placeholder="支付时间"-->
              <!--                  class="inputStyle"-->
              <!--                  value-format="yyyy-MM-dd HH:mm:ss"-->
              <!--                ></el-date-picker>-->
              <!--              </el-form-item>-->
              <el-form-item label="备注" label-width="160px" prop="remark">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  class="inputStyle"
                  placeholder="备注"
                  :autosize="{ minRows: 4, maxRows: 6 }"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <br />
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>附件信息</strong>
          <el-button type="primary" style="margin-left: 10px" @click="addFile">上传文件</el-button>
        </div>
        <VXTable ref="fileTable" :pageShow="false" :columns="fileColumn" :tableData="fileData" />
      </el-card>
      <div class="footerButton">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSubmit">提交审核</el-button>
      </div>
    </el-form>
    <UploadDialog v-if="uploadVisible" :visible.sync="uploadVisible" @getFile="getFile" />
  </div>
</template>
<script>
import Api from '@/views/epcPpp/investment/api'
import payType from '@/views/epcPpp/investment/lib/payType'
import fileApi from '@/api/file'
import UploadDialog from '@/views/epcPpp/investment/components/UploadDialog'
import Download from '@/views/epcPpp/investment/components/Download'
export default {
  name: 'Prepayment',
  components: { UploadDialog },
  data() {
    return {
      isSave: true,
      isEdit: false,
      uploadVisible: false,
      paymentId: '',
      formData: {
        paymentStage: 2
      },
      formRule: {},
      form: {},
      payType,
      fileData: [],
      fileIds: [],
      fileColumn: [
        {
          field: 'fileName',
          title: '文件名称'
        },
        {
          field: 'createTime',
          title: '上传时间'
        },
        {
          field: 'creatorName',
          title: '上传人'
        },
        {
          field: 'createTime',
          title: '操作',
          slots: {
            default: ({ row }) => {
              return [
                <PreviewByFileId fileId={row.id} />,
                <Download fileId={row.id} fileName={row.fileName} />,
                <el-button type="text" onClick={() => this.removeFile(row)}>
                  删除
                </el-button>
              ]
            }
          }
        }
      ]
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  watch: {
    fileIds: {
      handler: function (v) {
        if (!v.length) {
          this.fileData = []
          return
        }
        this.getFileList()
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      let { id, isEdit } = this.$route.params
      let { paymentStage } = this.$route.query
      this.formData.paymentStage = parseInt(paymentStage)
      this.isEdit = isEdit
      this.paymentId = id
      if (isEdit) {
        Api.getContractMeasurementPaymentById(id).then(res => {
          if (res.code === 200) {
            this.formData = res.data
          } else {
            this.$message.error('未知错误,请重试')
          }
        })
      }
    },
    addFile() {
      this.uploadVisible = true
    },
    //获取文件id
    getFile(fileIds) {
      console.log('fileIds', fileIds)
      this.fileIds = [...this.fileIds, ...fileIds]
    },
    //获取文件列表
    async getFileList() {
      let res = await fileApi.getFileList(this.fileIds)
      this.fileData = res.data
    },
    handleCancel() {
      this.$router.back()
    },
    async handleSave() {
      await this.$refs.baseInfoForm.validate()
      let res = await Api.getAddList(this.form)
      if (res.code === 200) {
        this.$message.success('保存成功')
        this.$router.back()
      } else {
        this.$message.error('保存失败')
      }
    },
    handleSubmit() {
      this.isSave = false
      this.$refs.baseForm.submitForm()
    }
    // handleSubmitSuccess(data) {
    //   if (this.isEdit) {
    //     Api.updateContractMeasurementPaymentById({
    //       ...data,
    //       status: this.isSave ? 0 : 1,
    //       projectId: this.projectId,
    //       id: this.paymentId
    //     }).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('保存成功')
    //         this.$router.back()
    //       } else {
    //         this.$message.error('保存失败')
    //       }
    //     })
    //   } else {
    //     Api.addPrepayment({ ...data, projectId: this.projectId, status: this.isSave ? 0 : 1 }).then(res => {
    //       if (res.code === 200) {
    //         this.$message.success('保存成功')
    //         this.$router.back()
    //       } else {
    //         this.$message.error('保存失败')
    //       }
    //     })
    //   }
    // },
    // handleSubmitError() {
    //   this.$message.error('保存失败')
    // }
  }
}
</script>
<style lang="less" scoped>
.outerContainer {
  padding: 20px;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
