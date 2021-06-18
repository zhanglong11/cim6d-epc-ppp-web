<template>
  <div :id="guid" class="select-user" @click.stop>
    <!-- 输入框 start -->
    <div class="el-input el-input--small" :class="{ 'is-disabled': disabled }" @click="handleSetInputFocus">
      <div class="el-input__inner">
        <span v-if="selectVal.length == 0 && !visible" class="palceholder">请选择</span>
        <el-tag v-for="tag in selectVal" v-else :key="tag.id" :closable="!disabled" @close="handleCloseTag(tag)">
          {{ tag.label }}
        </el-tag>
        <el-input ref="searchInput" v-model.trim="keyword" class="search"></el-input>
      </div>
    </div>
    <!-- 弹出层 -->
    <div v-show="visible" class="list-wrapper" :class="listClass">
      <div class="checkAll">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
          >全选</el-checkbox
        >
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item in treeData" :key="item.id" :name="item.id">
          <template slot="title">
            <i class="header-icon el-icon-caret-right">{{ item.label }}</i>
          </template>

          <div v-if="item.children && item.children.length" class="el-checkbox-group">
            <el-checkbox
              v-for="subItem in item.children"
              :key="subItem.id"
              :label="subItem.id"
              :value="_.findIndex(selectVal, { id: subItem.id }) > -1"
              @change="handleCheckBoxChange(subItem)"
              >{{ subItem.label }}</el-checkbox
            >
          </div>

          <span v-else>没有选项...</span>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectUser',

  props: {
    guid: {
      type: String,
      defalut: ''
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    },
    /**
     * 可以选择的人员id列表， ，号连起来的字符串
     */
    canChooseUserIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: '',
      selectVal: [],
      visible: false,
      checkAll: false,
      isIndeterminate: false,
      totalTreeData: [], //所有数据
      treeData: [], //展示出来的tree数据，用来区分搜索功能
      totalLabourList: [], //所有劳务人员
      labourlist: [],
      activeNames: [], //展开的公司
      listClass: {
        top: false
      }
    }
  },

  watch: {
    value(val) {
      let list = (val || '').split(',')
      this.selectVal = _.filter(this.totalLabourList, e => list.includes(e.id))
    },
    canChooseUserIds(val) {
      this.filterAvalidTreeData()
    },

    selectVal: {
      handler(val) {
        this.checkAll = Boolean(val.length === this.labourlist.length && this.labourlist.length)
        this.isIndeterminate = Boolean(val.length !== this.labourlist.length && val.length)
      },
      deep: true,
      immediate: true
    },
    labourlist: {
      handler(val) {
        this.checkAll = Boolean(this.selectVal.length === val.length && val.length)
        this.isIndeterminate = Boolean(this.selectVal.length !== val.length && this.selectVal.length)
      },
      deep: true,
      immediate: true
    },
    keyword(val) {
      if (val) {
        this.labourlist = _.filter(this.totalLabourList, e => e.label.toLowerCase().includes(val.toLowerCase()))
        let matchedInfo = _.map(this.totalTreeData, e => {
          let obj = _.cloneDeep(e)
          obj.children = _.filter([...e.children], f => f.label.toLowerCase().includes(val.toLowerCase()))
          return obj
        })
        this.treeData = _.filter(matchedInfo, e => e.children && e.children.length)
        this.activeNames = _.map(this.treeData, 'id')
      } else {
        this.treeData = [...this.totalTreeData]
        this.labourlist = [...this.totalLabourList]
        this.activeNames = []
      }
    }
  },
  created() {
    // 查询公司树下在职状态的员工
    this.axios.labour
      .post('company/tree', {
        projectId: localStorage.getItem('projectId'),
        jobStatus: 'jobStatus_1'
      })
      .then(res => {
        res.data.forEach(e => {
          e.label = e.labourCompanyName
          e.id = e.labourCompanyId
          if (e.list) {
            e.list.forEach(f => {
              f.label = f.labourEmployeeName
              f.id = f.labourEmployeeId
            })
            e.children = e.list
            this.totalLabourList.push(...e.children)
          } else {
            e.children = []
          }
        })
        this.totalTreeData = _.filter(res.data, item => item.children && item.children.length)
        this.labourlist = [...this.totalLabourList]
        this.filterAvalidTreeData()
        //初始化选中项
        this.selectVal = _.filter(this.totalLabourList, e => (this.value || '').includes(e.id))
      })
  },
  methods: {
    // 定位弹出层位置
    setPostionInfo() {
      let doc = document.documentElement.clientHeight
      let ele = document.getElementById(this.guid)
      let top = ele.getBoundingClientRect().top //组件距离顶部的距离
      let height = ele.clientHeight
      let avalidHeight = Math.floor(doc - top - height)
      this.listClass.top = avalidHeight < 240
      console.log(avalidHeight, this.listClass.top)
    },
    // 通过canChooseUserIds 过滤树状图
    filterAvalidTreeData() {
      if (this.canChooseUserIds) {
        let matchedInfo = _.map(this.totalTreeData, item => {
          let obj = _.cloneDeep(item)
          obj.children = _.filter([...item.children], f => this.canChooseUserIds.includes(f.id))
          return obj
        })
        this.treeData = _.filter(matchedInfo, e => e.children && e.children.length)
      } else {
        this.treeData = [...this.totalTreeData]
      }
    },
    // 关闭当前selectUser 弹出层
    close() {
      this.visible = false
    },
    // 设置input 获取焦点，显示下拉弹出层，并关闭自身之外的其他弹层
    handleSetInputFocus() {
      if (this.disabled) return
      this.setPostionInfo()
      this.$emit('close-other', this.guid)
      this.$refs.searchInput.focus()
      this.visible = true
    },
    // 点击input中的tag删除对应项
    handleCloseTag(tag) {
      this.selectVal = _.filter([...this.selectVal], e => e.id !== tag.id)
    },
    // 选中单个checkbox
    handleCheckBoxChange(item) {
      let checked = _.find(this.selectVal, { id: item.id }) ? true : false
      if (!checked) {
        this.selectVal.push(item)
      } else {
        this.selectVal = _.filter(_.cloneDeep(this.selectVal), e => e.id !== item.id)
      }
      this.$emit('update:value', _.map(this.selectVal, 'id').join(','))
    },
    // 全选状态发生改变--ok
    handleCheckAllChange(value) {
      this.selectVal = value ? [...this.labourlist] : []
      this.$emit('update:value', _.map(this.selectVal, 'id').join(','))
    }
  }
}
</script>

