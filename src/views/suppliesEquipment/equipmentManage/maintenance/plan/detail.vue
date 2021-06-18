<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ formData.name }} {{ formData.code }}</span>
        <div class="details-title-sub">
          <p>
            <span class="label">执行状态：</span>
            <span class="val">{{ $getLabel(planStatus, formData.status) }}</span>
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
            <el-form-item label="下次计划保养时间">
              {{ formData.thisTime }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="时间间隔">
              {{ formData.intervalDays }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
      <VXTable :tableData="tableData" :columns="tableColumn" :pageShow="false" />
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-if="formData.status === 1" type="primary" size="lg" @click="handle(id, 2)">执行</el-button>
      <el-button v-if="formData.status === 2" type="primary" size="lg" @click="handle(id, 3)">停用</el-button>
      <el-button v-if="formData.status === 3" type="primary" size="lg" @click="handle(id, 1)">执行</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/plan'
import cycle from './lib/cycle'
import level from './lib/level'
import planStatus from './lib/planStatus'
export default {
  name: 'EquipmentDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      formData: {},
      cycle,
      level,
      planStatus,
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
        }
      ]
    }
  },
  created() {
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.formData = res.data
      this.tableData = res.data.equipments
    },
    async handle(id, status) {
      await Api.updateStatus({
        id,
        status
      })
      this.$message.success('操作成功')
      this.refresh()
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
