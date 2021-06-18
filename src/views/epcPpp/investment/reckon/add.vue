<template>
  <div class="container no-padding is-footer fixedHeight">
    <div class="innerContainer white">
      <div class="formWrapper">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" class="form-con">
          <el-form-item label="投资估算名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入估算名称" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="估算金额(万元)" prop="money">
            <InputNumber v-model="form.money" placeholder="请输入估算金额" class="inputStyle"> </InputNumber>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              class="inputStyle"
              placeholder="备注"
              :autosize="{ minRows: 4, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="附件" prop="fileIds">
            <Upload
              v-model="form.fileIds"
              class="inputStyle"
              isOnlyButton
              multiple
              accept=".rar,.zip,.doc,.docx,.pdf,.jpg"
            >
              <div slot="btn">
                <el-button size="mini">
                  <i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px"></i>
                  上传文件
                </el-button>
              </div>
            </Upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-promise-btn type="primary" size="lg" @click="handleSave">保存</el-button>
      <!--<el-button v-promise-btn type="primary" size="lg" @click="handleSubmit">保存并提交</el-button>-->
    </div>
  </div>
</template>

<script>
import Api from '../api'
export default {
  name: 'ReckonAdd',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.params.id || '',
      form: { type: 1 },
      formRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        money: [{ required: true, message: '金额不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getReckonDetail(this.id)
      this.form = { ...res.data }
    },
    //点击保存
    async handleSave() {
      await this.$refs['formRef'].validate()
      let res = ''
      if (this.id) {
        res = await Api.updateReckon({
          ...this.form,
          projectId: this.projectId
        })
      } else {
        res = await Api.addReckon({
          ...this.form,
          projectId: this.projectId
        })
      }
      this.$message.success('保存成功')
      this.goBack()
    },
    //点击保存并提交
    async handleSubmit() {
      await this.$refs['formRef'].validate()
      let res = ''
      if (this.id) {
        res = await Api.updateReckon({
          ...this.form,
          projectId: this.projectId
        })
      } else {
        res = await Api.addReckon({
          ...this.form,
          projectId: this.projectId
        })
      }
      this.$message.success('保存成功')
      this.goBack()
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.formWrapper {
  width: 60%;
  background-color: #fff;
  .inputStyle {
    width: 400px;
  }
  .btn {
    cursor: pointer;
  }
}
/deep/ .el-input-number .el-input__inner {
  text-align: left !important;
}
/deep/ .el-upload--picture-card {
  background-color: #fbfdff;
  border: none;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 50px;
  line-height: 50px;
  vertical-align: top;
  display: block;
}
/deep/ .el-upload--text {
  max-width: 110px;
}
</style>
