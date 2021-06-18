<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="form-con">
            <el-form-item label="设备名称" prop="equipmentName">
              <el-input v-model="form.equipmentName" disabled />
            </el-form-item>

            <el-form-item label="故障发生时间" prop="faultTime">
              <el-date-picker
                v-model="form.faultTime"
                value-format="yyyy-MM-dd HH:MM:SS"
                type="datetime"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="操作人员" prop="operatorId">
              <SelectUser
                :id.sync="form.operatorId"
                :value="form.operatorId ? { id: form.operatorId, label: form.operatorName } : null"
                :name.sync="form.operatorName"
                :mobile.sync="form.operatorPhone"
                :multiple="false"
                append-to-body
              />
            </el-form-item>

            <el-form-item label="操作人员电话" prop="operatorPhone">
              <InputNumberCommon v-model="form.operatorPhone" />
            </el-form-item>

            <el-form-item label="故障等级" prop="level">
              <SelectList v-model="form.level" :self-list="level" :has-all-option="false" />
            </el-form-item>

            <el-form-item label="故障类别" prop="type">
              <SelectList v-model="form.type" :self-list="faultType" :has-all-option="false" />
            </el-form-item>
            <el-form-item label="维修组" prop="repairDepartmentId">
              <SelectDepart
                :id.sync="form.repairDepartmentId"
                :multiple="false"
                :value="
                  form.repairDepartmentId ? { id: form.repairDepartmentId, label: form.repairDepartmentName } : null
                "
                :label.sync="form.repairDepartmentName"
                append-to-body
              />
            </el-form-item>
            <el-form-item label="紧急程度" prop="urgency">
              <SelectList v-model="form.urgency" :self-list="urgency" :has-all-option="false" />
            </el-form-item>
            <el-form-item label="是否停机" prop="isStop">
              <el-radio-group v-model="form.isStop">
                <el-radio v-for="item in toggle" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="故障描述" prop="description">
              <el-input v-model="form.description" type="textarea" />
            </el-form-item>
            <el-form-item label="是否外委" prop="isOutsource">
              <el-radio-group v-model="form.isOutsource">
                <el-radio v-for="item in toggle" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="附件" prop="fileIds">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <el-button type="text" @click="visible = true">选择设备</el-button>
        </el-col>
      </el-row>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(null)">保存</el-button>
      <el-button size="lg" type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
    <SelectEquipmentDialog
      v-if="visible"
      ref="selectEquipment"
      :status="1"
      :multiple="false"
      :visible.sync="visible"
      :checkRowKey="form.equipmentId"
      @change="getEquipment"
    />
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/repair'
import level from './lib/level'
import faultType from './lib/faultType'
import urgency from './lib/urgency'
import toggle from './lib/toggle'
import SelectEquipmentDialog from '../../list/components/SelectEquipmentDialog'

export default {
  name: 'Edit',
  components: { SelectEquipmentDialog },
  data() {
    return {
      id: null,
      form: {},
      level,
      faultType,
      urgency,
      toggle,
      visible: false,
      rules: {
        equipmentName: [{ required: true, message: '必填' }],
        faultTime: [{ required: true, message: '必填' }],
        operatorId: [{ required: true, message: '必填' }],
        operatorPhone: [{ required: true, message: '必填' }],
        level: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
        repairDepartmentId: [{ required: true, message: '必填' }],
        urgency: [{ required: true, message: '必填' }],
        isStop: [{ required: true, message: '必填' }],
        description: [{ required: true, message: '必填' }],
        isOutsource: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    const { id } = this.$route.params
    if (!_.isNil(id)) {
      this.id = id
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.form = res.data
      this.equipmentList = res.data.equipments.map(r => {
        r.id = r.equipmentId
        return r
      })
    },
    async submit(isSubmit) {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      let repairStatus = isSubmit ? 1 : 0
      _.isNil(this.id)
        ? await Api.add({ ...form, repairStatus })
        : await Api.update({ ...form, ...{ repairStatus, id: this.id } })
      this.$message.success('操作成功')
      this.goBack()
    },
    showEquipment() {
      this.visible = true
    },
    goBack() {
      this.$router.back()
    },
    getEquipment(row) {
      this.form = {
        ...this.form,
        ...{ equipmentName: row.name, equipmentId: row.id }
      }
    }
  }
}
</script>

<style lang="less"></style>
