<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="form" inline :model="queryForm">
        <el-form-item>
          <el-select v-model="queryForm.monitorArea" clearable placeholder="所属区域">
            <el-option v-for="item in monitorAreaList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
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
          <el-input v-model="queryForm.keyword" style="width: 260px" placeholder="监控视频编号/设备编号/所在区域" />
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
    <el-table v-loading="loading" :data="dataList" border stripe size="small">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="recordNum" label="监控视频编号" min-width="140px" />
      <el-table-column prop="deviceNum" label="设备编号" min-width="140px" />
      <el-table-column prop="monitorArea" label="所属区域" min-width="140px">
        <template slot-scope="scope">
          {{ $getLabelFromArg('monitorArea', scope.row.monitorArea) }}
        </template>
      </el-table-column>
      <el-table-column prop="monitorTarget" label="监控目标" min-width="140px">
        <template slot-scope="scope">
          {{ $getLabelFromArg('monitorTarget', scope.row.monitorTarget) }}
        </template>
      </el-table-column>
      <el-table-column label="监控时长" min-width="140px">
        <template slot-scope="scope">
          {{ moment(scope.row.endTime).diff(moment(scope.row.startTime), 'seconds') | initTime }}
          <!--{{ moment('2020-03-01 15:42:52').diff(moment('2020-03-01 13:24:54'), 'seconds') | initTime }}-->
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="起始时间" min-width="140px" />
      <el-table-column prop="endTime" label="结束时间" min-width="140px" />
      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button v-if="$hasPower('EquipmentMonitoringEditView')" type="text" size="mini">
            <PreviewUrl
              v-if="scope.row.cameraRecordUrl"
              :button-content="'查看'"
              :fileUrl="scope.row.cameraRecordUrl"
            ></PreviewUrl>
          </el-button>
          <el-button v-if="$hasPower('EquipmentMonitoringVideoListDownload')" type="text" size="mini">
            <a :href="`${scope.row.deviceUrl}?response-content-type=application/octet-stream`">下载</a>
            <!--            <a @click="save(scope.row)">下载</a>-->
          </el-button>
          <el-button
            v-if="$hasPower('EquipmentMonitoringVideoListDelete')"
            type="text"
            size="mini"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <p class="total">
        共 {{ total }} 条记录 第 {{ queryForm.page }} / {{ Math.ceil(total / queryForm.rows) || 1 }} 页
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
import Api from './api/work-bench'

export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EquipmentMonitoringList',
  components: {},
  data() {
    // 这里存放数据
    return {
      loading: false,
      queryForm: {
        // 查询条件
        //deviceId: '1',
        monitorArea: null,
        keyword: '',
        startTime: null,
        endTime: null,
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [{}],
      total: 0
    }
  },
  computed: {
    //监控区域
    monitorAreaList() {
      return this.$getArgList('monitorArea') || []
    },
    //监控目标
    monitorTargetList() {
      return this.$getArgList('monitorTarget') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询列表
    async queryList() {
      this.loading = true
      const res = await Api.getVideoListByArea({
        ...this.queryForm,
        projectId: localStorage.getItem('projectId')
      }).finally(() => (this.loading = false))
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
      Object.assign(this.queryForm, this.queryFormBack)
      this.queryForm.page = 1
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
      this.queryForm.rows = pageSize
      this.queryList()
    },
    // 删除视频
    handleDelete(id) {
      this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          Api.deleteVideoById(id).then(res => {
            this.$message.success('删除成功')
            this.queryList()
          })
        })
        .catch(() => {})
    },
    async save(data) {
      console.log(data.cameraRecordUrl)
      let res = await Api.videoMonitorDown({ videoUrl: data.cameraRecordUrl })
      this.download(res.data, data.id)
    },
    download(data, name) {
      if (!data) {
        return
      }
      let blob = new Blob([data])
      let fileName = name + '.mp4'
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
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
</style>