<style lang="less" scoped>
.select-user {
  position: relative;
  cursor: pointer;

  .placeholder {
    color: #a7a7a7;
  }

  .el-tag {
    margin: 0 10px 0 0;
    pointer-events: auto;
  }
  .el-input__inner {
    height: auto;
    min-height: 32px;
    max-height: 100px;
    overflow-y: auto;
    vertical-align: top;
  }
  .search {
    display: inline-block;
    width: auto;
    min-width: 20px;
    max-width: 100%;
    /deep/ .el-input__inner {
      border: none;
      padding: 0 5px;
      background-color: transparent !important;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #dcdfe6;
    border-top: none;
    background-color: #fff;
    border-radius: 4px;
    z-index: 100;
    max-height: 240px;
    overflow-y: auto;
    &.top {
      top: auto;
      bottom: 100%;
      border-top: 1px solid #dcdfe6;
      border-bottom: none;
    }

    .checkAll {
      padding: 0 15px 0 30px;
    }

    .el-collapse-item,
    /deep/ .el-collapse-item__wrap {
      padding: 0 15px;
    }
  }
}

.el-collapse {
  border-top: none;

  .header-icon {
    font-size: 16px;
  }

  .el-checkbox {
    width: 30%;
    margin-right: 0;
    padding-right: 15px;
  }

  /deep/ .el-collapse-item__header {
    height: 35px;
    line-height: 35px;
    border-bottom: none;
  }

  /deep/ .el-collapse-item__wrap {
    border-bottom: none;
  }

  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }

  /deep/ .el-collapse-item__arrow {
    display: none;
  }
}
</style>
