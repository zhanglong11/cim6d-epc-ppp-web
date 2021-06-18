<template>
  <div>
    <div class="tooltips">
      <el-form ref="pageQuery" inline>
        <el-form-item>
          <el-input
            v-model="filterForm.keyWord"
            placeholder="合同名称/创建人"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item label="甲方">
          <el-select v-model="filterForm.firstPartyName">
            <el-option v-for="item in optionListA" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="乙方">
          <el-select v-model="filterForm.secondPartyName">
            <el-option v-for="item in optionListB" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" class="search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-reset" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="toopltips">
      <el-form inline>
        <el-form-item>
          <el-button type="primary" @click="toAdd(null)"> 新增 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- table -->
    <Grid ref="table" :request="request" :filterForm.sync="filterForm" size="medium">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column title="合同编号" field="code"></vxe-table-column>
      <vxe-table-column title="合同名称" field="name"></vxe-table-column>
      <vxe-table-column title="甲方" field="firstPartyName"></vxe-table-column>
      <vxe-table-column title="乙方" field="secondPartyName"></vxe-table-column>
      <vxe-table-column title="签订日期" field="signDate">
        <template slot-scope="{ row }">
          {{ moment(row.signDate).format('YYYY-MM-DD') }}
        </template>
      </vxe-table-column>
      <vxe-table-column title="创建人" field="creatorName"></vxe-table-column>
      <vxe-table-column title="创建时间" field="createTime"></vxe-table-column>
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <el-button type="text" @click="toDetail(row.id)">查看</el-button>
          <el-button type="text" @click="toAdd(row.id)">编辑</el-button>
          <el-button type="text" @click="remove(row.id)">删除</el-button>
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>
<script>
import { contractApi } from './api/contract'
export default {
  name: 'EpcPppContractList',
  data() {
    //这里存放数据
    return {
      optionListA: [],
      optionListB: [],
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request: contractApi.getCcpContract
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.queryList()
  },
  //方法集合
  methods: {
    //刷新
    refresh() {
      this.$refs.table.refresh()
    },
    async queryList() {
      const result = await contractApi.getFistSPeopleName({
        projectId: localStorage.getItem('projectId')
      })
      console.log(result)
      const list = result.data || []
      this.optionListA = list.firstNames
      this.optionListB = list.secondNames
    },
    //删除
    async remove(id) {
      await this.$confirm('删除当前合同吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await contractApi.getdeleteContract(id)
      this.$message.success('操作成功')
      this.refresh()
    },
    //重置
    reset() {
      this.$refs.table.reset()
    },
    //新建
    toAdd(id) {
      _.isNil(id)
        ? this.$router.push({ name: `ContractAdd` })
        : this.$router.push({ name: `ContractEdit`, params: { id } })
    },
    //详情
    toDetail(id) {
      this.$router.push({
        name: `detail`,
        params: { id }
      })
    }
  }
}
</script>
<style lang="less" scoped>
// .development {
//   display: flex;
//   align-items: flex-end;
//   justify-content: center;
//   img {
//     max-width: 100%;
//   }
// }
.tooltips .el-form-item .el-button {
  margin-right: 10px;
}
</style>
