<template>
  <div class="project-button">
    <p class="close" @click="closeParent()">
      <span class="project-title">我的项目</span>
      <span class="el-icon-close"></span>
    </p>
    <ul>
      <li v-for="(item, i) in projectDataList" :key="i" :class="{ active: currentProjectId == item.id }">
        <router-link to="" class="title" @click.native="toProject(item)">{{ item.name }}</router-link>
        <span class="time">{{ item.projectDate | formatData }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { workBenchApi } from '@/api/work-bench'
export default {
  name: 'ProjectButton',
  components: {},
  data() {
    //这里存放数据
    return {
      projectDataList: []
    }
  },
  computed: {
    // 当前项目id
    currentProjectId() {
      return this.$store.state.project.projectId
    }
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.queryProjectList()
  },
  //方法集合
  methods: {
    // 获取项目列表
    async queryProjectList() {
      const result = await workBenchApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      this.projectDataList = datas
    },
    // 跳转项目详情
    toProject(item) {
      this.closeParent()
      this.$store.commit('setProjectLocalStorage', item)
    },
    // 关闭父级组件
    closeParent() {
      this.$parent.show = false
    }
  }
}
</script>
<style lang="less" scoped>
@import url('../../../styles/color.less');
.project-button {
  .close {
    padding: 10px;
    display: flex;
    align-items: center;
    .project-title {
      flex: 1;
      text-align: center;
      font-size: 26px;
    }
    .el-icon-close {
      cursor: pointer;
      color: #ccc;
      font-size: 32px;
    }
  }
  ul {
    padding: 20px 0 0 15px;
    li {
      padding: 0 15px;
      border-bottom: 1px #e5e5e5 solid;
      line-height: 45px;
      font-size: 14px;
      display: flex;
      align-items: center;
      .title {
        flex: 1;
        color: #333;
        &:hover {
          color: @main-color;
        }
      }
      .time {
        color: #999;
      }
      &.active {
        background: @main-color;
        color: #fff;
        .title,
        .time {
          color: #fff;
        }
      }
    }
  }
}
</style>
