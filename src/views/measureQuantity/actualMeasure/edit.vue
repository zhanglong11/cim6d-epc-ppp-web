<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" class="edit-section" label-width="90px">
            <el-form-item label="选择位置" prop="measureLocation">
              <el-input :value="form.measureLocation" disabled>
                <el-button slot="append" icon="el-icon-plus" @click="showTargetDialog(1)">选择</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="合格标准" prop="measureStandardName">
              <el-input :value="form.measureStandardName" disabled>
                <el-button slot="append" icon="el-icon-plus" @click="showTargetDialog(2)">选择</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="测量指标" prop="measureMetricInfo">
              <el-input :value="form.measureMetricInfo.map(e => e.metricName).join('，')" disabled>
                <el-button slot="append" icon="el-icon-plus" @click="showTargetDialog(3)">选择</el-button>
              </el-input>
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
        <el-col :span="24">
          <el-button-group>
            <el-button type="primary" size="medium" icon="el-icon-zoom-out" @click="zoomOut">缩小</el-button>
            <el-button size="medium" icon="el-icon-refresh-left" @click="zoomReset">复位</el-button>
            <el-button type="warning" size="medium" icon="el-icon-zoom-in" @click="zoomIn">放大</el-button>
          </el-button-group>
          <div class="zoom-image" :style="zoomConStyle">
            <ImageMark
              v-if="hasImg"
              id="zoomImage"
              :imageSrc="form.measureDrawingUrl"
              :pointList="pointList"
              :style="zoomStyle"
              @add="handleAdd"
              @pointClick="pointClick"
            ></ImageMark>
            <div v-else class="imgInfo">没有关联的图纸</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">测点明细</div>
      <vxe-table
        ref="table"
        :row-id="null"
        :data="sortedTableData"
        :edit-rules="validRules"
        :span-method="mergeRowMethod"
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
        <vxe-table-column title="偏差" field="deviationValue">
          <template #default="{ row }">{{ row.deviationValue | toFixed2(2) }}</template>
        </vxe-table-column>
        <vxe-table-column title="是否合格">
          <template #default="{ row }">{{ ['不合格', '合格'][row.status] }}</template>
        </vxe-table-column>
        <vxe-table-column title="测量人">
          <span>{{ $store.state.user.name }}</span>
        </vxe-table-column>
        <vxe-table-column title="操作">
          <template #default="{ row }">
            <el-button type="danger" @click="handlePointRemove(row)"> 删除 </el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <div class="footer-btn">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <!--选择位置-->
    <SelectTreeMonomer :visible.sync="targetVisible" @getTarget="getTarget" />
    <!--合格标准-->
    <SelectTreeStandard :visible.sync="targetStandardVisible" @getTarget="getTargetStandard" />
    <!--测量指标-->
    <SelectMeasure
      :visible.sync="targetMeasureVisible"
      :measureId="form.measureStandardId"
      @getTarget="getMeasureList"
    />
    <PointMeasureEdit
      :list="_.cloneDeep(pointMeasureEditList)"
      :visible.sync="pointMeasureEditDialogVisible"
      @add="submitPointEdit"
    ></PointMeasureEdit>
  </div>
