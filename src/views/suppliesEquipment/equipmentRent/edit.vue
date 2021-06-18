<template>
  <div class="container no-padding is-footer">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item prop="applicantId" label="申请人">
          <selectUser
            v-model="form.applicantId"
            valueFormat="id"
            :name.sync="form.applicantName"
            :multiple="false"
          ></selectUser>
        </el-form-item>
        <el-form-item prop="applyDepartmentId" label="申请部门">
          <SelectDepart
            v-model="form.applyDepartmentId"
            valueFormat="id"
            :name.sync="form.applyDepartmentName"
            :multiple="false"
          ></SelectDepart>
        </el-form-item>
        <el-form-item prop="applyReason" label="申请原因">
          <el-input v-model="form.applyReason"></el-input>
        </el-form-item>
        <el-form-item prop="userId" label="设备使用人">
          <SelectUser v-model="form.userId" valueFormat="id" :name.sync="form.userName" :multiple="false"></SelectUser>
        </el-form-item>
        <el-form-item prop="useCompany" label="设备使用部门">
          <SelectDepart
            v-model="form.useCompany"
            valueFormat="id"
            :name.sync="form.useCompanyName"
            :multiple="false"
          ></SelectDepart>
        </el-form-item>
        <el-form-item prop="usePart" label="设备使用位置">
          <el-input v-model="form.usePart"></el-input>
        </el-form-item>
        <el-form-item prop="leaseCompany" label="租赁单位">
          <el-input v-model="form.leaseCompany"></el-input>
        </el-form-item>
        <el-form-item prop="leaseUserName" label="租赁人">
          <el-input v-model="form.leaseUserName"></el-input>
        </el-form-item>
        <el-form-item prop="leaseUserPhone" label="租赁人联系方式">
          <el-input v-model="form.leaseUserPhone"></el-input>
        </el-form-item>
        <el-form-item prop="leaseTime" label="租赁时间">
          <el-date-picker
            v-model="form.leaseTime"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="leasePeriod" label="租赁总期限">
          <div>{{ form.leasePeriod }}</div>
        </el-form-item>
        <el-form-item prop="totalDeposit" label="租赁总押金">
          <div title="根据租赁明细自动计算">{{ form.totalDeposit || 0 }} 元</div>
        </el-form-item>
        <el-form-item prop="totalRent" label="租赁总租金">
          <div title="根据租赁明细自动计算">{{ form.totalRent || 0 }} 元</div>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <header slot="header">
        <h2>租赁明细</h2>
        <div>
          <el-button type="primary" @click="selectEquipmentDialogVisible = true">选择设备</el-button>
          <el-button type="primary" @click="equipmentAddDialogVisible = true">添加新设备</el-button>
        </div>
      </header>

      <vxe-table
        ref="table"
        :data="form.details"
        :edit-rules="validRules"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
      >
        <vxe-table-column title="序号" type="seq" width="60px"></vxe-table-column>
        <vxe-table-column title="设备名称" field="name"> </vxe-table-column>
        <vxe-table-column title="规格型号" field="models"> </vxe-table-column>
        <vxe-table-column
          title="设备类型"
          field="type"
          :formatter="({ cellValue }) => $getLabel(equipmentType, cellValue)"
        ></vxe-table-column>
        <vxe-table-column title="单位" field="unit"></vxe-table-column>
        <vxe-table-column title="生产厂家" field="manufacturer"></vxe-table-column>
        <vxe-table-column title="供应商" field="supplier"></vxe-table-column>
        <vxe-table-column
          title="租赁数量"
          field="number"
          :edit-render="{ name: '$input', props: { type: 'number' }, attrs: { min: 0 } }"
        >
        </vxe-table-column>
        <vxe-table-column
          title="租赁押金"
          field="rentDeposit"
          :edit-render="{ name: '$input', props: { type: 'number' }, attrs: { min: 0 } }"
        >
        </vxe-table-column>
        <vxe-table-column
          title="租赁期限(天)"
          field="rentTime"
          :edit-render="{ name: '$input', props: { type: 'number' }, attrs: { min: 0 } }"
        >
        </vxe-table-column>
        <vxe-table-column
          title="租赁租金"
          field="rentReprises"
          :edit-render="{ name: '$input', props: { type: 'number' }, attrs: { min: 0 } }"
        >
        </vxe-table-column>
        <vxe-table-column
          title="备注"
          field="remark"
          :edit-render="{ name: '$input', props: { type: 'text' } }"
        ></vxe-table-column>
        <vxe-table-column title="操作">
          <template #default="{ row, rowIndex }">
            <el-button type="text" @click="form.details.splice(rowIndex, 1)">删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>
      <footer class="detail-footer">
        <div>
          <span>租赁总押金(元): </span><span class="number">{{ form.totalDeposit || 0 }}</span>
        </div>
        <div>
          <span>租赁总租金(元): </span><span class="number">{{ form.totalRent || 0 }}</span>
        </div>
      </footer>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="$router.back()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(0)">保存</el-button>
      <el-button size="lg" type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
    <SelectEquipmentDialog
      ref="selectEquipment"
      :visible.sync="selectEquipmentDialogVisible"
      @change="handleEquipmentAdd"
    ></SelectEquipmentDialog>
    <el-dialog title="添加设备" width="900px" :visible.sync="equipmentAddDialogVisible" top="30px">
      <EquipmentAdd
        ref="equipmentAdd"
        in-dialog
        @success="equipment => handleEquipmentAdd([equipment])"
        @close="equipmentAddDialogVisible = false"
      ></EquipmentAdd>
      <footer slot="footer">
        <el-button @click="equipmentAddDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="() => $refs.equipmentAdd.submit()">创建</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import SelectEquipmentDialog from '../equipmentManage/list/components/SelectEquipmentDialog'
