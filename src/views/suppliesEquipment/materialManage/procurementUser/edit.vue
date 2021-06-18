<template>
  <div class="container no-padding is-footer">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="140px" class="form-con">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="使用申请单名称" prop="applyName">
              <el-input v-model="form.applyName" type="textarea" placeholder="请填写申请单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="关联进度">
              <el-input :value="form.schduleName" disabled>
                <el-button slot="append" icon="el-icon-plus" @click="showTargetDialog">选择</el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row :gutter="20">-->
        <!--          <el-col :md="8">-->
        <!--            <el-form-item label="申请人" prop="applicantName">-->
        <!--              <SelectUser-->
        <!--                :id.sync="form.applicantId"-->
        <!--                :value="form.applicantId ? { id: form.applicantId, label: form.applicantName } : null"-->
        <!--                :name.sync="form.applicantName"-->
        <!--                :departId.sync="form.applyDepartmentId"-->
        <!--                :departName.sync="form.applyDepartmentName"-->
        <!--                :multiple="false"-->
        <!--                :clearable="false"-->
        <!--              />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="申请部门" prop="applyDepartmentId">
              <el-input v-model="form.applyDepartmentId" class="none"></el-input>
              <SelectDepart
                :id.sync="form.applyDepartmentId"
                :multiple="false"
                :value="form.applyDepartmentId ? { id: form.applyDepartmentId, label: form.applyDepartmentName } : null"
                :label.sync="form.applyDepartmentName"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="申请原因">
              <el-input v-model="form.applyReason" type="textarea" placeholder="请填写原因" @change="changeReason" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="指定审核人" prop="firstAuditPersonId">
              <SelectUser
                :id.sync="form.firstAuditPersonId"
                :appendToBody="true"
                :multiple="false"
                :value="
                  form.firstAuditPersonId
                    ? {
                        id: form.firstAuditPersonId,
                        label: form.firstAuditPersonName
                      }
                    : null
                "
                :name.sync="form.firstAuditPersonName"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="8">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="detailList">
          <div>采购明细</div>
          <div>
            <el-button type="primary" @click="selectMaterialBtn">选择材料</el-button>
          </div>
        </div>
        <div>
          <vxe-table
            ref="xTable"
            border
            resizable
            show-overflow
            :data="tableData"
            :edit-rules="validRules"
            :edit-config="{ trigger: 'click', mode: 'cell', autoClear: true }"
            @edit-closed="handleEditClosed"
          >
            <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
            <vxe-table-column field="code" title="材料编码"></vxe-table-column>
            <vxe-table-column field="name" title="材料名称"></vxe-table-column>
            <vxe-table-column field="models" title="规格型号"></vxe-table-column>
            <vxe-table-column field="unit" title="单位"></vxe-table-column>
            <vxe-table-column field="brand" title="品牌"></vxe-table-column>
            <vxe-table-column field="supplier" title="供应商"></vxe-table-column>
            <vxe-table-column field="inventoryNumber" title="库存量">
              <template #default="{ row }">
                {{ row.inventoryNumber || 0 }}
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="number"
              title="使用申请数量"
              :edit-render="{
                name: '$input'
              }"
            ></vxe-table-column>
            <vxe-table-column field="set" title="操作">
              <template slot-scope="{ row }">
                <span style="margin: 0 3px"><a @click="handleDeleteRow(row)">删除</a></span></template
              >
            </vxe-table-column>
          </vxe-table>
        </div>
        <el-row v-if="purchasePersonVisible" :gutter="20" style="margin-top: 15px">
          <el-col :md="8">
            <el-form-item label="通知采购人" prop="purchasePersonId">
              <SelectUser
                :id.sync="form.purchasePersonId"
                :appendToBody="true"
                :multiple="false"
                :value="
                  form.purchasePersonId
                    ? {
                        id: form.purchasePersonId,
                        label: form.purchasePersonName
                      }
                    : null
                "
                :name.sync="form.purchasePersonName"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <!--关联材料 start-->
    <ProcurentDialog
      v-if="procurentVisible"
      :visible="procurentVisible"
      @close="procurentVisible = false"
      @getTarget="getTarget"
    >
    </ProcurentDialog>
    <!--关联材料 end-->
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(0)">保存</el-button>
      <el-button size="lg" type="primary" @click="submit(1)">保存并提交</el-button>
    </div>
    <!--选择工序-->
    <SelectSchdule :visible.sync="targetVisible" @getTarget="getTargetProcess" />
  </div>
</template>

<script>
import Api from '@/api/supplies/material/procurement'
import ProcurentDialog from './lib/ProcurentDialog'
import SelectSchdule from './components/SelectSchdule'
import XEUtils from 'xe-utils'
import type from './lib/type'
import toFixed2 from '@/utils/toFixed2'

