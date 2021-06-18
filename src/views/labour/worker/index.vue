<template>
  <!--
/**
任务名称：2845/【智慧工地2.0-前端】劳务管理》工人信息》列表、新增、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-2日
任务类型：1、全新代码
**/
-->
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="选择工种">
          <SelectArg v-model="filterForm.workType" argGroup="workType"></SelectArg>
        </el-form-item>
        <el-form-item style="margin-left: 10px" label="所属班组">
          <SelectGroup v-model="filterForm.groupId"></SelectGroup>
        </el-form-item>
      </el-form>
      <div>
        <el-input
          v-model="filterForm.content"
          style="width: 300px"
          placeholder="考勤卡号/姓名/工种/班组/劳务公司/身份"
          suffix-icon="el-icon-search"
          @keyup.enter.native="refresh"
        />
        <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="用工性质">
          <SelectArg v-model="filterForm.workerPropertyId" argGroup="workerProperty"></SelectArg>
        </el-form-item>
        <el-form-item style="margin-left: 10px" label="在职状态">
          <SelectArg v-model="filterForm.jobStatus" argGroup="jobStatus"></SelectArg>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-if="$hasPower('LabourWorkerAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('worker/new')"
          >新增人员</el-button
        >
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm" size="medium">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="employeeNum" title="人员卡号"></vxe-table-column>
      <vxe-table-column field="name" title="姓名"></vxe-table-column>
      <vxe-table-column
        field="gender"
        title="性别"
        :formatter="({ cellValue }) => ['男', '女'][cellValue - 1]"
      ></vxe-table-column>
      <vxe-table-column
        field="workType"
        title="工种"
        :formatter="({ cellValue }) => $getLabelFromArg('workType', cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="groupName" title="所属班组"></vxe-table-column>
      <vxe-table-column field="labourCompanyName" title="所属劳务公司"></vxe-table-column>
      <vxe-table-column
        field="labourCompanyType"
        title="企业类型"
        :formatter="({ cellValue }) => $getLabelFromArg('labourCompanyType', cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        field="staffKind"
        title="用工性质"
        :formatter="({ cellValue }) => $getLabelFromArg('workerProperty', cellValue)"
      ></vxe-table-column>
      <vxe-table-column
        field="workDuty"
        title="身份"
        :formatter="({ cellValue }) => $getLabelFromArg('identity', cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="todo" title="人员照片">
        <template #default="{ row }">
          <el-avatar :size="70" style="margin-top: 5px" :src="row.headImage"></el-avatar>
        </template>
      </vxe-table-column>
      <vxe-table-column title="在职情况">
        <template #default="{ row }">
          <Status arg-group="jobStatus" :value="row.jobStatus"></Status>
        </template>
      </vxe-table-column>
      <vxe-table-column field="todo" title="考勤记录">
        <template #default="{ row }">
          <router-link v-if="$hasPower('LabourWorkerRecord')" :to="'worker/' + row.id + '/record?activeName=attend'"
            >考勤记录</router-link
          >
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" width="180px">
        <template #default="{ row }">
          <el-button
            v-if="$hasPower('LabourWorkerPersonal')"
            type="text"
            @click="$router.push('worker/' + row.id + '/detail')"
            >个人信息</el-button
          >
          <el-button v-if="$hasPower('LabourWorkerEdit')" type="text" @click="$router.push('worker/' + row.id)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('LabourWorkerDelete')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import SelectGroup from '../components/SelectGroup'
export default {
  name: 'Worker',
  components: { SelectGroup },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return this.axios.labour.post('employee/list', body)
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    remove(list) {
      this.$remove(idList => {
        return this.axios.labour.get('employee/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
