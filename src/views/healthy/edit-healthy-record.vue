<template>
  <div class="container is-footer">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <vxe-table
      ref="xTable"
      v-loading="loading"
      border
      :data="dataList"
      auto-resize
      :edit-config="{ trigger: 'manual', mode: 'row' }"
    >
      <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
      <vxe-table-column field="employeeName" title="被检测人" />
      <vxe-table-column field="monitorTime" title="监测时间" :edit-render="{ type: 'default' }">
        <template #edit="{ row }">
          <el-date-picker
            v-model="row.monitorTime"
            type="datetime"
            placeholder="选择监测时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="bodyTemperature"
        title="体温℃"
        :edit-render="{
          name: 'input',
          attrs: { type: 'number' }
        }"
      />
      <vxe-table-column
        field="monitorType"
        title="测量方式"
        width="200"
        :edit-render="{
          name: 'select',
          options: temperatureMeasureTypeList
        }"
      />
      <vxe-table-column
        field="remark"
        title="备注"
        :edit-render="{
          name: 'input',
          attrs: { type: 'text' }
        }"
      />
      <vxe-table-column title="操作" width="150px">
        <template #default="{ row }">
          <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
            <vxe-button @click="handleDelete(row)">删除</vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()" />
      </p>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="queryForm.page"
        :page-size="queryForm.rows"
        :page-sizes="$pageConfig.pageSizes"
        @size-change="changePageSize"
        @current-change="changePageNumber"
      />
    </div>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">取消</el-button>
      <el-button size="lg" type="primary" @click="goBack()">保存</el-button>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-30
 * @Last Modified by: gengweigang
 */
import Api from './api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'HealthyList',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id,
      loading: false,
      info: {},
      // 监控状态下拉框数据
      queryForm: {
        employeeId: this.$route.query.id,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0,
      temperatureMeasureTypeList: [
        {
          label: '红外测量',
          value: 1
        },
        {
          label: '人工测量',
          value: 2
        }
      ]
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.getDetail()
    this.queryList()
  },
  // 方法集合
  methods: {
    async getDetail() {
      let res = await Api.getLabourDetail(this.id)
      this.info = res.data
    },
    // 查询列表
    async queryList() {
      this.loading = true
      const res = await Api.getLabourMonitorList(this.queryForm).finally(() => (this.loading = false))
      this.dataList = res.data.records.map(item => {
        return {
          ...item,
          monitorType: item.monitorType + ''
        }
      })
      this.total = res.data.total
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryList()
    },
    // 当前页码改变
    changePageNumber(pageNumber) {
      this.queryForm.page = pageNumber
      this.queryList()
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 新增
    add() {
      let obj = {
        employeeId: this.id,
        employeeName: this.info.name,
        monitorTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        bodyTemperature: null,
        monitorType: this.temperatureMeasureTypeList[0].value,
        remark: ''
      }
      this.dataList.push(obj)
      this.$refs.xTable.setActiveRow(obj)
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    async saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(async () => {
        if (!row.bodyTemperature) {
          this.$message.error('请填写体温')
          this.$refs.xTable.setActiveRow(row)
          return false
        }
        let res
        if (row.id) {
          res = await Api.updateLabourTemperature(row)
        } else {
          res = await Api.addLabourTemperature(row)
        }
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
      })
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (row.id) {
            Api.deleteLabourTemperatureRecordById(row.id).then(res => {
              this.$message.success('删除成功')
              this.dataList = this.dataList.filter(item => item._XID !== row._XID)
              this.queryList()
            })
          } else {
            this.dataList = this.dataList.filter(item => item._XID !== row._XID)
            this.$refs.xTable.remove(row)
            this.$message.success('删除成功')
          }
        })
        .catch(() => {})
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.status {
  display: flex;
  align-items: center;
  i {
    margin-right: 6px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00cc00;
  }
  &.status-2 i {
    background: #999;
  }
  &.status-3 i {
    background: #ff9900;
  }
  &.status-4 i {
    background: #ff0000;
  }
}
</style>
