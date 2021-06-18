<template>
  <!--
  /**
  任务名称：2843/【智慧工地2.0-前端】劳务管理》劳务公司》列表、新建、编辑切图及功能开发
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
      <el-form ref="form" :model="form" style="width: 650px; margin-left: 100px" :rules="rules" label-width="90px">
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司名称"></el-input>
        </el-form-item>
        <el-form-item label="公司类型">
          <SelectArg
            v-model="form.type"
            argGroup="labourCompanyType"
            placeholder="请选择公司类型"
            style="width: 100%"
          ></SelectArg>
          <!--          <a class="add-button" @click="addType">添加</a>-->
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="form.principalName" placeholder="请输入负责人名称"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="principalMobile">
          <el-input v-model="form.principalMobile" placeholder="000-0000-0000"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            placeholder="请输入备注信息"
            type="textarea"
            :autosize="{ minRows: 3 }"
          ></el-input>
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
import regular from '@/utils/regular'

export default {
  name: 'Edit',
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId')
      },
      rules: {
        name: [{ required: true, message: '必填' }],
        principalMobile: [{ pattern: regular.phone, message: '手机号不合法' }]
      },
      companyTypeList: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) {
      this.axios.labour.get('company/get/' + this.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    async submit() {
      await this.$refs.form.validate()
      this.axios.labour.post('company/' + (this.id ? 'update' : 'add'), this.form).then(res => {
        this.$message.success(this.id ? '编辑成功' : '新建成功')
        this.$router.back()
      })
    },
    addType() {
      this.$prompt('请输入公司类型名称', '添加公司类型', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{2}/,
        inputErrorMessage: '最小长度2'
      }).then(async ({ value }) => {
        await this.$api.addArg({ argGroup: 'labourCompanyType', argText: value })
        this.$message.success('添加公司类型成功')
        this.$store.dispatch('setSystemConfigStorage')
      })
    }
  }
}
</script>

<style scoped lang="less">
.add-button {
  position: absolute;
  left: 100%;
  width: 50px;
  display: block;
  top: 0;
  margin-left: 15px;
}
</style>
