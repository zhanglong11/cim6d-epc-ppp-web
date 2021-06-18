<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix details-header">
        <span class="details-title">消毒记录-20200225</span>
        <el-button type="primary" size="mini">编辑</el-button>
      </div>
      <div class="details">
        <el-row>
          <el-col :md="8">
            <span class="label">消毒人</span>
            <span>{{ info.principalName }}</span>
          </el-col>
          <el-col :md="16">
            <span class="label">联系电话</span>
            <span>{{ info.principalMobile }}</span>
          </el-col>
          <el-col :md="8">
            <span class="label">消毒部位</span>
            <span>{{ info.sterilizePart }}</span>
          </el-col>
          <el-col :md="16">
            <span class="label">消毒用品</span>
            <span>{{ info.type }}</span>
          </el-col>
          <el-col>
            <span class="label">备注信息</span>
            <span>{{ info.remark }}</span>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 车辆消毒记录 start -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>车辆消毒记录</span>
        <el-button
          v-if="$hasPower('EditHealthyDisinfectionRecord')"
          style="float: right"
          type="primary"
          size="mini"
          @click="editHealthyRecord"
          >编辑</el-button
        >
      </div>
      <el-table :data="dataList" border stripe size="small" :edit-config="{ trigger: 'manual', mode: 'row' }">
        <el-table-column type="index" width="120" align="center" label="序号" />
        <el-table-column prop="lisencePlate" label="车牌号" min-width="140px" />
        <el-table-column prop="principalName" label="负责人" min-width="140px" />
        <el-table-column prop="name" label="消毒状态" min-width="140px" />
        <el-table-column prop="name" label="消毒时间" min-width="140px" />
        <el-table-column prop="name" label="消毒人" min-width="140px" />
        <el-table-column prop="name" label="备注" min-width="140px" />
      </el-table>
    </el-card>
    <!-- 车辆消毒记录 end -->

    <!-- 操作记录 start -->
    <!-- <el-card class="box-card">
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
 * @Date: 2020-03-31
 * @Last Modified by: gengweigang
 */
import Api from '../api/work-bench'
export default {
  name: 'HealthyDisinfectionRecordDetails',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      info: {},
      dataList: [],
      total: 0,
      operationRecordDataList: [
        {
          name: '张三'
        }
      ]
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDetail()
  },
  // 方法集合
  methods: {
    // 查询详情
    async getDetail() {
      const result = await Api.getDisinfectionRecordDetail(this.id)
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
    // 编辑车辆消毒记录
    editHealthyRecord() {
      this.$router.push({
        path: '/healthy/edit-disinfection-vehicle-record',
        query: { id: this.id }
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
