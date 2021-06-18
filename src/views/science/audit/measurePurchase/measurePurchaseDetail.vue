<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: f6235cbfaf3bf5ceedf8e41bae54f2fb51cae4d1
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具采购计划审核 搜索的时间组件添加时分秒，审核和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.deviceName }}详情</div>
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

    <div class="audit-a">
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

    <div class="detail-c">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/audit/measurePurchase'
export default {
  name: 'AuditMeasurePurchaseDetail',
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
        remark: '',
        status: '',
        auditOpinion: '',
        auditFileId: ''
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
  methods: {
    handleBack() {
      this.$router.push({ name: 'MeasurePurchaseAudit' })
    }
  }
}
</script>

<style scoped lang="less"></style>
