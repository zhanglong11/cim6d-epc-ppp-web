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
      <el-tabs v-model="activeTabName" stretch type="border-card">
        <el-tab-pane name="1" label="工程建设其他费用确认单">
          <el-form-item label="工程建设其他费用" prop="constructionOtherCostSaveDTO.constructionOtherCost">
            <InputNumber
              v-model="form.constructionOtherCostSaveDTO.constructionOtherCost"
              unit="元"
              style="width: 200px"
            ></InputNumber>
          </el-form-item>
          <el-form-item>
            <OtherFee editable :list="form.constructionOtherCostDetailList" />
          </el-form-item>
          <el-form-item label="上传附件" style="width: 500px">
            <Upload v-model="form.constructionOtherCostSaveDTO.fileIds" multiple></Upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="项目建设期利息确认单">
          <el-form-item label="项目建设期利息" prop="constructionInterestSaveDTO.constructionInterest">
            <InputNumber
              v-model="form.constructionInterestSaveDTO.constructionInterest"
              unit="元"
              style="width: 200px"
            ></InputNumber>
          </el-form-item>
          <el-form-item>
            <Interest editable :list="form.constructionInterestDetailList" />
          </el-form-item>
          <el-form-item label="上传附件" style="width: 500px">
            <Upload v-model="form.constructionInterestSaveDTO.fileIds" multiple></Upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="总投资确认单">
          <el-form-item>
            <TotalConfirm editable :list="form.totalDetailList" />
          </el-form-item>
          <el-form-item label="上传附件" style="width: 500px">
            <Upload v-model="form.totalConfirmSaveDTO.fileIds" multiple></Upload>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
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
import OtherFee from '../components/OtherFee'
import Interest from '../components/Interest'
import TotalConfirm from '../components/TotalConfirm'
export default {
  name: 'Total',
  // import引入的组件需要注入到对象中才能使用
  components: { OtherFee, Interest, TotalConfirm },
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id,
      form: {
        confirmType: 2,
        projectId: localStorage.getItem('projectId'),
        constructionOtherCostSaveDTO: {
          projectId: localStorage.getItem('projectId'),
          fileIds: ''
        },
        constructionInterestSaveDTO: {
          projectId: localStorage.getItem('projectId'),
          fileIds: ''
        },
        totalConfirmSaveDTO: {
          projectId: localStorage.getItem('projectId'),
          fileIds: ''
        },
        constructionOtherCostDetailList: [{}, {}],
        constructionInterestDetailList: [
          { type: 1, interestPeriodArray: [] },
          { type: 2, interestPeriodArray: [] },
          { type: 3, interestPeriodArray: [] }
        ],
        totalDetailList: [{ type: 1 }, { type: 2 }, { type: 3 }]
      },
      rules: {
        issue: [{ required: true, message: '必填' }],
        confirmMonth: [{ required: true, message: '必填' }],
        confirmStartDate: [{ required: true, message: '必填' }],
        'constructionOtherCostSaveDTO.constructionOtherCost': [{ required: true, message: '工程建设其他费用必填' }],
        'constructionInterestSaveDTO.constructionInterest': [{ required: true, message: '项目建设期利息必填' }]
      },
      activeTabName: '1'
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
          _.forEach(res.data.constructionInterestDetailList, item => {
            item.interestPeriodArray = item.interestPeriod ? item.interestPeriod.split(',') : []
          })
          if (!res.data.constructionOtherCostDetailList.length) {
            res.data.constructionOtherCostDetailList.push(...[{}, {}])
          }
          this.form = res.data
        })
      }
    },
    //处理要提交的数据
    async getFormatterData() {
      const form = _.cloneDeep(this.form)
      form.constructionOtherCostDetailList = form.constructionOtherCostDetailList.filter(e => e.projectName)
      form.constructionInterestDetailList.forEach(item => {
        if (item.interestPeriodArray.length) {
          item.interestPeriod = item.interestPeriodArray.join(',')
        }
      })
      _.flatten([
        form.constructionOtherCostDetailList,
        form.constructionInterestDetailList,
        form.totalDetailList
      ]).forEach(item => {
        item.projectId = localStorage.getItem('projectId')
      })
      return form
    },
    // 保存草稿
    async save() {
      await this.$refs.form.validateField(['issue', 'confirmMonth', 'confirmStartDate'])
      const form = await this.getFormatterData()
      await saveConfirm(form)
      this.$message.success('成功')
      this.$router.back()
    },
    // 保存并提交
    async submit() {
      await this.$refs.form.validate(async (valid, err) => {
        if (!valid) {
          // 由于表单在多个标签页中，因此这里会判断并自动跳转到有校验错误的标签页
          if (_.values(err).length === 1 && err['constructionOtherCostSaveDTO.constructionOtherCost']) {
            this.activeTabName = '1'
          }
          if (_.values(err).length === 1 && err['constructionInterestSaveDTO.constructionInterest']) {
            this.activeTabName = '2'
          }
        } else {
          const form = await this.getFormatterData()
          await submitConfirm(form)
          this.$message.success('成功')
          this.$router.back()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-tabs {
  margin-top: 15px;
  background-color: #fff;
}
</style>
