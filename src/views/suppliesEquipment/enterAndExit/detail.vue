<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ status === '2' ? '退场信息' : '设备进场详情' }}</span>
      </div>
      <el-form ref="formRef" label-width="200px" class="form-con">
        <el-row :gutter="20">
          <el-col v-if="status === '1'" :md="12">
            <el-form-item label="进场编码">
              {{ baseInfo.code }}
            </el-form-item>
          </el-col>
        </el-row>
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
              {{ baseInfo.enterTime | dateYMD }}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 进场状态展示内容  -->
        <template v-if="status === '1'">
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="计划退场日期">
                {{ baseInfo.planExitTime | dateYMD }}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="进场附件信息">
              <FileList :ids="baseInfo.enterFileIds" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="进场备注">
              {{ baseInfo.enterRemark }}
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 进场状态展示内容end -->
        <!--  -->
        <!--退场状态展示内容  -->
        <template v-if="status === '2'">
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="退场日期">
                {{ baseInfo.realExitTime | dateYMD }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="退场负责人">
                {{ baseInfo.exitPrincipalName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="退场附件信息">
                <FileList :ids="baseInfo.exitFileIds" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :md="12">
              <el-form-item label="退场备注">
                {{ baseInfo.exitRemark }}
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <!-- 退场状态展示内容end -->
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返 回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipmentEnterItem',
  data() {
    return {
      id: this.$route.query.id || '',
      status: this.$route.query.status || '',
      baseInfo: {}
    }
  },
  created() {
    this.getEquipmentDetailInfo()
  },

  methods: {
    // 获取设备进场基本信息
    async getEquipmentDetailInfo() {
      const result = await this.axios.material.get(`/equipmentEnterExit/get/${this.id}`)

      this.baseInfo = result.data || {}
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
