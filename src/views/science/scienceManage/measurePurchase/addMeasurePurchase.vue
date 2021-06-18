<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 6b14b0ad1968a54825bfe34dc82b3e967c432103
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具采购计划 搜索的时间组件添加时分秒，新增和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-d">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div class="form-d-head">采购计划基本信息</div>
        <div class="form-d-body">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="器具名称" prop="deviceName">
                <el-input v-model="form.deviceName" placeholder="请输入器具名称"></el-input>
              </el-form-item>
              <el-form-item label="测量范围" required>
                <div style="display: flex">
                  <div style="flex: 1 1 auto">
                    <el-form-item prop="measureMin" style="margin-bottom: 0px">
                      <el-input-number
                        v-model="form.measureMin"
                        controls-position="right"
                        placeholder="请输入下限"
                        style="width: 100%"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                  <div style="width: 20px; text-align: center">-</div>
                  <div style="flex: 1 1 auto">
                    <el-form-item prop="measureMax" style="margin-bottom: 0px">
                      <el-input-number
                        v-model="form.measureMax"
                        controls-position="right"
                        placeholder="请输入上限"
                        style="width: 100%"
                      ></el-input-number>
                    </el-form-item>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="单位" prop="measureUnit">
                <el-input v-model="form.measureUnit" placeholder="请输入单位"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格型号" prop="specification">
                <el-input v-model="form.specification" placeholder="请输入规格型号"></el-input>
              </el-form-item>
              <el-form-item label="精度等级" prop="step">
                <el-input-number
                  v-model="form.step"
                  controls-position="right"
                  placeholder="请输入精度等级"
                  :max="100000000"
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="计划备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入计划备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <div class="form-d-gutter"></div>

      <div class="form-d-button">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSaveSubmit">保存并提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/measurePurchase'
export default {
  name: 'OperationMeasurePurchase',
  data() {
    return {
      form: {
        id: '',
        projectId: localStorage.getItem('projectId'),
        deviceName: '',
        measureMin: undefined,
        measureMax: undefined,
        measureUnit: '',
        specification: '',
        step: undefined,
        remark: ''
      },
      formRules: {
        deviceName: [{ required: true, message: '请输入器具名称' }],
        measureMin: [{ required: true, message: '请输入下限' }],
        measureMax: [{ required: true, message: '请输入上限' }],
        measureUnit: [{ required: true, message: '请输入单位' }],
        specification: [{ required: true, message: '请输入规格型号' }],
        step: [{ required: true, message: '请输入精度等级' }]
      }
    }
  },
  mounted() {
    this.form.id = this.$route.params.id ? this.$route.params.id : ''
    if (this.form.id) {
      Api.getMeasurePurchaseDetail(this.form.id).then(res => {
        let data = res.data
        if (data) {
          this.form = data
        }
      })
    }
  },
  methods: {
    onCancel() {
      this.$router.push({ name: 'MeasurePurchase' })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          Api.saveMeasurePurchase(this.form).then(res => {
            this.$message.success('保存成功')
            this.$router.push({ name: 'MeasurePurchase' })
          })
        }
      })
    },
    handleSaveSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          Api.saveSubmitMeasurePurchase(this.form).then(res => {
            this.$message.success('保存提交成功') //bug号：1189、修改人：董渊海、修改时间：2020-03-19
            this.$router.push({ name: 'MeasurePurchase' })
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
