<template>
  <div class="outerWrapper indexWrapper">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>合同变更基本信息</span>
      </div>
      <div class="formWrapper">
        <el-form ref="baseInfoForm" :model="baseInfo" :rules="baseInfoRule">
          <el-form-item label="选择合同" label-width="120px" prop="contractName">
            <el-input v-model="baseInfo.contractName" placeholder="请选择合同" class="inputStyle" disabled> </el-input>
            <a @click="handleSelectContract">选择合同</a>
          </el-form-item>
          <el-form-item label="变更类型" label-width="120px" prop="changeType" style="margin-right: 20px">
            <ContractChangeTypeSelect
              v-model="baseInfo.changeType"
              class="inputStyle"
              :hasAll="false"
            ></ContractChangeTypeSelect>
          </el-form-item>
          <el-form-item label="变更编号" label-width="120px" prop="changeCode" style="margin-right: 20px">
            <el-input v-model="baseInfo.changeCode" placeholder="请输入变更编号" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="变更名称" label-width="120px" prop="changeName" style="margin-right: 20px">
            <el-input v-model="baseInfo.changeName" placeholder="请输入变更名称" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="专业名称" label-width="120px" prop="specialName" style="margin-right: 20px">
            <el-input v-model="baseInfo.specialName" placeholder="请输入专业名称" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="变更原因" label-width="120px" prop="changeReason" style="margin-right: 20px">
            <el-input v-model="baseInfo.changeReason" placeholder="请输入变更原因" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="变更提出单位 " label-width="120px" prop="changeSubmitCompany" style="margin-right: 20px">
            <!--
                /**
                 任务名称：BUG#1395/合同管理-合同变更-新建-【变更提出单位】要改成允许输入的
                 开发人员：崔洛宜
                 日期：2020-03-30
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
            -->
            <!-- <el-input v-model="baseInfo.changeSubmitCompany" class="inputStyle" disabled></el-input>-->
            <el-input v-model="baseInfo.changeSubmitCompany" class="inputStyle"></el-input>
          </el-form-item>
          <el-form-item label="备注" label-width="120px" prop="remark" style="margin-right: 20px">
            <el-input
              v-model="baseInfo.remark"
              type="textarea"
              class="inputStyle"
              placeholder="备注"
              :autosize="{ minRows: 4, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人 " label-width="120px" prop="creatorName" style="margin-right: 20px">
            <el-input v-model="baseInfo.creatorName" class="inputStyle" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>合同变更附件信息</span>
        <el-button type="text" style="float: right; padding: 3px 0"></el-button>
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-form ref="docForm" :model="docForm" style="width: 100%">
            <el-col :span="14">
              <el-form-item
                label="设计变更单/工程洽商记录"
                label-width="120px"
                prop="eleFile"
                style="margin-right: 20px"
              >
                <FileUploadWithImg
                  v-model="docForm.eleFileList"
                  :fileRecover="eleFileUrlList"
                  :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
                  @change="handleChange"
                ></FileUploadWithImg>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!--
                /**
                  任务名称：BUG1287 合同管理-附件缩略图-如果附件是图片，就显示图片；如果是文档，按照下图2中显示文件类型
                  开发人员：崔洛宜
                  日期：2020-03-24
                  BUG类型：测试人员发现的研发自测未通过引起的BUG
                  **/
              -->
              <!--
                  /**
                  任务名称：BUG1495 合同管理->编辑->上传附件时,文件列表没变
                  开发人员：崔洛宜
                  日期：2020-04-03
                  BUG类型：自测BUG
                  **/
              -->
              <div v-if="isEdit" class="detail-b-file">
                <FileRecord labelName="" :fileRecover="eleFileUrlList1"></FileRecord>
              </div>
              <!--<div class="imgContainer">
                <template v-for="(item, index) of eleFileUrlList">
                  <div :key="index" class="imgWrapper">
                    <img :src="item.fileUrl" alt="未知错误" width="100px" height="100px" />
                    <div class="fileName">
                      {{ item.fileName }}
                    </div>
                  </div>
                </template>
              </div>-->
            </el-col>
            <el-col :span="14">
              <!--
                  /**
                 任务名称：BUG#1391 合同管理-合同变更-新建-附件类型是【其他】，非必填
                 开发人员：崔洛宜
                 日期：2020-03-30
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
              -->
              <el-form-item label="其他" label-width="120px" prop="paperFile" style="margin-right: 20px">
                <FileUploadWithImg
                  v-model="docForm.paperFileList"
                  :fileRecover="paperFileUrlList"
                  :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
                  @change="handleChange2"
                ></FileUploadWithImg>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!--
                /**
                  任务名称：BUG1287 合同管理-附件缩略图-如果附件是图片，就显示图片；如果是文档，按照下图2中显示文件类型
                  开发人员：崔洛宜
                  日期：2020-03-24
                  BUG类型：测试人员发现的研发自测未通过引起的BUG
                  **/
              -->
              <!--
                  /**
                  任务名称：BUG1495 合同管理->编辑->上传附件时,文件列表没变
                  开发人员：崔洛宜
                  日期：2020-04-03
                  BUG类型：自测BUG
                  **/
              -->
              <div v-if="isEdit" class="detail-b-file">
                <FileRecord labelName="" :fileRecover="paperFileUrlList1"></FileRecord>
              </div>
              <!-- <div class="imgContainer">
                <template v-for="(item, index) of paperFileUrlList">
                  <div :key="index" class="imgWrapper">
                    <img :src="item.fileUrl" alt="未知错误" width="100px" height="100px" />
                    <div class="fileName">
                      {{ item.fileName }}
                    </div>
                  </div>
                </template>
              </div>-->
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-card>
    <div class="footerButton">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
    <ContractDialog
      v-if="contractSelectVisible"
      :visible="contractSelectVisible"
      @close="contractSelectVisible = false"
      @submit="handleEmit"
    ></ContractDialog>
  </div>
