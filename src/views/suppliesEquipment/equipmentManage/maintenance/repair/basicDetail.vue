<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ formData.equipmentName }} {{ formData.equipmentCode }}</span>
        <div class="details-title-sub">
          <p>
            <span class="label">执行状态：</span>
            <span class="val">{{ $getLabel(repairStatus, formData.repairStatus) }}</span>
            <el-button v-if="formData.repairStatus === 0" type="primary" @click="toEdit">编辑</el-button>
          </p>
        </div>
      </div>
      <el-form ref="formRef" :model="formData" label-width="140px" class="form-con">
        <el-row>
          <el-col :md="12">
            <el-form-item label="设备维修编码">
              {{ formData.code }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="操作人员">
              {{ formData.operatorName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="规格型号">
              {{ formData.models }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="操作人员电话">
              {{ formData.operatorPhone }}
              <!--              {{ $getLabel(level, formData.level) }}-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="故障发生时间">
              {{ formData.faultTime }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="维修组">
              {{ formData.repairDepartmentName }}
              <!--              {{ $getLabel(level, formData.level) }}-->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="故障等级">
              {{ $getLabel(level, formData.level) }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="紧急程度">
              {{ $getLabel(urgency, formData.urgency) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="故障类别">
              {{ $getLabel(repairType, formData.type) }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="是否停机">
              {{ $getLabel(toggle, formData.isStop) }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="故障描述">
              {{ formData.description }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="创建人">
              {{ formData.creatorName }}
            </el-form-item>
          </el-col> </el-row
        ><el-row>
          <el-col :md="12">
            <el-form-item label="是否外委">
              {{ $getLabel(toggle, formData.isOutsource) }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="备注">
              {{ formData.remark }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button
        v-if="formData.handleState === 0 || formData.handleState === 3"
        size="lg"
        type="primary"
        @click="toRepair"
        >维修</el-button
      >
    </div>
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/repair'
import repairStatus from './lib/repairStatus'
import level from './lib/level'
import repairLevel from './lib/repairLevel'
import urgency from './lib/urgency'
import toggle from './lib/toggle'
import faultReason from './lib/faultReason'
import repairType from './lib/repairType'
import faultType from './lib/faultType'
import acceptStatus from './lib/acceptStatus'
export default {
  name: 'EquipmentDetail',
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      formData: {},
      form: {},
      repairStatus,
      level,
      urgency,
      repairType,
      faultType,
      toggle,
      faultReason,
      repairLevel,
      acceptStatus,
      acceptVisible: false
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
    },
    toEdit() {
      this.$router.push({ name: `EquipmentRepairEdit`, params: { id: this.id } })
    },
    toRepair() {
      this.$router.replace({ name: `EquipmentRepairDetail`, params: { id: this.id } })
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
