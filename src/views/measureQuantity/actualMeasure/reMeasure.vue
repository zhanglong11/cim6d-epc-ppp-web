<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" class="edit-section" label-width="90px">
            <el-form-item label="选择位置" prop="measureLocation">
              <div v-text="form.measureLocation"></div>
            </el-form-item>
            <el-form-item label="合格标准" prop="measureStandardName">
              <div v-text="form.measureStandardName"></div>
            </el-form-item>
            <el-form-item label="测量指标" prop="measureMetricInfo">
              <div v-text="form.measureMetricInfo.map(e => e.metricName).join('，')"></div>
            </el-form-item>
            <el-form-item label="实测点" prop="totalPointNum">
              <div v-text="totalPointNum" />
            </el-form-item>
            <el-form-item label="合格点" prop="passNum">
              <div v-text="passNum" />
            </el-form-item>
            <el-form-item label="合格率" prop="failNum">
              <div v-text="totalPointNum ? _.round(passNum / totalPointNum, 2) * 100 + '%' : ''" />
            </el-form-item>
            <el-form-item label="不合格点" prop="failNum">
              <div v-text="failNum" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <ImageMark :imageSrc="form.measureDrawingUrl" :pointList="pointList"></ImageMark>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">测点明细(合格)</div>
      <div class="tooltips">
        <el-form inline>
          <el-form-item>
            <el-input v-model="filterForm1.q" placeholder="测量人" />
          </el-form-item>
          <el-form-item label="测量时间">
            <DateRange
              :start-time.sync="filterForm1.startTime"
              :end-time.sync="filterForm1.endTime"
              type="daterange"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <vxe-table highlight-current-row :row-id="null" :data="computedPassPointDetailList">
        <vxe-table-column title="点号" field="positionNum" width="60px"></vxe-table-column>
        <vxe-table-column
          title="位置"
          :show-overflow="false"
          :formatter="() => form.measureLocation"
        ></vxe-table-column>
        <vxe-table-column title="测量指标" field="metricName"></vxe-table-column>
        <vxe-table-column title="合格标准">
          <template #default="{ row }"> [{{ row.lowerBound }},{{ row.uppserBound }}] </template>
        </vxe-table-column>
        <vxe-table-column title="单位" field="unit"></vxe-table-column>
        <vxe-table-column title="设计值" field="designValue"></vxe-table-column>
        <vxe-table-column title="测量值" field="measureValue"></vxe-table-column>
        <vxe-table-column title="偏差" field="deviationValue"></vxe-table-column>
        <vxe-table-column title="是否合格">
          <template #default="{ row }">{{ ['不合格', '合格'][row.status] }}</template>
        </vxe-table-column>
        <vxe-table-column title="测量人" field="measurerName"> </vxe-table-column>
        <vxe-table-column title="测量时间" field="measureTime"></vxe-table-column>
        <vxe-table-column title="测量记录">
          <template #default="{ row }">
            <el-button type="text" @click="showPointLogs(row.id)">查看记录</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">复测明细(不合格)</div>
      <div class="tooltips">
        <el-form inline>
          <el-form-item>
            <el-input v-model="filterForm2.q" placeholder="测量人" />
          </el-form-item>
          <el-form-item label="测量时间">
            <DateRange
              :start-time.sync="filterForm2.startTime"
              :end-time.sync="filterForm2.endTime"
              type="daterange"
              clearable
            />
          </el-form-item>
        </el-form>
      </div>
      <vxe-table
        ref="table"
        highlight-current-row
        :row-id="null"
        :data="computedRejectPointDetailList"
        :edit-rules="validRules"
      >
        <vxe-table-column title="点号" field="positionNum" width="60px"></vxe-table-column>
        <vxe-table-column
          title="位置"
          :show-overflow="false"
          :formatter="() => form.measureLocation"
        ></vxe-table-column>
        <vxe-table-column title="测量指标" field="metricName"></vxe-table-column>
        <vxe-table-column title="合格标准">
          <template #default="{ row }"> [{{ row.lowerBound }},{{ row.uppserBound }}] </template>
        </vxe-table-column>
        <vxe-table-column title="单位" field="unit"></vxe-table-column>
        <vxe-table-column title="设计值" field="designValue">
          <template #default="{ row }">
            <InputNumber v-model="row.designValue" @input="calculateRow(row)"></InputNumber>
          </template>
        </vxe-table-column>
        <vxe-table-column title="测量值" field="measureValue">
          <template #default="{ row }">
            <InputNumber v-model="row.measureValue" @input="calculateRow(row)"></InputNumber>
          </template>
        </vxe-table-column>
        <vxe-table-column title="偏差" field="deviationValue"></vxe-table-column>
        <vxe-table-column title="是否合格">
          <template #default="{ row }">{{ ['不合格', '合格'][row.status] }}</template>
        </vxe-table-column>
        <vxe-table-column title="测量人" field="measurerName"></vxe-table-column>
        <vxe-table-column title="测量时间" field="measureTime"> </vxe-table-column>
        <vxe-table-column title="测量记录">
          <template #default="{ row }">
            <el-button type="text" @click="showPointLogs(row.id)">查看记录</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>
    <PointLogs :id="pointLogsId" :visible.sync="pointLogsDialogVisible"></PointLogs>
    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
