<template>
  <TreeSelect
    :value="value"
    :options="treeData"
    :multiple="multiple"
    :valueFormat="valueFormat"
    loading-text="加载中..."
    :appendToBody="appendToBody"
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    no-children-text="没有子项了"
    :disabled="disabled || (elForm || {}).disabled"
    placeholder="请选择"
    disable-branch-nodes
    :clearable="clearable"
    :append-to-body="appendToBody"
    @close="
      val => {
        $emit('close', val)
      }
    "
    @select="
      node => {
        if (!multiple) {
          $emit('update:id', node.id)
          $emit('update:name', node.label)
          $emit('update:departId', node.organId)
          $emit('update:departName', node.organName)
          $emit('update:mobile', node.mobile)
          $emit('change', node)
        }
      }
    "
    @input="
      val => {
        $emit('input', val)
        if (multiple) {
          $emit('update:id', val && val.map(item => item.id).join(','))
          $emit('update:name', val && val.map(item => item.label).join(','))
        }
        if (!multiple && !val) {
          $emit('update:id', '')
          $emit('update:name', '')
        }
      }
    "
  />
</template>

<script>
import treeFilter from '@/utils/treeFilter'
export default {
  name: 'SelectUser',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: true
    },
    value: [String, Number, Array, Object],
    disabled: {
      type: Boolean,
      default: false
    },
    valueFormat: {
      type: String,
      default: 'object',
      enum: ['id', 'object']
    },
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    // 需要显示的人员角色类型
    roles: {
      type: Array,
      default: null
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    treeData() {
      let departmentUserList = _.cloneDeep(this.$store.state.departmentUserList)
      if (this.roles) {
        departmentUserList = treeFilter(departmentUserList, item => this.roles.includes(item.roleName))
      }
      if (this.disableKeys.length) {
        departmentUserList = treeFilter(departmentUserList, item => !this.disableKeys.includes(item.id))
      }
      return departmentUserList
    }
  },
  created() {
    !this.treeData.length && this.$store.dispatch('getDepartmentUserList', this.keyWords)
  }
}
</script>
<style lang="less">
.vue-treeselect {
  display: inline-block;
  width: 100%;
  font-size: unset;
}
.el-form--inline {
  .vue-treeselect {
    width: 215px;
  }
}
</style>
