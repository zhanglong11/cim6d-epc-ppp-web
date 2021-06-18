<template>
  <div>
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-card class="box-card">
        <el-form-item label="入库单编号" required>
          <el-input v-model="formData.id" style="width: 300px" placeholder="自动生成" disabled />
        </el-form-item>
        <el-form-item label="入库类型" prop="type" required>
          <el-select v-model="formData.type" style="width: 300px" @change="handleTypeChange">
            <el-option value="1" label="领用还回"></el-option>
            <el-option value="2" label="采购入库"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" style="width: 300px" placeholder="请输入备注">
          </el-input>
        </el-form-item>
      </el-card>
    </el-form>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>入库明细</span>
        <el-button style="float: right" type="primary" @click="onAddInDetail">添加入库明细</el-button>
      </div>

      <!-- 文档:https://xuliangzhan_admin.gitee.io/vxe-table/#/table/start/install -->
      <vxe-table
        ref="xTable"
        border
        keep-source
        show-footer
        :edit-rules="validRules"
        :footer-method="footerMethod"
        :footer-span-method="footerColspanMethod"
        :data="tableData"
        :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
      >
        <!-- <vxe-table-column type="checkbox" width="60"></vxe-table-column> -->
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="code" title="材料编码" min-width="100"></vxe-table-column>
        <vxe-table-column field="name" title="材料名称" min-width="100"></vxe-table-column>
        <vxe-table-column field="models" title="规格型号" min-width="100"></vxe-table-column>
        <vxe-table-column field="unit" title="单位" min-width="100"></vxe-table-column>
        <vxe-table-column field="brand" title="品牌" min-width="100"></vxe-table-column>
        <vxe-table-column field="supplier" title="供应商" min-width="100"></vxe-table-column>
        <vxe-table-column field="inventoryNumber" title="库存量" min-width="100"></vxe-table-column>
        <vxe-table-column
          field="number"
          title="入库数量"
          :edit-render="{ name: 'input', attrs: { type: 'number' } }"
          min-width="110"
        ></vxe-table-column>
        <vxe-table-column
          field="univalence"
          title="单价"
          :edit-render="{ name: 'input', attrs: { type: 'number' } }"
          min-width="100"
        ></vxe-table-column>
        <vxe-table-column field="combinedPrice" title="合价" min-width="100">
          <template #default="{ row }">
            <span>{{ countAmount(row) }} 元</span>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" min-width="80">
          <template #default="{ row }">
            <vxe-button type="text" @click="onRemove(row._XID)">删除</vxe-button>
          </template>
        </vxe-table-column>
      </vxe-table>
    </el-card>

    <div class="footerButton">
      <el-button @click="goBack">返回</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>

    <!-- 入库明细模态框 -->
    <el-dialog title="入库明细" :visible.sync="dialogVisible" width="90%">
      <div>
        <el-form ref="form" :model="detailForm" inline>
          <el-row>
            <el-form-item>
              <el-input
                v-model="detailForm.keyword"
                style="width: 250px"
                suffix-icon="el-icon-search"
                placeholder="材料编号/材料名称/供应商/创建人"
              />
            </el-form-item>

            <el-form-item label="创建时间">
              <el-date-picker
                v-model="searchDate"
                type="datetimerange"
                value-format="yyyy-MM-dd hh:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="onDateChange"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button-group>
                <el-button type="primary" icon="el-icon-search" @click="onDetailSearch">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="onDetailReset">重置</el-button>
              </el-button-group>
            </el-form-item>
          </el-row>
        </el-form>

        <el-table
          :data="detailTableData"
          style="width: 100%; margin-top: 20px"
          @selection-change="handleDetailSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column type="index" :index="indexMethod" label="序号" width="80" />
          <el-table-column prop="code" label="材料编码" min-width="100" />
          <el-table-column prop="name" label="材料名称" min-width="100" />
          <el-table-column prop="models" label="规格型号" min-width="100" />
          <el-table-column prop="unit" label="单位" min-width="100" />
          <el-table-column prop="brand" label="品牌" min-width="100" />
          <el-table-column prop="supplier" label="供应商" min-width="100" />
          <el-table-column prop="inventoryNumber" label="库存量" min-width="100" />
          <el-table-column prop="remark" label="备注" min-width="100" />
        </el-table>
        <el-pagination
          :current-page="page.current"
          :page-sizes="[10, 20]"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next"
          :total="page.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/*
author: 许雷
date: 2020-06-30
*/
import Api from './api/index.js'

