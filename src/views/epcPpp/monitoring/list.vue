<template>
  <div class="container">
    <!-- 工具栏 start -->
    <div class="tooltips">
      <el-form ref="pageQuery" inline :model="queryForm">
        <el-form-item>
          <el-select v-model="queryForm.status" clearable placeholder="监控状态">
            <el-option v-for="item in monitorStatusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryForm.keyword"
            style="width: 360px"
            placeholder="监控设备编号/设备型号/设备负责人/区域负责人"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$hasPower('EquipmentMonitoringAdd')" type="primary" icon="el-icon-plus" @click="add"
            >新增</el-button
          >
          <el-button type="primary" @click="together">同步</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 工具栏 end -->
    <Grid ref="table" :request="request" :filter-form.sync="queryForm">
      <vxe-table-column type="index" label="序号" />
      <vxe-table-column prop="deviceName" label="监控设备名称" min-width="140px" />
      <vxe-table-column prop="deviceNum" label="监控设备编号" min-width="140px" />
      <vxe-table-column prop="factoryNum" label="监控设备型号" min-width="140px" />
      <vxe-table-column prop="monitorArea" label="所属区域" min-width="140px" />
      <vxe-table-column
        prop="homeFlag"
        label="首页显示"
        min-width="140px"
        :formatter="({ cellValue }) => (cellValue === '1' ? '是' : cellValue === '0' ? '否' : '-')"
      />
      <vxe-table-column prop="status" label="监控状态" min-width="140px">
        <template slot-scope="scope">
          <span :class="`status status-${scope.row.status}`">
            <i></i>
            {{ $getLabelFromArg('monitorStatus', scope.row.status) }}
          </span>
        </template>
      </vxe-table-column>
      <vxe-table-column prop="devicePrincipalName" label="监控设备负责人" min-width="140px" />
      <vxe-table-column prop="areaPrincipalName" label="监控区域负责人" min-width="140px" />
      <vxe-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="$hasPower('EquipmentMonitoringDetails')"
            type="text"
            size="mini"
            @click="toDetails(scope.row.id)"
            >查看</el-button
          >
          <el-button
            v-if="$hasPower('EquipmentMonitoringEdit')"
            type="text"
            size="mini"
            @click="editMonitoring(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="
              $hasPower('EquipmentMonitoringStart') && ['monitorStatus_2', 'monitorStatus_4'].includes(scope.row.status)
            "
            type="text"
            size="mini"
            @click="updateStatus(scope.row.id, 'monitorStatus_1')"
            >启用
          </el-button>
          <el-button
            v-if="
              $hasPower('EquipmentMonitoringStop') && !['monitorStatus_2', 'monitorStatus_4'].includes(scope.row.status)
            "
            type="text"
            style="color: #00ff00"
            size="mini"
            @click="updateStatus(scope.row.id, 'monitorStatus_4')"
            >停用</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import Api from './api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EquipmentMonitoringList',
  components: {},
  data() {
    // 这里存放数据
    return {
      queryForm: {
        projectId: localStorage.getItem('projectId')
      },
      request: body => {
        return Api.getMonitorList(body)
      }
    }
  },
  computed: {
    //监控区域
    monitorAreaList() {
      return this.$getArgList('monitorArea') || []
    },
    //监控状态
    monitorStatusList() {
      return this.$getArgList('monitorStatus') || []
    },
    //监控目标
    monitorTargetList() {
      return this.$getArgList('monitorTarget') || []
    }
  },
  // 方法集合
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    // 查看详情
    toDetails(id) {
      this.$router.push({
        name: 'EquipmentMonitoringDetails',
        query: {
          id
        }
      })
    },
    // 新增监控设备
    add() {
      this.$router.push({
        name: 'EquipmentMonitoringAdd'
      })
    },
    // 编辑监控设备
    editMonitoring(id) {
      this.$router.push({
        name: 'EquipmentMonitoringEdit',
        query: {
          id
        }
      })
    },
    async updateStatus(monitorCameraId, status) {
      await Api.updateStatus({ monitorCameraId, status })
      this.$message.success('操作成功')
      this.refresh()
    },
    async together() {
      await Api.together()
      this.$message.success('操作成功')
      this.refresh()
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
  &.status-3 i {
    background: #999;
  }
  &.status-2 i {
    background: #ff9900;
  }
}
</style>
