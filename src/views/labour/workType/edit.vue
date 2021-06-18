<template>
  <!--
/**
任务名称：2840/【智慧工地2.0-前端】劳务管理》工种管理》列表、新建、编辑切图及功能开发
开发人员：李建敏
日期：2020-4月-1日
任务类型：1、全新代码
**/
-->
  <div style="background-color: unset; width: 1130px; margin: 0 auto">
    <el-card>
      <div slot="header" class="card-header">
        <span>{{ $route.meta.title }}</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        style="width: 650px; margin-left: 100px"
        :rules="rules"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item label="工种名称" prop="argText">
          <el-input v-model="form.argText"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :autosize="{ minRows: 6 }"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="footer-divide">
      <el-button size="medium" @click="$router.back()">取消</el-button>
      <el-button size="medium" type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  data() {
    return {
      form: {
        argGroup: 'workType',
        module: 'construction-2.0',
        argFlag: 0
      },
      rules: {
        argText: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) {
      this.$api.getArgById(this.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      if (this.id) {
        await this.$api.updateArg(this.form)
        this.$message.success('编辑成功')
      } else {
        await this.$api.addArg(this.form)
        this.$message.success('新建成功')
      }
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less"></style>
