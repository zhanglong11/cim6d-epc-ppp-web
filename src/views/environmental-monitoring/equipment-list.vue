<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-select v-model="queryForm.type" clearable placeholder="设备种类">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.department" clearable placeholder="监测类型" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="queryForm.status" clearable placeholder="使用状态">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryForm.keyWords" style="width: 280px" placeholder="设备类型/设备名称/设备编号" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="add()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <el-table :data="dataList" border stripe size="small">
      <el-table-column type="index" width="120" align="center" label="序号" />
      <el-table-column prop="name" label="设备类型" />
      <el-table-column prop="name" label="设备名称" />
      <el-table-column prop="name" label="设备编号" />
      <el-table-column prop="name" label="监测类型" />
      <el-table-column prop="name" label="安装地点" />
      <el-table-column prop="name" label="使用状态">
        <template slot-scope="scope">
          <span :class="`status status-${scope.row.status}`">
            <i />
            {{ scope.row.statusName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="最新数据" />
      <el-table-column prop="name" label="更新时间" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="toDetails(scope.row.id)">查看</el-button>
          <el-button type="text" size="mini" @click="editItem(scope.row.id)">修改</el-button>
          <el-button type="text" size="mini">停用</el-button>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-30
 * @Last Modified by: gengweigang
 */
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EnvironmentalMonitoringEquipmentList',
  components: {},
  data() {
    // 这里存放数据
    return {
      // 设备种类下拉框数据
      typeList: [
        {
          value: 1,
          label: '温度传感器'
        },
        {
          value: 2,
          label: '空气质量传感器'
        },
        {
          value: 3,
          label: '风力传感器'
        },
        {
          value: 4,
          label: '噪音传感器'
        }
      ],
      // 使用状态下拉框数据
      status: [
        {
          value: 1,
          label: '使用中'
        },
        {
          value: 2,
          label: '停用'
        },
        {
          value: 3,
          label: '故障'
        }
      ],
      queryForm: {
        // 查询条件
        type: '',
        status: '',
        keyWords: '',
        department: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [
        {
          id: 1,
          name: '测试',
          status: 1,
          statusName: '使用中'
        },
        {
          id: 2,
          name: '测试',
          status: 2,
          statusName: '停用'
        },
        {
          id: 3,
          name: '测试',
          status: 3,
          statusName: '故障'
        }
      ],
      total: 0
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    Object.assign(this.queryFormBack, this.queryForm)
    // this.queryList()
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
    toDetails(id) {
      // 跳转两种不同的页面
      const path = `/environmental-monitoring/details-${id === 1 ? 'a' : 'b'}`
      this.$router.push({
        path
      })
    },
    // 新增设备
    add() {
      this.$router.push({
        path: '/environmental-monitoring/add'
      })
    },
    // 修改设备
    editItem(id) {
      this.$router.push({
        path: `/environmental-monitoring/edit?id=${id}`
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
}
</style>
