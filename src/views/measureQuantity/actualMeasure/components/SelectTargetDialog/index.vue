<template>
  <el-dialog
    width="800px"
    :modal="true"
    top="10vh"
    title="选择分项工程"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
  >
    <el-tree :expand-on-click-node="false" default-expand-all show-checkbox :data="treeData" />
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectProjectDialog',
  props: {
    visible: {}
  },
  data() {
    return {
      treeData: [
        {
          label: 'XX施工总进度计划',
          children: [
            {
              label: '2019年度计划',
              children: [
                {
                  label: '2019年1月计划'
                },
                {
                  label: '2019年2月计划'
                }
              ]
            },
            {
              label: '2020年度计划',
              children: [
                {
                  label: '2020年1月计划'
                },
                {
                  label: '2020年2月计划'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$message.success('操作成功')
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped></style>
