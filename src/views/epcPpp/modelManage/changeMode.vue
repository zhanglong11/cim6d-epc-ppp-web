<template>
  <div class="wrap">
    <el-card class="list">
      <div slot="header">
        <span>模型列表</span>
      </div>
      <el-tree :data="data" show-checkbox node-key="id" :props="defaultProps" />
    </el-card>
    <div class="model">
      <BIM ref="BIM" idSelect="progress" class="bim-box-progress" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangeMode',
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
  methods: {}
}
</script>

<style scoped lang="less">
div.wrap {
  display: flex;
  padding: 0;
  background: #f0f2f5;
  .list {
    flex: 0 0 300px;
  }
  .model {
    flex: 1;
    margin-left: 20px;
  }
}
</style>
