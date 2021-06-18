<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '修改监控设备' : '新增监控设备' }}</span>
      </div>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="150px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="form.deviceName" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="设备编号" prop="deviceNum">
              <el-input v-model="form.deviceNum" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="设备型号" prop="factoryNum">
              <el-input v-model="form.factoryNum" class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="生产厂家" prop="factoryName">
              <el-input v-model="form.factoryName" class="form-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="所属区域" prop="monitorArea">
              <el-select v-model="form.monitorArea" class="form-input" clearable placeholder="所属区域">
                <el-option v-for="item in monitorAreaList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="设备url" prop="deviceUrl">
              <el-input v-model="form.deviceUrl" class="form-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="监控目标" prop="monitorTarget">
              <el-select v-model="form.monitorTarget" class="form-input" clearable placeholder="监控目标">
                <el-option v-for="item in monitorTargetList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="关联设备" prop="relatedDeviceName">
              <el-input v-model="form.relatedDeviceName" disabled class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-button type="primary" @click="handleRelate">关联</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="24">
            <el-form-item label="监控设备负责人" prop="devicePrincipalMobile">
              <el-input v-model="form.devicePrincipalName" placeholder="姓名" class="inline-input" /> -
              <el-input v-model="form.devicePrincipalMobile" placeholder="联系电话" class="inline-input" />
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="监控区域负责人" prop="areaPrincipalMobile">
              <el-input v-model="form.areaPrincipalName" placeholder="姓名" class="inline-input" /> -
              <el-input v-model="form.areaPrincipalMobile" placeholder="联系电话" class="inline-input" />
            </el-form-item>
          </el-col>
          <el-col :md="16">
            <el-form-item label="上传">
              <Upload
                v-model="form.fileId"
                multiple
                :limit="4"
                accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.png"
                is-only-button
              />
            </el-form-item>
          </el-col>
          <el-col :md="16">
            <el-form-item label="图片">
              <ImportUpload v-model="form.imageId" :limit="1" />
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="备注" prop="remark">
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
    <RelateModal v-if="relateVisible" :visible.sync="relateVisible" @submit="handleRelateSubmit"></RelateModal>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 */
import Api from './api/work-bench'
import Upload from '@/components/Upload' // 上传组件
import RelateModal from './components/RelateModal'
import regular from '@/utils/regular' // 上传组件
import ImportUpload from './components/ImageUpload'
export default {
  name: 'EquipmentMonitoringAdd',
  components: {
    Upload,
    RelateModal,
    ImportUpload
  },
  data() {
    // 这里存放数据
    return {
      /**
       任务名称：TASK#2924	设备监控接口
       开发人员：崔洛宜
       日期：2020-04-11
       任务类型：1、监测数据修改
       **/
      id: this.$route.query.id || '',
      relateVisible: false,
      form: {
        deviceName: '',
        deviceNum: '',
        factoryNum: '',
        factoryName: '',
        relatedDevice: '',
        relatedDeviceName: '',
        devicePrincipalName: '',
        devicePrincipalMobile: '',
        areaPrincipalName: '',
        areaPrincipalMobile: '',
        fileId: '',
        remark: ''
      },
      formRules: {
        deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        deviceNum: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
        monitorArea: [{ required: true, message: '请选择监控区域', trigger: 'change' }],
        monitorTarget: [{ required: true, message: '请选择监控目标', trigger: 'change' }],
        relatedDeviceName: [
          { required: true, message: '请选择设备编号', trigger: 'blur' },
          { required: true, message: '请选择设备编号', trigger: 'change' }
        ],
        devicePrincipal: [{ pattern: regular.phone, message: '手机号不合法' }],
        devicePrincipalMobile: [{ pattern: regular.phone, message: '手机号不合法' }],
        areaPrincipalMobile: [{ pattern: regular.phone, message: '手机号不合法' }],
        deviceUrl: [{ required: true, message: '请输入设备url', trigger: 'change' }]
      }
    }
  },
  computed: {
    /**
     任务名称：TASK#2924	设备监控接口
     开发人员：崔洛宜
     日期：2020-04-11
     任务类型：1、下拉数据
     **/
    //监控区域
    monitorAreaList() {
      return this.$getArgList('monitorArea') || []
    },
    //监控目标
    monitorTargetList() {
      return this.$getArgList('monitorTarget') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  async mounted() {
    if (this.id) {
      let res = await Api.getMonitorDetail(this.id)
      this.form = { ...res.data }
    }
  },
  // 方法集合
  methods: {
    //点击关联
    handleRelate() {
      this.relateVisible = true
    },
    //选择设备结束
    handleRelateSubmit(data) {
      this.form = {
        ...this.form,
        relatedDeviceName: data.map(item => item.name).join(','),
        relatedDevice: data.map(item => item.id).join(',')
      }
      this.relateVisible = false
    },
    //点击保存
    handleSubmit() {
      this.$refs['formRef'].validate(async valid => {
        if (valid) {
          let res
          if (this.id) {
            res = await Api.updateMonitor(this.form)
          } else {
            res = await Api.addMonitor(this.form)
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
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/equipment-monitoring'
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
