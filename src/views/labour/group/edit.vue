<template>
  <!--
  /**
  任务名称：2844/【智慧工地2.0-前端】劳务管理》班组管理》列表、新建、编辑切图及功能开发
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
      <el-form ref="form" :model="form" style="width: 650px; margin-left: 100px" :rules="rules" label-width="120px">
        <el-form-item label="所属劳务公司" prop="labourCompanyId">
          <el-select v-model="form.labourCompanyId" style="width: 100%">
            <el-option v-for="e in companyList" :key="e.id" :label="e.name" :value="e.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入班组名称"></el-input>
        </el-form-item>
        <el-form-item label="责任负责人" prop="principal">
          <SelectUser
            v-model="form.principal"
            value-format="id"
            :multiple="false"
            :name.sync="form.principalName"
            placeholder="请选择"
            @update:mobile="handmobile"
          ></SelectUser>
        </el-form-item>
        <el-form-item label="联系电话" prop="principalMobile">
          <el-input v-model="form.principalMobile" placeholder="请输入手机号"></el-input>
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
        labourCompanyId: [{ required: true, message: '必填' }],
        principal: [{ required: true, message: '必填' }],
        principalMobile: [{ pattern: regular.phone, message: '手机号不合法' }]
      },
      companyList: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    'form.principal'(val) {
      if (!val) {
        this.form.principalMobile = ''
      }
    }
  },
  created() {
    if (this.id) {
      this.axios.labour.get('group/get/' + this.id).then(res => {
        this.form = res.data
      })
    }
    this.getCompanyList()
  },
  methods: {
    handmobile(val) {
      this.form.principalMobile = val
    },
    async getCompanyList() {
      this.companyList = await this.axios.labour
        .post('company/list', {
          page: 1,
          rows: 10000,
          projectId: localStorage.getItem('projectId')
        })
        .then(res => res.data.records)
    },
    async submit() {
      await this.$refs.form.validate()
      this.axios.labour.post('group/' + (this.id ? 'update' : 'add'), this.form).then(res => {
        this.$message.success(this.id ? '编辑成功' : '新建成功')
        this.$router.back()
      })
    },
    addType() {
      this.$prompt('请输入类型名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{2}/,
        inputErrorMessage: '最小长度2'
      }).then(({ value }) => {
        this.getCompanyList()
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
.el-card {
  overflow: visible;
}
</style>
