<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="menu-list">
      <breadcrumb class="breadcrumb-container" />
      <!-- <el-menu
        :default-active="'/' + $route.path.split('/')[1]"
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#409eff"
        router
        v-if="isShowHeaderMenu"
      >
        <template v-for="item in menuList">
          <el-menu-item :key="item.path" :index="item.path" v-if="item.name !== 'WorkBench'">{{ item.meta.title }}</el-menu-item>
        </template>
      </el-menu> -->
    </div>
    <div class="right-menu clearfix">
      <template v-if="isShowHeaderMenu">
        <el-switch
          v-if="ignorePermissionsVisible"
          v-model="ignorePermissions"
          title="显示所有菜单和按钮"
          inactive-text="开发者模式"
          style="margin-right: 15px"
        >
        </el-switch>
        当前项目：
        <el-select
          v-model="projectId"
          :disabled="!ignorePermissionsVisible"
          placeholder="请选择"
          style="margin-right: 15px"
          @change="changeProject"
        >
          <el-option v-for="item in projectData" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </template>
      <el-button type="primary" round icon="el-icon-setting" style="margin-right: 10px" @click="goToSystem()"
        >基础管理</el-button
      >
      <a href="/dashboard.html" target="_blank" style="margin-right: 10px">
        <el-button round type="primary">大屏展示</el-button>
      </a>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-name">{{ userName }}</span>
          <i class="el-icon-caret-bottom" />
          <img :src="avatar || '/img/default-user.png' + '?imageView2/1/w/80/h/80'" class="user-avatar" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb/old-breadcrumb'
import api from '@/api/message'
import { workBenchApi } from '@/api/work-bench'
import { getOrigin } from '@/utils/'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      unreadNum: 0,
      projectId: '',
      projectData: [],
      projectIdList: [],
      getOrigin
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar']),
    menuList() {
      return this.$store.state.app.menuList.filter(e => !e.hidden && e.meta)
    },
    userName() {
      return this.$store.state.user.name
    },
    // 是否显示头部菜单
    isShowHeaderMenu() {
      return this.$route.path.indexOf('/work-bench/') < 0
    },
    //是否显示开发者模式按钮
    ignorePermissionsVisible() {
      return process.env.NODE_ENV === 'development'
    },
    // 忽视权限,显示所有菜单和按钮
    ignorePermissions: {
      get() {
        return process.env.NODE_ENV === 'development' && localStorage.getItem('ignorePermissions') === 'true'
      },
      set(val) {
        localStorage.setItem('ignorePermissions', '' + val)
        location.reload()
      }
    },
    // 当前项目id
    currentProjectId() {
      return this.$store.state.project.projectId
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    // 监听路由改变
    $route(to, from) {}
  },

  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.projectId = this.currentProjectId
      this.queryProjectList()
      this.$store.commit('setApprovalRouter')
    },
    // 获取项目消息
    async getUnread() {
      if (!this.isShowHeaderMenu) {
        return
      }
      let res = await api.getList({
        status: 0,
        page: null,
        rows: null
      })
      this.unreadNum = res.data.total
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      //this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    // 跳转路由
    goToUrl(path) {
      this.$router.push({ path })
    },
    // 获取项目列表
    async queryProjectList() {
      const result = await workBenchApi.queryProjectList({ page: 1, rows: 999 })
      const datas = (result.data && result.data.records) || []
      const projectIdList = []
      datas.map(item => {
        item.value = item.id
        item.label = item.name
        // 只加载当前项目
        if (process.env.NODE_ENV === 'development' || item.id === this.currentProjectId) {
          projectIdList.push(item.id)
        }
      })
      this.projectIdList = projectIdList
      if (process.env.NODE_ENV === 'development') {
        this.projectData = datas
        this.$store.dispatch('setSystemConfigStorage')
      } else {
        this.projectData = datas.filter(e => e.id === this.currentProjectId)
      }
    },
    // 选择项目
    changeProject(id) {
      const index = this.projectIdList.indexOf(id)
      this.toProject(this.projectData[index])
    },
    // 跳转项目详情
    toProject(item) {
      this.$store.commit('setProjectLocalStorage', item)
    },
    // 跳转基础管理
    goToSystem() {
      location.href = `${getOrigin(-2)}/login?token=${this.token}`
    }
  }
}
</script>

<style lang="scss" scoped>
.user-name {
  cursor: pointer;
  padding-right: 6px;
}
.info {
  font-size: 20px;
  display: inline-block;
  margin-right: 30px;
  cursor: pointer;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .menu-list {
    flex: 1;
    white-space: nowrap;
    overflow-x: auto;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 50px;
    padding-top: 5px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          /* margin-top: 3px; */
          position: relative;
          top: 6px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
          padding-right: 12px;
        }
      }
    }
  }
}
.to-admin {
  margin-right: 10px;
  padding: 9px 15px;
  color: #fff;
  background-color: #409eff;
  border: #409eff 1px solid;
  line-height: 1;
  font-size: 12px;
  border-radius: 20px;
  transition: 0.4s;
  display: inline-flex;
  align-items: center;
  span {
    margin-right: 5px;
  }
  &:hover {
    opacity: 0.8;
  }
}
</style>
