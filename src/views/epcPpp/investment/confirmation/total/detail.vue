<template>
  <div class="container no-padding is-footer">
    <ViewFlow :id="id" />
    <el-form ref="form" label-width="150px">
      <el-card header="基本信息">
        <el-form-item label="期号">
          <div v-text="form.issue"></div>
        </el-form-item>
        <el-form-item label="确认单月份">
          <div v-text="form.confirmMonth"></div>
        </el-form-item>
        <el-form-item label="确认期">
          <div>{{ form.confirmStartDate }} ~ {{ form.confirmEndDate }}</div>
        </el-form-item>
      </el-card>
      <el-tabs v-model="activeTabName" stretch type="border-card">
        <el-tab-pane name="1" label="工程建设其他费用确认单">
          <el-form-item label="工程建设其他费用" prop="constructionOtherCostSaveDTO.constructionOtherCost">
            <p>{{ form.constructionOtherCostSaveDTO.constructionOtherCost }} 元</p>
          </el-form-item>
          <el-form-item>
            <OtherFee :list="form.constructionOtherCostDetailList" />
          </el-form-item>
          <el-form-item label="上传附件">
            <FileTable :ids="form.constructionOtherCostSaveDTO.fileIds" multiple></FileTable>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="项目建设期利息确认单">
          <el-form-item label="项目建设期利息" prop="constructionInterestSaveDTO.constructionInterest">
            <p>{{ form.constructionInterestSaveDTO.constructionInterest }} 元</p>
          </el-form-item>
          <el-form-item>
            <Interest :list="form.constructionInterestDetailList" />
          </el-form-item>
          <el-form-item label="上传附件">
            <FileTable :ids="form.constructionInterestSaveDTO.fileIds" multiple></FileTable>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="总投资确认单">
          <el-form-item>
            <TotalConfirm :list="form.totalDetailList" />
          </el-form-item>
          <el-form-item label="上传附件">
            <FileTable :ids="form.totalConfirmSaveDTO.fileIds" multiple></FileTable>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-card v-if="form.id && (isAfterAudit || isAudit)" header="跟踪审计单位填报审核金额" style="margin-top: 15px">
      <OtherFee :isAudit="isAudit" :editable="isAudit" :list="form.constructionOtherCostDetailList" />
      <TotalConfirm :isAudit="isAudit" :editable="isAudit" style="margin-top: 15px" :list="form.totalDetailList" />
    </el-card>
    <CheckCard v-if="!isAudit && isCheck" :id="id" ref="checkCard"></CheckCard>
    <div class="footer-btn">
      <el-button v-if="!isCheck" @click="handleCancel">返回</el-button>
      <template v-else>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { completeConfirm, getConfirmDetail } from '../../api/confirmation'
import OtherFee from '../components/OtherFee'
import Interest from '../components/Interest'
import TotalConfirm from '../components/TotalConfirm'
import { workFlowApi } from '@/views/epcPpp/workflow/api/workflow-api'
export default {
  name: 'Detail',
  // import引入的组件需要注入到对象中才能使用
  components: { OtherFee, Interest, TotalConfirm },
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id,
      // 是否是工作流审核
      isCheck: !!this.$route.query.isCheck,
      // 是否是审计，用于跟踪审计单位填报审核金额, 是审核金额的时候，两个表格可以编辑
      isAudit: false,
      isAfterAudit: false,
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
    async refresh() {
      if (this.id) {
        // 是审核页面的时候判断一下流程是不是跟踪审计单位填报审核阶段
        if (this.isCheck) {
          await workFlowApi.getProcessLayout(this.id).then(res => {
            // 目前根据高亮节点数量判断是不是跟踪审计单位填报审核阶段
            if (res.data.highLightedActivities.length === 2) {
              this.isAudit = true
            }
            if (res.data.highLightedActivities.length > 2) {
              this.isAfterAudit = true
            }
          })
        }
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
    handleCancel() {
      this.$router.back()
    },
    handleSubmit() {
      if (this.isAudit) {
        completeConfirm(this.form)
        this.$message.success('成功')
        this.$router.back()
      } else {
        this.$refs.checkCard.audit()
      }
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
