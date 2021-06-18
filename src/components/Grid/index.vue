<template>
  <div class="container">
    <vxe-grid
      ref="xTable"
      v-loading="loading"
      v-bind="$attrs"
      :size="size"
      :row-key="rowKey"
      :show-overflow="showOverflow"
      :show-header-overflow="showHeaderOverflow"
      :highlight-hover-row="highlightHoverRow"
      :highlight-current-row="highlightCurrentRow"
      :tree-config="treeConfig"
      :align="align"
      :columns="columns"
      :max-height="maxHeight"
      column-min-width="140px"
      :seq-config="{ startIndex: (pagination.pageNum - 1) * pagination.pageSize }"
      :radio-config="customRadioConfig"
      :checkbox-config="checkboxConfig"
      :data="list"
      :row-id="rowId"
      @checkbox-change="checkChange"
      @checkbox-all="checkChange"
      @current-change="obj => $emit('currentChange', obj)"
      @radio-change="obj => $emit('radioChange', obj)"
    >
      <!-- :radio-config="{ checkRowKey }" -->
      <slot />
    </vxe-grid>
    <div v-if="pagination" class="page-wrap">
      <span>
        共 {{ total }} 条记录 第 {{ pagination.page }} / {{ total ? Math.ceil(total / pagination.rows) : 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" @click="() => refresh()"></el-button>
      </span>
      <el-pagination
        :total="total"
        :page-size.sync="pagination.rows"
        :current-page.sync="pagination.page"
        layout="prev, pager, next, sizes, jumper"
        @current-change="refresh(false)"
        @size-change="refresh"
      />
    </div>
  </div>
</template>
<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Grid',
  props: {
    align: {
      type: String,
      default: 'center'
    },
    rowId: {
      type: String,
      default: 'id'
    },
    // 是否立即刷新列表
    immediate: {
      type: Boolean,
      default: true
    },
    request: Function,
    filterForm: {
      type: Object,
      default() {
        return {}
      }
    },
    showOverflow: {
      type: Boolean,
      default: true
      //内容较长，不易展示
    },
    highlightHoverRow: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'mini'
    },
    showHeaderOverflow: {
      type: [String, Boolean],
      default: 'title'
    },
    pagination: {
      type: [Object, Boolean],
      default() {
        return {
          page: 1,
          rows: 10
        }
      }
    },
    pageUseQuery: {
      type: Boolean,
      default: false
    },
    autoSearch: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    checkRowKeys: {},
    // 最大高度
    maxHeight: {},
    spanMethod: {},
    checkRowKey: {},
    radioConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    treeConfig: {
      default: () => {}
    },
    checkboxConfig: {
      type: Object,
      default() {
        return { checkRowKeys: this.checkRowKeys, highlight: true, reserve: true, range: true }
      }
    },
    rowKey: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      customRadioConfig: Object.assign({}, this.radioConfig, this.checkRowKey)
    }
  },
  watch: {
    tableData: function () {
      scrollTo(0, 0)
    },
    filterForm: {
      deep: true,
      handler() {
        this.filterFormChanged = true
        if (this.autoSearch) {
          this.refresh()
        }
      }
    },
    pagination: {
      deep: true,
      handler({ page, rows }) {
        if (this.pageUseQuery) {
          this.$router.replace({ query: { ...this.$route.query, page, rows } }).catch(err => {
            console.log(err)
          })
        }
      }
    }
  },
  created() {
    if (this.pageUseQuery && this.pagination) {
      if (this.$route.query.page) this.pagination.page = +this.$route.query.page
      if (this.$route.query.rows) this.pagination.rows = +this.$route.query.rows
    }
    this.initFilterForm = _.cloneDeep(this.filterForm)
    if (this.request && this.immediate) {
      this.refresh()
    }
  },
  methods: {
    refresh(changedJumpToFirst = true) {
      this.loading = true
      let body = _.cloneDeep(this.filterForm)
      if (this.pagination) Object.assign(body, this.pagination)
      if (this.filterFormChanged && changedJumpToFirst) {
        if (this.pagination) {
          this.pagination.page = 1
        }

        this.filterFormChanged = false
      }
      return this.request(body)
        .then(res => {
          if (res.data) {
            res = res.data
          }
          if (this.pagination) {
            const { total, records, list } = res

            this.total = total
            this.list = records || list
          } else {
            this.list = res
            this.total = res.length
          }
          // this.$refs.xTable.setAllCheckboxRow(false)
          this.$emit('checkboxChange', { selection: [] })
          this.$emit('radioChange', { row: null })
          this.$emit('change', this.list)
          if (this.checkRowKey) {
            this.setRadioData()
          }
          if (_.size(this.checkRowKeys)) {
            this.setSelectData()
          }
        })
        .finally(() => (this.loading = false))
    },
    async reset() {
      if (this.pagination) {
        this.pagination.page = 1
      }
      this.$emit('update:filterForm', _.cloneDeep(this.initFilterForm))
      await this.$nextTick()
      this.refresh()
    },
    setSelectData() {
      this.$emit(
        'checkboxChange',
        this.list.filter(r => this.checkRowKeys.includes(r.id))
      )
    },
    setRadioData() {
      this.$emit('radioChange', { row: this.list.find(r => this.checkRowKey === r.id) })
    },
    checkChange(selections) {
      const check = this.$refs.xTable.getCheckboxReserveRecords()
      this.$emit('checkboxChange', [...selections.selection, ...check])
    }
  }
}
</script>
<style lang="less" scoped>
.page-wrap {
  display: flex;
  justify-content: space-between;
  align-content: center;
  margin-top: 12px;
  padding-bottom: 12px;

  .el-button {
    padding-top: 0;
    padding-bottom: 0;
  }
  > span {
    color: #888;
    font-size: 14px;
    line-height: 32px;

    .el-button {
      margin-left: 5px;
      transform: scale(1.4);
    }
  }
}

.el-pagination {
  padding-right: 0;
  text-align: right;
  > span {
    color: #888;
    font-size: 14px;

    .el-button {
      margin-left: 5px;
      transform: scale(1.5);
    }
  }
  /deep/ .el-pagination__sizes {
    margin-right: 0;
  }
  /deep/ .el-select .el-input {
    margin-right: 0;
  }
  /deep/ .el-pagination__jump {
    margin-left: 10px;
  }
}
</style>
