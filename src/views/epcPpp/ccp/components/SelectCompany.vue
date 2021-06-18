<template>
  <TreeSelect
    :value="value"
    :options="list"
    :multiple="multiple"
    :valueFormat="valueFormat"
    :defaultExpandLevel="1"
    loading-text="加载中..."
    no-options-text="没有选项..."
    no-results-text="没有匹配的选项..."
    noChildrenText="没有子项了"
    placeholder="请选择"
    style="width: 100%"
    flat
    @input="
      val => {
        $emit('input', val)
      }
    "
    @select="
      node => {
        $emit('update:id', node && node.id)
        $emit('update:name', node && node.label)
        $emit('update:companyName', node && node.participantCompanyName)
        $emit('update:companyId', node && node.participantCompanyId)
      }
    "
  />
</template>

<script>
import treeFilter from '@/utils/treeFilter'
import treeForEach from '@/utils/treeForEach'
import api from '@/api'
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
      default: false
    },
    value: [String, Number, Array, Object],
    valueFormat: {
      type: String,
      default: 'object',
      enum: ['id', 'object']
    }
  },
  data() {
    return {
      list: []
    }
  },
  async created() {
    let data = await api.getCompanyListByProjectId(localStorage.getItem('projectId')).then(res => res.data)
    data.forEach(e => {
      e.children = e.participantCompanyList
      e.isDisabled = true
    })
    treeForEach(data, e => {
      e.label = e.name || e.participantTypeName
    })
    this.list = data
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
