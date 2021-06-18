<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新增消毒记录</span>
      </div>
      <el-form ref="formRef" label-width="150px" class="form-con" :model="form" :rules="formRules">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="消毒人" prop="principalName">
              <el-input v-model="form.principalName" class="form-input" placeholder="请输入消毒人名称" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="联系电话" prop="principalMobile">
              <el-input v-model="form.principalMobile" class="form-input" placeholder="请输入消毒人联系电话" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="选择日期" prop="sterilizeTime">
              <el-date-picker
                v-model="form.sterilizeTime"
                type="date"
                value-format="yyyy-MM-dd 00:00:00"
                placeholder="选择消毒日期"
                class="form-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="消毒部位" prop="sterilizePart">
              <el-input v-model="form.sterilizePart" class="form-input" placeholder="请输入消毒部位" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="消毒用品" prop="sterilizationSupplies">
              <el-input v-model="form.sterilizationSupplies" class="form-input" placeholder="请输入消毒用品" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="所属公司" prop="companyId">
              <CompanySelect
                v-model="form.companyId"
                :hasAll="false"
                class="form-input"
                placeholder="请选择所属公司"
              ></CompanySelect>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.companyId" :gutter="20" style="padding: 10px 10px 10px 150px">
          <vxe-table ref="xTable" border :data="dataList" auto-resize>
            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
            <vxe-table-column field="lisencePlate" title="车辆" />
            <vxe-table-column field="carPrincipalName" title="司机" />
          </vxe-table>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="24">
            <el-form-item label="备注信息" prop="remark">
              <el-input v-model="form.remark" class="form-input" type="textarea" :rows="4" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" @click="handleSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-31
 * @Last Modified by: gengweigang
 */
import Api from '../api/work-bench'
import CompanySelect from '../components/CompanySelect'
export default {
  name: 'HealthyAddDisinfectionRecord',
  components: { CompanySelect },
  data() {
    // 这里存放数据
    return {
      form: {},
      formRules: {
        principalName: [{ required: true, message: '消毒人名称必填', trigger: 'blur' }],
        sterilizeTime: [{ required: true, message: '请选择消毒日期', trigger: 'change' }],
        companyId: [{ required: true, message: '请选择公司', trigger: 'change' }]
      },
      id: this.$route.query.id || '',
      formData: {
        region: ''
      },
      //公司所属车辆
      dataList: []
    }
  },
  watch: {
    'form.companyId'(val) {
      if (!val) {
        return
      }
      Api.getVehicleList({
        companyId: val,
        page: '',
        rows: ''
      }).then(res => {
        this.dataList = res.data.records
      })
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 返回
    goBack() {
      this.$router.go(-1)
    },
    async handleSubmit() {
      this.$refs['formRef'].validate(async valid => {
        if (valid) {
          let ids = this.dataList.map(item => item.id).join(',')
          let res
          if (this.id) {
            res = await Api.addVehicle(this.form)
          } else {
            res = await Api.addCentralizedDisinfectionRecord({ ...this.form, carIdList: ids })
          }
          if (res.code === 200) {
            this.$message.success('提交成功')
            this.$router.back()
          } else {
            this.$message.info('未知错误,请重试')
            return false
          }
        } else {
          this.$message.info('请正确填写')
          return false
        }
      })
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
}
.inline-input {
  width: 30%;
  display: inline-block;
}
</style>
