<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">{{ info.lisencePlate }}</span>
        <el-button
          v-if="$hasPower('EditHealthyVehicle')"
          type="primary"
          size="mini"
          @click="$router.push('edit-healthy-vehicle/' + id)"
          >编辑</el-button
        >
      </div>
      <div class="details">
        <el-row>
          <el-col :md="18">
            <el-row>
              <el-col :md="8">
                <span class="label">所属公司</span>
                <span>{{ info.subordinateCompanyName }}</span>
              </el-col>
              <el-col :md="16">
                <span class="label">车辆类型</span>
                <span>{{ info.carType }}</span>
              </el-col>
              <el-col :md="8">
                <span class="label">在场状态</span>
                <span class="status inline">
                  <i />
                  在场
                </span>
              </el-col>
              <el-col :md="16">
                <span class="label">消毒状态</span>
                <span class="status inline">
                  <i />
                  已消毒
                </span>
              </el-col>
              <el-col :md="8">
                <span class="label">车辆负责人</span>
                <span>{{ info.principalName }}</span>
              </el-col>
              <el-col :md="16">
                <span class="label">身份证号</span>
                <span>410300198501010000</span>
              </el-col>
              <el-col :md="8">
                <span class="label">联系电话</span>
                <span>155-0000-0000</span>
              </el-col>
              <el-col>
                <span class="label">备注信息</span>
                <span>
                  {{ info.remark }}
                </span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :md="6" style="text-align: right">
            <img :src="info.car_image" style="width: 400px; height: 200px" alt="车辆图片" />
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 车辆消毒记录 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>车辆消毒记录</span>
        <el-button
          v-if="$hasPower('EditHealthyVehicleRecord')"
          style="float: right"
          type="primary"
          size="mini"
          @click="editHealthyRecord"
          >编辑</el-button
        >
      </div>
      <el-table :data="dataList" border stripe size="small" :edit-config="{ trigger: 'manual', mode: 'row' }">
        <el-table-column type="index" width="120" align="center" label="序号" />
        <el-table-column prop="lisencePlate" label="车辆" min-width="140px" />
        <el-table-column prop="principalName" label="司机" min-width="140px" />
        <el-table-column prop="sterilizeTime" label="时间" min-width="140px" />
        <el-table-column prop="sterilizeFlag" label="消毒状态" min-width="140px">
          <template slot-scope="scope">
            <span :class="`status status-${scope.row.sterilizeFlag}`">
              <i />
              {{
                _.get(
                  _.find($store.state.systemConfig.config.disinfectionStatus.children, {
                    value: scope.row.sterilizeFlag + '' || '0'
                  }),
                  'label'
                )
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="消毒方式" min-width="140px">
          <template slot-scope="scope">
            {{ $getLabelFromArg('disinfectionType', scope.row.type + '') }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="140px" />
      </el-table>
    </el-card>
    <!-- 车辆消毒记录 end -->

    <!-- 操作记录 start -->
    <!--  <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作记录</span>
      </div>
      <el-table
        :data="operationRecordDataList"
        border
        stripe
        size="small"
        :edit-config="{ trigger: 'manual', mode: 'row' }"
      >
        <el-table-column type="index" width="120" align="center" label="序号" />
        <el-table-column prop="name" label="操作人" />
        <el-table-column prop="name" label="操作时间" />
        <el-table-column prop="name" label="操作类型" />
        <el-table-column prop="name" label="操作内容" />
        <el-table-column prop="name" label="附件" />
      </el-table>
    </el-card>-->
    <!-- 操作记录 end -->

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
import Api from '../api/work-bench'
export default {
  name: 'HealthyVehicleDetails',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      info: {},
      queryForm: {
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
    console.log(
      _.get(_.find(this.$store.state.systemConfig.config.disinfectionStatus.children, { value: '1' }), 'label')
    )
    Object.assign(this.queryFormBack, this.queryForm)
    this.queryList()
  },
  // 方法集合
  methods: {
    // 查询车辆详情
    async queryList() {
      const result = await Api.getVehicleListDetail(this.id)
      this.info = result.data
      this.dataList = result.data.list
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
    // 编辑车辆消毒记录
    editHealthyRecord() {
      this.$router.push({
        path: '/healthy/edit-vehicle-record',
        query: {
          carId: this.id
        }
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
}
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
</style>
