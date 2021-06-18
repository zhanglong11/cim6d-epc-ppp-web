<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑车辆信息备' : '新增车辆信息' }}</span>
      </div>
      <el-form ref="formRef" label-width="150px" class="form-con" :model="form" :rules="formRules">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="车牌号码" prop="lisencePlate">
              <el-input v-model="form.lisencePlate" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="车辆类型" prop="carType">
              <el-input v-model="form.carType" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="负责人" prop="principalName">
              <el-input v-model="form.principalName" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="身份证号" prop="idCardNum">
              <el-input v-model="form.idCardNum" class="form-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="联系电话" prop="tel">
              <el-input v-model="form.tel" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="所属公司" prop="subordinateCompany">
              <CompanySelect v-model="form.subordinateCompany" :hasAll="false" class="form-input"></CompanySelect>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="车牌类型" prop="lisencePlageColor">
              <el-select v-model="form.lisencePlageColor" class="form-input">
                <el-option
                  v-for="item in licensePlateTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="附件">
              <Upload v-model="form.fileId" multiple :limit="4" accept=".jpg" is-only-button />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="车辆图片">
              <Upload v-model="form.carImage" multiple :limit="4" accept=".jpg" is-only-button />
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :md="24">
          <el-form-item label="备注信息" prop="remark">
            <el-input v-model="form.remark" class="form-input" type="textarea" :rows="4" placeholder="请输入备注" />
          </el-form-item>
        </el-col>
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
 * @Date: 2020-03-30
 * @Last Modified by: gengweigang
 */
import Upload from '@/components/Upload' // 上传组件
import CompanySelect from '../components/CompanySelect'
import Api from '../api/work-bench'
export default {
  name: 'AddHealthyVehicle',
  components: {
    Upload,
    CompanySelect
  },
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id || '',
      form: {},
      formRules: {
        lisencePlate: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
        principalName: [{ required: true, message: '请输入负责人', trigger: 'blur' }],
        subordinateCompany: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
        lisencePlageColor: [{ required: true, message: '请选择车牌类型', trigger: 'change' }]
      },
      formData: {
        region: ''
      }
    }
  },
  computed: {
    // 车牌类型
    licensePlateTypeList() {
      return this.$getArgList('licensePlateType') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  async mounted() {
    if (this.id) {
      let res = await Api.getVehicleListDetail(this.id)
      this.form = { ...res.data }
    }
  },
  // 方法集合
  methods: {
    // 返回
    goBack() {
      this.$router.back()
    },
    async handleSubmit() {
      this.$refs['formRef'].validate(async valid => {
        if (valid) {
          let res
          if (this.id) {
            res = await Api.updateVehicle(this.form)
          } else {
            res = await Api.addVehicle(this.form)
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
  /deep/ .el-input__inner {
    vertical-align: middle;
  }
}
.inline-input {
  width: 30%;
  display: inline-block;
}
</style>
