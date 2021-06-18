<template>
  <div>
    <div class="info">
      <div class="content">
        <ul class="status">
          <li>状态</li>
          <li>{{ orderInfo.status === 0 ? '不合格' : '合格' }}</li>
        </ul>
        <ul>
          <li>
            <span class="label">测量项</span>
            <span class="val">{{ orderInfo.measureStandardName }}</span>
          </li>
          <li>
            <span class="label">创建人</span>
            <span class="val">{{ orderInfo.creatorName }}</span>
          </li>
          <li>
            <span class="label">位置</span>
            <span class="val">{{ orderInfo.measureLocation }}</span>
          </li>
          <li>
            <span class="label">创建时间</span>
            <span class="val">{{ orderInfo.createTime }}</span>
          </li>
          <li>
            <span class="label">实测点</span>
            <span class="val">{{ orderInfo.totalPointNum }}</span>
          </li>
          <li>
            <span class="label">合格点</span>
            <span class="val">{{ orderInfo.passNum }}</span>
          </li>
          <li>
            <span class="label">合格率</span>
            <span class="val">{{ getPercentFun(orderInfo.passNum, orderInfo.totalPointNum) }}</span>
          </li>
          <li>
            <span class="label">不合格点</span>
            <span class="val">{{ orderInfo.failNum }}</span>
          </li>
          <li>
            <ImageMark :imageSrc="orderInfo.measureDrawingUrl" style="width: 60%" :pointList="pointList"> </ImageMark>
            <!--            <img :src="orderInfo.measureDrawingUrl" alt="" />-->
          </li>
        </ul>
      </div>
    </div>
    <section>
      <el-card>
        <div slot="header" class="card-header">
          <span>测点明细(合格)</span>
        </div>
        <VXTable ref="tableDetail" :columns="tableColumn" :tableData="tableList" :pageShow="false" />
      </el-card>
    </section>
    <section v-if="orderInfo.reiterationStatus === 0 || orderInfo.status === 0" style="margin-top: 20px">
      <el-card>
        <div slot="header" class="card-header">
          <span>复测明细（不合格）</span>
        </div>
        <VXTable ref="table" :columns="recheckTableColumn" :tableData="recheckTableList" :pageShow="false" />
      </el-card>
    </section>
    <div class="btn-box">
      <el-button @click="cancel">返回</el-button>
      <el-button type="primary" @click="submit">保存</el-button>
    </div>
    <RecordDialog :recordId="recordId" :visible.sync="recordVisible"></RecordDialog>
  </div>
</template>

