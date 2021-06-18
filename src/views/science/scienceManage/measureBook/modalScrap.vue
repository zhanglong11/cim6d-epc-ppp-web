<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2d2f6e9e411e7d7453167097561f6240b7cb626d
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整，后续检定校准、故障维修、封存、报废模态框的时间组件添加时分秒
@补加代码注释日期: 2020-04-11
-->
<template>
  <el-dialog :title="'申请报废'" :visible="visible" @close="onCancel">
    <div style="font-weight: bold; font-size: 14px; padding-bottom: 14px">
      <span style="margin-right: 14px">{{ data.specification }}</span>
      <span style="margin-right: 14px">{{ data.deviceName }}</span>
      <span style="margin-right: 14px">{{ data.manufacturer }}</span>
    </div>
    <el-form ref="form" :model="form" :rules="formRules" label-width="120px">
      <el-form-item label="报废原因" prop="scrapReason">
        <el-input
          v-model="form.scrapReason"
          type="textarea"
          :row="2"
          placeholder="请输入报废原因"
          style="width: 80%"
        ></el-input>
      </el-form-item>
      <el-form-item label="报废时间" prop="scrapTime">
        <el-date-picker
          v-model="form.scrapTime"
          placeholder="请选择"
          style="width: 80%"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
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
  name: 'ModalScrap',
  props: {
    visible: Boolean,
    data: Object
  },
  data() {
    return {
      form: {
        scrapReason: '',
        scrapTime: '',
        projectId: localStorage.getItem('projectId')
      },
      formRules: {
        scrapReason: [{ required: true, message: '请输入报废原因' }],
        scrapTime: [{ required: true, message: '请选择报废时间' }]
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
          //this.form.scrapTime = moment(this.form.scrapTime).format('YYYY-MM-DD')
          this.form.measureDeviceName = this.data.deviceName
          this.form.measureDeviceId = this.data.id //设备台账id
          Api.measureBookScrapApply(this.form).then(res => {
            this.$message.success('申请提交成功')
            this.$emit('update:visible', false)
            this.$refs.form.resetFields()
            this.$emit('refreshTabScrapList', 'scrap')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
