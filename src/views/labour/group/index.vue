<template>
  <!--
/**
任务名称：2844/【智慧工地2.0-前端】劳务管理》班组管理》列表、新建、编辑切图及功能开发
开发人员：李建敏
日期：2020-4月-1日
任务类型：1、全新代码
**/
-->
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="班组名称">
          <SelectGroup v-model="name" valueField="name" @update:name="handlefilter"></SelectGroup>
        </el-form-item>
        <el-form-item style="margin-left: 30px">
          <el-input
            v-model="filterForm.content"
            style="width: 300px"
            placeholder="公司编号/公司名称/班组名称/负责人"
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
          v-if="$hasPower('LabourGroupAdd')"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('group/new')"
          >新建班组</el-button
        >
      </div>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="labourCompanyName" title="公司名称"></vxe-table-column>
      <vxe-table-column field="name" title="班组名称"></vxe-table-column>
      <vxe-table-column field="principalName" title="负责人"></vxe-table-column>
      <vxe-table-column field="principalMobile" title="班组负责人联系方式"></vxe-table-column>
      <vxe-table-column field="employeeNum" title="班组人数"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button v-if="$hasPower('LabourGroupEdit')" type="text" @click="$router.push('group/' + row.id)"
            >编辑</el-button
          >
          <el-button v-if="$hasPower('LabourGroupDelete')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import SelectGroup from '../components/SelectGroup'
import SelectCompany from '../components/SelectCompany'
export default {
  name: 'Group',
  components: { SelectGroup },
  data() {
    return {
      name: '',
      filterForm: {
        projectId: localStorage.getItem('projectId'),
        name: ''
      },
      request(body) {
        return this.axios.labour.post('group/list', body)
      }
    }
  },
  mounted() {},
  methods: {
    handlefilter(val) {
      this.filterForm.name = val
    },
    refresh() {
      this.$refs.table.refresh()
    },
    remove(list) {
      this.$remove(idList => {
        return this.axios.labour.get('group/delete/' + idList.join(','))
      }, list).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
      this.name = ''
    }
  }
}
</script>

<style scoped lang="less"></style>
