<template>
  <div>
    <p class="header">
      <span>项目建设期利息明细表</span>
      <span>单位:元</span>
    </p>
    <vxe-table :edit-config="editable ? { trigger: 'click', mode: 'row' } : false" auto-resize :data="list">
      <vxe-table-column title="序号" type="seq" width="60"></vxe-table-column>
      <vxe-table-column title="内容" field="type" :formatter="confirmationInterestTypeFormatter"></vxe-table-column>
      <vxe-table-column
        title="融贷金额"
        field="creditAmount"
        :edit-render="{ name: '$input', props: { type: 'float', digits: 2 } }"
      ></vxe-table-column>
      <vxe-table-column
        title="确认工程费和工程建设费总额"
        field="totalAmount"
        :edit-render="{ name: '$input', props: { type: 'float', digits: 2 } }"
      ></vxe-table-column>
      <vxe-table-column
        title="确认计息投资额"
        field="investAmount"
        :edit-render="{ name: '$input', props: { type: 'float', digits: 2 } }"
      ></vxe-table-column>
      <vxe-table-column title="年利率" field="annualInterestRate" :edit-render="{ autofocus: '.vxe-input--inner' }">
        <template #edit="{ row }">
          <vxe-input v-model="row.annualInterestRate" type="number"></vxe-input>
        </template>
        <template #default="{ row }">{{ row.annualInterestRate }}{{ row.annualInterestRate ? '%' : '' }}</template>
      </vxe-table-column>
      <vxe-table-column
        width="200"
        title="计息周期"
        field="interestPeriodArray"
        :edit-render="{ name: 'ElDatePicker', props: { type: 'daterange', valueFormat: 'yyyy-MM-dd' } }"
      ></vxe-table-column>
      <vxe-table-column title="计息天数" width="80" field="interestDays">
        <template #default="{ row }">
          {{ moment(row.interestPeriodArray[1]).diff(row.interestPeriodArray[0], 'days') }}
        </template>
      </vxe-table-column>
      <vxe-table-column
        title="利息"
        field="interest"
        :edit-render="{ name: '$input', props: { type: 'float', digits: 2 } }"
      ></vxe-table-column>
      <vxe-table-column title="备注" field="remark" :edit-render="{ name: '$input' }"></vxe-table-column>
    </vxe-table>
  </div>
</template>

<script>
import { confirmationInterestTypeFormatter } from '../lib/confirmationInterestTypeList'

export default {
  name: 'Interest',
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
    confirmationInterestTypeFormatter
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
</style>
