<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">登录</h3>
      </div>
      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginName"
          v-model="loginForm.loginName"
          placeholder="用户名"
          name="loginName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="showProject"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width: 100%" size="lg" @click.native.prevent="submit"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { userEncryption } from '@/utils'
export default {
  name: 'Login',
  data() {
    return {
      // 展示项目列表
      visible: false,
      loginForm: {
        loginName: process.env.VUE_APP_USERNAME,
        password: process.env.VUE_APP_USEPSWD
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', min: 6, message: '密码最少6位' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      // 项目列表
      projectList: []
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    // 设置缓存
    selectProject(item) {
      this.visible = false
      localStorage.setItem('projectId', item.id)
      localStorage.setItem('projectType', item.type)
      localStorage.setItem('projectName', item.name)
      this.$router.push({ path: this.redirect || '/' })
    },
    // 查看密码
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    // 登录
    /*
     * @Author: 耿为刚 创建
     * @Date: 2020-03-27
     * @Last Modified by: gengweigang
     * @Last Modified time: 2020-07-29 11:48:03
     * 任务名称跳转到工作台首页
     */
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 登录加密
          let params = userEncryption(this.loginForm)
          this.loading = true
          this.$store
            .dispatch('user/login', params)
            .then(() => {
              this.$router.push('/')
            })
            .finally(() => (this.loading = false))
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
.login-container .el-dialog__body {
  max-height: 500px;
  overflow-y: scroll;
}

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #e5e5e5 inset !important;
        -webkit-text-fill-color: #333 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 18px;
    .el-form-item__error {
      margin-top: 10px;
    }
  }
}
</style>

<style lang="scss" scoped>
.box-card {
  cursor: pointer;
  .el-image {
    width: 100%;
    height: 200px;
  }
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
.image-slot {
  font-size: 30px;
}
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #666;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url('../../assets/images/login-bg.jpg') $bg;
  background-size: cover;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 520px;
    max-width: 100%;
    min-height: 320px;
    padding: 0 35px;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    border-radius: 12px;
    left: 50%;
    top: 50%;
    margin-left: -260px;
    margin-top: -240px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
