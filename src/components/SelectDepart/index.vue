<!--
 * @Description: 选择部门
 * @Version:
 * @Autor:
 * @Date: 2020-02-18 10:32:54
 * @LastEditTime: 2020-02-18 17:54:33
 -->
<template>
  <TreeSelect
    :value="value"
    :options="treeData"
    :multiple="multiple"
    :valueFormat="valueFormat"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    noChildrenText="没有子项了"
    :disabled="disabled || (elForm || {}).disabled"
    placeholder="请选择"
    style="width: 100%"
    @input="
      val => {
        $emit('input', val)
      }
    "
    @select="
      node => {
        $emit('update:id', node && node.id)
        $emit('update:label', node && node.name)
        $emit('update:name', node && node.name)
      }
    "
  />
</template>

<script>
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'SelectDepart',
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
    }
  },
  computed: {
    treeData() {
      return this.$store.state.departmentList
    }
  },
  created() {
    !this.treeData.length && this.$store.dispatch('getDepartmentList')
  }
}
</script>
<style lang="less" scoped>
.vue-treeselect {
  display: inline-block;
  width: 215px;
  font-size: unset;
}
</style>
