<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑材料信息' : '新建材料' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="200px" class="form-con">
        <el-row v-if="id" :gutter="20">
          <el-col :md="12">
            <el-form-item label="材料编码">
              <el-input v-model="formData.code" readonly class="form-input" placeholder="请输入材料编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="材料名称" prop="name">
              <el-input v-model="formData.name" class="form-input" placeholder="请输入材料名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="规格型号" prop="models">
              <el-input v-model="formData.models" class="form-input" placeholder="请输入规格型号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="formData.unit" class="form-input" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="formData.brand" class="form-input" placeholder="请输入品牌" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="formData.supplier" class="form-input" placeholder="请输入供应商" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="备注">
              <el-input
                v-model="formData.remark"
                class="form-input"
                type="textarea"
                :rows="4"
                placeholder="请输入备注信息"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返 回</el-button>
      <el-button type="primary" :loading="isLoading" size="lg" @click="save()">保 存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryAdd',
  data() {
    return {
      id: this.$route.query.id || '',
      formData: {
        id: this.$route.query.id || '',
        projectId: this.$store.state.project.projectId
      },
      formRules: {
        name: [{ required: true, message: '请输入材料名称', trigger: 'blur' }],
        models: [{ required: true, message: '请选择材料型号', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入材料单位', trigger: 'blur' }],
        brand: [{ required: true, message: '请选择材料品牌信息', trigger: 'blur' }],
        supplier: [{ required: true, message: '请输入供应商信息', trigger: 'blur' }]
      },
      isLoading: false
    }
  },
  created() {
    if (this.id) {
      this.getMaterialDetailInfo()
    }
  },

  methods: {
    // 编辑时获取材料基本信息
    async getMaterialDetailInfo() {
      const result = await this.axios.material.get(`/material/get/${this.id}`)
      console.log('材料信息', result.data)
      const datas = result.data
      this.formData = Object.assign({}, datas)
    },
    // 保存并提交
    save() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.saveSuccess()
        } else {
          this.$message({
            type: 'error',
            message: '请完善表单!'
          })
          return false
        }
      })
    },
    // 保存 - 异步
    async saveSuccess() {
      try {
        this.isLoading = true
        if (this.id) {
          await this.axios.material.post('material/update', this.formData)
        } else {
          await this.axios.material.post('material/add', this.formData)
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.goBack()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.form-con {
  padding-right: 15%;
}
.form-input {
  width: 100%;
  /deep/.el-input__inner {
    text-align: left;
  }
}
.inline-input {
  width: 30%;
  display: inline-block;
}
</style>
