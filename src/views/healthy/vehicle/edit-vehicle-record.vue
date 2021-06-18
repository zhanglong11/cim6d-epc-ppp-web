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
      border
      :data="dataList"
      auto-resize
      :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
    >
      <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
      <vxe-table-column field="lisencePlate" title="车辆" />
      <vxe-table-column field="carPrincipalName" title="司机" />
      <vxe-table-column
        field="principalName"
        title="消毒人"
        :edit-render="{
          name: 'input',
          attrs: { type: 'text' }
        }"
      >
      </vxe-table-column>
      <vxe-table-column
        field="sterilizePart"
        title="消毒部位"
        :edit-render="{
          name: 'input',
          attrs: { type: 'text' }
        }"
      >
      </vxe-table-column>
      <!--
         /**
       任务名称：TASK#2893 健康管理接口对接
       开发人员：崔洛宜
       日期：2020-04-01
       任务类型：修改消毒方式和消毒时间的选择
       **/
      -->
      <!-- <vxe-table-column field="sterilizeTime" title="时间" />-->
      <vxe-table-column field="sterilizeTime" title="消毒时间" :edit-render="{ type: 'default' }">
        <template #edit="{ row }">
          <el-date-picker
            v-model="row.sterilizeTime"
            type="datetime"
            placeholder="选择消毒时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="sterilizeFlag"
        title="消毒状态"
        width="120"
        :edit-render="{
          name: 'select',
          options: disinfectionStatusList
        }"
      />
      <!--<vxe-table-column
        field="type"
        title="消毒方式"
        :edit-render="{
          name: 'select',
          options: disinfectionTypeList
        }"
      />-->
      <vxe-table-column field="type" title="消毒方式"> 车辆消毒 </vxe-table-column>
      <vxe-table-column
        field="remark"
        title="备注"
        :edit-render="{
          name: '$input',
          props: { type: 'text' }
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
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }}
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
import Api from '../api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EditHealthyVehicleRecord',
  components: {},
  data() {
    // 这里存放数据
    return {
      carId: this.$route.query.carId,
      queryForm: {
        // 查询条件
        type: 1,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      info: {},
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  computed: {
    // 消毒方式
    disinfectionTypeList() {
      return this.$getArgList('disinfectionType') || []
    },
    // 消毒状态
    disinfectionStatusList() {
      return this.$getArgList('disinfectionStatus') || []
    }
  },
  created() {
    Api.getVehicleListDetail(this.carId).then(res => {
      this.info = res.data
    })
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      const result = await Api.getVehicleDisinfectionRecordList({ carId: this.carId, type: '1' })
      this.dataList = result.data.records
      this.total = result.data.total
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
        ...this.info,
        lisencePlate: this.info.lisencePlate,
        carPrincipalName: this.info.principalName,
        carId: this.carId,
        sterilizeTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        sterilizeFlag: '1',
        type: '1',
        remark: '',
        principalName: '',
        principalMobile: '',
        sterilizePart: ''
      }
      //this.$refs.xTable.insertAt(obj,-1)
      console.log(this.info)
      console.log(obj)
      this.dataList.push(obj)
      this.$refs.xTable.setActiveRow(obj)
    },
    editRowEvent(row) {
      this.$refs.xTable.setActiveRow(row)
    },
    async saveRowEvent(row) {
      console.log(row)
      this.$refs.xTable.clearActived().then(async () => {
        let res
        if (row.sterilizeRecordId) {
          res = await Api.updateVehicleDisinfectionRecordById(row)
        } else {
          res = await Api.addVehicleDisinfectionRecord(row)
        }
        if (res.code === 200) {
          this.$message.success('保存成功')
          await this.queryList()
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
          if (row.sterilizeRecordId) {
            Api.deleteVehicleDisinfectionRecordById(row.sterilizeRecordId, row.carId).then(res => {
              this.dataList = this.dataList.filter(item => item.id !== row.id)
              this.$message.success('删除成功')
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
      this.$router.go(-1)
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
