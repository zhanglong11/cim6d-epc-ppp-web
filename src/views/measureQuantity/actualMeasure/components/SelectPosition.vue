<template>
  <TreeSelect
    :value="value"
    :options="treeData"
    label="name"
    flat
    :defaultExpandLevel="Infinity"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    :disabled="disabled || (elForm || {}).disabled"
    placeholder="请选择"
    @select="handleSelect"
  >
    <div slot="value-label" slot-scope="{ node }">{{ node.raw.ancestorNames.concat([node.label]).join('') }}</div>
  </TreeSelect>
</template>

<script>
import toTree from '@/utils/toTree'
import treeForEach from '@/utils/treeForEach'
export default {
  name: 'SelectPosition',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    value: [String, Number, Array, Object],
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  created() {
    this.axios.construction.get('constructionDrawingLibrary/tree/' + localStorage.getItem('projectId')).then(res => {
      treeForEach(res.data, node => {
        node.isDisabled = node.type !== 5
        if (_.isEmpty(node.children)) {
          delete node.children
        }
      })
      this.treeData = toTree(res.data)
      console.log(res.data)
    })
  },
  methods: {
    handleSelect(node) {
      this.$emit('input', node.id)
      this.$emit('change', node)
    }
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
