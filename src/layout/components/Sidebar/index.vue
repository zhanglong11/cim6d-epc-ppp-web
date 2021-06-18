<template>
  <div :class="{ 'has-logo': showLogo, [projectType]: projectType }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        ref="menuRef"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <template v-for="route in routes">
          <sidebar-item
            v-if="$DevelopmentRoute.includes(route.name) || power.includes(route.name) || ignorePermissions"
            v-show="
              (isShowHeaderMenu && route.name !== 'WorkBench') || (!isShowHeaderMenu && route.name === 'WorkBench')
            "

            :key="route.path"
            :item="route"
            :base-path="route.path"
          />
          {{route.path}}
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import treeForEach from '@/utils/treeForEach'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      const sortHash = _.keyBy(this.$store.state.userPower.powerFlatList, 'powerKey')
      treeForEach(this.$router.options.routes, route => (route.sort = sortHash[route.name]?.sort))
      treeForEach(this.$router.options.routes, route => {
        if (route.children) {
          route.children = _.sortBy(route.children, 'sort')
        }
      })
      return _.sortBy(this.$router.options.routes, 'sort')
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      this.$nextTick(() => {
        /*
        耿为刚添加
        保持当前路由父级菜单始终展开
        日期：2020-04-01
        修改三级路由不展开bug
        */
        const openedMenus = []
        const menus = path.split('/')
        openedMenus.push(`/${menus[menus.length - 2]}`)
        console.log(openedMenus)
        if (menus.length < 4) {
          this.$refs.menuRef.openedMenus = openedMenus
        }
      })

      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      console.log(path)
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    // 是否显示头部菜单
    isShowHeaderMenu() {
      return this.$route.path.indexOf('/work-bench/') < 0
    },
    // 权限
    power() {
      return this.$store.state.userPower.power
    },
    // 是否是企业管理员
    companyAdminFlag() {
      return this.$store.state.user.companyAdminFlag
    },
    // 忽视权限,显示所有菜单和按钮
    ignorePermissions() {
      return process.env.NODE_ENV === 'development' && localStorage.getItem('ignorePermissions') === 'true'
    },
    // 项目类型
    projectType() {
      return this.$store.state.project.projectType
    }
  },
  watch: {
    isCollapse() {
      this.changeFooterBtn()
    }
  },
  mounted() {
    this.changeFooterBtn()
  },
  methods: {
    // 折叠左侧菜单,自动改变底部按钮栏样式
    changeFooterBtn() {
      this.$nextTick(() => {
        const ele = document.getElementsByClassName('footer-btn')
        if (!ele.length) {
          return
        }
        ele[0].style.left = this.isCollapse ? '54px' : '210px'
      })
    }
  }
}
</script>
