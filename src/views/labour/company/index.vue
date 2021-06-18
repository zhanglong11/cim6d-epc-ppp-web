<template>
  <!--
  /**
  任务名称：2843/【智慧工地2.0-前端】劳务管理》劳务公司》列表、新建、编辑切图及功能开发
  开发人员：李建敏
  日期：2020-4月-1日
  任务类型：1、全新代码
  **/
  -->
  <div>
    <div class="tooltips">
      <div>
        <el-input
          v-model="filterForm.content"
          style="width: 300px"
          placeholder="公司名称/公司编号/负责人/负责人联系方式"
          suffix-icon="el-icon-search"
          @keyup.enter.native="refresh"
        />
        <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <div>
        <el-button v-if="$hasPower('LabourAdd')" type="primary" icon="el-icon-plus" @click="$router.push('company/new')"
          >新建公司</el-button
        >
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="name" title="公司名称"></vxe-table-column>
      <vxe-table-column
        field="type"
        title="公司类型"
        :formatter="({ cellValue }) => $getLabelFromArg('labourCompanyType', cellValue)"
      ></vxe-table-column>
      <vxe-table-column field="labourEmployeeNum" title="劳务人员总数"></vxe-table-column>
      <vxe-table-column field="principalName" title="负责人"></vxe-table-column>
      <vxe-table-column field="principalMobile" title="负责人联系方式"></vxe-table-column>
      <vxe-table-column field="groupNum" title="关联班组"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourEdit')" type="text" @click="$router.push('company/' + row.id)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('LabourRemove')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
export default {
  name: 'LabourCompanyList',
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return this.axios.labour.post('company/list', body)
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
        return this.axios.labour.get('company/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