export default {
  name: 'ProcurementUserEdit',
  components: {
    ProcurentDialog,
    SelectSchdule
  },
  data() {
    return {
      id: '',
      procurentVisible: false,
      targetVisible: false,
      purchasePersonVisible: false,
      form: {
        // type: 1,
        schduleName: '',
        schduleId: ''
      },
      tableData: [],
      type,
      materialType: 1,
      rules: {
        applyName: [{ required: true, message: '申请单位必填', trigger: 'blur' }],
        // schduleName: [{ required: true, message: '关联进度/工序必选', trigger: 'blur' }],
        applicantName: [{ required: true, message: '申请人必填', trigger: 'blur' }],
        applyDepartmentId: [{ required: true, message: '申请部门必填', trigger: 'blur' }],
        firstAuditPersonId: [{ required: true, message: '审批人必选', trigger: 'blur' }],
        purchasePersonId: [{ required: true, message: '通知采购人必选', trigger: 'blur' }]
      },
      validRules: {
        number: [
          { required: true, message: '必填' }
          // { pattern: /[^0-9]/g, message: '必须为数字值' }
        ],
        univalence: [
          { required: true, message: '必填' }
          // { pattern: /[^0-9]/g, message: '必须为数字值' }
        ]
      },
      countTotalMoney: 0
    }
  },

  watch: {
    tableData: {
      deep: true,
      handler(val) {
        console.log(val)
        val.map(item => {
          if (item.number > item.inventoryNumber) {
            return (this.purchasePersonVisible = true)
          } else {
            return (this.purchasePersonVisible = false)
          }
        })
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
      const res = await Api.getMaterialApplyDetail(this.id)
      this.form = res.data || {}
      this.tableData = res.data.details.map(item => {
        return {
          brand: item.materialEntity.brand,
          code: item.materialEntity.code,
          models: item.materialEntity.models,
          name: item.materialEntity.name,
          remark: item.materialEntity.remark,
          supplier: item.materialEntity.supplier,
          unit: item.materialEntity.unit,
          materialId: item.materialEntity.id,
          number: item.number,
          inventoryNumber: item.materialEntity.inventoryNumber || 0
        }
      })
    },
    //编辑结束触发
    handleEditClosed(data) {
      this.countTotalMoney = this.countAllAmount(data.data)
    },
    //选择工序弹窗
    showTargetDialog() {
      this.targetVisible = true
    },
    //计算总额
    combinedPrice(row) {
      return this.toFixed2(XEUtils.multiply(row.univalence, row.number))
    },
    countAllAmount(data) {
      return XEUtils.sum(data.map(row => this.combinedPrice(row)))
    },
    async submit(type) {
      await this.$refs.formRef.validate()
      await this.$refs.xTable.validate().then(() => {
        let data = _.cloneDeep(this.form)
        data.details = this.tableData.map(item => {
          return {
            materialId: item.id || item.materialId,
            number: item.number
          }
        })
        this.id
          ? Api.getMaterialApplyConstructionUpdate({ ...data, status: type }).then(res => {
              if (type === 0) {
                this.$message.success('已保存草稿')
              } else {
                this.$message.success('保存成功')
              }

              setTimeout(() => {
                this.goBack()
              }, 1000)
            })
          : Api.getMaterialApplyConstructionAdd({ ...data, status: type }).then(res => {
              if (type === 0) {
                this.$message.success('已保存草稿')
              } else {
                this.$message.success('保存成功')
              }

              setTimeout(() => {
                this.goBack()
              }, 1000)
            })
      })
    },
    //切换类型
    changeType(v) {
      this.materialType = v
      if (v === this.form.type) {
        this.tableData = []
      }
    },
    //添加新材料
    AddMaterial(e) {
      this.tableData = [...this.tableData, ...e.checked]
    },
    goBack() {
      // this.$router.back()
      this.$router.push({ name: `ProcurementUser` })
    },
    //选择材料弹窗
    selectMaterialBtn(type) {
      this.procurentVisible = true
      // this.dialogType = type
    },
    changeReason(v) {
      this.form = {
        ...this.form,
        applyReason: _.trim(v)
      }
    },
    //选择材料获取的数据
    getTarget(e) {
      let targetList = (e.checked || []).map(item => {
        return {
          ...item,
          number: null,
          univalence: null
        }
      })

      this.tableData = [...this.tableData, ...targetList]
    },
    //选择工序回传
    getTargetProcess(e) {
      // console.log(111111, e)
      this.form.schduleName = e.label
      this.form.schduleId = e.id
    },
    //删除
    handleDeleteRow(row) {
      this.tableData = this.tableData.filter(item => item._XID !== row._XID)
    }
  }
}
</script>

<style lang="less">
.detailList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
