<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" inline :model="queryForm">
        <el-form-item>
          <el-date-picker
            v-model="queryForm.time"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyword" style="width: 360px" placeholder="输入要搜索的内容" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('HealthyAddDisinfectionRecord')" type="primary" icon="el-icon-plus" @click="add()"
            >新增记录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('HealthyRecordListExport')" icon="el-icon-top-right" @click="handleExport"
            >数据导出</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="principalName" label="消毒人" min-width="140px" />
      <el-table-column prop="sterilizeTime" label="消毒时间" min-width="140px" />
      <el-table-column prop="sterilizePart" label="消毒部位" min-width="140px" />
      <el-table-column prop="carCount" label="消毒车辆数" min-width="140px" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('HealthyDisinfectionRecordDetails')"
            type="text"
            size="mini"
            @click="toDetails(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
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
  name: 'HealthyDisinfectionRecordList',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 监控状态下拉框数据
      queryForm: {
        // 查询条件
        keyword: '',
        time: ['', ''],
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    changeTime(e) {
      console.log(111, e)
    },
    // 查询列表
    async queryList() {
      const result = await Api.getDisinfectionRecordList(this.queryForm)
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
      this.$refs.form.resetFields()
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
    // 新增消毒记录
    add() {
      this.$router.push({
        path: '/healthy/add-disinfection-record'
      })
    },
    handleExport() {
      Api.exportCentralizedDisinfectionRecordList({}).then(res => {
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName = '统一消毒记录'
      if ('download' in document.createElement('a')) {
        // 不是IE浏览器
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      } else {
        // IE 10+
        window.navigator.msSaveBlob(blob, fileName)
      }
    },
    // 查看详情
    toDetails(row) {
      this.$router.push({
        path: '/healthy/disinfection-record-details',
        query: { id: row.sterilizeRecordId }
      })
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
