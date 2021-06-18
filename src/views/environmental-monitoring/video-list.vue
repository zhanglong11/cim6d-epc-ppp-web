<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.region" clearable placeholder="所属区域">
            <el-option v-for="item in region" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="起始时间"
            @change="search()"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="queryForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
            @change="search()"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWords" style="width: 260px" placeholder="监控视频编号/设备编号/所在区域" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column prop="name" label="序号" />
      <el-table-column prop="name" label="监控视频编号" min-width="140" />
      <el-table-column prop="name" label="设备编号" min-width="140" />
      <el-table-column prop="name" label="所属区域" min-width="140" />
      <el-table-column prop="name" label="监控目标" min-width="140" />
      <el-table-column prop="name" label="监控时长" min-width="140" />
      <el-table-column prop="name" label="起始时间" min-width="140" />
      <el-table-column prop="name" label="结束时间" min-width="140" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toDetails()">查看</el-button>
          <el-button type="text" size="mini">下载</el-button>
          <el-button type="text" size="mini" @click="deleteVideo(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }}
        <el-button type="text primary" class="el-icon-refresh" @click="queryList()"></el-button>
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
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 */
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EquipmentMonitoringList',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 所属区域下拉框数据
      region: [
        {
          value: 1,
          label: '工地'
        },
        {
          value: 2,
          label: '食堂'
        },
        {
          value: 3,
          label: '项目部'
        }
      ],
      queryForm: {
        // 查询条件
        region: '',
        keyWords: '',
        startTime: null,
        endTime: null,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [
        {
          id: 1,
          name: '测试'
        }
      ],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    //this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      // const result = await gitLogApi.queryCountList(this.queryForm)
      // const datas = result.data
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
      this.queryForm.pageNumber = pageNumber
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.pageNumber = 1
      this.queryForm.pageSize = pageSize
      this.queryList()
    },
    // 查看详情
    toDetails() {},
    // 删除视频
    deleteVideo(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
