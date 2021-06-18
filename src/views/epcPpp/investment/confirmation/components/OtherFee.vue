<template>
  <div>
    <p class="header">
      <span>工程建设其他费用明细表</span>
      <span>单位:元</span>
    </p>
    <vxe-table
      auto-resize
      :data="list"
      :edit-config="editable ? { trigger: 'click', mode: 'row' } : false"
      show-footer
      :footer-method="footerMethod"
    >
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column
        title="项目名称"
        field="projectName"
        v-bind="isAudit ? {} : { editRender: { name: 'input', attrs: { type: 'text' } } }"
      ></vxe-table-column>
      <vxe-table-column
        title="合同总额"
        field="contractTotal"
        v-bind="isAudit ? {} : { editRender: { name: '$input', props: { type: 'float', digits: 2 } } }"
      ></vxe-table-column>
      <vxe-table-column
        title="上期累计确认金额"
        field="previousPeriodAmount"
        v-bind="isAudit ? {} : { editRender: { name: '$input', props: { type: 'float', digits: 2 } } }"
      ></vxe-table-column>
      <vxe-table-column
        title="本期申报金额"
        field="currentPeriodDeclared"
        v-bind="isAudit ? {} : { editRender: { name: '$input', props: { type: 'float', digits: 2 } } }"
      ></vxe-table-column>
      <vxe-table-column
        title="本期审核金额"
        field="currentAuditAmount"
        v-bind="!isAudit ? {} : { editRender: { name: '$input', props: { type: 'float', digits: 2 } } }"
      ></vxe-table-column>
      <vxe-table-column title="备注" field="remark" :edit-render="{ name: '$input' }"></vxe-table-column>
      <vxe-table-column v-if="editable && !isAudit" title="操作" width="60">
        <template #default="{ rowIndex }">
          <el-button type="text" @click="list.splice(rowIndex, 1)">删除</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    <div v-if="editable && !isAudit" class="add" @click="list.push({})">新增</div>
  </div>
</template>

<script>
export default {
  name: 'OtherAmount',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    list: {
      type: Array,
      required: true
    },
    editable: {
      type: Boolean,
      default: false
    },
    //是否用于审核，只有审核相关列可以编辑，需要设置editable为true
    isAudit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 这里存放数据
    return {}
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    // 表尾合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 1) {
            return '合计'
          }
          if ([2, 3, 4, 5].includes(columnIndex)) {
            return _.sumBy(data, e => +e[column.property] || null)
          }
          return null
        })
      ]
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  border: 1px solid #e8eaec;
  border-bottom: none;
  background-color: #f8f8f9;
  line-height: 30px;
  font-size: 14px;
}
.add {
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  border: 1px solid #e8eaec;
  border-top: none;
  color: @btnPrimary;
  &:hover {
    color: lighten(@btnPrimary, 10%);
  }
  cursor: pointer;
}
</style>
