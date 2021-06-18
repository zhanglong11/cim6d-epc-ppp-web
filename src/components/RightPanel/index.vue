<template>
  <div ref="rightPanel" :class="{ show: show }" class="rightPanel-container">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <el-tooltip v-model="tooltipStatus" effect="dark" :content="show ? '关闭' : iconDesc" placement="left">
        <div
          class="handle-button"
          :style="{
            top: buttonTop ? buttonTop + 'px' : 'auto',
            bottom: buttonBottom ? buttonBottom + 'px' : 'auto',
            'background-color': 'rgb(24, 144, 255)'
          }"
          @click="hidePanel"
        >
          <i :class="show ? 'el-icon-close' : icon" />
        </div>
      </el-tooltip>
      <div class="rightPanel-items">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'

export default {
  name: 'RightPanel',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    // 按钮距离头部距离
    buttonTop: {
      default: 0,
      type: Number
    },
    // 按钮距离底部距离
    buttonBottom: {
      default: 0,
      type: Number
    },
    // 图标
    icon: {
      type: String,
      default: 'el-icon-chat-dot-round'
    },
    // 图标描述
    iconDesc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
      tooltipStatus: false
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    show(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }
  },
  mounted() {
    this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.rightPanel
    elx.remove()
  },
  methods: {
    hidePanel() {
      // 用于清除form表单内容
      this.$emit('close')
      this.show = !this.show
      this.tooltipStatus = false
    },
    addEventClick() {
      window.addEventListener('click', this.closeSidebar)
    },
    closeSidebar(evt) {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        this.show = false
        this.$emit('close')
        window.removeEventListener('click', this.closeSidebar)
      }
    },
    insertToBody() {
      const elx = this.$refs.rightPanel
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    }
  }
}
</script>

<style>
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
</style>

<style lang="scss" scoped>
.rightPanel-items {
  height: 100%;
}
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
  background: rgba(0, 0, 0, 0.2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 360px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: -2px 0 18px -5px #888888;
  transition: all 0.25s cubic-bezier(0.7, 0.3, 0.1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 40000;
}

.show {
  transition: all 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);

  .rightPanel-background {
    z-index: 20000;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
