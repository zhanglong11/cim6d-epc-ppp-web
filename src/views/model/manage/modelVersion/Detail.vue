<template>
  <div class="main">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="task-list-wrap">
      <div class="aside">
        <el-card class="box-card" style="min-height: 450px">
          <div slot="header" class="clearfix">
            <span>模型列表</span>
          </div>
          <div>
            <el-tree
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="bimResourceId"
              default-expand-all
              :props="defaultProps"
            >
              <span slot-scope="{ node }" class="custom-tree-node">
                <span
                  >{{ node.label }}
                  <!--                  <span v-if="data.type === 3">{{ data.version ? '(v' + data.version + ')' : '' }}</span>-->
                </span>
              </span>
            </el-tree>
          </div>
        </el-card>
      </div>
      <div class="box-card task-list">
        <BIM ref="BIM" idSelect="modelVersionDetails" flag="version" :versionSatus="versionSatus" />
      </div>
    </div>

    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="$router.go(-1)">返回</el-button>
      <template v-else>
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
// import FileList from '@/components/FileList'
import Api from '@/api/model/modelVersion'
import treeApi from '@/api/model/tree'
import toFlat from '@/utils/toFlat'
import treeForEach from '@/utils/treeForEach'
import supplierState from '@/lib/supplier/supplierState'
export default {
  name: 'ModelVersionDetail',
  components: {
    // FileList
  },
  data() {
    return {
      // 状态列表
      stateList: supplierState,
      versionSatus: null,
      defaultProps: {},
      treeData: [],
      treeList: [],
      tableData: [],
      auditForm: {}
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    // this.getTreeData()
    this.getEntityTree(id)
    this.getModelDetail(id)
  },
  methods: {
    async getModelDetail(id) {
      let res = await Api.getVersionById(id)
      this.auditForm = res.data
      this.versionSatus =
        res.data.status !== null && res.data.status !== undefined
          ? this.stateList.filter(item => item.value === res.data.status)[0].label
          : ''
    },
    async getEntityTree(id) {
      let res = await Api.getEntityTree(id)
      let idList = []
      treeForEach(res.data, e => {
        e.label = e.bimResourceName
        e.disabled = true
        if (e.type === 3) {
          let bimResourceId = e.bimResourceId.split('_')[0]
          e.version = e.bimResourceId.split('_')[1]
          this.tableData.push(e)
        }
        idList.push(e.bimResourceId)
      })
      this.treeData = res.data
      this.$refs.tree.setCheckedKeys(idList)
    },
    /*
     * @任务编号: 2522 || 树与模型交互,切换接口
     * @开发人员:申豪强
     * @日期:2020-03-20
     * @任务类型: 新代码
     */
    async getTreeData() {
      let res = await treeApi.getProjectTreeData(localStorage.getItem('projectId'))
      this.treeData = res.data
      console.log(res.data)
      treeForEach(this.treeData, e => {
        e.label = e.bimResourceName
        e.version = e.bimResourceId.split('_')[1]
        if (e.type !== 3) {
          e.disabled = true
        }
      })
      this.treeList = toFlat(this.treeData)
      this.getVersionModelIds(this.treeList)
    },
    handleCheckChange(data, checkedNodes) {
      let list = checkedNodes.checkedNodes
      this.getVersionModelIds(list)
    },
    // 获取所选单体的数据
    getVersionModelIds(data) {
      // data:是一个一维数组
      let list = data.filter(item => item.type === 3).map(item => item.bimResourceId)
      this.$store.commit('bim/changeVersionModelIds', list)
    },
    handleCancle() {
      this.$router.back()
    },
    handleEmitForm(data) {
      if (data.result && data.desc === '') {
        return this.$message.error('请输入审核意见')
      }
      Api.updateVersion({
        ...this.auditForm,
        status: data.result ? 3 : 2,
        auditFileId: data.fileIds,
        auditOpinion: data.desc
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleSubmit() {
      this.$refs.checkCard.audit()
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less">
// 模型的容器：建议增大高度
.task-list /deep/ .el-card__body {
  height: calc(100% - 60px);
}
div.main {
  background-color: #f0f2f5;
  padding: 0;
  .task-list-wrap {
    display: flex;
    .aside {
      width: 320px;
      margin-right: 10px;
      background-color: #fff;
    }
    .task-list {
      width: calc(100% - 320px);
      min-height: 560px;
      background-color: #fff;
      .box-header {
        display: flex;
        justify-content: space-between;
        span {
          width: 50%;
        }
      }
    }
  }
}
.add-row {
  cursor: pointer;
  &:hover {
    color: #1890ff;
  }
  font-size: 14px;
  line-height: 30px;
  border: 1px dashed #ddd;
  margin-top: -1px;
  i {
    margin-right: 8px;
  }
  text-align: center;
}
.main-footer {
  text-align: right;
  z-index: 100;
  position: absolute;
  bottom: 0;
  width: calc(100% - 40px);
  background-color: #fff;
  margin-top: 15px;
  padding: 10px;
}

.checkWrapper {
  display: flex;
  .checkForm {
    flex: 1;
    .inputStyle {
      width: 500px;
    }
  }
  .checkUpload {
    flex: 1;
  }
}
/deep/ .el-upload {
  text-align: left !important;
}
</style>
