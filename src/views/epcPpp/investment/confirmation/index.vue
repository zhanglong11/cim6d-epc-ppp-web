<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input v-model="filterForm.creatorName" placeholder="创建人"></el-input>
        </el-form-item>
        <el-form-item label="确认单月份">
          <el-date-picker
            v-model="filterForm.confirmMonth"
            style="width: 110px"
            type="month"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="确认单类型">
          <el-select v-model="filterForm.confirmType" clearable>
            <el-option
              v-for="{ label, value } in confirmationTypeList"
              :key="value"
              :value="value"
              :label="label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <DateRange
            clearable
            :start-time.sync="filterForm.createTimeBegin"
            :end-time.sync="filterForm.createTimeEnd"
          ></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="() => $refs.table.reset()">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="tooltips">
      <div>
        <el-button
          v-if="$hasPower('investmentConfirmationAddEpcPpp')"
          type="primary"
          @click="$router.push({ name: 'InvestmentBuildConfirmationAdd' })"
        >
          新建建设费用确认单
        </el-button>
        <el-button
          v-if="$hasPower('investmentConfirmationAddEpcPpp')"
          type="primary"
          @click="$router.push({ name: 'InvestmentTotalConfirmationAdd' })"
        >
          新建总投资确认单
        </el-button>
      </div>
    </div>
    <Grid ref="table" :request="request" :filter-form.sync="filterForm" page-use-query>
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column
        title="确认单类型"
        field="confirmType"
        :formatter="confirmationTypeFormatter"
      ></vxe-table-column>
      <vxe-table-column title="期号" field="issue"></vxe-table-column>
      <vxe-table-column title="确认单月份" field="confirmMonth" width="120"></vxe-table-column>
      <vxe-table-column
        title="确认期"
        :formatter="({ row }) => row.confirmStartDate.slice(0, 10) + ' ~ ' + row.confirmEndDate.slice(0, 10)"
      ></vxe-table-column>
      <vxe-table-column title="创建人" field="creatorName" width="100"></vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
      <vxe-table-column
        title="状态"
        field="status"
        :formatter="confirmationStatusFormatter"
        width="80"
      ></vxe-table-column>
      <vxe-table-column title="操作" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="$hasPower('investmentConfirmationEditEpcPpp') && row.status === 0"
            type="text"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button type="text" @click="handleView(row)">查看</el-button>
          <el-button
            v-if="$hasPower('investmentConfirmationDeleteEpcPpp') && row.status === 0"
            type="text"
            @click="remove(row)"
          >
            删除
          </el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import { getConfirmList, removeConfirm } from '../api/confirmation'
import { confirmationTypeList, confirmationTypeFormatter } from './lib/confirmationTypeList'
import { confirmationStatusFormatter } from './lib/confirmationStatusList'
export default {
  name: 'Confirmation',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request: getConfirmList,
      confirmationTypeList
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      this.$refs.table.refresh()
    },
    handleEdit(row) {
      this.$router.push({
        name: ['InvestmentBuildConfirmationEdit', 'InvestmentTotalConfirmationEdit'][row.confirmType - 1],
        params: { id: row.id }
      })
    },
    handleView(row) {
      this.$router.push({
        name: ['InvestmentBuildConfirmationDetail', 'InvestmentTotalConfirmationDetail'][row.confirmType - 1],
        params: { id: row.id }
      })
    },
    async remove(row) {
      await this.$tipRemove([row], 'month')
      await removeConfirm([row.id])
      await this.$message.success('删除成功')
      this.refresh()
    },
    confirmationTypeFormatter,
    confirmationStatusFormatter
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
