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
              <vxe-table
                ref="xTable111"
                border
                resizable
                show-overflow
                :data="tableData"
                :edit-rules="validRules"
                :edit-config="{ trigger: 'click', mode: 'cell', autoClear: false }"
              >
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
                    {{ row.univalence && row.number && row.number * row.univalence }}</template
                  ></vxe-table-column
                >
                <vxe-table-column
                  field="arrivalNumber"
                  title="到货数量"
                  :edit-render="{
                    name: '$input',
                    props: { type: 'number' }
                  }"
                ></vxe-table-column>
                <vxe-table-column
                  field="enableInputNumber"
                  title="可入库量"
                  :edit-render="{
                    name: '$input',
                    props: { type: 'number', attrs: { min: 0 } }
                  }"
                ></vxe-table-column>
                <vxe-table-column
                  field="remark"
                  title="备注"
                  :edit-render="{
                    name: '$input',
                    props: { type: 'text' }
                  }"
                ></vxe-table-column>
              </vxe-table>
            </div>
          </div>
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
  name: 'ReceiveGoodsDialog',

  props: {
    visible: {},
    detailList: {
      type: Array
    }
  },

  data() {
    const enableValid = ({ cellValue, row }) => {
      if (cellValue > row.arrivalNumber) {
        return Promise.reject(new Error('可入库量不能大于到货数量'))
      }
    }
    // 这里存放数据
    return {
      loading: false,
      /*列表*/
      tableData: [],
      //表格验证
      validRules: {
        arrivalNumber: [{ required: true, message: '到货数量必填' }],
        enableInputNumber: [
          { required: true, message: '可入库量必填' },
          { validator: enableValid, message: '可入库量不能大于到货数量' }
        ]
      },
      checkedVal: ''
    }
  },
  watch: {
    detailList: {
      deep: true,
      handler(val) {
        this.tableData = val
      },
      immediate: true
    }
  },

  methods: {
    submit() {
      this.$refs.xTable111.validate(valid => {
        if (valid) {
          Object.values(valid).forEach(params => {
            let { rules } = params
            rules.forEach(rule => {
              this.$message.info(rule.message)
            })
          })
        } else {
          this.$emit('getTarget', { checked: this.tableData })
          this.$emit('update:visible', false)
          this.$emit('close')
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
