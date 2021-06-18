<template>
  <TreeSelect
    :value="value"
    :options="list"
    label="name"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    placeholder="请选择"
    :alwaysOpen="alwaysOpen"
    :appendToBody="appendToBody"
    :multiple="multiple"
    flat
    disable-branch-nodes
    :disabled="disabled || (elForm || {}).disabled"
    @input="val => $emit('input', val)"
  />
</template>

<script>
import treeForEach from '@/utils/treeForEach'
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
    }
  },
  computed: {
    list() {
      let data = _.cloneDeep(this.$store.state.workflow.roleList).filter(e => _.size(e.children))
      treeForEach(data, e => {
        e.label = e.name
        e.id = e.targetId
        e.isUser = e.type === 3
        if (e.isUser) delete e.children
      })
      if (_.size(_.chunk(this.disableKeys))) {
        data = _.cloneDeep(data)
        treeForEach(data, e => (e.isDisabled = this.disableKeys.includes(e.id)))
      }
      return [...data]
    }
  },
  created() {
    this.$store.dispatch('getDepartmentUserList')
  }
}
</script>
<style>
.vue-treeselect {
  line-height: 18px;
}
</style>
