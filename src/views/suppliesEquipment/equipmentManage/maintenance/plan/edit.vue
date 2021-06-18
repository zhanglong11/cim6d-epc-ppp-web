<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <el-row :gutter="15">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="form-con">
            <el-form-item label="设备保养计划名称" prop="name">
              <el-input v-model="form.name" />
            </el-form-item>

            <el-form-item label="保养部门" prop="maintenanceDepartmentId">
              <SelectDepart
                :id.sync="form.maintenanceDepartmentId"
                :multiple="false"
                :value="
                  form.maintenanceDepartmentId
                    ? { id: form.maintenanceDepartmentId, label: form.maintenanceDepartmentName }
                    : null
                "
                :label.sync="form.maintenanceDepartmentName"
                append-to-body
              />
            </el-form-item>

            <el-form-item label="上次保养时间" prop="lastTime">
              <el-date-picker v-model="form.lastTime" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%" />
            </el-form-item>

            <el-form-item label="计划保养时间" prop="thisTime">
              <el-date-picker v-model="form.thisTime" value-format="yyyy-MM-dd HH:MM:SS" style="width: 100%" />
            </el-form-item>

            <el-form-item label="时间间隔（天）" prop="intervalDays">
              <InputNumberCommon
                :value="moment(form.thisTime).diff(moment(form.lastTime), 'days')"
                class="form-input"
                disabled
              />
            </el-form-item>

            <el-form-item label="循环方式" prop="circulationMode">
              <el-radio-group v-model="form.circulationMode">
                <el-radio v-for="item in cycle" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="保养级别" prop="level">
              <SelectList v-model="form.level" :self-list="level" :has-all-option="false" />
            </el-form-item>

            <el-form-item label="保养负责人" prop="principalId">
              <SelectUser
                :id.sync="form.principalId"
                :value="form.principalId ? { id: form.principalId, label: form.principalName } : null"
                :name.sync="form.principalName"
                :multiple="false"
                append-to-body
              />
            </el-form-item>

            <el-form-item label="计划描述" prop="description">
              <el-input v-model="form.description" type="textarea" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>保养明细</span>
        <el-button type="primary" @click="showEquipment">选择设备</el-button>
      </div>
      <EditTable
        ref="table"
        v-model="equipmentList"
        :tableColumn="tableColumn"
        :validRules="validRules"
        :is-add="false"
        :is-remove="false"
        :show-footer="true"
        :border="true"
      />
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(null)">保存</el-button>
    </div>
    <SelectEquipmentDialog
      v-if="visible"
      ref="selectEquipment"
      :status="1"
      :visible.sync="visible"
      :checkRowKeys="equipmentList.map(r => r.id)"
      @change="getList"
    />
  </div>
</template>

<script>
import Api from '@/api/supplies/maintenance/plan'
import cycle from './lib/cycle'
import level from './lib/level'
import SelectEquipmentDialog from '../../list/components/SelectEquipmentDialog'
import equipmentType from '@/views/suppliesEquipment/equipmentManage/list/lib/equipmentType'
export default {
  name: 'Edit',
  components: { SelectEquipmentDialog },
  data() {
    return {
      id: null,
      form: {},
      cycle,
      level,
      visible: false,
      equipmentType,
      rules: {
        name: [{ required: true, message: '必填' }],
        maintenanceDepartmentId: [{ required: true, message: '必填' }],
        thisTime: [{ required: true, message: '必填' }],
        circulationMode: [{ required: true, message: '必填' }],
        level: [{ required: true, message: '必填' }],
        principalId: [{ required: true, message: '必填' }]
      },
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
          slots: {
            default: ({ row }) => [<el-input v-model={row.maintenanceParts} />]
          },
          minWidth: 120
        },
        {
          field: 'models',
          title: '操作',
          minWidth: 120,
          slots: {
            default: ({ row }) => [
              <el-button type="text" onClick={() => this.delDetail(row.id)}>
                删除
              </el-button>
            ]
          }
        }
      ],
      validRules: {
        maintenanceParts: [{ required: true, message: '保养部位必须填写' }]
      },
      equipmentList: []
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
    async submit() {
      await this.$refs.form.validate()
      await this.$refs.table.$refs.table.$refs.vxeTable.validate()
      let form = _.cloneDeep(this.form)
      form.intervalDays = moment(form.thisTime).diff(form.lastTime, 'days')
      let equipmentListClone = _.cloneDeep(this.equipmentList)
      let flag = true
      let equipments = equipmentListClone.map(r => {
        if (!r.maintenanceParts) {
          flag = false
        }
        return { equipmentId: r.id, maintenanceParts: r.maintenanceParts }
      })
      if (!flag) {
        return this.$message.error('保养部位不能为空')
      }

      _.isNil(this.id)
        ? await Api.add({ ...form, equipments })
        : await Api.update({ ...form, ...{ id: this.id, equipments } })
      this.$message.success('操作成功')
      this.goBack()
    },
    showEquipment() {
      this.visible = true
    },
    delDetail(id) {
      this.equipmentList = [...this.equipmentList].filter(p => p.id !== id)
    },
    goBack() {
      this.$router.back()
    },
    getList(list) {
      const curCheckIds = list.map(r => r.id)
      const checkRowKeys = this.equipmentList.map(r => r.id)
      this.equipmentList = [
        ...this.equipmentList.filter(r => curCheckIds.includes(r.id)),
        ...list.filter(r => !checkRowKeys.includes(r.id))
      ]
    }
  }
}
</script>

<style lang="less"></style>
