<template>
  <div class="container no-padding is-footer fixedHeight">
    <div class="innerContainer white">
      <div class="formWrapper">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="140px" class="form-con">
          <el-form-item label="投资概算名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入概算名称" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="概算金额(万元)" prop="money">
            <InputNumber v-model="form.money" placeholder="请输入概算金额" class="inputStyle"> </InputNumber>
          </el-form-item>
          <el-form-item label="投资估算名称" prop="lastBudgetId">
            <el-select v-model="form.lastBudgetId" clearable placeholder="请选择估算名称" class="inputStyle">
              <el-option v-for="item in reckonList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="估算金额(万元)" prop="preMoney">
            <el-input-number v-model="form.preMoney" disabled :controls="false" :min="0" class="inputStyle">
            </el-input-number>
          </el-form-item>
          <el-form-item label="比值" prop="ratio">
            <el-input v-model="form.ratio" disabled class="inputStyle"> </el-input>
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
  name: 'EstimateAdd',
  components: {},
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.params.id || '',
      form: { type: 2 },
      reckonList: [], //通过审核的估算列表
      formRules: {
        name: [{ required: true, message: '投资概算名称必填', trigger: 'blur' }],
        money: [{ required: true, message: '投资概算金额必填', trigger: 'blur' }],
        lastBudgetId: [{ required: true, message: '投资估算必选', trigger: 'change' }]
      }
    }
  },
  computed: {},
  watch: {
    'form.lastBudgetId'(val) {
      let selectData = this.reckonList.filter(item => item.id === val)
      if (!selectData.length) return
      this.form.preMoney = selectData[0].money
      if (this.form.money) {
        this.form.ratio = this.toFixed2(((this.form.money - this.form.preMoney) * 100) / this.form.money) + '%'
      }
    },
    'form.money'(val) {
      if (val && val - 0 !== 0) {
        this.form.ratio = this.toFixed2(((val - this.form.preMoney) * 100) / val) + '%'
      } else {
        this.form.ratio = 0 + '%'
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
    this.getReckonList()
  },
  // 方法集合
  methods: {
    //获取估算列表(只查询已通过的)
    async getReckonList() {
      let res = await Api.getReckonList({
        projectId: this.projectId,
        page: 1,
        rows: 9999,
        type: 1
      })
      if (this.id) {
        this.reckonList =
          res.data.records.filter(item => item.usedFlag === 0 || item.id === this.form.lastBudgetId) || []
      } else {
        this.reckonList = res.data.records.filter(item => item.usedFlag === 0) || []
      }
    },
    //获取详情
    async getDetail() {
      let res = await Api.getEstimateDetail(this.id)
      this.form = { ...res.data }
    },
    //点击保存
    async handleSave() {
      await this.$refs['formRef'].validate()
      let res = ''
      if (this.id) {
        res = await Api.updateEstimate({
          ...this.form,
          projectId: this.projectId
        })
      } else {
        res = await Api.addEstimate({
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
        res = await Api.updateEstimate({
          ...this.form,
          projectId: this.projectId
        })
      } else {
        res = await Api.addEstimate({
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
