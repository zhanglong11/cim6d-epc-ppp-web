<template>
  <div class="wrap">
    <header>
      <el-button :type="activeType === 1 ? 'primary' : 'default'" @click="() => (activeType = 1)"
        >工程管理资料</el-button
      >
      <el-button :type="activeType === 2 ? 'primary' : 'default'" @click="() => (activeType = 2)"
        >商务合约管理资料</el-button
      >
      <el-button :type="activeType === 3 ? 'primary' : 'default'" @click="() => (activeType = 3)"
        >综合管理资料</el-button
      >
      <el-button :type="activeType === 4 ? 'primary' : 'default'" @click="() => (activeType = 4)"
        >财务资金资料</el-button
      >
      <el-dropdown style="margin-left: 10px">
        <el-button :type="activeType === 5 || activeType === 6 ? 'primary' : 'default'"
          >竣工资料<i class="el-icon-arrow-down el-icon--right"></i
        ></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="() => (activeType = 5)">施工单位资料</el-dropdown-item>
          <el-dropdown-item @click.native="() => (activeType = 6)">监理单位资料</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </header>
    <div class="container">
      <el-card class="slide">
        <div slot="header" class="card-header">
          <span>{{ typeName }}资料列表</span>
          <el-button v-if="$hasPower('DocumentManageEpcPppAddRoot')" type="primary" @click="showAddDialog"
            >新增</el-button
          >
        </div>
        <ul>
          <li
            v-for="item in modelList"
            :key="item.id"
            :class="item.id === activeDocumentId ? 'active' : ''"
            @click="changeDocument(item)"
          >
            <p class="name">
              <span :title="item.name">{{ item.name }}</span>
              <el-button-group>
                <el-button
                  v-if="$hasPower('DocumentManageEpcPppDeleteRoot')"
                  size="mini"
                  type="danger"
                  @click="removeRoot(item.id)"
                  >删除</el-button
                >
                <el-button
                  v-if="$hasPower('DocumentManageEpcPppUpdateRoot')"
                  size="mini"
                  type="primary"
                  @click="e => showRootUpdateDialog(e, item)"
                  >修改</el-button
                >
              </el-button-group>
            </p>
            <p class="desc">
              <span>{{ item.createTime }}</span>
              <span>{{ item.creatorName }}</span>
            </p>
          </li>
        </ul>
      </el-card>
      <el-card class="content">
        <div slot="header" class="card-header">
          <div>
            <el-button
              v-if="$hasPower('DocumentManageEpcPppAddTable')"
              :disabled="!activeDocumentId"
              @click="showSubAddDialog"
              >新增</el-button
            >
            <el-button
              v-if="$hasPower('DocumentManageEpcPppAddChild')"
              :disabled="!activeRow.id"
              type="primary"
              @click="showSubDialog"
              >新增子项</el-button
            >
          </div>
        </div>
        <vxe-table
          ref="xTable"
          border
          :data="tableData"
          :tree-config="{ expandAll: true }"
          highlight-current-row
          @cell-click="changeRow"
        >
          <vxe-table-column field="name" title="资料名称" min-width="200" tree-node />
          <vxe-table-column field="creatorName" title="创建人" min-width="200" />
          <vxe-table-column field="createTime" title="创建日期" min-width="200" />
          <vxe-table-column field="issueType" title="操作" min-width="200">
            <template #default="{ row }">
              <el-button type="text" @click="toDetail(row)">查看</el-button>
              <el-button
                v-if="$hasPower('DocumentManageEpcPppUpdateTable')"
                type="text"
                @click="showSubUpdateDialog(row)"
                >修改</el-button
              >
              <el-button v-if="$hasPower('DocumentManageEpcPppDeleteTable')" type="text" @click="removeChild(row)"
                >删除</el-button
              >
            </template>
          </vxe-table-column>
        </vxe-table>
      </el-card>
    </div>
    <AddModelDialog
      v-if="addVisible"
      :documentId="activeDocumentId"
      :activeId="activeId"
      :activeName="activeName"
      :fileIds="activeFile"
      :name="activeDocumentName"
      :level="level"
      :visible.sync="addVisible"
      :pId="pid"
      :type="activeType"
    />
  </div>
</template>

