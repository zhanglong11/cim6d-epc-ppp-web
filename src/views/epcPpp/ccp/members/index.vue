<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="性别">
          <el-select v-model="filterForm.sex" style="width: 100px">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位">
          <SelectCompany
            :id.sync="filterForm.partyMemberCompanyId"
            v-model="filterForm.receivePersonCompany"
            style="width: 200px"
            :multiple="false"
          ></SelectCompany>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filterForm.someThings"
            style="width: 300px; margin-left: 30px"
            placeholder="姓名/手机号码/党内职务/录入人"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-reset" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="入党时间">
          <DateRange :start-time.sync="filterForm.partyStartTime" :end-time.sync="filterForm.partyEndTime"></DateRange>
        </el-form-item>
        <el-form-item label="录入时间">
          <DateRange
            :start-time.sync="filterForm.createStartTime"
            :end-time.sync="filterForm.createEndTime"
          ></DateRange>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('EpcPppCcpMembersAdd')" type="primary" icon="el-icon-plus" @click="add()"
            >新增党员</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm" size="medium">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="partyMemberName" title="姓名"></vxe-table-column>
      <vxe-table-column
        field="sex"
        title="性别"
        :formatter="({ cellValue }) => ['男', '女'][cellValue - 1]"
      ></vxe-table-column>
      <vxe-table-column field="mobile" title="手机号码"></vxe-table-column>
      <vxe-table-column field="joinPartyTime" title="入党日期" formatter="ymd"></vxe-table-column>
      <vxe-table-column field="partyPosition" title="党内职务"></vxe-table-column>
      <vxe-table-column
        field="partyMemberCompanyName"
        title="所属单位及部门"
        :formatter="({ row }) => row.partyMemberCompanyName + ' - ' + row.partyMemberDepartmentName"
      ></vxe-table-column>
      <vxe-table-column field="creatorName" title="录入人"></vxe-table-column>
      <vxe-table-column field="createTime" title="录入时间"></vxe-table-column>

      <vxe-table-column title="操作" width="180px" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="view(row)">查看</el-button>
          <el-button v-if="$hasPower('EpcPppCcpMembersEdit')" type="text" @click="edit(row)">修改</el-button>
          <el-button v-if="$hasPower('EpcPppCcpMembersRemove')" type="text" @click="remove([row])">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <Detail :id="activeId" :visible.sync="viewDialogVisible"></Detail>
    <Edit :id="activeId" :visible.sync="editDialogVisible"></Edit>
  </div>
</template>

<script>
import Detail from './components/Detail'
import Edit from './components/Edit'
import api from '../api'
import SelectCompany from '../components/SelectCompany'
export default {
  name: 'CcpMembers',
  components: { Detail, Edit, SelectCompany },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request: api.getCcpMembers,
      // 当前活动行的数据
      activeId: null,
      // 查看弹窗是否显示
      viewDialogVisible: false,
      // 编辑弹窗是否显示
      editDialogVisible: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 刷新
    refresh() {
      this.$refs.table.refresh()
    },
    // 删除
    remove(list) {
      this.$remove(
        idList => {
          return api.removeCcpMemberById(idList.join(','))
        },
        list,
        'partyMemberName',
        null,
        '确定要删除党员'
      ).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    },
    // 新增党员
    add() {
      this.activeId = null
      this.editDialogVisible = true
    },
    // 编辑党员
    edit(row) {
      this.activeId = row.id
      this.editDialogVisible = true
    },
    // 查看
    view(row) {
      this.viewDialogVisible = true
      this.activeId = row.id
    }
  }
}
</script>

<style scoped lang="less"></style>