import sourceList from '../equipmentManage/list/lib/sourceList'
import equipmentStatus from '../equipmentManage/list/lib/equipmentStatus'
import equipmentType from '../equipmentManage/list/lib/equipmentType'
import EquipmentAdd from '../equipmentManage/list/edit'
export default {
  name: 'Edit',
  components: { SelectEquipmentDialog, EquipmentAdd },
  data() {
    return {
      id: '',
      form: {
        leaseTime: [],
        details: [],
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        applicantId: [{ required: true, message: '必填' }],
        applyDepartmentId: [{ required: true, message: '必填' }],
        applyReason: [{ required: true, message: '必填' }],
        userId: [{ required: true, message: '必填' }],
        useCompany: [{ required: true, message: '必填' }],
        usePart: [{ required: true, message: '必填' }],
        leaseCompany: [{ required: true, message: '必填' }],
        leaseUserName: [{ required: true, message: '必填' }],
        leaseUserPhone: [{ required: true, message: '必填' }],
        leaseTime: [{ required: true, message: '必填' }],
        leasePeriod: [{ required: true, message: '必填' }],
        totalDeposit: [{ required: true, message: '必填' }],
        totalRent: [{ required: true, message: '必填' }]
      },
      validRules: {
        number: [{ required: true, message: '必填' }],
        rentDeposit: [{ required: true, message: '必填' }],
        rentReprises: [{ required: true, message: '必填' }]
      },
      sourceList,
      equipmentStatus,
      equipmentType,
      selectEquipmentDialogVisible: false,
      equipmentAddDialogVisible: false
    }
  },
  watch: {
    'form.leaseTime'(val) {
      if (val[0]) {
        const totalHours = moment(val[1]).diff(val[0], 'hours')
        const totalDays = _.floor(totalHours / 24)
        const remainHours = totalHours % 24
        let result = `${totalDays}天`
        if (remainHours) {
          result += `${remainHours}小时`
        }
        this.form.leasePeriod = result
      }
    },
    'form.details': {
      deep: true,
      handler(val) {
        this.$set(
          this.form,
          'totalDeposit',
          _.sumBy(val, e => +e.rentDeposit)
        )
        this.$set(
          this.form,
          'totalRent',
          _.sumBy(val, e => +e.rentReprises)
        )
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
      this.axios.material.get('equipmentLease/get/' + this.id).then(res => {
        this.form = res.data
        this.form.leaseTime = [res.data.leaseStartTime, res.data.leaseEndTime]
      })
    },
    async submit(status = 0) {
      await this.$refs.form.validate()
      await this.$refs.table.validate()
      let form = _.cloneDeep(this.form)
      form.leaseStartTime = form.leaseTime[0]
      form.leaseEndTime = form.leaseTime[1]
      delete form.leaseTime
      form.status = status
      if (this.id) {
        await this.axios.material.post('equipmentLease/submit', form).then(res => {
          this.$message.success('成功')
        })
      } else {
        await this.axios.material.post('equipmentLease/add', form).then(res => {
          this.$message.success('添加成功')
        })
      }
      this.$router.back()
    },
    handleEquipmentAdd(list) {
      list = list.map(e => ({
        ..._.omit(e, ['id']),
        number: 1,
        rentDeposit: 0,
        rentReprises: 0
      }))
      this.form.details.push(...list)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin: 0 auto;
  .el-card__header header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-form {
    max-width: 1000px;
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
    }
  }
}
.detail-footer {
  margin-top: 10px;
  display: flex;
  align-items: center;
  line-height: 30px;
  > div {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
    & + div {
      margin-left: 20px;
    }
    .number {
      font-size: 22px;
      color: #409eff;
      margin-left: 10px;
    }
  }
}
</style>