<script>
import api from '../api/measure'
import ImageMark from 'vue-image-mark'
import RecordDialog from '@/views/measureQuantity/actualMeasure/components/RecordDialog'
export default {
  name: 'Detail',
  components: { ImageMark, RecordDialog },
  data() {
    return {
      orderInfo: {},
      pointList: [],
      recordVisible: false,
      recordId: '',
      requestFlag: false,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '点号', width: 80 },
        {
          field: 'measureLocation',
          title: '位置'
        },
        {
          field: 'designValue',
          title: '设计值'
        },
        {
          field: 'measureValue',
          title: '测量值'
        },
        {
          field: 'metricName',
          title: '测量指标'
        },
        {
          field: 'content',
          title: '偏差',
          slots: {
            default: ({ row }) => [<span>{Number(row.measureValue) - Number(row.designValue)}</span>]
          }
        },
        {
          field: 'acceptanceLevel',
          title: '合格标准',
          slots: {
            default: ({ row }) => [
              <span>
                [{row.uppserBound || 0} , {row.lowerBound || 0}]
              </span>
            ]
          }
        },
        {
          field: 'status',
          title: '是否合格',
          slots: {
            default: ({ row }) => [
              <span>
                {Math.abs(row.uppserBound) <= Math.abs(row.deviationValue) &&
                Math.abs(row.deviationValue) <= Math.abs(row.lowerBound)
                  ? '合格'
                  : '不合格'}
              </span>
            ]
          }
        },
        {
          field: 'measurerName',
          title: '测量人'
        },
        {
          field: '',
          title: '测量记录',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              return [
                <el-button type="text" onClick={() => this.toDetail(row.id)}>
                  查看
                </el-button>
              ]
            }
          }
        }
      ],
      tableList: [],
      /*复检明细*/
      recheckTableColumn: [
        { type: 'seq', title: '点号', width: 80 },
        {
          field: 'measureLocation',
          title: '位置'
        },
        {
          field: 'unit',
          title: '单位'
        },
        {
          field: 'designValue',
          title: '设计值',
          slots: {
            default: ({ row, rowIndex }) => [
              <el-input-number
                v-model={row.designValue}
                controls={false}
                controls-position="right"
                min={0}
                onInput={() => {
                  this.getDesignValue(row, rowIndex)
                }}
              />
            ]
          }
        },
        {
          field: 'measuredValue',
          title: '测量值',
          slots: {
            default: ({ row, rowIndex }) => [
              <el-input-number
                v-model={row.measuredValue}
                controls={false}
                controls-position="right"
                min={0}
                onInput={() => {
                  this.getMeasuredValue(row, rowIndex)
                }}
              />
            ]
          }
        },
        {
          field: 'deviationValue',
          title: '偏差'
        },
        {
          field: 'acceptanceLevel',
          title: '合格标准',
          slots: {
            default: ({ row }) => [
              <span>
                [{row.uppserBound}, {row.lowerBound}]
              </span>
            ]
          }
        },
        {
          field: 'status',
          title: '是否合格',
          slots: {
            default: ({ row }) => [<span>{this.formatterStandard(row)}</span>]
          }
        },
        {
          field: 'measurerName',
          title: '测量人'
        }
      ],
      recheckTableList: [],
      // recheckForm:[
      //   {
      //     designValue: 0,
      //     id: '',
      //     measurePositionId: '',
      //     measureRecordId: '',
      //     measureValue: 0,
      //     status: 0
      //   }
      // ],
      form: {}
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let res = await api.getMeasureRecordDetail(this.$route.query.id)
      this.orderInfo = res.data || []
      let cloneData = res.data.positionList.map(item => {
        return {
          x: item.xCoordinate,
          y: item.yCoordinate,
          id: item.positionNum
        }
      })
      this.pointList = cloneData || []
      this.getMeasureDetailList(0)
      this.getMeasureDetailList(1)
      // if (res.data.reiterationStatus === 0) {
      //   this.getMeasureRecordInfo()
      // }
      console.log(this.tableList)
    },
    // 实测实量-测点明细列表
    async getMeasureDetailList(status) {
      let res = await api.getMeasureDetailList({
        measureRecordId: this.$route.query.id,
        status: status
      })

      if (status === 0) {
        let arr = res.data || []
        console.log(this.recheckTableList)
        arr.map(item => {
          this.recheckTableList.push(Object.assign({}, item, { measureLocation: this.orderInfo.measureLocation }))
        })
        console.log(this.recheckTableList)
        // this.recheckTableList = arr
      } else if (status === 1) {
        let arr = res.data || []
        arr.map(item => {
          this.tableList.push(Object.assign({}, item, { measureLocation: this.orderInfo.measureLocation }))
        })
        this.tableList = arr
      }
    },

    toEdit(id) {
      this.$router.push({ path: 'actualMeasureEdit', query: { id } })
    },
    toDetail(id) {
      this.recordId = id
      this.recordVisible = true
    },
    cancel() {
      this.$router.go(-1)
    },
    // 实测实量-复测
    async submit() {
      let res = await api.getMeasureRecordInfo(this.$route.query.id, this.recheckTableList)
      this.$message.success('提交成功')
      this.$router.go(-1)
    },
    getPercentFun(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0 + '%'
    }, //设计值
    getDesignValue(row) {
      row.deviationValue = row.measuredValue - row.designValue || 0
      this.$refs.table.$refs.vxeTable.reloadRow(row)
    },
    // 测量值
    getMeasuredValue(row) {
      row.deviationValue = row.measuredValue - row.designValue || 0
      this.$refs.table.$refs.vxeTable.reloadRow(row)
    },
    //是否合格
    formatterStandard(row) {
      if (
        Math.abs(row.uppserBound) <= Math.abs(row.deviationValue) &&
        Math.abs(row.deviationValue) <= Math.abs(row.lowerBound)
      ) {
        return '合格'
      } else {
        return '不合格'
      }
    },
    getStandardCount() {
      return this.detailList.filter(r => {
        return Math.abs(this.form.deviationValue) >= Math.abs(r.deviationValue)
      }).length
    }
  }
}
</script>

<style scoped lang="less">
.info {
  .content {
    .status {
      display: flex;
      justify-content: center;
      width: 143%;
      flex-direction: column;
      align-items: flex-end;
      padding: 0;
      li {
        &:last-child {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