</template>
<script>
import SelectTreeMonomer from '@/views/measureQuantity/actualMeasure/components/SelectTreeMonomer'
import SelectTreeStandard from '@/views/measureQuantity/actualMeasure/components/SelectTreeStandard'
import SelectMeasure from '@/views/measureQuantity/actualMeasure/components/SelectMeasure'
import ImageMark from 'vue-image-mark'
import PointMeasureEdit from './components/PointMeasureEdit'
import upsertMany from 'upsert-many'
export default {
  name: 'Edit',
  components: {
    SelectTreeMonomer,
    SelectTreeStandard,
    SelectMeasure,
    ImageMark,
    PointMeasureEdit
  },

  data() {
    return {
      hasImg: false, //图纸是否已展示
      id: null,
      /*图纸的url*/
      imgUrl: require('@/assets/images/temp/2d.jpg'), // 平面图
      // 弹窗显示
      targetVisible: false,
      targetStandardVisible: false,
      targetMeasureVisible: false,
      pointMeasureEditDialogVisible: false,
      pointMeasureEditList: [],
      pointList: [],
      targetType: null,
      /*测点明细*/
      measurePointDetail: '',
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
      sortedTableData: [],
      rules: {
        measureLocation: [{ required: true, message: '必填' }],
        measureStandardName: [{ required: true, message: '必填' }],
        measureMetricInfo: [{ required: true, message: '必填' }]
      },
      validRules: {
        designValue: [{ required: true, message: '必填' }],
        measuredValue: [{ required: true, message: '必填' }]
      },
      zoomConStyle: '', // 默认高度
      zoomStyle: '', // 放大/缩小
      zoomSize: 1, // 图纸初始大小
      zoomStep: 0.2, // 每次放大或缩小倍数
      imageHeight: ''
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
    }
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.sortedTableData = _.sortBy(this.form.measurePositionList, ['positionNum', 'metricName'])
        if (this.form.measureDrawingUrl) {
          this.hasImg = true
        } else {
          this.hasImg = false
        }
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.refresh()
    }
  },
  mounted() {
    // this.initImage()
  },
  methods: {
    // 初始化选择图纸组件
    initImage() {
      setTimeout(() => {
        let imageHeight = document.getElementById('zoomImage').firstElementChild.height
        this.imageHeight = imageHeight
        this.zoomConStyle = `height: ${imageHeight}px;`
      }, 1000)
    },
    // 放大图纸
    zoomIn() {
      let zoomSize = this.zoomSize + this.zoomStep
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 缩小图纸
    zoomOut() {
      let zoomSize = this.zoomSize - this.zoomStep
      if (zoomSize < 0.2) {
        return
      }
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    // 复位图纸
    zoomReset() {
      let zoomSize = 1
      this.zoomSize = zoomSize
      this.zoomStyle = `width: ${zoomSize * 100}%;`
    },
    refresh() {
      this.axios.safety.get('measureRecord/view/' + this.id).then(res => {
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
          e.measureLocation = targetPoint.measureLocation
          e._id = _.uniqueId()
        })
        this.form.measurePositionList = res.data.detailList
        this.calculateAll()
      })
    },
    async submit() {
      await this.$refs.form.validate()
      if (!this.form.measureDrawingUrl) {
        this.$message.error('请先关联图纸')
        return false
      }
      if (!this.form.measurePositionList.length) {
        this.$message.error('请添加测点明细')
        return false
      }
      await this.$refs.table.validate().then(async () => {})

      this.form.totalPointNum = this.totalPointNum
      this.form.passNum = this.passNum
      this.form.failNum = this.failNum

      await this.axios.safety.post('measureRecord/' + (this.id ? 'update' : 'add'), this.form)
      this.$message.success('保存成功')
      this.$router.back()
    },
    cancel() {
      this.$router.back()
    },
    /*图纸点击触发事件*/
    handleAdd(point) {
      if (this.form.measureMetricInfo.length) {
        this.pointMeasureEditList = this.form.measureMetricInfo.map(e => ({
          lowerBound: e.lowerBound,
          uppserBound: e.uppserBound,
          metricName: e.metricName,
          unit: e.unit,
          positionNum: point.id,
          xCoordinate: point.x,
          yCoordinate: point.y,
          status: null
        }))
        this.pointMeasureEditDialogVisible = true
      } else {
        this.$message.info('请先选择位置、合格标准、测量指标')
      }
    },
    handlePointRemove(row) {
      const positionNum = row.positionNum
      this.form.measurePositionList = this.form.measurePositionList.filter(e => e.positionNum !== positionNum)
      this.form.measurePositionList.forEach((e, index) => (e.positionNum = index + 1))
      this.sortedTableData.forEach((e, index) => {
        e.positionNum = Math.floor(index / 3 + 0.001) + 1
      })
      this.form.measurePositionList = this.form.measurePositionList.slice()
      this.pointList = this.pointList.filter(e => e.id !== positionNum)
      this.pointList.forEach((e, index) => (e.id = index + 1))
      this.pointList = this.pointList.slice()
    },
    pointClick(point) {
      this.pointMeasureEditList = this.form.measurePositionList.filter(e => e.positionNum === point.id)
      this.pointMeasureEditDialogVisible = true
    },
    submitPointEdit(list) {
      upsertMany(this.pointList, [
        {
          id: list[0].positionNum,
          x: list[0].xCoordinate,
          y: list[0].yCoordinate
        }
      ])
      list.forEach(e => {
        if (!e._id) {
          e._id = _.uniqueId()
        }
      })
      upsertMany(this.form.measurePositionList, list, '_id')
      this.calculateRow(list[0])
    },
    showTargetDialog(type) {
      if (type === 1) {
        this.targetVisible = true
      } else if (type === 2) {
        this.targetStandardVisible = true
      } else if (type === 3) {
        if (this.form.measureStandardId) {
          this.targetMeasureVisible = true
        } else {
          this.$message.info('请先选择标准')
        }
      }
    },
    mergeRowMethod({ row, $rowIndex, column }) {
      if (['操作', '点号', '位置', '测量人'].includes(column.title)) {
        if ($rowIndex % this.form.measureMetricInfo.length === 0) {
          return { rowspan: this.form.measureMetricInfo.length, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 1 }
        }
      } else {
        return { rowspan: 1, colspan: 1 }
      }
    },
    //选择位置之后获取的信息
    getTarget(o) {
      this.form.measureDrawingUrl = o.drawingUrl
      this.form.measureDrawingId = o.drawingId
      this.form.measureLocation = o.label
      this.form.measureLocationId = o.id
    },
    //选择测量指标之后获取的信息
    getMeasureList({ checked }) {
      // 处理增删的指标
      const addList = _.differenceBy(checked, this.form.measureMetricInfo, 'id')
      const removeList = _.differenceBy(this.form.measureMetricInfo, checked, 'id')
      if (addList.length) {
        this.pointList.forEach(point => {
          this.form.measurePositionList.push(
            ...addList.map(e => ({
              lowerBound: e.leftValue,
              uppserBound: e.rightValue,
              metricName: e.measureIndex,
              unit: e.unit,
              positionNum: point.id,
              xCoordinate: point.x,
              yCoordinate: point.y,
              status: null,
              _id: _.uniqueId()
            }))
          )
        })
      }
      if (removeList.length) {
        this.form.measurePositionList = this.form.measurePositionList.filter(
          e => !_.map(removeList, 'metricName').includes(e.metricName)
        )
      }

      this.form.measureMetricInfo = checked.map(e => ({
        lowerBound: e.leftValue,
        uppserBound: e.rightValue,
        metricName: e.measureIndex,
        unit: e.unit,
        id: e.id
      }))
    },
    //选择合格标准之后获取的信息
    getTargetStandard(o) {
      this.form.measureStandardId = o.id
      this.form.measureStandardName = o.name
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
          targetPoint.color = '#e63030'
        } else if (pointMeasureList.every(e => e.status === 1)) {
          targetPoint.status = 1
          targetPoint.color = '#25cc70'
        } else {
          targetPoint.status = null
        }
        this.pointList = this.pointList.slice()
      }
    },
    calculateAll() {
      this.form.measurePositionList.forEach(this.calculateRow)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/styles/common.less');
.imgInfo {
  width: 100%;
  height: 340px;
  background-color: rgb(235, 235, 235);
  text-align: center;
  line-height: 340px;
  font-size: 20px;
  color: #aaa;
}
.zoom-image {
  margin-top: 10px;
  width: 100%;
  height: 800px;
  border: 1px #ccc solid;
  overflow-x: auto;
  .scrollbar(15px);
}
</style>
