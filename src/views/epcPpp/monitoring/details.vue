<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ info.deviceName }}</span>
        <el-button type="primary" size="mini">编辑</el-button>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="5">
            <p class="label">设备型号</p>
            <p class="title">{{ info.deviceName }}</p>
          </el-col>
          <el-col :md="5">
            <p class="label">所属区域</p>
            <p class="title">{{ info.monitorArea }}</p>
          </el-col>
          <el-col :md="5">
            <p class="label">状态</p>
            <p class="title">
              <span class="status">
                <i />
                {{ $getLabelFromArg('monitorStatus', info.status) }}
              </span>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="5">
            <span class="label">监控设备负责人</span>
            <span>{{ info.devicePrincipalName }}</span>
          </el-col>
          <el-col :md="5">
            <span class="label">创建时间</span>
            <span>{{ info.openDeviceDate }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="5">
            <span class="label">监控区域负责人</span>
            <span>{{ info.areaPrincipalName }}</span>
          </el-col>
          <el-col :md="5">
            <span class="label">启用时间</span>
            <span>{{ info.openDeviceDate }}</span>
          </el-col>
          <el-col>
            <span class="label">备注</span>
            <span>{{ info.remark }}</span>
          </el-col>
          <el-col>
            <div class="upload-con">
              <span class="label">附件</span>
              <div class="upload-list">
                <FileList :ids="info.fileId"></FileList>
              </div>
            </div>
          </el-col>
          <el-col>
            <div class="upload-con">
              <span class="label">图片</span>
              <div class="upload-list">
                <FileList :ids="info.imageId"></FileList>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <el-card class="box-card">
      <!-- 工具栏 start -->
      <div class="tooltips">
        <el-form inline>
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
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
      <!-- 工具栏 end -->
      <el-table :data="dataList" border stripe size="small" :edit-config="{ trigger: 'manual', mode: 'row' }">
        <el-table-column type="index" label="序号" />
        <el-table-column prop="recordNum" label="监控视频编号" min-width="140" />
        <el-table-column label="监控时长" min-width="140">
          <template slot-scope="scope">
            {{ moment(scope.row.endTime).diff(moment(scope.row.startTime), 'seconds') | initTime }}
            <!--{{ moment('2020-03-01 15:42:52').diff(moment('2020-03-01 13:24:54'), 'seconds') | initTime }}-->
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="起始时间" min-width="140" />
        <el-table-column prop="endTime" label="结束时间" min-width="140" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini">
              <PreviewUrl :button-content="'查看'" :fileUrl="scope.row.cameraRecordUrl"></PreviewUrl>
            </el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
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
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
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
  name: 'EquipmentMonitoringDetails',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id,
      info: {},
      queryForm: {
        // 查询条件
        startTime: null,
        endTime: null,
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
    this.getDetail()
    this.queryList()
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getMonitorDetail(this.id)
      this.info = res.data
    },
    // 查询列表
    async queryList() {
      let res = await Api.getVideoList({
        ...this.queryForm,
        deviceId: this.id,
        projectId: localStorage.getItem('projectId')
      })
      this.dataList = res.data.records
      this.total = res.data.total
    },
    //删除视频记录
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
    },
    // 每页显示条数改变
    changePageSize(pageSize) {
      this.queryForm.page = 1
      this.queryForm.rows = pageSize
      this.queryList()
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
