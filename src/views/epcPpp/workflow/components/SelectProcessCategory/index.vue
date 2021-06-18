<template>
  <TreeSelect
    :value="value || null"
    :options="computedList"
    label="name"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    placeholder="请选择"
    :alwaysOpen="alwaysOpen"
    :appendToBody="appendToBody"
    :multiple="multiple"
    flat
    style="width: 200px"
    :disabled="disabled || (elForm || {}).disabled"
    @input="val => $emit('input', val || 0)"
  />
</template>

<script>
import treeForEach from '@/utils/treeForEach'
import treeFilter from '@/utils/treeFilter'
export default {
  name: 'SelectProcessCategory',
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
    disableKeys: {
      type: Array,
      default() {
        return []
      }
    },
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
    valueKey: {
      type: String,
      default: 'argCode' //  pid 使用 id， 其它分类使用argCode
    }
  },
  computed: {
    computedList() {
      let data = _.cloneDeep(this.$store.state.workflow.processCategoryTree)
      treeForEach(data, e => {
        e.id = e[this.valueKey]
        e.label = e.argText
        if (this.disableKeys.includes(e.id)) {
          delete e.children
        }
      })
      return treeFilter(data, e => !this.disableKeys.includes(e.id))
    }
  },
  created() {
    if (this.computedList.length === 0) {
    }
  }
}
</script>
<style>
.vue-treeselect {
  line-height: 18px;
}
</style>
