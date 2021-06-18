<!--
@bug名称: 1183/附件列，显示【查看附件】，点击弹出模态框，可查看附件列表详情
@开发人员: 董渊海
@修改日期: 2020-03-19
@任务类型: 修改代码，使用AttachmentDialog组件，修改比例(5%)

@bug名称: 1182/计量器具台账-去掉【状态】字段
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，修改比例(3%)

@bug名称: 1274、1275/计量器具台账-不允许在列表页上传附件，如果没有附件，显示【无】；附件详情模态框，不允许上传和删除，只允许查看和下载
@开发人员: 董渊海
@修改日期: 2020-03-31
@任务类型: 修改代码，修改比例(1%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2d2f6e9e411e7d7453167097561f6240b7cb626d
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整，后续检定校准、故障维修、封存、报废模态框的时间组件添加时分秒
@补加代码注释日期: 2020-04-11
-->
<template>
  <div>
    <el-form ref="form" :inline="true" :model="form">
      <ul class="search_bar">
        <li>
          <el-form-item label="" prop="synthesize">
            <el-input
              v-model="form.synthesize"
              placeholder="器具名称/规格型号/测量范围/精度等级/创建人"
              style="width: 310px"
              suffix-icon="el-icon-search"
            />
          </el-form-item>
          <el-form-item label="管理类别" prop="type">
            <el-select v-model="form.type" placeholder="请选择管理类别">
              <el-option label="A" value="A"></el-option>
              <el-option label="B" value="B"></el-option>
              <el-option label="C" value="C"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="equipmentStatus">
            <el-select v-model="form.equipmentStatus" placeholder="请选择设备状态">
              <el-option label="停用" value="0"></el-option>
              <el-option label="在用" value="1"></el-option>
              <el-option label="封存" value="2"></el-option>
              <el-option label="报废" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="有效期" prop="validity">
            <el-date-picker
              v-model="form.validity"
              type="datetimerange"
              range-separator="至"
              start-placeholder="请选择"
              end-placeholder="请选择"
              :default-time="['00:00:00', '23:59:59']"
              style="width: 336px"
            ></el-date-picker>
          </el-form-item>
          <!--<el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态">
              <el-option label="正常" value="0"></el-option>
              <el-option label="故障报修待审核" value="1"></el-option>
              <el-option label="故障报修已通过" value="2"></el-option>
              <el-option label="故障报修已驳回" value="3"></el-option>
              <el-option label="封存待审核" value="4"></el-option>
              <el-option label="封存已通过" value="5"></el-option>
              <el-option label="封存已驳回" value="6"></el-option>
              <el-option label="报废待审核" value="7"></el-option>
              <el-option label="报废已通过" value="8"></el-option>
              <el-option label="报废已驳回" value="9"></el-option>
              <el-option label="检定待审核" value="10"></el-option>
              <el-option label="检定已通过" value="11"></el-option>
              <el-option label="检定已驳回" value="12"></el-option>
            </el-select>
          </el-form-item>-->
        </li>
        <li class="search_bar_btn">
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
        </li>
      </ul>
    </el-form>

    <div style="margin-bottom: 10px">
      <el-button v-if="$hasPower('MeasureBookAdd')" type="primary" icon="el-icon-plus" @click="handleAdd"
        >新增</el-button
      >
      <el-button v-if="$hasPower('MeasureBookExport')" @click="handleExport">导出</el-button>
    </div>
    <vxe-table
      ref="xTable"
      border
      :show-header-overflow="true"
      column-min-width="140px"
      show-overflow
      :data="tableData"
      :loading="loading"
    >
      <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
      <vxe-table-column field="deviceName" title="器具名称">
        <!--任务号：973、修改人：董渊海、修改时间：2020-03-23-->
        <template #default="{ row }">
          <a @click="handleDetail(row.id, row)">{{ row.deviceName }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="specification" title="规格型号"></vxe-table-column>
      <vxe-table-column field="range" title="测量范围"></vxe-table-column>
      <vxe-table-column field="step" title="精度等级"></vxe-table-column>
      <vxe-table-column field="manageCategory" title="管理类别"></vxe-table-column>
      <vxe-table-column field="expireTime" title="有效期至"></vxe-table-column>
      <vxe-table-column field="deviceStatus" title="设备状态"></vxe-table-column>
      <!--<vxe-table-column field="status" title="状态"></vxe-table-column>-->
      <vxe-table-column field="fileId" title="附件">
        <template #default="{ row }">
          <AttachmentDialog accept=".jpg,.png,.gif,.webp,.bmp" :ids.sync="row.fileId"></AttachmentDialog>
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="130">
        <template #default="{ row }">
          <span>
            <a v-if="$hasPower('MeasureBookDetail')" @click="handleDetail(row.id, row)">查看</a>&nbsp;
            <a v-if="$hasPower('MeasureBookEdit')" @click="handleEdit(row.id, row)">编辑</a>&nbsp;
            <a v-if="$hasPower('MeasureBookDelete')" @click="handleDelete(row.id, row)">删除</a>
          </span>
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="page"
      :page-size="rows"
      :page-sizes="[10, 20, 30, 40]"
      :total="total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handlePageChange"
    >
    </vxe-pager>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/measureBook'
import jsonAsXlsx from 'json-as-xlsx'
export default {
  name: 'MeasureBook',
  data() {
    return {
      deviceStatus: {
        0: '停用',
        1: '在用',
        2: '封存',
        3: '报废'
      },
      status: {
        0: '正常',
        1: '故障维修待审核',
        2: '故障维修已通过',
        3: '故障维修已驳回',
        4: '封存待审核',
        5: '封存已通过',
        6: '封存已驳回',
        7: '报废待审核',
        8: '报废已通过',
        9: '报废已驳回',
        10: '检定待审核',
        11: '检定已通过',
        12: '检定已驳回'
      },
      form: {
        synthesize: '',
        type: null,
        equipmentStatus: '',
        createTime: '',
        validity: '',
        status: ''
      },
      tableData: [],

      loading: false,
      page: 1,
      rows: 10,
      total: 0
    }
  },
  mounted() {
    this.refresh(1, this.rows)
  },
  methods: {
    refresh(page, rows) {
      let createStartTime = ''
      let createEndTime = ''
      if (this.form.createTime !== null && this.form.createTime !== '' && this.form.createTime.length !== 1) {
        createStartTime = moment(this.form.createTime[0]).format('YYYY-MM-DD HH:mm:ss')
        createEndTime = moment(this.form.createTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let expireStartTime = ''
      let expireEndTime = ''
      if (this.form.validity !== null && this.form.validity !== '' && this.form.validity.length !== 1) {
        expireStartTime = moment(this.form.validity[0]).format('YYYY-MM-DD HH:mm:ss')
        expireEndTime = moment(this.form.validity[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      let keyWord = this.form.synthesize
      let manageCategory = this.form.type
      let deviceStatus = this.form.equipmentStatus
      let status = this.form.status

      this.loading = true

      Api.getMeasureBook({
        projectId: localStorage.getItem('projectId'),
        keyWord,
        manageCategory,
        deviceStatus,
        createStartTime,
        createEndTime,
        expireStartTime,
        expireEndTime,
        status,
        page,
        rows
      }).then(res => {
        //console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.tableData.map(item => {
          item.range = item.measureMin + ' ~ ' + item.measureMax + ' ' + item.measureUnit
          item.deviceStatus = this.deviceStatus[item.deviceStatus]
          item.status = this.status[item.status]
          item.fileId = item.fileId ? item.fileId : ''
        })
        this.total = res.data.total
        this.page = page
        this.rows = rows
      })
    },
    handleSearch() {
      this.refresh(1, this.rows)
    },
    resetForm() {
      this.$refs['form'].resetFields()
      this.refresh(1, this.rows)
    },
    handleAdd() {
      this.$router.push({ name: 'MeasureBookAdd' })
    },
    handleExport() {
      const columns = this.$refs.xTable
        .getTableColumn()
        .visibleColumn.map(e => ({ label: e.title, value: e.property }))
        .filter(item => item.value)
      jsonAsXlsx(columns, this.tableData, { fileName: '计量器具台账' })
    },
    handleDetail(id, row) {
      this.$router.push({ name: 'MeasureBookDetail', params: { id: id } })
    },
    handleEdit(id, row) {
      this.$router.push({ name: 'MeasureBookEdit', params: { id: id } })
    },
    handleDelete(id, row) {
      this.$confirm(`确定移除 ${row.deviceName} 记录吗？`).then(res => {
        Api.deleteMeasureBook(id).then(res => {
          this.$message.success('删除成功')
          this.refresh(1, this.rows)
        })
      })
    },

    handlePageChange({ currentPage, pageSize }) {
      //this.page = currentPage
      //this.rows = pageSize
      this.refresh(currentPage, pageSize)
    }
  }
}
</script>

<style scoped lang="less">
.search_bar {
  display: flex;
  justify-content: space-between;

  .search_bar_btn {
    white-space: nowrap;
  }
}
</style>
