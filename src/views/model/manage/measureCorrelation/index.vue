<template>
  <div class="main">
    <div class="task-list-wrap">
      <el-card class="box-card aside">
        <div slot="header" class="clearfix">
          <span>单体楼层</span>
        </div>
        <TreeData type="space" @handleCheckChange="singleChange" />
      </el-card>
      <div class="task-list" style="padding: 0">
        <BIM ref="BIM" idSelect="securityCheck" />
      </div>
    </div>
    <div class="task-list-wrap" style="margin-top: 10px">
      <el-card class="box-card aside">
        <div slot="header" class="clearfix">
          <span>专业构件</span>
        </div>
        <TreeData type="special" @handleCheckChange="specialChange" />
      </el-card>
      <div class="task-list">
        <div class="headContainer">
          <!--表头参考清单关联搜索条件，所属分类、关联状态、查询、重置、自动匹配-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TreeData from '../components/TreeData'
export default {
  components: {
    TreeData
  },
  data() {
    return {}
  },
  methods: {
    singleChange(e) {
      this.$store.commit('bim/changeSingle', e)
    },
    specialChange(e) {
      this.$store.commit('bim/changeMajor', e)
    }
  }
}
</script>

<style lang="less" scoped>
div.main {
  background-color: #f0f2f5;
  padding: 0;
  .task-list-wrap {
    display: flex;
    .aside {
      flex: 0 0 320px;
      max-height: 500px;
      margin-right: 10px;
      background-color: #fff;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background: #d8d8d8;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track-piece {
        background: transparent;
      }
    }
    .task-list {
      width: calc(100% - 320px);
      min-height: 560px;
      padding: 20px;
      background-color: #fff;
    }
  }
}
</style>
