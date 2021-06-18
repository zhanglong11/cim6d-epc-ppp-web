<template>
  <div class="is-Footer white">
    <section class="edit-section">
      <el-form ref="form" :model="form" :rules="rules" class="form" label-width="160px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="申请人" prop="applicantId">
              <SelectUser
                :id.sync="form.applicantId"
                :multiple="false"
                :clearable="false"
                :value="form.applicantId ? { id: form.applicantId, label: form.applicantName } : null"
                :name.sync="form.applicantName"
                :departId.sync="form.applyDepartmentId"
                :departName.sync="form.applyDepartmentName"
                class="inputStyle"
              >
              </SelectUser>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="使用位置" prop="usePart">
              <el-input v-model="form.usePart" class="inputStyle" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="申请部门" prop="applyDepartmentId">
              <SelectDepart
                :id.sync="form.applyDepartmentId"
                disabled
                :multiple="false"
                :value="form.applyDepartmentId ? { id: form.applyDepartmentId, label: form.applyDepartmentName } : null"
                :label.sync="form.applyDepartmentName"
                class="inputStyle"
              ></SelectDepart>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="设备使用人" prop="userId">
              <SelectUser
                :id.sync="form.userId"
                :multiple="false"
                :value="form.userId ? { id: form.userId, label: form.userName } : null"
                :name.sync="form.userName"
                :departId.sync="form.useCompany"
                class="inputStyle"
                :clearable="false"
                @change="handleUserSelected"
              >
              </SelectUser>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="申请到货日期" prop="appyArrivalTime">
              <el-date-picker
                v-model="form.appyArrivalTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="inputStyle"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="设备使用部门" prop="useCompany">
              <SelectDepart
                :id.sync="form.useCompany"
                :multiple="false"
                :value="form.useCompany ? { id: form.useCompany, label: form.useCompanyName } : null"
                :label.sync="form.useCompanyName"
                class="inputStyle"
                disabled
              ></SelectDepart>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请原因" prop="applyReason">
          <el-input v-model="form.applyReason" type="textarea" placeholder="请输入申请原因" class="textareaStyle" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" class="textareaStyle" />
        </el-form-item>
      </el-form>
      <el-card class="box-card" style="margin-top: 50px">
        <div slot="header" class="clearfix">
          <span>采购明细</span>
          <el-button style="float: right; padding: 5px 10px" type="primary" @click="visibleSelectEquipment = true">
            选择设备
          </el-button>
        </div>
        <div>
          <vxe-table
            ref="xTable"
            border
            resizable
            show-overflow
            :data="tableData"
            :edit-config="{ trigger: 'click', mode: 'cell', autoClear: true }"
          >
            <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
            <vxe-table-column field="name" title="设备名称"></vxe-table-column>
            <vxe-table-column field="models" title="规格型号"></vxe-table-column>
            <vxe-table-column field="unit" title="单位"></vxe-table-column>
            <vxe-table-column
              field="type"
              title="设备类别"
              :formatter="({ cellValue }) => $getLabel(equipmentTypeList, cellValue)"
            ></vxe-table-column>
            <vxe-table-column field="manufacturer" title="生产厂家"></vxe-table-column>
            <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
            <vxe-table-column
              field="number"
              title="申请采购数量"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            ></vxe-table-column>
            <vxe-table-column
              field="univalence"
              title="单价"
              :edit-render="{
                name: '$input',
                props: { type: 'number' }
              }"
            ></vxe-table-column>
            <vxe-table-column field="total" title="合价">
              <template slot-scope="{ row }">
                {{ row.univalence && row.number && row.number * row.univalence }}</template
              ></vxe-table-column
            >
            <vxe-table-column field="unit" title="操作">
              <template slot-scope="{ row }">
                <span style="margin: 0 3px"><a @click="handleDeleteRow(row)">删除</a></span></template
              >
            </vxe-table-column>
          </vxe-table>
        </div>
      </el-card>
      <p style="margin-top: 10px">采购金额（元)：{{ totalMoney }}</p>
    </section>
    <div class="footer-btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit(false)">保存</el-button>
      <el-button type="primary" @click="submit(true)">保存并提交</el-button>
    </div>
    <SelectEquipmentModel
      v-if="visibleSelectEquipment"
      :visible.sync="visibleSelectEquipment"
      @submit="handleSelectEquipment"
    ></SelectEquipmentModel>
  </div>
</template>

<script>
import Api from './api/index'
import equipmentTypeList from '../lib/equipmentTypeList'
import SelectEquipmentModel from './components/SelectEquipmentModel'
export default {
  name: 'EquipmentPurchaseEdit',
  components: { SelectEquipmentModel },
  data() {
    return {
      equipmentTypeList,
      visibleSelectEquipment: false,
      totalMoney: null,
      form: {},
      rules: {
        applicantId: [{ required: true, message: '申请人必选', trigger: 'change' }],
        usePart: [{ required: true, message: '使用位置必填', trigger: 'blur' }],
        applyDepartmentId: [{ required: true, message: '申请部门必选', trigger: 'change' }],
        userId: [{ required: true, message: '设备使用人必选', trigger: 'change' }],
        appyArrivalTime: [{ required: true, message: '申请到货时间必填', trigger: 'change' }],
        useCompany: [{ required: true, message: '设备使用部门必选', trigger: 'change' }],
        applyReason: [{ required: true, message: '申请原因必填', trigger: 'blur' }]
      },
      tableData: []
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler(val) {
        let a = 0
        val.map(item => (a += item.number && item.univalence && item.number * item.univalence))
        this.totalMoney = a
      }
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getDetail()
    }
  },
  methods: {
    handleUserSelected(node) {
      console.log('设备负责人', node)
      console.log('使用人部门', node.organId, node.organName)
      console.log('部门', this.$store.state.departmentList)
      console.log(_.find(this.$store.state.departmentList, { id: node.organId }))
    },
    async getDetail() {
      let res = await Api.getEquipmentPurchaseById(this.$route.params.id)
      this.form = { ...res.data }
      this.tableData = [...res.data.purchaseDetails]
    },
    handleDeleteRow(row) {
      this.tableData = this.tableData.filter(item => item._XID !== row._XID)
    },
    handleSelectEquipment(data) {
      let arr = data.map(item => {
        return {
          ...item,
          number: 0,
          univalence: 0
        }
      })
      this.tableData = arr
    },
    async submit(isSubmit = false) {
      let purchaseDetails = this.tableData.map(item => {
        return {
          combinedPrice: item.number && item.univalence && item.number * item.univalence,
          manufacturer: item.manufacturer,
          models: item.manufacturer,
          name: item.manufacturer,
          number: item.number,
          supplier: item.supplier,
          type: item.type,
          unit: item.unit,
          univalence: item.univalence
        }
      })
      await this.$refs.form.validate()
      let res = this.$route.params.id
        ? await Api.updateEquipmentPurchase({
            ...this.form,
            status: isSubmit ? 1 : 0,
            purchaseDetails: purchaseDetails
          })
        : await Api.addEquipmentPurchase({
            ...this.form,
            status: isSubmit ? 1 : 0,
            purchaseDetails: purchaseDetails
          })
      this.$message.success('保存成功')
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>
