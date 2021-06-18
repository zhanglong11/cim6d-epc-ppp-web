<template>
  <!--
/**
任务名称：2846/【【智慧工地2.0-前端】劳务管理》安全培训》列表、新建、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-1日
任务类型：1、全新代码
**/
-->
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd HH:MM:SS"
            type="daterange"
            @input="
              arr => {
                filterForm.trainingTimeBegin = arr ? arr[0] : null
                filterForm.trainingTimeEnd = arr ? arr[1] : null
              }
            "
          ></el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 30px">
          <el-input
            v-model="filterForm.trainingTheme"
            style="width: 300px"
            placeholder="安全培训名称"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-if="$hasPower('LabourSafetyAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('safety/new')"
          >新建安全培训</el-button
        >
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="trainingTheme" title="培训名称"></vxe-table-column>
      <vxe-table-column
        field="trainingType"
        title="培训类别"
        :formatter="({ cellValue }) => $getLabel(trainType, cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="trainingHour" title="培训课时"></vxe-table-column>
      <vxe-table-column field="lecturer" title="培训讲师"></vxe-table-column>
      <vxe-table-column field="trainingTime" title="培训时间"></vxe-table-column>
      <vxe-table-column
        field="totalEmployee"
        width="100px"
        title="参与人数"
        :formatter="({ cellValue }) => (cellValue ? cellValue.split(',').length : 0)"
      ></vxe-table-column>
      <vxe-table-column
        field="qualifiedEmployee"
        width="100px"
        title="合格人数"
        :formatter="({ cellValue }) => (cellValue ? cellValue.split(',').length : 0)"
      ></vxe-table-column>
      <vxe-table-column
        field="unqualifiedEmployee"
        width="100px"
        title="不合格人数"
        :formatter="({ cellValue }) => (cellValue ? cellValue.split(',').length : 0)"
      ></vxe-table-column>
      <vxe-table-column
        width="100px"
        title="合格率"
        :formatter="
          ({ row }) =>
            row.totalEmployee && row.qualifiedEmployee
              ? _.ceil((row.qualifiedEmployee.split(',').length / row.totalEmployee.split(',').length) * 100, 2) + '%'
              : ''
        "
      ></vxe-table-column>
      <vxe-table-column title="操作" width="180px">
        <template #default="{ row }">
          <el-button
            v-if="$hasPower('LabourSafetyDetail')"
            type="text"
            @click="$router.push('safety/' + row.id + '/detail')"
            >查看详情</el-button
          >
          <el-button v-if="$hasPower('LabourSafetyEdit')" type="text" @click="$router.push('safety/' + row.id)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('LabourSafetyDelete')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import trainType from './lib/trainType'
export default {
  name: 'Company',
  data() {
    return {
      date: null,
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return this.axios.labourSafety.post('training/list', body)
      },
      trainType
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    remove(list) {
      this.$remove(
        idList => {
          return this.axios.labourSafety.get('training/delete/' + idList.join(','))
        },
        list,
        'trainingTheme'
      ).then(() => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
