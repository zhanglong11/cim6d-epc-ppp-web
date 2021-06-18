<template>
  <!--
/**
任务名称：2840/【智慧工地2.0-前端】劳务管理》工种管理》列表、新建、编辑切图及功能开发
开发人员：李建敏
日期：2020-4月-1日
任务类型：1、全新代码
**/
-->
  <div>
    <div class="tooltips">
      <div>
        <el-input
          v-model="filterForm.argText"
          placeholder="工种名称"
          suffix-icon="el-icon-search"
          @keyup.enter.native="refresh"
        />
        <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="$router.push('workType/new')">新建工种</el-button>
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="argText" title="工种名称"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column field="creatorName" title="创建人"></vxe-table-column>
      <vxe-table-column field="remark" title="备注"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button type="text" @click="$router.push('workType/' + row.id)">编辑</el-button>
          <el-button type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
export default {
  name: 'WorkType',
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId'),
        argFlag: 0
      },
      request(body) {
        return this.$api.getArgList({ argGroup: 'workType', ...body })
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
        return this.$api.removeArgById(idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    }
  }
}
</script>

<style scoped lang="less"></style>
