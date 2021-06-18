<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>设备退场</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="200px" class="form-con">
        <!-- 设备进场信息 start -->
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="设备编码">
              {{ baseInfo.equipmentCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="设备名称">
              {{ baseInfo.equipmentName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="使用位置">
              {{ baseInfo.location }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="进场负责人">
              {{ baseInfo.enterPrincipalName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="进场日期">
              {{ baseInfo.enterTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 设备进场信息end -->
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="退场负责人" prop="exitPrincipalId">
              <SelectUser
                :id.sync="formData.exitPrincipalId"
                :multiple="false"
                :value="
                  formData.enterPrincipalId ? { id: formData.exitPrincipalId, label: formData.exitPrincipalName } : null
                "
                :name.sync="formData.exitPrincipalName"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="退场日期" prop="realExitTime">
              <el-date-picker
                v-model="formData.realExitTime"
                class="form-input"
                type="date"
                placeholder="请选择退场日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="上传" prop="exitFileIds">
              <FileEdit v-model="formData.exitFileIds" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="备注">
              <el-input
                v-model="formData.exitRemark"
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
  name: 'EquipmentEnterItem',

  data() {
    return {
      id: this.$route.query.id || '',
      formData: {
        id: this.$route.query.id || '',
        projectId: this.$store.state.project.projectId
      },
      formRules: {
        exitPrincipalId: [{ required: true, message: '请选择退场负责人', trigger: 'blur' }],
        realExitTime: [{ required: true, message: '请选择退场日期', trigger: 'blur' }]
      },
      isLoading: false,
      baseInfo: {},
      pickerOptions: {}
    }
  },
  created() {
    this.getEquipmentDetailInfo()
  },
  methods: {
    // 设置退场日期禁用项，避免退场日期早于入场日期
    initPickerOptions() {
      let enterTime = this.baseInfo.enterTime
      if (!enterTime) return
      this.pickerOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(enterTime).getTime() || time.getTime() > new Date().getTime()
        }
      }
    },
    // 获取设备进场基本信息
    async getEquipmentDetailInfo() {
      const result = await this.axios.material.get(`/equipmentEnterExit/get/${this.id}`)
      this.baseInfo = result.data || {}
      this.initPickerOptions()
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
        console.log('saveSuccess', this.formData)
        await this.axios.material.post('/equipmentEnterExit/exitEquipment', this.formData)
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
