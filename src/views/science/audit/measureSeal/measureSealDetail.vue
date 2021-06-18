<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 85bf2cf5ee5f8f78d0de97fed475c36927261788
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具封存审核 搜索的时间组件添加时分秒，审核和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.measureDeviceName }}详情</div>
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
            <span v-if="data.status === 0">草稿</span>
            <span v-else-if="data.status === 1">待审核</span>
            <span v-else-if="data.status === 2">通过</span>
            <span v-else-if="data.status === 3">驳回</span>
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

    <!--    <div class="audit-a">-->
    <!--      <div class="audit-a-head">审核结果</div>-->
    <!--      <div class="audit-a-des">-->
    <!--        <div>-->
    <!--          <div>-->
    <!--            <span>审核结果</span>-->
    <!--            <span v-if="data.status === 0">封存待审核</span>-->
    <!--            <span v-else-if="data.status === 1">封存已通过</span>-->
    <!--            <span v-else-if="data.status === 2">封存已驳回</span>-->
    <!--          </div>-->
    <!--          <div>-->
    <!--            <span>审核意见</span>-->
    <!--            <span>{{ data.auditOpinion }}</span>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div style="display: flex;">-->
    <!--          <div style="padding-right: 10px; color: #c1c1c1;">文件列表</div>-->
    <!--          <div style="margin-top: -6px;">-->
    <!--            <FileList :ids="data.auditFileId" />-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <div class="detail-c">-->
    <!--      <el-button @click="handleBack">返回</el-button>-->
    <!--    </div>-->

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/audit/measureSeal'
export default {
  name: 'AuditMeasureSealDetail',
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
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
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
      this.$router.push({ name: 'MeasureSealAudit' })
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less"></style>
