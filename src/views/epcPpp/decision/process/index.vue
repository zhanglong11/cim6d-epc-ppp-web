<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item>
          <el-input>创建人</el-input>
        </el-form-item>
        <el-form-item style="margin-left: 30px" label="决策录入日期">
          <DateRange :start-time.sync="filterForm.startDate" :end-time.sync="filterForm.endDate"></DateRange>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="() => $refs.table.resetFields()">重置</el-button>
          </el-button-group>
        </el-form-item>
        <br />
        <router-link to="processEpcPpp/add">
          <el-button type="primary">新建</el-button>
        </router-link>
      </el-form>
    </div>

    <Grid ref="table" :showHeaderOverflow="false" :request="request" :filter-form.sync="filterForm">
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column title="决策录入日期" field="createTime"></vxe-table-column>
      <vxe-table-column width="100" title="净利润" field="filed1"></vxe-table-column>
      <vxe-table-column width="100" title="全投资税前净现金流量" field="filed2"></vxe-table-column>
      <vxe-table-column width="100" title="全投资税后净现金流量" field="filed3"></vxe-table-column>
      <vxe-table-column width="100" title="资本金税前净现金流量" field="filed4"></vxe-table-column>
      <vxe-table-column width="100" title="资本金税后净现金流量" field="filed5"></vxe-table-column>
      <vxe-table-column width="100" title="项目全口径现金流量" field="filed6"></vxe-table-column>
      <vxe-table-column width="100" title="累计净现金流量" field="filed7"></vxe-table-column>
      <vxe-table-column width="100" title="全投税前IRR" field="filed8"></vxe-table-column>
      <vxe-table-column width="100" title="全投税后IRR" field="filed9"></vxe-table-column>
      <vxe-table-column width="100" title="全投资静态投资回收期(年)" field="filed10"></vxe-table-column>
      <vxe-table-column width="100" title="全投资动态投资回收期(年)" field="filed11"></vxe-table-column>
      <vxe-table-column width="100" title="资本金税前IRR" field="filed12"></vxe-table-column>
      <vxe-table-column width="100" title="资本金税后IRR" field="filed13"></vxe-table-column>
      <vxe-table-column width="100" title="资本金静态投资回收期(年)" field="filed14"></vxe-table-column>
      <vxe-table-column width="100" title="资本金动态投资回收期(年)" field="filed15"></vxe-table-column>
      <vxe-table-column width="100" title="资金缺口(万元)" field="filed16"></vxe-table-column>
      <vxe-table-column title="创建人" field="creatorName"></vxe-table-column>
      <vxe-table-column title="操作" field="todo" fixed="right">
        <template #default="{ row }">
          <router-link :to="`processEpcPpp/${row.id}`">查看</router-link>
          <router-link :to="`processEpcPpp/${row.id}/edit`">修改</router-link>
          <el-button type="text" @click="remove(row)">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'Index',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      filterForm: {},
      request: body => {
        return api.getList(body)
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    // 删除
    async remove(row) {
      await this.$tipRemove([row])
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
