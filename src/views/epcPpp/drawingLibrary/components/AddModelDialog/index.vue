<template>
  <el-dialog width="1000px" top="10vh" title="新建BIM模型" :visible="visible" @close="close">
    <div class="wrap">
      <el-card class="list">
        <div slot="header">
          <span>图纸列表</span>
        </div>
        <el-tree :data="data" show-checkbox node-key="id" :props="defaultProps" />
      </el-card>
      <div class="model">
        <BIM ref="BIM" idSelect="cc" class="bim-box-progress" />
      </div>
    </div>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
export default {
  name: 'AddModelDialog',
  props: ['visible'],
  data() {
    return {
      data: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                },
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '一级 2',
          children: [
            {
              id: 5,
              label: '二级 2-1'
            },
            {
              id: 6,
              label: '二级 2-2'
            }
          ]
        },
        {
          id: 3,
          label: '一级 3',
          children: [
            {
              id: 7,
              label: '二级 3-1'
            },
            {
              id: 8,
              label: '二级 3-2'
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {},
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    async submit() {}
  }
}
</script>

<style scoped lang="less">
.wrap {
  display: flex;

  .list {
    flex: 0 0 240px;
  }
  .model {
    flex: 1;
    height: 500px;
  }
}
</style>