</template>
<script>
import ContractDialog from '../contractMeasurementPayment/componnets/ContractDialog'
import Api from '@/api/contract/contractChange'
import FileUploadWithImg from '_c/FileUploadWithImg/index'
import FileApi from '@/api/file'
export default {
  name: 'ContractChangeAdd',
  components: { ContractDialog, FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      eleFileUrlList: [],
      eleFileUrlList1: [],
      paperFileUrlList: [],
      paperFileUrlList1: [],
      docForm: { eleFileList: [], paperFileList: [] },
      contractSelectVisible: false,
      baseInfo: {
        contractName: '',
        contractId: '',
        changeType: null,
        changeCode: '',
        changeName: '',
        specialName: '',
        changeReason: '',
        /**
         任务名称：BUG#1456 合同管理-合同变更-新建-【变更提出单位】不需要默认显示北京机械厂
         开发人员：崔洛宜
         日期：2020-04-02
         BUG类型：测试人员发现的研发自测未通过引起的BUG
         **/
        changeSubmitCompany: '',
        remark: '',
        creatorName: ''
      },
      baseInfoRule: {
        contractName: [{ required: true, message: '请选择合同', trigger: 'blur' }],
        changeType: [{ required: true, message: '请选择变更类型', trigger: 'change' }],
        changeCode: [{ required: true, message: '请输入变更编号', trigger: 'blur' }],
        changeName: [{ required: true, message: '请输入变更名称', trigger: 'blur' }],
        specialName: [{ required: true, message: '请输入专业名称', trigger: 'blur' }],
        changeReason: [{ required: true, message: '请输入变更原因', trigger: 'blur' }]
      }
    }
  },
  created() {
    let { id, isEdit } = this.$route.query
    this.isEdit = isEdit
    if (isEdit) {
      /**
       任务名称：BUG1495 合同管理->编辑->上传附件时,文件列表没变
       开发人员：崔洛宜
       日期：2020-04-03
       BUG类型：自测BUG
       **/
      Api.getContractChangeById(id).then(res => {
        if (res.code === 200) {
          this.baseInfo = res.data
          this.docForm = {
            eleFileList: res.data.changeOrdersFileIds.split(','),
            paperFileList: res.data.otherOrdersFileIds.split(',')
          }
          if (this.docForm.eleFileList.length > 0) {
            FileApi.getFileList(this.docForm.eleFileList).then(res => {
              if (res.data) {
                this.eleFileUrlList = res.data
                this.eleFileUrlList1 = res.data
              }
            })
          }
          if (this.docForm.paperFileList.length > 0) {
            FileApi.getFileList(this.docForm.paperFileList).then(res => {
              if (res.data) {
                this.paperFileUrlList = res.data
                this.paperFileUrlList1 = res.data
              }
            })
          }
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    }
    this.baseInfo.creatorName = this.$store.getters.name || 'admin'
  },
  methods: {
    handleSelectContract() {
      this.contractSelectVisible = true
    },
    handleEmit(row) {
      this.baseInfo.contractName = row.name
      this.baseInfo.contractId = row.id
      this.contractSelectVisible = false
    },
    /**
     任务名称：BUG1495 合同管理->编辑->上传附件时,文件列表没变
     开发人员：崔洛宜
     日期：2020-04-03
     BUG类型：自测BUG
     **/
    async handleChange(data) {
      if (data.length > 0) {
        let res = await FileApi.getFileList(data)
        this.eleFileUrlList1 = [...res.data]
      } else {
        this.eleFileUrlList1 = []
      }
    },
    async handleChange2(data) {
      if (data.length > 0) {
        let res = await FileApi.getFileList(data)
        this.paperFileUrlList1 = [...res.data]
      } else {
        this.paperFileUrlList1 = []
      }
    },
    handleCancel() {
      this.$router.back()
    },
    handleSave() {
      /**
       任务名称：BUG#1391 合同管理-合同变更-新建-附件类型是【其他】，非必填
       开发人员：崔洛宜
       日期：2020-03-30
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      /**
       任务名称：BUG#1455 合同管理-合同变更-新建-附件非必填，不需要校验
       开发人员：崔洛宜
       日期：2020-04-02
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      /* if (!this.docForm.eleFileList.length ) {
        this.$message.info('请选择上传附件')
        return false
      }*/
      this.$refs.baseInfoForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateContractChangeById({
              ...this.baseInfo,
              projectId: this.projectId,
              changeOrdersFileIds: this.docForm.eleFileList.join(','),
              otherOrdersFileIds: this.docForm.paperFileList.join(','),
              status: 0
            }).then(res => {
              if (res.code === 200) {
                /**
                 任务名称：BUG#1390 合同管理-合同变更-新建-保存成功，没有自动跳转列表页
                 开发人员：崔洛宜
                 日期：2020-03-30
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addContractChange({
              ...this.baseInfo,
              projectId: this.projectId,
              changeOrdersFileIds: this.docForm.eleFileList.join(','),
              otherOrdersFileIds: this.docForm.paperFileList.join(','),
              status: 0
            }).then(res => {
              if (res.code === 200) {
                /**
                 任务名称：BUG#1390 合同管理-合同变更-新建-保存成功，没有自动跳转列表页
                 开发人员：崔洛宜
                 日期：2020-03-30
                 BUG类型：测试人员发现的研发自测未通过引起的BUG
                 **/
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          console.log('请正确填写')
          return false
        }
      })
    },
    handleSubmit() {
      /**
       任务名称：BUG#1391 合同管理-合同变更-新建-附件类型是【其他】，非必填
       开发人员：崔洛宜
       日期：2020-03-30
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      /**
       任务名称：BUG#1455 合同管理-合同变更-新建-附件非必填，不需要校验
       开发人员：崔洛宜
       日期：2020-04-02
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      /*if (!this.docForm.eleFileList.length ) {
        this.$message.info('请选择上传附件')
        return false
      }*/
      this.$refs.baseInfoForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateContractChangeById({
              ...this.baseInfo,
              changeOrdersFileIds: this.docForm.eleFileList.join(','),
              otherOrdersFileIds: this.docForm.paperFileList.join(','),
              projectId: this.projectId,
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addContractChange({
              ...this.baseInfo,
              projectId: this.projectId,
              changeOrdersFileIds: this.docForm.eleFileList.join(','),
              otherOrdersFileIds: this.docForm.paperFileList.join(','),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          console.log('请正确填写')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.inputStyle {
  width: 500px;
}
.formWrapper {
  width: 1200px;
  margin: 0 auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
/deep/ .el-upload {
  text-align: left !important;
}
.imgContainer {
  display: flex;
  .imgWrapper {
    width: 140px;
    height: 140px;
    margin: 10px;
    img {
      width: 100px;
      height: 100px;
      margin: 0 20px;
    }
    .fileName {
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
