<!--
* @任务编号:vx-grid废弃api替换
* @开发人员:张龙
* @日期:2020-03-18
* @任务类型: 修改代码
-->
<template>
  <div class="container">
    <vxe-grid
      ref="vxeTable"
      :max-height="maxHeight"
      :max-width="maxWidth"
      align="center"
      :show-overflow="showOverflow"
      :show-header-overflow="showHeaderOverflow"
      highlight-hover-row
      :resizable="resizable"
      :data="tableData"
      :columns="columns"
      column-min-width="140px"
      :row-id="rowId"
      :checkbox-config="{ checkRowKeys, highlight: true }"
      :edit-config="{ trigger: 'click', mode: 'row' }"
      :edit-rules="validRules"
      :show-footer="showFooter"
      :footer-method="footerMethod"
      :footer-span-method="footerColspanMethod"
      :border="border"
      @select-change="selectionChange"
      @checkbox-all="selectionChange"
      @radio-change="radioChange"
    >
      <slot></slot>
    </vxe-grid>
    <!--分页栏-->
    <div v-if="pageShow" class="toolbar">
      <div class="num">
        共 {{ total }} 条记录 第 {{ pageQuery.page }} / {{ total ? Math.ceil(total / pageQuery.rows) : 1 }} 页
        <el-button type="text primary" class="el-icon-refresh" style="font-size: 16px" @click="update"></el-button>
      </div>
      <el-pagination
        :page-sizes="pageSizes"
        class="pagination"
        :layout="layout"
        :total="total"
        :current-page.sync="pageQuery.page"
        :page-size="pageQuery.rows"
        @current-change="pageChange"
        @size-change="sizeChange"
      />
    </div>
  </div>
</template>
<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'SrmTable',
  props: {
    // 是否显示page组件
    pageShow: {
      type: Boolean,
      default: true
    },
    showOverflow: {
      type: Boolean,
      default: true
      //内容较长，不易展示
    },
    showHeaderOverflow: {
      type: Boolean,
      default: true
      //内容较长，不易展示
    },
    //是否可拖拽
    resizable: {
      type: Boolean,
      default: false
    },
    // table主键
    rowId: {},
    // 列表数据
    tableData: {
      type: Array,
      required: true
    },
    // 数据总数
    total: {
      type: Number,
      default: 0
    },
    // 定义列
    columns: {
      type: Array
    },
    // 是否加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 是否可选择行
    selectVisible: {
      type: Boolean,
      default: true
    },
    // 分页查询参数
    pageQuery: {
      type: Object,
      default: () => ({
        page: 1,
        rows: 10
      })
    },
    // 每页条数选择器
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    },
    // 最大高度
    maxHeight: {},
    maxWidth: {},
    //校验规则
    validRules: {},
    //判断是否是编辑表格
    isEdit: {
      type: Boolean,
      default: false
    },
    checkRowKeys: {
      type: Array,
      default: () => []
    },
    //是否显示表尾
    showFooter: {
      type: Boolean,
      default: false
    },
    //表尾配置参数
    footerMethod: {
      type: Function
    },
    //是否显示边框
    border: {
      type: Boolean,
      default: true
    },
    footerColspanMethod: {}
  },
  data() {
    return {
      downloadLoading: false,
      // 当前选择项的集合
      selections: []
    }
  },
  computed: {
    layout() {
      const layout = ['prev', 'pager', 'next', 'sizes', 'jumper']

      return layout.join(', ')
    }
  },
  watch: {
    tableData: function (val) {
      !this.isEdit && scrollTo(0, 0)
    }
  },
  methods: {
    setSelection(rows, checked) {
      this.$refs.vxeTable.setSelection(rows, checked)
    },
    setAllSelection(flag) {
      this.$refs.vxeTable.setAllSelection(flag)
    },
    // 已选项
    selectionChange(selections) {
      this.selections = selections
      this.$emit('selectionChange', selections.selection)
    },
    //单选
    radioChange(table) {
      this.$emit('radioChange', table.row)
    },
    // 切换页面
    pageChange(page) {
      this.$emit('pageChange', page)
    },
    sizeChange(size) {
      this.$emit('sizeChange', size)
    },
    setAttrs(params) {
      // eslint-disable-next-line
      const { slot, ...options } = params
      if (!options.align) {
        options.align = 'center'
      }
      return { ...options }
    },
    update() {
      this.$emit('getList')
    }
  }
}
</script>
<style lang="scss" scoped>
.table-img {
  cursor: pointer;
}
.toolbar {
  margin-top: 15px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .num {
    font-size: 13px;
    color: #606266;
    // width: 30%;
  }
  .pagination {
    margin-top: 0;
    // width: 70%;
  }
  .handle-wrap {
    position: absolute;
    left: 0;
  }
}
.handle-wrap {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 15px;
}
* + .table-export_btn {
  margin-left: 15px;
}
</style>
<style>
.el-pagination__jump {
  margin-left: 0;
}
</style>