<script>
import AddModelDialog from './components/AddModelDialog'
import Api from './api'
import toTree from '@/utils/toTree'
export default {
  name: 'ModelManage',
  components: { AddModelDialog },
  data() {
    return {
      addVisible: false, //添加模态框显示
      activeDocument: {}, //选中文档
      activeDocumentId: this.$router.query?.documentId || null, //选中文档id
      activeDocumentName: this.$router.query?.documentName || '', //选中文档名称
      activeType: 1, //选中类型
      pid: 0, //父id
      activeFile: null, //当前选中文档
      isRoot: true, //是否根目录
      activeId: null, //当前id
      activeName: '', //当前名称
      level: 1, //层级
      modelList: [], //文档列表
      tableData: [], //表格数据
      activeRow: {} //当前行
    }
  },
  computed: {
    typeName: function () {
      switch (this.activeType) {
        case 1:
          return '工程管理'
        case 2:
          return '商务合约管理'
        case 3:
          return '综合管理'
        case 4:
          return '财务资金'
        case 5:
          return '施工单位'
        case 6:
          return '监理单位'
        default:
          break
      }
      return ''
    }
  },
  watch: {
    activeType() {
      this.activeDocumentId = null
      this.refresh()
    },
    //当前选中资料ID
    activeDocumentId(v) {
      this.$router.replace({
        query: {
          documentId: v,
          documentName: this.$route.query.documentName
        }
      })
    },
    //当前选中资料名称
    activeDocumentName(v) {
      this.$router.replace({
        query: {
          documentId: this.$route.query.documentId,
          documentName: v
        }
      })
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    //刷新
    async refresh() {
      const res = await Api.rootList(this.activeType)
      this.modelList = res.data
      if (res.data && res.data.length) {
        if (this.activeDocumentId) {
          this.childList(this.activeDocumentId)
          return
        }
        this.changeDocument(res.data[0])
      } else {
        this.tableData = []
      }
    },
    //添加
    showAddDialog() {
      this.activeId = null
      this.activeName = ''
      this.level = 1
      this.pid = 0
      this.addVisible = true
    },
    //删除根目录
    async removeRoot(id) {
      await this.$confirm('删除该文件，将会删除该文件下的所有资料确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await Api.deleteRoot(id)
      this.$message.success('操作成功')
      this.refresh()
    },
    //删除子集
    async removeChild(row) {
      await this.$confirm('确认删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await Api.deleteChild({ firstLevelId: row.firstLevelId, id: row.id, level: row.level })
      this.activeRow = {}
      this.$message.success('操作成功')
      this.refresh()
    },
    //获取子数据
    async childList(id) {
      const res = await Api.childList(id)
      const cloneData = _.cloneDeep(res.data)
      this.tableData = toTree(cloneData)
    },
    //点击根目录
    changeDocument(document) {
      this.document = document
      this.activeRow = {}
      this.activeDocumentId = document.id
      this.activeDocumentName = document.name
      this.childList(document.id)
    },
    //添加子集
    showSubDialog() {
      this.activeId = null
      this.pid = this.activeRow.id
      this.level = 3
      this.addVisible = true
    },
    //新增文件
    showSubAddDialog() {
      this.activeId = null
      this.activeName = ''
      this.level = 2
      this.pid = this.document.id
      this.addVisible = true
    },
    //修改根目录
    showRootUpdateDialog(e, row) {
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
      this.activeId = row.id
      this.activeName = row.name
      this.level = row.level
      this.addVisible = true
    },
    //修改子集
    showSubUpdateDialog(row) {
      this.pid = row.pid
      this.activeId = row.id
      this.activeName = row.name
      this.level = row.level
      this.activeFile = row.fileIds
      this.addVisible = true
    },
    //跳转详情
    toDetail(row) {
      this.$router.push({
        name: `DocumentManageDetailEpcPpp`,
        params: { id: row.id, fileIds: row.fileIds, name: row.name, fileName: this.activeDocumentName }
      })
    },
    //点击当前行
    changeRow({ row }) {
      row.level === 2 ? (this.activeRow = row) : (this.activeRow = {})
    }
  }
}
</script>

<style scoped lang="less">
div.wrap {
  padding: 0;
  header {
    padding: 10px;
  }
}
div.container {
  display: flex;
  height: calc(100vh - 150px);
  overflow: hidden;
  .slide {
    flex: 0 0 300px;
    /deep/ .el-card__body {
      height: 100%;
      padding: 0;
    }
    ul {
      height: 100%;
      overflow: auto;
      li {
        position: relative;
        padding: 10px 10px 10px 20px;
        cursor: pointer;
        border-left: 5px solid transparent;
        &:hover {
          transition: all ease 0.5s;
          //background: #f0f0f0;
        }
        &:after {
          position: absolute;
          bottom: -1px;
          padding: 0 10px;
          left: 10px;
          right: 10px;
          content: '';
          background: #f0f0f0;
          height: 1px;
        }
        &.active {
          transition: all ease 0.4s;
          //background: #f0f0f0;
          color: #409eff;
          border-left: 5px solid #409eff;
          //&:after {
          //  height: 0;
          //}
        }
        .name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap;
          > div {
            flex: 0 0 120px;
            margin-left: 4px;
          }
          > span {
            flex: 1;
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .desc {
          margin-top: 4px;
          font-size: 12px;
          color: #8f8f8f;
          span + span {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .content {
    flex: 1;
    width: calc(100% - 20px);
    overflow: hidden;
    .model {
      height: 500px;
    }
    .detail {
      margin-top: 20px;
      background: #fff;
    }
  }
}
</style>
