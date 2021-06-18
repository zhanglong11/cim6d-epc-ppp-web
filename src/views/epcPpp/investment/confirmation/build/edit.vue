<template>
  <div class="container no-padding is-footer">
    <el-form ref="form" label-width="150px" :rules="rules" :model="form">
      <el-card header="基本信息">
        <el-form-item label="期号" prop="issue">
          <el-input v-model="form.issue" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="确认单月份" prop="confirmMonth">
          <el-date-picker
            v-model="form.confirmMonth"
            value-format="yyyy-MM"
            style="width: 110px"
            type="month"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="确认期" prop="confirmStartDate">
          <DateRange :start-time.sync="form.confirmStartDate" :end-time.sync="form.confirmEndDate"></DateRange>
        </el-form-item>
      </el-card>
      <el-card header="工程建设费用">
        <el-form-item label="工程建设费用" prop="constructionCostSaveDTO.constructionCost">
          <InputNumber
            v-model="form.constructionCostSaveDTO.constructionCost"
            unit="元"
            style="width: 200px"
          ></InputNumber>
        </el-form-item>
        <el-form-item label="上传附件" style="width: 500px">
          <Upload v-model="form.constructionCostSaveDTO.fileIds" multiple></Upload>
        </el-form-item>
      </el-card>
    </el-form>
    <footer class="footer-btn">
      <el-button @click="$router.back()">取消</el-button>
      <el-button v-promise-btn type="primary" @click="save">保存草稿</el-button>
      <el-button v-promise-btn type="primary" @click="submit">保存并提交</el-button>
    </footer>
  </div>
</template>

<script>
import { getConfirmDetail, saveConfirm, submitConfirm } from '../../api/confirmation'

export default {
  name: 'Build',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id,
      form: {
        confirmType: 1,
        projectId: localStorage.getItem('projectId'),
        constructionCostSaveDTO: {
          projectId: localStorage.getItem('projectId')
        }
      },
      rules: {
        issue: [{ required: true, message: '必填' }],
        confirmMonth: [{ required: true, message: '必填' }],
        confirmStartDate: [{ required: true, message: '必填' }],
        'constructionCostSaveDTO.constructionCost': [{ required: true, message: '必填' }]
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      if (this.id) {
        getConfirmDetail(this.id).then(res => {
          this.form = res.data
        })
      }
    },
    // 保存草稿
    async save() {
      await this.$refs.form.validate()
      await saveConfirm(this.form)
      await this.$message.success('成功')
      this.$router.back()
    },
    // 保存并提交
    async submit() {
      await this.$refs.form.validate()
      await submitConfirm(this.form)
      await this.$message.success('成功')
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-card + .el-card {
  margin-top: 15px;
}
</style>
