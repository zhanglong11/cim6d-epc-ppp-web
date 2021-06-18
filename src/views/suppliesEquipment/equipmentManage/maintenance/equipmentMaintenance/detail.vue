<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ formData.name }} {{ formData.code }}</span>
        <div class="details-title-sub">
          <p>
            <span class="label">执行状态：</span>
            <span class="val">{{ $getLabel(maintenanceStatus, formData.status) }}</span>
          </p>
        </div>
      </div>
      <el-form ref="formRef" :model="formData" label-width="140px" class="form-con">
        <el-row>
          <el-col :md="12">
            <el-form-item label="保养部门">
              {{ formData.maintenanceDepartmentName }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="上次保养时间">
              {{ formData.lastTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="计划保养时间">
              {{ formData.thisTime }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="时间间隔">
              {{ formData.intervalDays }}
            </el-form-item>
          </el-col> </el-row
        ><el-row>
          <el-col :md="12">
            <el-form-item label="循环方式">
              {{ $getLabel(cycle, formData.circulationMode) }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="保养级别">
              {{ $getLabel(level, formData.level) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="保养负责人">
              {{ formData.principalName }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="创建人">
              {{ formData.creatorName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="创建时间">
              {{ formData.createTime }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="计划描述">
              {{ formData.description }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>保养明细</span>
      </div>
      <VXTable v-if="formData.status > 1" :tableData="tableData" :columns="tableColumn" :pageShow="false" />
      <EditTable
        v-if="formData.status < 2"
        ref="table"
        v-model="tableData"
        :tableColumn="formData.status === 0 ? startColumn : editColumn"
        :validRules="validRules"
        :is-add="false"
        :is-remove="false"
        :show-footer="true"
        :border="true"
      />
    </el-card>

    <el-card v-if="formData.status > 2" class="box-card">
      <div slot="header" class="card-header">
        <span>验收信息</span>
      </div>
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="是否合格" prop="status">
              <div>{{ $getLabel(maintenanceStatus, formData.status) }}</div>
            </el-form-item>
            <el-form-item label="评价" prop="opinion">
              <div>{{ formData.opinion }}</div>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card v-if="formData.status === 2" class="box-card">
      <div slot="header" class="card-header">
        <span>验收信息</span>
      </div>
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="是否合格" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="3">合格</el-radio>
                <el-radio :label="4">不合格</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="评价" prop="opinion">
              <el-input v-model="form.opinion" type="textarea" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-if="formData.status === 0" size="lg" type="primary" @click="handle(id, 1)">保养</el-button>
      <el-button v-if="formData.status === 1" size="lg" type="primary" @click="finish(id)">保养完成</el-button>
      <el-button v-if="formData.status === 2" size="lg" type="primary" @click="check">验证</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/maintenance'
import maintenanceStatus from './lib/maintenanceStatus'
import level from './lib/level'
import cycle from './lib/cycle'
import equipmentType from '@/views/suppliesEquipment/equipmentManage/list/lib/equipmentType'
import timestamp from '@/utils/timeStamp'
export default {
  name: 'EquipmentDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      formData: {},
      form: {},
      maintenanceStatus,
      cycle,
      level,
      tableData: [],
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备编码',
          minWidth: 120
        },
        {
          field: 'name',
          title: '设备名称',
          minWidth: 120
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 120
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 120
        },
        {
          field: 'manufacturer',
          title: '生产厂家',
          minWidth: 120
        },
        {
          field: 'supplier',
          title: '供应商',
          minWidth: 120
        },
        {
          field: 'type',
          title: '设备类别',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(equipmentType, row.type)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'maintenanceParts',
          title: '保养部位',
          minWidth: 120
        },
        {
          field: 'maintenanceStartTime',
          title: '保养开始时间',
          minWidth: 220
        },
        {
          field: 'maintenanceEndTime',
          title: '保养结束时间',
          minWidth: 220
        },
        {
          field: 'maintenanceTotalTime',
          title: '保养用时',
          slots: {
            default: ({ row }) => [<span>{timestamp(row.maintenanceTotalTime)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'maintenanceCost',
          title: '保养费用',
          minWidth: 120
        },
        {
          field: 'maintenanceInfo',
          title: '保养信息',
          minWidth: 120
        }
      ],
      startColumn: [
        { type: 'seq', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备编码',
          minWidth: 120
        },
        {
          field: 'name',
          title: '设备名称',
          minWidth: 120
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 120
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 120
        },
        {
          field: 'manufacturer',
          title: '生产厂家',
          minWidth: 120
        },
        {
          field: 'supplier',
          title: '供应商',
          minWidth: 120
        },
        {
          field: 'type',
          title: '设备类别',
          slots: {
            default: ({ row }) => [<span>{this.$getLabel(equipmentType, row.type)}</span>]
          },
          minWidth: 120
        },
        {
          field: 'maintenanceStartTime',
          title: '保养开始时间',
          slots: {
            default: ({ row }) => [
              <el-date-picker v-model={row.maintenanceStartTime} value-format="yyyy-MM-dd HH:mm:ss" type="datetime" />
            ]
          },
          minWidth: 220
        }
      ],
      editColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备编码',
          minWidth: 120
        },
        {
          field: 'name',
          title: '设备名称',
          minWidth: 120
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 120
        },
        {
          field: 'models',
          title: '单位',
          minWidth: 120
        },
        {
          field: 'models',
          title: '生产厂家',
          minWidth: 120
        },
        {
          field: 'models',
          title: '供应商',
          minWidth: 120
        },
        {
          field: 'models',
          title: '设备类别',
          minWidth: 120
        },
        {
          field: 'maintenanceParts',
          title: '保养部位',
          minWidth: 120
        },
        {
          field: 'maintenanceStartTime',
          title: '保养开始时间',
          minWidth: 220
        },
        {
          field: 'maintenanceEndTime',
          title: '保养结束时间',
          slots: {
            default: ({ row }) => [
              <el-date-picker v-model={row.maintenanceEndTime} type="datetime" value-format="yyyy-MM-dd HH:mm:ss" />
            ]
          },
          minWidth: 220
        },
        {
          field: 'maintenanceTotalTime',
          title: '保养用时',
          slots: {
            default: ({ row }) => [
              <span>{timestamp(moment(row.maintenanceEndTime).diff(moment(row.maintenanceStartTime), 'seconds'))}</span>
            ]
          },
          minWidth: 120
        },
        {
          field: 'maintenanceCost',
          title: '保养费用',
          slots: {
            default: ({ row }) => [<InputNumberCommon v-model={row.maintenanceCost} />]
          },
          minWidth: 120
        },
        {
          field: 'maintenanceInfo',
          title: '保养信息',
          slots: {
            default: ({ row }) => [<el-input v-model={row.maintenanceInfo} />]
          },
          minWidth: 120
        }
      ],
      validRules: {
        maintenanceStartTime: [{ required: true, message: '必填' }],
        maintenanceEndTime: [{ required: true, message: '必填' }],
        maintenanceCost: [{ required: true, message: '必填' }],
        maintenanceInfo: [{ required: true, message: '必填' }]
      },
      rules: {
        status: [{ required: true, message: '必选' }],
        opinion: [{ required: true, message: '必选' }]
      }
    }
  },
  created() {
    this.getDate()
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.formData = res.data
      this.tableData = res.data.details
    },
    async handle(id, status) {
      await this.$refs.table.$refs.table.$refs.vxeTable.validate()
      await Api.updateStatus({ id, status, details: this.tableData })
      this.$message.success('操作成功')
      this.refresh()
    },
    async finish() {
      const details = _.cloneDeep(this.tableData)
      details.map(r => {
        r.maintenanceTotalTime = moment(r.maintenanceEndTime).diff(moment(r.maintenanceStartTime), 'seconds') + ''
        return r
      })
      await this.$refs.table.$refs.table.$refs.vxeTable.validate()
      await Api.updateStatus({ id: this.id, status: 2, details })
      this.$message.success('操作成功')
      this.refresh()
    },
    async check() {
      await this.$refs.form.validate()
      await Api.updateStatus({ ...this.formData, ...this.form, id: this.id })
      this.$message.success('操作成功')
      this.refresh()
    },
    getDate() {
      console.log(timestamp(10000))
      let seconds = moment('2020-07-30 12:00:00').diff(moment('2020-07-23 11:00:00'), 'days', true)
      // console.log(moment.duration(seconds).asDays())
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.form-con {
  padding-right: 15%;
}
.form-input {
  width: 100%;
  /deep/.el-input__inner {
    text-align: left;
  }
}
.inline-input {
  width: 30%;
  display: inline-block;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
</style>