import ImageMark from 'vue-image-mark'
import PointLogs from './components/PointLogs'
export default {
  name: 'ReMeasure',
  components: {
    ImageMark,
    PointLogs
  },

  data() {
    return {
      id: null,
      pointMeasureEditList: [],
      pointList: [],
      targetType: null,
      /*测点明细*/
      measurePointDetail: '',
      pointLogsId: null,
      pointLogsDialogVisible: false,
      form: {
        projectId: localStorage.getItem('projectId'),
        measureDrawingId: '',
        measureDrawingUrl: '',
        measureLocation: '',
        measureStandardId: '',
        measureMetricInfo: [],
        measurePositionList: [],
        measureStandardName: ''
      },
      passPointDetailList: [],
      rejectPointDetailList: [],
      filterForm1: {
        q: '',
        time: []
      },
      filterForm2: {
        q: '',
        time: []
      },
      validRules: {
        designValue: [{ required: true, message: '必填' }],
        measuredValue: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    totalPointNum() {
      return this.pointList.length
    },
    passNum() {
      return this.pointList.filter(e => e.status === 1).length
    },
    failNum() {
      return this.pointList.filter(e => e.status === 0).length
    },
    computedPassPointDetailList() {
      let result = this.passPointDetailList
      if (this.filterForm1.q) {
        result = result.filter(e => e.measurerName.includes(this.filterForm1.q))
      }
      if (this.filterForm1.startTime && this.filterForm1.endTime) {
        result = result.filter(
          e => e.measureTime <= this.filterForm1.endTime && e.measureTime >= this.filterForm1.startTime
        )
      }
      return result
    },
    computedRejectPointDetailList() {
      let result = this.rejectPointDetailList
      if (this.filterForm2.q) {
        result = result.filter(e => e.measurerName.includes(this.filterForm2.q))
      }
      if (this.filterForm2.startTime && this.filterForm2.endTime) {
        result = result.filter(
          e => e.measureTime <= this.filterForm2.endTime && e.measureTime >= this.filterForm2.startTime
        )
      }
      return result
    }
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.refresh()
    }
  },
  methods: {
    refresh() {
      this.axios.safety.get('measureRecord/view/' + this.id).then(async res => {
        this.form = res.data
        this.pointList = res.data.positionList.map(e => ({
          x: e.xCoordinate,
          y: e.yCoordinate,
          id: e.positionNum
        }))
        this.form.measureMetricInfo = JSON.parse(res.data.measureMetricInfo)
        res.data.detailList.forEach(e => {
          const targetPoint = _.find(res.data.positionList, { id: e.measurePositionId })
          e.positionNum = targetPoint.positionNum
          e.xCoordinate = targetPoint.xCoordinate
          e.yCoordinate = targetPoint.yCoordinate
        })
        this.form.measurePositionList = res.data.detailList
        await this.$nextTick()
        this.calculateAll()
        this.passPointDetailList = this.form.measurePositionList.filter(e => e.status === 1)
        let rejectPointDetailList = this.form.measurePositionList.filter(e => e.status === 0)
        rejectPointDetailList.forEach(e => {
          e.designValue = null
          e.measureValue = null
        })
        this.rejectPointDetailList = rejectPointDetailList
      })
    },
    async submit() {
      await this.$refs.table.validate().then(async () => {})
      await this.axios.safety.post('measureRecord/' + this.id + '/repetitionMeasure', this.rejectPointDetailList)
      this.$message.success('保存成功')
      this.$router.back()
    },
    cancel() {
      this.$router.back()
    },
    calculateRow(row) {
      if (_.isNumber(row.measureValue) && _.isNumber(row.designValue)) {
        const deviationValue = row.measureValue - row.designValue
        const isOk = deviationValue <= row.uppserBound && deviationValue >= row.lowerBound
        row.deviationValue = deviationValue
        row.status = isOk ? 1 : 0

        let targetPoint = _.find(this.pointList, { id: row.positionNum })
        let pointMeasureList = _.filter(this.form.measurePositionList, { positionNum: row.positionNum })
        if (pointMeasureList.some(e => e.status === 0)) {
          targetPoint.status = 0
          targetPoint.color = '#25cc70'
        } else if (pointMeasureList.every(e => e.status === 1)) {
          targetPoint.status = 1
          targetPoint.color = '#e63030'
        } else {
          targetPoint.status = null
        }
        this.pointList = this.pointList.slice()
      }
    },
    calculateAll() {
      this.form.measurePositionList.forEach(this.calculateRow)
    },
    showPointLogs(id) {
      this.pointLogsId = id
      this.pointLogsDialogVisible = true
    }
  }
}
</script>

<style lang="less"></style>
