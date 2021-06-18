<template>
  <div class="no-padding">
    <div class="model-con">
      <div class="model-group">
        <el-card>
          <div slot="header" class="clearfix">
            <span>模型分组</span>
            <el-button style="float: right" type="primary" size="mini" icon="el-icon-plus" @click="addType()"
              >新增分组</el-button
            >
          </div>
          <ul class="type-list">
            <template v-for="type in typeTree">
              <li :key="type.id" @click="anchorType(type.id)">
                <span class="icon el-icon-folder"></span>
                <span class="name">{{ type.name }}（{{ type.count }}）</span>
                <el-tooltip v-if="type.id" class="item" effect="dark" content="编辑" placement="right">
                  <el-button
                    type="text"
                    class="edit"
                    icon="el-icon-edit-outline"
                    @click.stop="editType(type)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip v-if="type.id" class="item" effect="dark" content="删除" placement="right">
                  <el-button
                    type="text"
                    class="delete"
                    icon="el-icon-delete"
                    @click.stop="deleteCategory(type.id)"
                  ></el-button>
                </el-tooltip>
              </li>
            </template>
          </ul>
        </el-card>
      </div>
      <div v-loading.fullscreen.lock="fullscreenLoading" class="model-list">
        <el-card class="tooltips">
          <el-form ref="filterForm" :model="filterForm" inline>
            <el-form-item label="名称" prop="name">
              <el-input v-model="filterForm.name" placeholder="请搜索"></el-input>
            </el-form-item>
            <el-form-item>
              <el-select v-model="filterForm.status" @change="init()">
                <el-option value="" label="全部">全部</el-option>
                <el-option :value="0" label="未部署"></el-option>
                <el-option :value="1" label="已部署"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="init()">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="default" @click="resetQuery()">重置</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="
                  () => {
                    activeId = null
                    editDialogVisible = true
                  }
                "
                >新增模型</el-button
              >
            </el-form-item> -->
          </el-form>
          <!-- <div>
            <el-button
              v-if="$hasPower('WorkflowModelAdd')"
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
              v-if="$hasPower('WorkflowModelDelete')"
              size="mini"
              type="danger"
              :disabled="!selectedList.length"
              icon="el-icon-delete"
              @click="remove"
              >删除</el-button
            >
          </div> -->
        </el-card>
        <template v-for="(items, i) in listData">
          <el-card :id="'model_' + items.id" :key="items.id">
            <div slot="header" class="clearfix">
              <span>{{ items.name }}（{{ items.count }}）</span>
              <el-button
                v-if="$hasPower('WorkflowModelAdd') && items.id"
                style="float: right"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                @click="addModel(items.id)"
                >新增模型</el-button
              >
            </div>
            <div class="list-con">
              <ul>
                <li v-for="(item, j) in items.children" :key="item.id">
                  <div class="list-data">
                    <div class="edit">
                      <el-tooltip class="item" effect="dark" content="编辑" placement="right">
                        <el-button type="text" icon="el-icon-edit-outline" @click="editModel(item)"></el-button>
                      </el-tooltip>
                      <el-tooltip
                        v-if="item.metaInfoObject.enable === 1"
                        class="item"
                        effect="dark"
                        content="启用中，点击禁用"
                        placement="right"
                      >
                        <el-button type="text" icon="el-icon-unlock" @click="disableModel(item.id, i, j)"></el-button>
                      </el-tooltip>
                      <el-tooltip v-else class="item" effect="dark" content="禁用中，点击启用" placement="right">
                        <el-button
                          type="text"
                          class="red"
                          icon="el-icon-lock"
                          @click="enableModel(item.id, i, j)"
                        ></el-button>
                      </el-tooltip>
                    </div>
                    <div class="list-box">
                      <span class="icon el-icon-s-check" :class="{ active: item.lastDeploymentTime }"></span>
                      <div class="desc">
                        <b>{{ item.name }}</b>
                        <p>版本：{{ item.revision }}</p>
                        <p>{{ item.lastDeploymentTime || '未部署' }}</p>
                      </div>
                    </div>
                    <div class="list-footer">
                      <el-button
                        v-if="$hasPower('WorkflowModelDesign')"
                        type="primary"
                        plain
                        size="medium"
                        @click="modelDesign(item)"
                        >流程设计</el-button
                      >
                      <el-button
                        v-if="$hasPower('WorkflowModelDeploy')"
                        type="primary"
                        plain
                        size="medium"
                        @click="deploy(item)"
                        >部署</el-button
                      >
                    </div>
                  </div>
                </li>
                <li v-if="!items.count">
                  <p class="no-data">暂无数据...</p>
                </li>
              </ul>
            </div>
          </el-card> </template
        ><!-- 旧的布局 start -->
        <!-- <el-card>
          <div slot="header" class="clearfix">
            <span>旧的布局</span>
          </div>
          <Grid
            ref="table"
            auto-search
            :filter-form="filterForm"
            :request="request"
            @checkboxChange="({ selection }) => (selectedList = selection)"
          >
            <vxe-table-column type="checkbox" width="40px" />
            <vxe-table-column title="名称" field="name"> </vxe-table-column>
            <vxe-table-column field="revision" title="版本" width="60" />
            <vxe-table-column field="deploymentInfo" title="状态">
              <template slot-scope="scope">
                {{ scope.row.lastDeploymentTime ? '已部署' : '未部署' }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="createTime" title="创建时间" />
            <vxe-table-column field="lastUpdateTime" title="修改时间" />
            <vxe-table-column title="操作" width="220px">
              <template v-slot="{ row }">
                <router-link :to="'model/' + row.id + '?name=' + row.name"
                  ><el-button v-if="$hasPower('WorkflowModelDesign')" size="mini" type="warning"
                    >流程设计</el-button
                  ></router-link
                >
                <el-button v-if="$hasPower('WorkflowModelDeploy')" size="mini" @click="deploy(row)">部署</el-button>
              </template>
            </vxe-table-column>
          </Grid>
        </el-card> -->
        <!-- 旧的布局 end -->
      </div>
    </div>

    <!-- 编辑分类 start -->
    <EditType :id="typeModal.id" :visible.sync="typeModal.show" />
    <!-- 编辑分类 end -->

    <!-- 新增模型 start -->
    <Edit
      :id="modelModal.id"
      ref="edit"
      :categoryId="modelModal.categoryId"
      :categoryList="typeTree"
      :visible.sync="modelModal.show"
    />
    <!-- 新增模型 end -->
  </div>
</template>

<script type="text/jsx">
import { workFlowApi } from '../api/workflow-api'
import Edit from './components/Edit' // 新增模型
import EditType from './components/editType' // 编辑分类
// import SelectProcessCategory from '../components/SelectProcessCategory'
export default {
  name: 'Process',
  // 组件集合
  components: { Edit, EditType },
  // 数据
  data() {
    return {
       // 获取模型列表
      request(body){
        return this.axios.workflow.post('activiti/model/list',body).then(res=>res.data)
      },
      // 已选中项
      selectedList: [],
      // 编辑弹窗可见性
      editDialogVisible: false,
      // 当前激活模型Id
      activeId: null,
      // 筛选表单
      filterForm: {
        name: '',
        status: '',
        page: 1,
        rows: 100
      },
      filterFormBack: {},
      listData: [],
      // 分组数据
      typeTree: [],
      // 分组模态框
      typeModal: {
        show: false,
        id: ''
      },
      // 新增模型
      modelModal: {
        show: false,
        id: '',
        categoryId: ''
      },
      fullscreenLoading: false
    }
  },
  computed: {
    // 项目id
    projectId(){
      return this.$store.state.project.projectId
    }
  },
  mounted(){
    Object.assign(this.filterFormBack, this.filterForm)
    this.init()
  },
  // 方法集合
  methods: {
    // 初始化
    init(){
      this.treeCategory()
    },
    // 定位到模型分组
    anchorType(id){
      let modelList = document.getElementsByClassName('model-list')
      let sel = document.getElementById('model_' + id)
      let offsetTop = sel.offsetTop
      modelList[0].scroll({
        top: offsetTop,
        behavior: 'smooth'
      })
    },
    // 重置
    resetQuery(){
      Object.assign(this.filterForm, this.filterFormBack)
      this.init()
    },
    // 分组树
    async treeCategory(){
      let params = {
        page: 1,
        rows: 100,
        type: 1,
        projectId: this.projectId
      }
      let result = await workFlowApi.treeCategory(params)
      let datas = result.data
      let listData = []
      datas.map((item, i) => {
        listData.push({
          id: item.id,
          name: item.name,
          count: 0,
          children: []
        })
        item.count = 0
      })
      this.typeTree = datas
      this.listData = listData
      this.queryModelListCategory()
    },
    // 获取模型列表
    async queryModelListCategory(){
      try{
        this.filterForm.projectId = this.projectId
        this.fullscreenLoading = true
        let result = await workFlowApi.queryModelListCategory(this.filterForm)
        let datas = result.data || []
        let ids = _.map(this.listData, 'id')
        datas.map(item => {
          let index = ids.indexOf(item.categoryId)
          if(index >= 0){
            this.typeTree[index].count = item.count
            this.typeTree[index].name = item.categoryName
            this.typeTree[index].id = item.categoryId
            this.listData[index].count = item.count
            this.listData[index].name = item.categoryName
            this.listData[index].children = item.children
          }
          if((!item.categoryId || item.categoryId === '0') && item.count){
            let noType = {
              id: item.categoryId,
              name: item.categoryName,
              count: item.count,
              parentId: 0,
              projectId: this.projectId,
              children: item.children
            }
            this.typeTree.push(noType)
            this.listData.push(noType)

          }
        })
        setTimeout(() => {
          this.fullscreenLoading = false
        }, 500)
      }catch(e){}
    },
    // 新增分组
    addType(){
      this.typeModal.id = ''
      this.typeModal.show = true
    },
    // 编辑分组
    editType(item){
      this.typeModal.id = item.id
      this.typeModal.show = true
    },
    // 删除分组
    deleteCategory(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await workFlowApi.deleteCategory(id)
        this.$message.success('操作成功')
        this.init()
      });
    },
    // 新增模型
    addModel(categoryId){
      this.modelModal.id = ''
      this.modelModal.categoryId = categoryId
      this.modelModal.show = true
    },
    // 编辑模型
    editModel(item){
      this.modelModal.id = item.id
      this.modelModal.categoryId = item.categoryId
      this.modelModal.show = true
    },
    // 刷新
    refresh(){
      this.$refs.table.refresh()
    },
    // 移除
    remove() {
      this.$remove(this.selectedList).then(() => {
        Promise.all(this.selectedList.map(e => this.axios.workflow.get('activiti/model/delete/' + e.id))).then(() => {
          this.$message.success('删除成功')
          this.refresh()
        })
      })
    },
    // 模型启用
    async enableModel(modelId, i, j){
      await workFlowApi.enableModel(modelId)
      this.$message.success('启用成功')
      this.listData[i].children[j].metaInfoObject.enable = 1
    },
    // 模型禁用
    async disableModel(modelId, i, j){
      await workFlowApi.disableModel(modelId)
      this.$message.success('禁用成功')
      this.listData[i].children[j].metaInfoObject.enable = 2
    },
    // 流程设计
    modelDesign(item){
      this.$router.push('model/' + item.id + '?name=' + item.name)
    },
    // 部署
    deploy(row){
      this.axios.workflow.get('activiti/model/deploy/'+row.id).then(res=>{
        this.$message.success('部署成功')
        this.init()
      })
    }
  }
}
</script>

