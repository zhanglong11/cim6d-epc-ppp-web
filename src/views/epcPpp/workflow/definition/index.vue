<template>
  <div>
    <div class="tooltips">
      <el-form ref="filterForm" :model="filterForm" inline>
        <el-form-item label="分类" prop="type">
          <SelectProcessCategory v-model="filterForm.processCategory"></SelectProcessCategory>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请搜索">
            <el-button slot="append" size="mini" icon="el-icon-search" @click="refresh(true)"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button
          v-if="$hasPower('DrawReviewAddViewAdd')"
          size="mini"
          type="primary"
          @click="
            () => {
              activeId = null
              editDialogVisible = true
            }
          "
          >添加</el-button
        >
        <el-button
          v-if="$hasPower('DrawReviewAddViewDelete')"
          size="mini"
          type="danger"
          :disabled="!selectedList.length"
          icon="el-icon-delete"
          @click="remove"
          >删除</el-button
        >
      </div>
    </div>
    <Grid
      ref="table"
      auto-search
      :filter-form="filterForm"
      :request="request"
      @checkboxChange="({ selection }) => (selectedList = selection)"
    >
      <vxe-table-column type="checkbox" width="60" />
      <vxe-table-column title="名称" field="name"> </vxe-table-column>
      <vxe-table-column title="ID" field="processDefinitionId"> </vxe-table-column>
      <vxe-table-column field="category" title="分类" />
      <vxe-table-column field="version" title="版本" width="60" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作">
        <template #default="{ row }">
          <a
            @click="
              () => {
                activeId = row.id
                editDialogVisible = true
              }
            "
            ><el-button
              size="mini"
              type="primary"
              @click="
                () => {
                  activeDefinition = row
                  initProcessDialogVisible = true
                }
              "
            >
              发起流程
            </el-button></a
          >
        </template>
      </vxe-table-column>
    </Grid>

    <Edit :id="activeId" ref="edit" :visible.sync="editDialogVisible" />
    <InitProcess :definition="activeDefinition" :visible.sync="initProcessDialogVisible" @submit="submit"></InitProcess>
  </div>
</template>

<script type="text/jsx">
import Edit from './components/Edit'
import InitProcess from './components/InitProcess'
import SelectProcessCategory from '../components/SelectProcessCategory'
export default {
  name: 'Definition',
  components: { Edit,InitProcess,SelectProcessCategory},
  data() {
    return {
      request(body){
        return this.axios.workflow.post('activiti/process/definition/list',body).then(res=>res.data)
      },
      selectedList: [],
      editDialogVisible: false,
      initProcessDialogVisible:false,
      activeDefinition:null,
      activeId: null,
      filterForm: {
        name: '',
        type: null,
        processStatus:0
      },
      options: [
        {
          label: '全部',
          value: null
        },
        {
          label: '哈哈',
          value: 1
        },
        {
          label: '啊啊',
          value: 2
        }
      ]
    }
  },
  methods: {
    refresh(){
      this.$refs.table.refresh()
    },
    remove() {
      this.$remove(this.selectedList).then(() => {
        Promise.all(this.selectedList.map(e => this.axios.workflow.get('activiti/deployment/delete/' + e.deploymentId))).then(() => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    },
    submit(data){
      this.axios.workflow.post('activiti/process/definition/start/'+this.activeDefinition.processDefinitionId,data).then(res=>{
        this.$message.success('发起流程成功')
        this.initProcessDialogVisible = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.el-tag {
  margin: 5px;
}
</style>
