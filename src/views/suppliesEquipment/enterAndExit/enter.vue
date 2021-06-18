<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '设备退场信息' : '新建进场设备' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="200px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="设备名称" prop="equipmentId">
              <el-input v-model="formData.equipmentName" readonly class="form-input" placeholder="请选择设备" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-button type="text" @click="showEquipment">选择设备</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="使用位置" prop="location">
              <el-input v-model="formData.location" class="form-input" readonly placeholder="使用位置" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="进场负责人" prop="enterPrincipalId">
              <SelectUser
                :id.sync="formData.enterPrincipalId"
                :multiple="false"
                :value="
                  formData.enterPrincipalId
                    ? { id: formData.enterPrincipalId, label: formData.enterPrincipalName }
                    : null
                "
                :name.sync="formData.enterPrincipalName"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="进场日期" prop="enterTime">
              <el-date-picker
                v-model="formData.enterTime"
                class="form-input"
                type="date"
                placeholder="请选择进场日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="initPickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="计划退场日期" prop="planExitTime">
              <el-date-picker
                v-model="formData.planExitTime"
                class="form-input"
                type="date"
                placeholder="请选择计划退场日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="上传" prop="enterFileIds">
              <FileEdit v-model="formData.enterFileIds" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="备注">
              <el-input
                v-model="formData.enterRemark"
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
    <!-- 选择设备dialog start -->
    <SelectEquipmentDialog
      v-if="visible"
      ref="selectEquipment"
      :multiple="false"
      :status="0"
      :visible.sync="visible"
      :checkRowKeys="equipmentList.map(r => r.id)"
      @change="getRow"
    />
    <!-- 选择设备dialog end -->
  </div>
</template>

<script>
import SelectEquipmentDialog from '@/views/suppliesEquipment/equipmentManage/list/components/SelectEquipmentDialog'

export default {
  name: 'EquipmentEnterItem',
  components: { SelectEquipmentDialog },

  data() {
    return {
      id: this.$route.query.id || '',
      pickerOptions: {}, //设置时间禁用项，避免预计退场日期遭遇入场日期
      formData: {
        id: this.$route.query.id || '',
        projectId: this.$store.state.project.projectId,
        equipmentName: '',
        equipmentId: '',
        location: ''
      },
      formRules: {
        equipmentId: [{ required: true, message: '请选择设备', trigger: ['blur', 'change'] }],
        location: [{ required: true, message: '请选择设备', trigger: 'blur' }],
        enterPrincipalId: [{ required: true, message: '请选择进场负责人', trigger: ['blur', 'change'] }],
        enterTime: [{ required: true, message: '请选择进场日期', trigger: ['blur', 'change'] }],
        planExitTime: [{ required: true, message: '请输入计划退场日期', trigger: ['blur', 'change'] }]
      },
      isLoading: false,
      // 选择设备参数
      visible: false,
      equipmentList: [] //选中设备项，用于编辑或再次打开
    }
  },

  methods: {
    // 设置退场日期禁用项，避免退场日期早于入场日期
    initPickerOptions(val) {
      if (!val) return
      this.pickerOptions = {
        disabledDate(time) {
          return time.getTime() < new Date(val).getTime()
        }
      }
    },
    // 打开选择设备dialog
    showEquipment() {
      this.visible = true
    },
    getRow(row) {
      // console.log('getRow', row)
      if (!row) return
      Object.assign(this.formData, { equipmentName: row.name, equipmentId: row.id, location: row.location })
      this.equipmentList = [row]
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
        await this.axios.material.post('equipmentEnterExit/add', this.formData)
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
