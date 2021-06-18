<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ info.name }}</span>
        <el-button v-if="$hasPower('LabourWorkerEdit')" type="primary" size="mini" @click="handleEdit">编辑</el-button>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="8">
            <span class="label">所属公司</span>
            <span>{{ info.labourCompanyName }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">所属部门</span>
            <span>{{ info.groupName }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">人员编号</span>
            <span>{{ info.employeeNum }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">在场状态</span>
            <span class="status inline">
              <i />
              {{ $getLabelFromArg('enterStatus', info.enterStatus + '') }}
            </span>
          </el-col>
          <el-col :md="16">
            <span class="label">健康状态</span>
            <span class="status inline">
              <i />
              {{ $getLabelFromArg('healthStatus', info.healthStatus + '') }}
            </span>
          </el-col>
          <el-col :md="8">
            <span class="label">人员性别</span>
            <span>{{ ['', '男', '女'][info.gender] }}</span>
          </el-col>
          <el-col :md="16">
            <span class="label">人员年龄</span>
            <span>{{ age }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">身份证号</span>
            <span>{{ info.idCardNum }}</span>
          </el-col>
          <el-col :md="16">
            <span class="label">人员籍贯</span>
            <span>{{ info.nativePlace }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">现居住地</span>
            <span>{{ info.remark }}</span>
          </el-col>
          <el-col :md="16">
            <span class="label">联系电话</span>
            <span>{{ info.mobile }}</span>
          </el-col>
          <el-col>
            <span class="label">备注信息</span>
            <span>{{ info.remark }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 健康监测记录 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>健康监测记录</span>
        <el-button
          v-if="$hasPower('EditHealthyRecord')"
          style="float: right"
          type="primary"
          size="mini"
          @click="editHealthyRecord"
          >编辑</el-button
        >
      </div>
      <el-table
        v-loading="loading"
        :data="dataList"
        border
        stripe
        size="small"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <el-table-column type="index" width="120" align="center" label="序号" />
        <el-table-column prop="employeeName" label="被检测人" min-width="140px" />
        <el-table-column prop="createTime" label="监测时间" min-width="140px" />
        <el-table-column prop="bodyTemperature" label="体温℃" min-width="140px" />
        <el-table-column prop="monitorType" label="测量方式" min-width="140px">
          <template slot-scope="scope">
            {{ $getLabel(temperatureMeasureTypeList, scope.row.monitorType) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="140px" />
      </el-table>
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
    </el-card>
    <!-- 健康监测记录 end -->

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
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
  name: 'HealthyLabourForceDetails',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id,
      age: null,
      loading: false,
      info: {},
      dataList: [],
      total: 0,
      queryForm: {
        // 查询条件
        employeeId: this.$route.query.id,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
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
  computed: {
    //连续监测
    continuousMonitorList() {
      return this.$getArgList('continuousMonitor') || []
    },
    //在场状态
    enterStatusList() {
      return this.$getArgList('enterStatus') || []
    },
    //健康状态
    healthStatusList() {
      return this.$getArgList('healthStatus') || []
    }
  },
  watch: {
    'info.idCardNum'(val) {
      if (val) {
        this.age = moment().year() - val.substring(6, 10)
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    this.getDetail()
    this.queryList()
  },
  // 方法集合
  methods: {
    //查询详情
    async getDetail() {
      let res = await Api.getLabourDetail(this.id)
      this.info = res.data
    },
    // 查询列表
    async queryList() {
      this.loading = true
      const res = await Api.getLabourMonitorList(this.queryForm).finally(() => (this.loading = false))
      this.dataList = res.data.records
      this.total = res.data.total
    },
    // 搜索
    search() {
      this.queryForm.page = 1
      this.queryList()
    },
    // 重置
    reset() {
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
    // 编辑健康监测记录
    editHealthyRecord() {
      this.$router.push({
        path: '/healthy/edit-healthy-record',
        query: { id: this.id }
      })
    },
    handleEdit() {
      this.$router.push({
        path: `/labour/worker/${this.id}`
      })
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
.details {
  font-size: 14px;
  .label {
    margin-right: 25px;
    margin-bottom: 15px;
    color: #ccc;
    display: inline-block;
  }
  .title {
    margin-bottom: 30px;
    font-size: 20px;
  }
  .status {
    display: flex;
    align-items: center;
    font-size: 14px;
    &.inline {
      display: inline-flex;
    }
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
  }
  .upload-con {
    display: flex;
    .upload-list {
      margin-bottom: 10px;
    }
  }
}
</style>
