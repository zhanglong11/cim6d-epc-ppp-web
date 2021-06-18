<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 8819cc97074ba0aa0c06082fda566918d18f0d05
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 添加检定校准、故障维修、封存、报废，四个详情页，并添加审核结果模块
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.measureDeviceName }}详情</div>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>规格型号</span>
            <span>{{ data.measureDeviceSimple.specification }}</span>
          </div>
          <div>
            <span>测量范围</span>
            <span
              >{{ data.measureDeviceSimple.measureMin }} ~ {{ data.measureDeviceSimple.measureMax }}
              {{ data.measureDeviceSimple.measureUnit }}</span
            >
          </div>
          <div>
            <span>精度等级</span>
            <span>{{ data.measureDeviceSimple.step }}</span>
          </div>
          <div>
            <span>设备状态</span>
            <span v-if="data.measureDeviceSimple.deviceStatus === 0">停用</span>
            <span v-else-if="data.measureDeviceSimple.deviceStatus === 1">在用</span>
            <span v-else-if="data.measureDeviceSimple.deviceStatus === 2">封存</span>
            <span v-else-if="data.measureDeviceSimple.deviceStatus === 3">报废</span>
          </div>
          <div>
            <span>状态</span>
            <span v-if="data.status === 0">封存待审核</span>
            <span v-else-if="data.status === 1">封存已通过</span>
            <span v-else-if="data.status === 2">封存已驳回</span>
          </div>
          <div>
            <span>出厂编号</span>
            <span>{{ data.measureDeviceSimple.manufactureNum }}</span>
          </div>
        </div>
        <div>
          <div>
            <span>制造厂商</span>
            <span>{{ data.measureDeviceSimple.manufacturer }}</span>
          </div>
          <div>
            <span>封存时间</span>
            <span>{{ data.sealTime }}</span>
          </div>
          <div>
            <span>封存原因</span>
            <span>{{ data.sealReason }}</span>
          </div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="remark">
            <span>备注</span>
            <span>{{ data.measureDeviceSimple.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="data.status === 1 || data.status === 2" class="audit-a">
      <div class="audit-a-head">审核结果</div>
      <div class="audit-a-des">
        <div>
          <div>
            <span>审核结果</span>
            <span v-if="data.status === 0">封存待审核</span>
            <span v-else-if="data.status === 1">封存已通过</span>
            <span v-else-if="data.status === 2">封存已驳回</span>
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
import Api from '@/api/science/audit/measureSeal'
export default {
  name: 'MeasureBookMeasureSealDetail',
  data() {
    return {
      data: {
        id: '',
        measureDeviceName: '',
        status: '',
        sealTime: '',
        sealReason: '',
        creatorName: '',
        createTime: '',
        measureDeviceSimple: {
          specification: '',
          measureMin: '',
          measureMax: '',
          measureUnit: '',
          step: '',
          manufactureNum: '',
          manufacturer: '',
          deviceStatus: '',
          remark: ''
        }
      }
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getMeasureSealDetail(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleBack() {
      this.$router.push({ name: 'MeasureBookDetail', params: { id: this.data.measureDeviceId, tabType: 'seal' } })
    }
  }
}
</script>

<style scoped lang="less"></style>
