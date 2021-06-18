<template>
  <el-dialog width="500px" title="测量记录" :visible="visible" @close="$emit('update:visible', false)">
    <VXTable ref="table" :columns="tableColumns" :tableData="tableLists" :pageShow="pageShow" />
  </el-dialog>
</template>

<script>
import Api from '@/views/measureQuantity/api/measure'
export default {
  name: 'RecordDialog',

  props: {
    recordId: {
      type: String,
      default: ''
    },
    visible: {}
  },
  data() {
    return {
      pageShow: false,
      // 表格表头
      tableColumns: [
        { type: 'seq', title: '序号', width: 80 },

        {
          field: 'measureValue',
          title: '测量值'
        },
        {
          field: 'measureTime',
          title: '测量时间'
        },
        {
          field: 'measurerName',
          title: '测量人'
        }
      ],
      tableLists: []
    }
  },
  watch: {
    recordId: function (val) {
      this.getDetailInfo(val)
    }
  },
  methods: {
    async getDetailInfo(id) {
      let res = await Api.getDetailInfo(id)
      this.tableLists = res.data || []
    }
  }
}
</script>

<style scoped lang="less">
.description {
  li {
    > span {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      &:first-child {
        width: 80px;
        font-weight: bold;
      }
    }
  }
}
</style>