<style scoped lang="less">
@import url('~@/styles/common.less');
.el-tag {
  margin: 5px;
}
.type-list {
  li {
    padding: 5px 0;
    border-bottom: 1px #ebeef5 solid;
    display: flex;
    align-items: center;
    font-size: 14px;
    .icon {
      margin-right: 10px;
      font-size: 20px;
    }
    .name {
      flex: 1;
      cursor: pointer;
    }
    .edit,
    .delete {
      font-size: 16px;
    }
    .delete {
      color: #f56c6c;
    }
    &:last-child {
      border: 0;
    }
  }
}
.no-data {
  font-size: 14px;
  color: #ccc;
}
.tooltips {
  /deep/.el-card__body {
    padding-bottom: 3px;
  }
}
.model-con {
  display: flex;
  height: calc(100vh - 90px);
  overflow: hidden;
  .model-group {
    margin-right: 15px;
    width: 300px;
  }
  .model-list {
    flex: 1;
    overflow-y: auto;
    .scrollbar;
    .el-card {
      margin-top: 15px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
}
.list-con {
  ul {
    li {
      margin-right: 15px;
      margin-bottom: 15px;
      display: inline-block;
      width: 320px;
      overflow: hidden;
    }
  }
}
.list-data {
  border: 1px #ebeef5 solid;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  .edit {
    position: absolute;
    top: 0;
    right: 5px;
    font-weight: bold;
    /deep/.el-button--text.el-button {
      font-size: 20px;
      padding: 5px;
      margin: 0;
    }
  }
  .list-box {
    padding: 20px 15px;
    display: flex;
    .icon {
      margin-right: 15px;
      font-size: 50px;
      color: #ddd;
      &.active {
        color: #409eff;
      }
    }
    .desc {
      font-size: 13px;
      flex: 1;
      width: 70%;
      b {
        font-size: 16px;
        font-weight: bold;
        margin: 5px 0 5px;
        display: block;
        .ellipsis;
        width: 100%;
      }
      p {
        color: #666;
        line-height: 2;
      }
    }
  }
  .list-footer {
    border-top: 1px #ebeef5 solid;
    display: flex;
    .el-button {
      flex: 1;
      margin: 5px;
    }
  }
}
.el-button.red {
  color: #f56c6c;
}
</style>
