<template>
  <div class="is-footer">
    <el-form ref="formData" label-width="140px" :rules="formRules" :model="formData">
      <div style="border: 1px solid #000; padding: 10px">
        <el-form-item label="合同编号" prop="code">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="合同名称" prop="name"><el-input v-model="formData.name"></el-input></el-form-item>
        <el-form-item label="甲方" prop="firstPartyName"
          ><el-input v-model="formData.firstPartyName"></el-input
        ></el-form-item>
        <el-form-item label="乙方" prop="secondPartyName"
          ><el-input v-model="formData.secondPartyName"></el-input
        ></el-form-item>
        <el-form-item label="签订日期" prop="signDate">
          <el-date-picker v-model="formData.signDate" value-format="yyyy-MM-dd HH:mm:ss" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="附件">
          <Upload v-model="formData.fileIds" isOnlyButton multiple btnText="上传附件" style="width: 250px"></Upload>
        </el-form-item>
      </div>
      <div style="border: 1px solid #000; padding: 10px; margin-top: 10px; overflow: hidden">
        <div style="float: right">
          <el-button size="large" @click="$router.back()">取消</el-button>
          <el-button v-promise-btn size="large" type="primary" @click="submit">保存</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { contractApi } from './api/contract'
export default {
  name: 'ContractAdd',
  data() {
    return {
      formRules: {
        code: [{ required: true, message: '请输入合同编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
        firstPartyName: [{ required: true, message: '请输入甲方', trigger: 'blur' }],
        secondPartyName: [{ required: true, message: '请输入乙方', trigger: 'blur' }],
        signDate: [{ required: true, message: '请输入签订日期', trigger: 'blur' }]
      },
      formData: {
        projectId: localStorage.getItem('projectId')
      },
      id: ''
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    async getDetail() {
      if (!this.id) {
        return
      }
      let res = await contractApi.getdetailCcpContract(this.id)
      this.formData = res.data || {}
    },
    async submit() {
      await this.$refs.formData.validate()
      if (this.formData.id) {
        await contractApi.getUpdateContract(this.formData)
      } else {
        await contractApi.getAddCcpContract(this.formData)
      }
      this.$message.success('成功')
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/color.less';
.el-form {
  max-width: 1000px;
}
.el-upload_tip {
  color: #ccc;
}
/deep/.el-input {
  border-color: #000;
  width: 250px;
}
</style>
