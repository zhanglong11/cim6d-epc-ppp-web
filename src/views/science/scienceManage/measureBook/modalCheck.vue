<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2d2f6e9e411e7d7453167097561f6240b7cb626d
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整，后续检定校准、故障维修、封存、报废模态框的时间组件添加时分秒
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog :title="'申请后续检定校准'" :visible="visible" @close="onCancel">
    <div style="font-weight: bold; font-size: 14px; padding-bottom: 14px">
      <span style="margin-right: 14px">{{ data.specification }}</span>
      <span style="margin-right: 14px">{{ data.deviceName }}</span>
      <span style="margin-right: 14px">{{ data.manufacturer }}</span>
    </div>
    <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
      <el-form-item label="检定时间" prop="verifyTime">
        <el-date-picker
          v-model="form.verifyTime"
          placeholder="请选择"
          style="width: 80%"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="检定周期(月)" prop="verifyFrequency">
        <el-date-picker
          v-model="form.verifyFrequency"
          type="month"
          format="MM"
          placeholder="请选择"
          style="width: 80%"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="有效期至" prop="expireTime">
        <el-date-picker
          v-model="form.expireTime"
          placeholder="请选择"
          style="width: 80%"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="检定结论" prop="verifyResult">
        <el-select v-model="form.verifyResult" placeholder="请选择检定结论" style="width: 80%">
          <el-option label="合格" :value="1"></el-option>
          <el-option label="不合格" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传">
        <FileUpload @input="setFileId"></FileUpload>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onOk">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Api from '@/api/science/scienceManage/measureBook'
export default {
  name: 'ModalCheck',
  props: {
    visible: Boolean,
    data: Object
  },
  data() {
    return {
      form: {
        verifyTime: '',
        verifyFrequency: '',
        expireTime: '',
        verifyResult: '',
        fileId: null,
        projectId: localStorage.getItem('projectId')
      },
      formRules: {
        verifyTime: [{ required: true, message: '请选择检定时间' }],
        verifyFrequency: [{ required: true, message: '请选择检定周期' }],
        expireTime: [{ required: true, message: '请选择有效期' }],
        verifyResult: [{ required: true, message: '请选择检定结果' }]
      }
    }
  },
  methods: {
    onCancel() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    onOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //this.form.verifyTime = moment(this.form.verifyTime).format('YYYY-MM-DD')
          this.form.verifyFrequency = moment(this.form.verifyFrequency).format('MM')
          //this.form.expireTime = moment(this.form.expireTime).format('YYYY-MM-DD')
          this.form.measureDeviceName = this.data.deviceName
          this.form.measureDeviceId = this.data.id //设备台账id
          Api.measureBookVerifyApply(this.form).then(res => {
            this.$message.success('申请提交成功')
            this.$emit('update:visible', false)
            this.$refs.form.resetFields()
            this.$emit('refreshTabCheckList', 'check')
          })
        }
      })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.fileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
