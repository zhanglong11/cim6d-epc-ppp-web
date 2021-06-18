<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">CMJ001 温度传感器</span>
        <el-button type="primary" size="mini">编辑</el-button>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="6">
            <p class="label">设备名称</p>
            <p class="title">CA0002 空气质量感器</p>
          </el-col>
          <el-col :md="6">
            <p class="label">所属区域</p>
            <p class="title">施工工地01</p>
          </el-col>
          <el-col :md="6">
            <p class="label">安装地点</p>
            <p class="title">工地西北监测点</p>
          </el-col>
          <el-col :md="6">
            <p class="label">状态</p>
            <p class="title">
              <span class="status">
                <i />
                使用中
              </span>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="8">
            <span class="label">设备型号</span>
            <span>BK001</span>
          </el-col>
          <el-col :md="16">
            <span class="label">创建时间</span>
            <span>2019-09-05 10:00:00</span>
          </el-col>
          <el-col :md="8">
            <span class="label">生产厂商</span>
            <span>海康威视</span>
          </el-col>
          <el-col :md="16">
            <span class="label">启用时间</span>
            <span>2019-09-05 10:00:00</span>
          </el-col>
          <el-col>
            <span class="label">备注</span>
            <span
              >这是一段器具备注。Blah blah blahLorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod
              bibendum laoreet. Proin gravida dolor sit amet lacus accumsan</span
            >
          </el-col>
          <el-col>
            <div class="upload-con">
              <span class="label">附件</span>
              <div class="upload-list">
                <p>
                  <span>这是一个附件.docx</span>
                  <a style="margin-left: 15px">点击下载</a>
                </p>
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
            <el-select v-model="queryForm.timeUnit" clearable placeholder="时间单位" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="queryForm.status" clearable placeholder="设备状态">
              <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
              <el-button icon="el-icon-refresh-left" @click="reset()">重置</el-button>
            </el-button-group>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-top-right">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 工具栏 end -->
      <el-tabs v-model="tabIndex" @tab-click="clickTab">
        <el-tab-pane label="温度&湿度" name="0" />
        <el-tab-pane label="空气质量" name="1" />
      </el-tabs>

      <!-- 温度&湿度 start -->
      <template v-if="tabIndex === '0'">
        <ChartLine style="margin-bottom: 20px" />
        <el-table :data="dataList" border stripe size="small" :edit-config="{ trigger: 'manual', mode: 'row' }">
          <el-table-column prop="name" label="序号" min-width="140" />
          <el-table-column prop="name" label="日期" min-width="140" />
          <el-table-column prop="name" label="时间" min-width="140" />
          <el-table-column prop="name" label="温度 ℃" min-width="140" />
          <el-table-column prop="name" label="湿度" min-width="140" />
          <el-table-column prop="name" label="设备状态" min-width="140" />
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
      </template>
      <!-- 温度&湿度 end -->

      <!-- 空气质量 start -->
      <template v-if="tabIndex === '1'">
        <ChartLineAir style="margin-bottom: 20px" />
        <el-table :data="dataList" border stripe size="small" :edit-config="{ trigger: 'manual', mode: 'row' }">
          <el-table-column prop="name" label="序号" />
          <el-table-column prop="name" label="日期" min-width="140" />
          <el-table-column prop="name" label="时间" min-width="140" />
          <el-table-column prop="name" label="AQI" min-width="140" />
          <el-table-column prop="name" label="PM2.5" min-width="140" />
          <el-table-column prop="name" label="PM10" min-width="140" />
          <el-table-column prop="name" label="设备状态" min-width="140" />
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
      </template>
      <!-- end start -->
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
import ChartLine from './components/chart-line' // 温度&湿度 图表组件
import ChartLineAir from './components/chart-line-air' // 空气质量 图表组件
export default {
  name: 'EnvironmentalMonitoringDetailsB',
  components: {
    ChartLine,
    ChartLineAir
  },
  data() {
    // 这里存放数据
    return {
      // 使用状态下拉框数据
      status: [
        {
          value: 1,
          label: '正常'
        },
        {
          value: 2,
          label: '故障'
        }
      ],
      queryForm: {
        // 查询条件
        status: '',
        startTime: null,
        endTime: null,
        timeUnit: '',
        page: 1,
        rows: this.$pageConfig.pageSize
      },
      queryFormBack: {},
      dataList: [
        {
          name: '测试'
        }
      ],
      total: 0,
      tabIndex: '1'
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
    // 选项卡点击事件
    clickTab() {},
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
