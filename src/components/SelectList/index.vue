<template>
  <el-select
    :value="value"
    :clearable="clearable"
    :multiple="multiple"
    :disabled="disabled"
    style="width: 100%"
    :filterable="filterable"
    :filter-method="filterMethod"
    @change="handleList"
  >
    <el-option v-if="hasAllOption" key="all" :value="null" label="全部"></el-option>
    <el-option
      v-for="item in selfList || selectList"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    ></el-option>
  </el-select>
</template>

<script>
import paramList from '@/lib/paramList'
export default {
  name: 'SelectList', //设备状态
  props: {
    value: {},
    clearable: {
      type: Boolean,
      default: true
    },
    hasAllOption: {
      type: Boolean,
      default: true
    },
    type: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    propsSelect: {
      type: Object,
      default() {
        return { val: 'value', label: 'label' }
      }
    },
    // 自定义list
    selfList: {
      type: Array
    },
    // 是否可进行搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 自定义搜索方法，默认匹配label
    filterMethod: {
      type: Function
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    selectList() {
      return (
        this.selfList ||
        this.list.map(l => {
          l.value = l[this.propsSelect.val]
          l.label = l[this.propsSelect.label]
          return l
        })
      )
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      if (this.url) {
        const res = await this.axios.post(`${this.url}`, {})
        this.list = _.isArray(res.data) ? res.data : res.data.list
      } else {
        this.list = paramList[this.type]
      }
    },
    handleList(node) {
      this.$emit('input', node)
      let label = this.selectList
        .filter(l => (this.multiple ? node.includes(l.value) : node === l.value))
        .map(l => l.label)
      this.$emit('getLabel', label)
      this.$emit('change', node, label)
    }
  }
}
</script>

<style scoped></style>