export default {
  name: 'NewInWarehouse',
  data() {
    return {
      isEdit: false, //页面是新建还是编辑
      multipleSelection: [], //明细多选
      dialogVisible: false,
      formId: '',
      tableLoading: false,
      searchLoading: false,
      detailTableData: [],
      searchDate: null,
      detailForm: {
        startDate: '',
        endDate: '',
        keyword: ''
      },
      textarea: '',
      inDate: '',
      formData: {
        id: '',
        type: '1',
        remark: '',
        money: 0, //入库金额,
        materialInputDetails: [],
        projectId: ''
      },
      page: {
        current: 1,
        size: 10, // 每页条数 必须与page-sizes一致
        total: 0
      },
      tableData: [],
      rules: {},
      validRules: {
        number: [{ required: true, message: '必填' }],
        univalence: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    let projectId = localStorage.getItem('projectId')
    this.formData.projectId = projectId
    this.detailForm.projectId = projectId
    // this.formData.companyId = this.$store.getters.companyId
    let formData = this.$route.query.formData
    this.handleTypeChange()
    //如果没值是新建,有值是编辑
    if (formData) {
      this.isEdit = true
      this.formData = formData
      this.tableData = formData.materialInputDetailResult
      delete this.formData.materialInputDetailResult
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.toggelColumnStatus()
    })
  },
  // 方法集合
  methods: {
    getTableData() {
      this.tableLoading = true
      this.searchLoading = true
      const param = Object.assign(this.detailForm, {
        page: this.page.current,
        rows: this.page.size
      })
      Api.getWarehouseDetail(param)
        .then(res => {
          this.detailTableData = res.data.records
          this.page.total = res.data.total
        })
        .finally(() => {
          this.tableLoading = false
          this.searchLoading = false
        })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getTableData()
    },
    indexMethod(index) {
      return index + 1
    },
    goBack() {
      this.$router.go(-1)
    },
    async onSave() {
      const errMap = await this.$refs.xTable.validate().catch(errMap => errMap)
      if (!errMap && this.tableData.length) {
        let arr = this.tableData.map(item => {
          return {
            materialId: item.id ? item.id : item.materialId,
            univalence: item.univalence,
            number: item.number
          }
        })
        //合计不能直接从表格中获取
        arr.forEach(item => {
          if (item.univalence && item.number) item.combinedPrice = item.univalence * item.number
        })
        this.formData.materialInputDetails = arr
        if (!this.isEdit) {
          Api.newInput(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success('新建成功')
              this.$router.go(-1)
            }
          })
        } else {
          Api.editInput(this.formData).then(res => {
            if (res.code === 200) {
              this.$message.success('更新成功')
              this.$router.go(-1)
            }
          })
        }
      } else {
        this.$message.warning('请选择入库材料')
      }
    },
    onDateChange(date) {
      this.detailForm.startDate = date[0]
      this.detailForm.endDate = date[1]
    },
    onAddInDetail() {
      this.dialogVisible = true
      this.getTableData()
    },
    onConfirm() {
      this.tableData = this.multipleSelection
      this.dialogVisible = false
    },
    onDetailSearch() {
      this.getTableData()
    },
    onDetailReset() {
      this.detailForm.keyword = ''
      this.detailForm.startDate = ''
      this.detailForm.endDate = ''
      this.searchDate = null
    },
    handleDetailSelectionChange(val) {
      this.multipleSelection = val
    },
    countAmount(row) {
      return this.XEUtils.multiply(row.number, row.univalence)
    },
    countAllAmount(data) {
      this.formData.money = this.XEUtils.sum(data.map(row => this.countAmount(row)))
      return this.formData.money
    },
    footerMethod({ columns, data }) {
      if (this.formData.type === '1' || this.tableData.length === 0) return []
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            // return '入库金额(元)'
            return `入库金额:共 ${this.countAllAmount(data)} 元`
          }
        })
      ]
    },
    footerColspanMethod({ columnIndex }) {
      if (columnIndex === 0) {
        return {
          rowspan: 1,
          colspan: 12
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    // 切换入库类型
    handleTypeChange(val) {
      this.toggelColumnStatus()
      this.tableData = []
    },
    // 根据入库类型显示或隐藏对应的列
    toggelColumnStatus() {
      let mode = this.formData.type
      if (!this.$refs.xTable) return
      if (mode === '1') {
        this.$refs.xTable.hideColumn(this.$refs.xTable.getColumnByField('univalence'))
        this.$refs.xTable.hideColumn(this.$refs.xTable.getColumnByField('combinedPrice'))
      } else {
        this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('univalence'))
        this.$refs.xTable.showColumn(this.$refs.xTable.getColumnByField('combinedPrice'))
      }
    },
    onRemove(id) {
      //table中不会自动删除数据,只会清除显示的内容,只能手动清除
      this.tableData = this.tableData.filter(item => item._XID !== id)
    }
  }
}
</script>
<style lang="less" scoped>
.vxe-table {
  /deep/.vxe-footer--column {
    text-align: left !important;
    color: #333;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
