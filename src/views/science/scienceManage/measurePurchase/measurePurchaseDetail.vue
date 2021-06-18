<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 6b14b0ad1968a54825bfe34dc82b3e967c432103
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具采购计划 搜索的时间组件添加时分秒，新增和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 4c2c837122d4ac3fc5ec1b3aac88920a5a1f8d41
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术方案、计量器具采购 发起人查看的详情页，添加审核结果
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.deviceName }}详情</div>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>规格型号</span>
            <span>{{ data.specification }}</span>
          </div>
          <div>
            <span>测量范围</span>
            <span>{{ data.measureMin }}~{{ data.measureMax }} {{ data.measureUnit }}</span>
          </div>
          <div>
            <span>精度等级</span>
            <span>{{ data.step }}</span>
          </div>
          <div>
            <span>计划状态</span>
            <span v-if="data.status === 0">草稿</span>
            <span v-else-if="data.status === 1">待审核</span>
            <span v-else-if="data.status === 2">已通过</span>
            <span v-else-if="data.status === 3">已驳回</span>
          </div>
        </div>
        <div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="remark">
            <span>计划备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="data.status === 2 || data.status === 3" class="audit-a">
      <div class="audit-a-head">审核结果</div>
      <div class="audit-a-des">
        <div>
          <div>
            <span>审核结果</span>
            <span v-if="data.status === 0">草稿</span>
            <span v-else-if="data.status === 1">待审核</span>
            <span v-else-if="data.status === 2">已通过</span>
            <span v-else-if="data.status === 3">已驳回</span>
          </div>
          <div>
            <span>审核意见</span>
            <span>{{ data.auditOpinion }}</span>
          </div>
        </div>
        <div style="display: flex">
          <div style="padding-right: 10px; color: #c1c1c1">文件列表</div>
          <div style="margin-top: -6px">
            <FileList :ids="data.auditFileId" />
          </div>
        </div>
      </div>
    </div>

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleBack">返回</el-button>
      <template v-else>
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/audit/measurePurchase'
export default {
  name: 'MeasurePurchaseDetail',
  data() {
    return {
      data: {
        id: '',
        deviceName: '',
        measureMin: '',
        measureMax: '',
        measureUnit: '',
        specification: '',
        step: '',
        remark: ''
      }
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getMeasurePurchaseDetailAuditResult(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
  },
  methods: {
    handleEdit() {
      this.$router.push({ name: 'MeasurePurchaseEdit', params: { id: this.data.id } })
    },
    handleBack() {
      this.$router.push({ name: 'MeasurePurchase' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less"></style>
