<template>
  <el-dialog
    top="10vh"
    :title="`添加角色（${selectUserIds.length}/${max}）`"
    width="50%"
    append-to-body
    :visible.sync="modalStatus"
  >
    <el-form ref="formRef">
      <el-form-item v-if="selectUserIds.length > 0" label="已选角色">
        <div class="tags">
          <template v-for="(item, i) in selectUserList">
            <el-tag :key="i" size="small" closable @close="deleteUser(item, i)">{{ item.name }}</el-tag>
          </template>
        </div>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filterText" placeholder="请输入关键字"> </el-input>
      </el-form-item>
      <el-form-item>
        <div class="tree-roll">
          <el-tree
            ref="treeRef"
            :data="list"
            show-checkbox
            node-key="id"
            default-expand-all
            :filter-node-method="filterNode"
            @check="changeTree"
          ></el-tree>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modalStatus = false">取 消</el-button>
      <el-button type="primary" @click="saveModal()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'SelectRole',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: [Array, String, Number],
    disableKeys: Array,
    disabled: {
      type: Boolean,
      default: false
    },
    alwaysOpen: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 最多选择20人
    max: {
      type: Number,
      default: 20
    }
  },
  data() {
    //这里存放数据
    return {
      modalStatus: false,
      filterText: '', // 筛选关键词
      selectUserIds: [], // 选择的用户id
      selectUserList: [], // 选择的用户列表
      treeCheckedKeys: [] // 选中的树key
    }
  },
  computed: {
    list() {
      let data = _.cloneDeep(this.$store.state.workflow.roleList).filter(e => _.size(e.children))
      treeForEach(data, e => {
        e.label = e.name
        e.id = e.id
        e.isUser = e.type === 2
        e.disabled = e.type !== 2 // 禁止部门选中事件
        if (e.isUser) {
          delete e.children
        }
      })
      if (_.size(_.chunk(this.disableKeys))) {
        data = _.cloneDeep(data)
        treeForEach(data, e => (e.isDisabled = this.disableKeys.includes(e.id)))
      }
      return [...data]
    }
  },
  watch: {
    modalStatus(val) {
      if (!val) {
        return
      }
      let ids = _.map(this.value, 'id')
      this.selectUserIds = ids
      this.selectUserList = _.cloneDeep(this.value)
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys(ids)
      })
    },
    filterText(val) {
      this.$refs.treeRef.filter(val)
    }
  },
  created() {
    this.$store.dispatch('getDepartmentUserList')
  },
  //方法集合
  methods: {
    // 筛选
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 选择用户
    changeTree(e, { checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys }) {
      // console.log('选择用户', e, checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys)
      let selectUserIds = []
      let selectUserList = []
      checkedNodes.map(item => {
        if (item.type === 2 && !selectUserIds.includes(item.id)) {
          selectUserIds.push(item.id)
          selectUserList.push(item)
        }
      })
      // 达到最多选择人数拦截操作
      if (selectUserIds.length > this.max) {
        this.$message.error(`最多选择 ${this.max} 个角色！`)
        this.$nextTick(() => {
          this.$refs.treeRef.setChecked(e.id, false)
        })
        return
      }
      this.selectUserIds = selectUserIds
      this.selectUserList = selectUserList
    },
    // 删除用户
    deleteUser(item, index) {
      this.selectUserIds.splice(index, 1)
      this.selectUserList.splice(index, 1)
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys(this.selectUserIds)
      })
    },
    // 确定
    saveModal() {
      this.$emit('change', this.selectUserList)
      this.modalStatus = false
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
@import url('./tree.less');
/deep/.el-form-item {
  border-bottom: 1px #eee solid;
  margin-bottom: 15px;
  padding-bottom: 15px;
}
.tree-roll {
  max-height: 400px;
  overflow-y: auto;
  .scrollbar;
}
.tags {
  .el-tag {
    margin-right: 10px;
  }
}
/deep/.el-checkbox.is-disabled {
  display: none;
}
</style>
