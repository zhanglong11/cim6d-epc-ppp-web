<template>
  <div class="container no-padding is-footer">
    <el-card v-if="formData.repairStatus < 2 || formData.repairStatus === 3" class="box-card">
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
    <!--    基本信息-->
    <el-card v-if="!_.isNil(formData.handleState)" class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">基本信息</span>
      </div>
      <el-form ref="formRef" :model="formData" label-width="140px" class="form-con">
        <el-row>
          <el-col :md="12">
            <el-form-item label="设备维修单号">
              {{ formData.code }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="设备名称"> {{ formData.equipmentName }}</el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="使用位置">
              {{ formData.location }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="设备编码"> {{ formData.equipmentCode }}</el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="使用部门">
              {{ formData.useDepartMent }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="规格型号"> {{ formData.models }}</el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="设备类别">
              {{ $getLabel(level, formData.level) }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card v-if="!_.isNil(formData.handleState)" class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">故障信息</span>
      </div>
      <el-form ref="formRef" :model="formData" label-width="140px" class="form-con">
        <el-row>
          <el-col :md="12">
            <el-form-item label="故障类别"> {{ $getLabel(faultType, formData.type) }} </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="故障发生时间">
              {{ formData.faultTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="故障等级"> {{ $getLabel(level, formData.level) }}</el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="设备保修时间">
              {{ formData.reviewerTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="报修人">
              {{ formData.creatorName }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div v-if="formData.details && formData.details.length">
      <div v-for="(item, index) in formData.details" :key="index">
        <el-card v-if="item.modelType === 1" class="box-card">
          <div slot="header" class="clearfix details-header">
            <span class="details-title">处理情况</span>
          </div>
          <el-form label-width="140px" class="form-con">
            <el-row>
              <el-col :md="12">
                <el-form-item label="故障原因">
                  {{ $getLabel(faultReason, item.faultReason) }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="维修费用">{{ item.repairMoney }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="维修组">
                  {{ item.team }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="是否外委">
                  {{ $getLabel(toggle, item.isOutsource) }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="维修级别">
                  {{ $getLabel(repairLevel, formData.level) }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="外委单位">{{ item.outCompany }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="维修类别">
                  {{ $getLabel(repairType, item.type) }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="紧急程度">
                  {{ $getLabel(urgency, item.urgency) }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="是否需要停机维修">
                  {{ $getLabel(toggle, item.isClose) }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="停机时长">
                  {{ item.downTime }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="开始时间">
                  {{ item.startTime }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="结束时间">
                  {{ item.endTime }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="维修时间">
                  {{ item.useTime }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="创建人">
                  {{ item.creatorName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="创建时间">
                  {{ item.createTime }}
                </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="工作描述">
                  {{ item.describeInfo }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="附件"> </el-form-item>
              </el-col>
              <el-col :md="12">
                <el-form-item label="备注">
                  {{ item.remark }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card v-if="item.modelType === 2" class="box-card">
          <div slot="header" class="clearfix details-header">
            <span class="details-title">验收内容</span>
          </div>
          <el-form label-width="140px" class="form-con">
            <el-row>
              <el-col :md="12">
                <el-form-item label="验收人">
                  {{ item.creatorName }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="验收内容">
                  {{ item.acceptResult }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="验收结果">
                  {{ $getLabel(acceptStatus, item.acceptState) }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :md="12">
                <el-form-item label="验收时间">
                  {{ item.createTime }}
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </div>
    </div>

    <!--    执行维修-->
    <el-card v-if="formData.handleState === 0 || formData.handleState === 3" class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">处理情况</span>
      </div>
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="故障原因" prop="faultReason">
              <SelectList v-model="form.faultReason" :has-all-option="false" :self-list="faultReason" />
            </el-form-item>
            <el-form-item label="维修组" prop="teamId">
              <SelectDepart
                :id.sync="form.teamId"
                :multiple="false"
                :value="form.teamId ? { id: form.teamId, label: form.team } : null"
                :label.sync="form.team"
              />
            </el-form-item>
            <el-form-item label="维修级别" prop="level">
              <SelectList v-model="form.level" :has-all-option="false" :self-list="repairLevel" />
            </el-form-item>
            <el-form-item label="维修类别" prop="type">
              <SelectList v-model="form.type" :has-all-option="false" :self-list="repairType" />
            </el-form-item>
            <el-form-item label="紧急程度" prop="urgency">
              <SelectList v-model="form.urgency" :self-list="urgency" :has-all-option="false" />
            </el-form-item>
            <el-form-item label="是否停机" prop="isClose">
              <el-radio-group v-model="form.isClose" @input="val => (rules.downTime[0].required = val === 1)">
                <el-radio v-for="item in toggle" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="停机时长" prop="downTime">
              <InputNumberCommon v-model="form.downTime" :disabled="form.isClose !== 1" />
            </el-form-item>
            <el-form-item label="维修开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                value-format="yyyy-MM-dd HH:MM:SS"
                type="datetime"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="维修结束时间" prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                value-format="yyyy-MM-dd HH:MM:SS"
                type="datetime"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="维修用时" prop="useTime">
              <InputNumberCommon :value="moment(form.endTime).diff(moment(form.startTime), 'minutes')" disabled />
            </el-form-item>
            <el-form-item label="维修费用" prop="repairMoney">
              <InputNumberCommon v-model="form.repairMoney" />
            </el-form-item>
            <el-form-item label="是否外委" prop="isOutsource">
              <el-radio-group v-model="form.isOutsource" @input="val => (rules.outCompany[0].required = val === 1)">
                <el-radio v-for="item in toggle" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="外委单位" prop="outCompany">
              <el-input v-model="form.outCompany" :disabled="form.isOutsource !== 1" />
            </el-form-item>
            <el-form-item label="工作描述" prop="describeInfo">
              <el-input v-model="form.describeInfo" type="textarea" />
            </el-form-item>
            <el-form-item label="上传" prop="fileIds">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <!--    执行维修-->

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button
        v-if="formData.handleState === 0 || formData.handleState === 3"
        size="lg"
        type="primary"
        @click="beginRepair"
        >保存</el-button
      >
      <el-button v-if="formData.handleState === 1" size="lg" type="primary" @click="accept">验收</el-button>
    </div>
    <AcceptDialog v-if="acceptVisible" :id="id" :visible.sync="acceptVisible" />
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
import AcceptDialog from './components/AcceptDialog'
export default {
  name: 'EquipmentDetail',
  components: { AcceptDialog },
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
      acceptVisible: false,
      rules: {
        faultReason: [{ required: true, message: '必填' }],
        teamId: [{ required: true, message: '必填' }],
        level: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
        urgency: [{ required: true, message: '必填' }],
        isClose: [{ required: true, message: '必填' }],
        downTime: [{ required: true, message: '必填' }],
        startTime: [{ required: true, message: '必填' }],
        endTime: [{ required: true, message: '必填' }],
        repairMoney: [{ required: true, message: '必填' }],
        isOutsource: [{ required: true, message: '必填' }],
        outCompany: [{ required: true, message: '必填' }],
        describeInfo: [{ required: true, message: '必填' }]
      }
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
    async beginRepair() {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      form.useTime = moment(form.endTime).diff(form.startTime, 'minutes')
      await Api.beginRepair({ ...form, ...{ modelType: 1, repairId: this.id } })
      this.$message.success('操作成功')
      this.refresh()
    },
    accept() {
      this.acceptVisible = true
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
