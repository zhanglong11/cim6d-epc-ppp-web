<template>
  <el-dialog
    title=""
    :visible="visible"
    width="85%"
    top="10vh"
    style="margin-left: 150px"
    :modal-append-to-body="false"
    @close="$emit('close')"
  >
    <div class="container">
      <el-row :gutter="20">
        <el-col :md="24">
          <div class="task-list">
            <div>
              <vxe-table ref="xTable111" border resizable show-overflow :data="tableData">
                <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
                <vxe-table-column field="materialCode" title="材料编码"></vxe-table-column>
                <vxe-table-column field="materialName" title="材料名称"></vxe-table-column>
                <vxe-table-column field="materialModels" width="80" title="规格型号"></vxe-table-column>
                <vxe-table-column field="materialUnit" width="60" title="单位"></vxe-table-column>
                <vxe-table-column field="materialBrand" title="品牌"></vxe-table-column>
                <vxe-table-column field="materialSupplier" title="供应商"></vxe-table-column>
                <vxe-table-column field="materialInventoryNumber" width="80" title="库存量"></vxe-table-column>
                <vxe-table-column field="number" title="申请采购数量"></vxe-table-column>
                <vxe-table-column field="univalence" width="80" title="单价"></vxe-table-column>
                <vxe-table-column field="combinedPrice" width="80" title="合价">
                  <template slot-scope="{ row }">
                    {{ row.univalence && row.number && row.number * row.univalence }}
                  </template>
                </vxe-table-column>
              </vxe-table>
            </div>
          </div>
        </el-col>
        <el-col :md="24">
          <el-form ref="formPerson" :model="form" label-width="120px" :rules="rules">
            <el-form-item label="指定到货确定人" prop="nextPerson">
              <SelectUser
                :id.sync="form.nextPersonId"
                prop="nextPerson"
                :value="form.nextPersonId ? { id: form.nextPersonId, label: form.nextPerson } : null"
                :name.sync="form.nextPerson"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <footer slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>
<script>
export default {
  name: 'PurchaseDialog',
  props: {
    visible: {},
    detailList: {
      type: Array
    }
  },

  data() {
    // 这里存放数据
    return {
      loading: false,
      /*列表*/
      tableData: [],
      form: {
        projectId: localStorage.getItem('projectId')
      },
      checkedVal: '',
      rules: {
        nextPerson: [{ required: true, message: '指定到货确定人必填' }]
      }
    }
  },
  watch: {
    detailList: {
      deep: true,
      handler(val) {
        console.log('val', val)
        this.tableData = val
      },
      immediate: true
    }
  },

  methods: {
    submit() {
      this.$refs.formPerson.validate(valid => {
        if (valid) {
          this.$emit('getTarget', { checked: this.form })
          this.$emit('update:visible', false)
          this.$emit('close')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  .treeView {
    margin-bottom: 15px;
  }
  .buttons {
    margin: 10px 0;
  }
}
</style>
