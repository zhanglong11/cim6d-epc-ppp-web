<template>
  <!--
/**
任务名称：2845/【智慧工地2.0-前端】劳务管理》工人信息》列表、新增、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-2日
任务类型：1、全新代码
**/
-->
  <div style="background-color: unset">
    <div class="main">
      <div class="detail">
        <div class="header">
          <h1>{{ form.name }}（{{ form.employeeNum }}）</h1>
          <el-button type="primary" @click="$router.push('.')">编辑</el-button>
        </div>
        <section>
          <ul>
            <li>
              <span>健康状态</span>
              <Status :options="$store.state.healthStatusList" :value="form.healthStatus"></Status>
            </li>
            <li style="width: 66.6%">
              <span>在场状态</span>
              <Status :options="$store.state.enterStatusList" :value="form.enterStatus"></Status>
            </li>
            <li>
              <span>人员性别</span>
              <span>{{ ['男', '女'][form.gender - 1] }}</span>
            </li>
            <li>
              <span>人员年龄</span>
              <span>{{ form.birthDate ? moment().year() - form.birthDate.slice(0, 4) : '' }}</span>
            </li>
            <li>
              <span>身份证号</span>
              <span>{{ form.idCardNum }}</span>
            </li>
            <li>
              <span>人员籍贯</span>
              <span>{{ form.nativePlace }}</span>
            </li>
            <li>
              <span>政治面貌</span>
              <span>{{ $getLabelFromArg('politicsStatus', form.politicsStatus) }}</span>
            </li>
            <li>
              <span>婚姻状态</span>
              <span>{{ $getLabelFromArg('maritalStatus', form.maritalStatus) }}</span>
            </li>
            <li>
              <span>最高学历</span>
              <span>{{ $getLabelFromArg('educationBackground', form.highestEducation) }}</span>
            </li>
            <li>
              <span>毕业院校</span>
              <span>{{ form.graduateSchool }}</span>
            </li>
            <li>
              <span>联系电话</span>
              <span>{{ form.mobile }}</span>
            </li>
            <li>
              <span>紧急联系人</span>
              <span>{{ form.emergencyContactor }}</span>
            </li>
            <li>
              <span>紧急联系人电话</span>
              <span>{{ form.emergencyContactMobile }}</span>
            </li>
          </ul>
        </section>
        <el-divider></el-divider>
        <section>
          <ul>
            <li>
              <span>人员工种</span>
              <span>{{ $getLabelFromArg('workType', form.workType) }}</span>
            </li>
            <li>
              <span>作业类别</span>
              <span>{{ $getLabelFromArg('workCategory', form.jobClass) }}</span>
            </li>
            <li>
              <span>考勤规则</span>
              <span>{{ form.attendRuleId }}</span>
            </li>
            <li>
              <span>所属班组</span>
              <span>{{ form.groupName }}</span>
            </li>
            <li>
              <span>所属公司</span>
              <span>{{ form.labourCompanyName }}</span>
            </li>
            <li>
              <span>在职状态</span>
              <Status :options="$store.state.jobStatusList" :value="form.jobStatus"></Status>
            </li>
            <li>
              <span>人员身份</span>
              <span>{{ $getLabelFromArg('identity', form.workDuty) }}</span>
            </li>
            <li>
              <span>用工性质</span>
              <span>{{ $getLabelFromArg('workerProperty', form.staffKind) }}</span>
            </li>
            <li>
              <span>合同编号</span>
              <span>{{ form.labourContractNum }}</span>
            </li>
            <li>
              <span>APP权限</span>
              <span>{{ $getLabelFromArg('appRole', form.appPermission) }}</span>
            </li>
            <li>
              <span>所属职位</span>
              <span>{{ $getLabelFromArg('position', form.position) }}</span>
            </li>
            <li>
              <span>备注信息</span>
              <span>{{ form.workRemark }}</span>
            </li>
          </ul>
        </section>
      </div>

      <el-tabs id="attend" v-model="activeName" name="attend">
        <el-tab-pane name="health" label="健康记录" lazy>
          <el-card>
            <header slot="header">
              <span>健康检测记录</span>
              <el-button type="primary" style="float: right; position: relative; top: -3px" @click="editHealthyRecord"
                >编辑</el-button
              >
            </header>
            <Grid :pageUseQuery="false" :request="healthLogRequest">
              <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
              <vxe-table-column field="employeeName" title="被检测人"></vxe-table-column>
              <vxe-table-column field="monitorTime" title="检测时间"></vxe-table-column>
              <vxe-table-column field="bodyTemperature" title="体温℃"></vxe-table-column>
              <vxe-table-column
                field="monitorType"
                title="测量方式"
                :formatter="({ cellValue }) => ['红外测量', '人工测量'][cellValue - 1]"
              ></vxe-table-column>
              <vxe-table-column field="remark" title="备注"></vxe-table-column>
            </Grid>
          </el-card>
        </el-tab-pane>
        <el-tab-pane name="attend" label="考勤记录" lazy>
          <el-card>
            <header slot="header">
              <span>考勤检测记录</span>
              <!--              <el-button type="primary" style="float: right;position: relative;top: -3px;">编辑</el-button>-->
            </header>
            <Grid :pageUseQuery="false" :request="checkingLogRequest">
              <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
              <vxe-table-column field="employeeId" title="员工卡号"></vxe-table-column>
              <vxe-table-column field="employeeName" title="员工姓名"></vxe-table-column>
              <vxe-table-column field="attendTime" title="打卡时间"></vxe-table-column>
              <vxe-table-column
                field="type"
                title="打卡类型"
                :formatter="({ cellValue }) => ['上班', '下班', '外勤'][cellValue - 1]"
              ></vxe-table-column>
              <vxe-table-column field="attendStatus" title="考勤状态">
                <template #default="{ row }">
                  <Status :options="attendStatusList" :value="row.attendStatus"></Status>
                </template>
              </vxe-table-column>
              <vxe-table-column field="remark" title="备注"></vxe-table-column>
            </Grid>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      activeName: this.$route.query.activeName || 'health',
      // 健康检测记录
      healthLogRequest(body) {
        return this.axios.construction.post('health/monitor/list', {
          projectId: localStorage.getItem('projectId'),
          employeeId: this.$route.params.id,
          ...body
        })
      },
      // 考勤记录
      checkingLogRequest(body) {
        return this.axios.construction.post('attend/record/list', {
          projectId: localStorage.getItem('projectId'),
          employeeId: this.$route.params.id,
          ...body
        })
      },
      form: {},
      attendStatusList: [
        { label: '正常', value: 1, color: '#449944' },
        { label: '迟到', value: 2, color: '#f54d4d' },
        { label: '早退', value: 3, color: '#f1cf23' },
        { label: '缺勤', value: 4, color: '#f1cf23' }
      ]
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    this.axios.labour.get('employee/get/' + this.id).then(res => {
      this.form = res.data
    })
  },
  methods: {
    // 编辑健康监测记录
    editHealthyRecord() {
      this.$router.push({
        path: '/healthy/edit-healthy-record',
        query: { id: this.id }
      })
    }
  }
}
</script>

<style scoped lang="less">
.main {
  width: 1100px;
  margin: 0 auto;
  .detail {
    padding: 30px 50px;
  }
  > * {
    background-color: #fff;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-weight: bold;
    color: #666666;
  }
}
section {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      width: 33.3%;
      font-size: 14px;
      padding: 20px 0;
      span:first-child {
        color: rgba(153, 153, 153, 0.85);
        margin-right: 15px;
      }
    }
  }
}
.el-tabs {
  /deep/ .el-tabs__header {
    margin-bottom: 0;
    &::after {
      height: 20px;
      background-color: #f0f2f5;
      display: block;
      content: '';
    }
    .el-tabs__nav-scroll {
      padding-left: 50px;
    }
  }
}
</style>
