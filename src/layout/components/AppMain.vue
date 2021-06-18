<template>
  <!--
    /**
     任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
     开发人员：李建敏
     日期：2020-3月-17日
     任务类型：2、复制修改代码 （2行）
     **/
     -->
  <div class="app-main-wrap">
    <Breadcrumb v-if="!$route.meta.hiddenLayout" class="breadcrumb-container" />
    <div v-if="isChildren">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </div>
    <section v-else class="app-main" :class="{ hiddenLayout: $route.meta.hiddenLayout }">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </section>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb
  },
  props: {
    // 是否有三级路由
    isChildren: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="less">
.app-main-wrap {
  display: flex;
  flex-direction: column;
}
.app-main {
  /*50 = navbar  */
  width: 100%;
  min-width: 1000px;
  position: relative;
  padding: 0 20px 20px;
  overflow: hidden;
  /**
   任务名称：2634/工作流前端迁移到施工系统作为流程管理模块
   开发人员：李建敏
   日期：2020-3月-17日
   任务类型：2、复制修改代码 （7行）
   **/
  &.hiddenLayout {
    padding: 0;
    > div {
      padding: 0;
      margin-top: 0;
    }
  }
  > div {
    background-color: #fff;
    min-height: calc(100vh - 90px);
    padding: 20px 20px 0 20px;
  }
}

.breadcrumb-container {
  margin-top: 50px;
  padding-left: 12px;
}
</style>
