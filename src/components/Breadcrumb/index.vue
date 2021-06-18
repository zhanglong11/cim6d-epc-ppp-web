<template>
  <!--<el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>-->
  <div class="breadcrumb">
    <!-- <span class="title">{{ $route.meta.title }}</span> -->
    <!-- <span v-if="isShowHeaderMenu" class="project-name">当前项目<i class="el-icon-arrow-right"></i>{{currentProjectName}}</span> -->
  </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    // 是否是在工作台
    isShowHeaderMenu() {
      return this.$route.path.indexOf('/work-bench/') < 0
    },
    // 当前项目名字
    currentProjectName() {
      return this.$store.state.project.projectName
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      const { params, query } = this.$route
      var toPath = pathToRegexp.compile(path)
      // debugger
      return toPath(params, query)
    },
    handleLink(item) {
      this.targetRoutePath = item.path
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push({ path: path, query: this.$route.query, params: this.$route.params })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.breadcrumb {
  padding-left: 0 !important;
  height: 20px;
  font-weight: bold;
  margin-left: 18px;
  position: relative;
  color: #525557;
  display: flex;
  align-items: center;
  // &:before {
  //   display: inline-block;
  //   position: absolute;
  //   left: 1px;
  //   top: 12px;
  //   content: '';
  //   width: 3px;
  //   background-color: #147afb;
  //   height: 20px;
  // }
  .title {
    flex: 1;
  }
}
.project-name {
  padding-right: 20px;
  color: #999;
  font-size: 12px;
  font-weight: normal;
  i {
    margin: 0 6px;
  }
}
</style>
