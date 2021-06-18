<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ formData.name }} {{ formData.code }}</span>
      </div>
      <el-form ref="formRef" :model="formData" label-width="140px" class="form-con">
        <el-row>
          <el-col :md="12">
            <el-form-item label="规格型号">
              {{ formData.name }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="模板名称">
              {{ formData.name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="规格型号">
              {{ formData.name }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="模板名称">
              {{ formData.name }}
            </el-form-item>
          </el-col> </el-row
        ><el-row>
          <el-col :md="12">
            <el-form-item label="规格型号">
              {{ formData.models }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="使用人">
              {{ formData.userName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="单位">
              {{ formData.unit }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="责任人">
              {{ formData.principalName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="设备类别">
              {{ $getLabel(equipmentType, formData.type) }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="使用人联系电话">
              {{ formData.userPhone }}
            </el-form-item>
          </el-col> </el-row
        ><el-row>
          <el-col :md="12">
            <el-form-item label="设备来源">
              {{ $getLabel(sourceList, formData.source) }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="使用人身份证号">
              {{ formData.userIdentityCard }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="设备位置">
              {{ formData.location }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="特种设备使用证号">
              {{ formData.specialEquipmentCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :md="12">
            <el-form-item label="品牌">
              {{ formData.brand }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="车牌号">
              {{ formData.plateNumber }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="12">
            <el-form-item label="供应商">
              {{ formData.supplier }}
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="生产厂家">
              {{ formData.manufacturer }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="12">
            <el-form-item label="备注">
              {{ formData.remark }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="12">
            <el-form-item label="附件">
              <FileList :ids="formData.fileIds" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/supplies/equipment/list'
import sourceList from './lib/sourceList'
import equipmentStatus from './lib/equipmentStatus'
import equipmentType from './lib/equipmentType'
export default {
  name: 'EquipmentDetail',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      formData: {},
      sourceList,
      equipmentStatus,
      equipmentType
    }
  },
  created() {
    if (this.id) {
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.formData = res.data
    },
    goBack() {
      this.$router.back()
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
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
</style>
