<!--
@bug名称: 1193/检定周期是输入数字，不需要根据年月选择
@开发人员: 董渊海
@修改日期: 2020-03-19
@任务类型: 修改代码，将检定周期组件更换为el-input-number，修改比例(8%)

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2d2f6e9e411e7d7453167097561f6240b7cb626d
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具台账 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整，后续检定校准、故障维修、封存、报废模态框的时间组件添加时分秒
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="form-d">
      <el-form ref="form" :model="form" :rules="formRules" label-positon="left" label-width="148px">
        <div class="form-d-head">计量器具基本信息</div>
        <div class="form-d-body">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="采购申请" prop="purchasePlanId">
                <el-select
                  v-model="form.purchasePlanId"
                  placeholder="请选择采购申请"
                  style="width: 100%"
                  @change="handleApplyChange"
                >
                  <el-option
                    v-for="item in applyList"
                    :key="item.id"
                    :label="item.deviceName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="规格型号" prop="specification">
                <el-input v-model="form.specification" placeholder="请输入规格型号" disabled></el-input>
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
                        disabled
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
                        disabled
                      ></el-input-number>
                    </el-form-item>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="制造厂商" prop="manufacturer">
                <el-input v-model="form.manufacturer" placeholder="请输入制造厂商"></el-input>
              </el-form-item>
              <el-form-item label="负责人" prop="principalName">
                <el-input v-model="form.principalName" placeholder="请输入负责人"></el-input>
              </el-form-item>
              <el-form-item label="检定周期(月)" prop="verificationFrequency">
                <!--<el-date-picker
                  v-model="form.verificationFrequency"
                  placeholder="请选择"
                  type="month"
                  format="MM"
                  style="width: 100%;"
                ></el-date-picker>-->
                <el-input-number
                  v-model="form.verificationFrequency"
                  controls-position="right"
                  placeholder="请输入检定周期"
                  :min="1"
                  :step="1"
                  step-strictly
                  style="width: 100%"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="最后一次检定时间" prop="latestVerifyTime">
                <el-date-picker
                  v-model="form.latestVerifyTime"
                  placeholder="请选择"
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="检定结论" prop="latestVerifyResult">
                <el-select v-model="form.latestVerifyResult" placeholder="请选择检定结论" style="width: 100%">
                  <el-option label="合格" :value="1"></el-option>
                  <el-option label="不合格" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备状态" prop="deviceStatus">
                <el-select v-model="form.deviceStatus" placeholder="请选择设备状态" style="width: 100%">
                  <el-option label="在用" :value="1"></el-option>
                  <el-option label="停用" :value="2"></el-option>
                  <el-option label="封存" :value="3"></el-option>
                  <el-option label="报废" :value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传">
                <FileUpload :fileRecover="fileList" multiple :limit="9" @input="setFileId"></FileUpload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="器具名称" prop="deviceName">
                <el-input v-model="form.deviceName" placeholder="请输入器具名称" disabled></el-input>
              </el-form-item>
              <el-form-item label="精度等级" prop="step">
                <el-input-number
                  v-model="form.step"
                  controls-position="right"
                  placeholder="请输入精度等级"
                  :max="100000000"
                  style="width: 100%"
                  disabled
                ></el-input-number>
              </el-form-item>
              <el-form-item label="单位" prop="measureUnit">
                <el-input v-model="form.measureUnit" placeholder="请输入单位" disabled></el-input>
              </el-form-item>
              <el-form-item label="出厂编号" prop="manufactureNum">
                <el-input v-model="form.manufactureNum" placeholder="请输入出厂编号"></el-input>
              </el-form-item>
              <el-form-item label="启用日期" prop="enableTime">
                <el-date-picker
                  v-model="form.enableTime"
                  placeholder="请选择"
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="配备地点" prop="location">
                <el-input v-model="form.location" placeholder="请输入配备地点"></el-input>
              </el-form-item>
              <el-form-item label="管理类别" prop="manageCategory">
                <el-select v-model="form.manageCategory" placeholder="请选择管理类别" style="width: 100%">
                  <el-option label="A" value="A"></el-option>
                  <el-option label="B" value="B"></el-option>
                  <el-option label="C" value="C"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="有效期至" prop="expireTime">
                <el-date-picker
                  v-model="form.expireTime"
                  placeholder="请选择"
                  style="width: 100%"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <div class="form-d-gutter"></div>

      <div class="form-d-button">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/measureBook'
import FileApi from '@/api/file'
export default {
  name: 'OperationMeasureBook',
  data() {
    return {
      fileList: [],
      applyList: [],
      form: {
        id: '',
        projectId: localStorage.getItem('projectId'),
        purchasePlanId: '',
        deviceName: '',
        specification: '',
        step: undefined,
        measureMin: undefined,
        measureMax: undefined,
        measureUnit: '',
        manufacturer: '',
        manufactureNum: '',
        principalName: '',
        enableTime: '',
        verificationFrequency: undefined,
        location: '',
        latestVerifyTime: '',
        manageCategory: '',
        latestVerifyResult: '',
        expireTime: '',
        deviceStatus: '',
        remark: '',
        fileId: null
      },
      formRules: {
        purchasePlanId: [{ required: true, message: '请选择采购申请' }],
        deviceName: [{ required: true, message: '请输入器具名称' }],
        specification: [{ required: true, message: '请输入规格型号' }],
        step: [{ required: true, message: '请输入精度等级' }],
        measureMin: [{ required: true, message: '请输入下限' }],
        measureMax: [{ required: true, message: '请输入上限' }],
        measureUnit: [{ required: true, message: '请输入单位' }],
        manufacturer: [{ required: true, message: '请输入制造厂商' }],
        manufactureNum: [{ required: true, message: '请输入出厂编号' }],
        principalName: [{ required: true, message: '请输入负责人' }],
        enableTime: [{ required: true, message: '请选择启用日期' }],
        verificationFrequency: [{ required: true, message: '请输入检定周期' }],
        location: [{ required: true, message: '请输入配备地点' }],
        latestVerifyTime: [{ required: true, message: '请选择最后一次检定日期' }],
        manageCategory: [{ required: true, message: '请选择管理类别' }],
        latestVerifyResult: [{ required: true, message: '请选择检定结论' }],
        expireTime: [{ required: true, message: '请选择有效期' }],
        deviceStatus: [{ required: true, message: '请选择设备状态' }]
      }
    }
  },
  mounted() {
    //采购申请下拉框数据
    Api.getMeasurePurchaseList({
      projectId: localStorage.getItem('projectId'),
      status: '2', //只查询审核已通过的
      page: 1,
      rows: 10000
    }).then(res => {
      this.applyList = res.data.records

      //编辑数据回显
      this.form.id = this.$route.params.id ? this.$route.params.id : ''
      if (this.form.id) {
        Api.getMeasureBookDetail(this.form.id).then(res => {
          let data = res.data
          if (data) {
            this.form = data
            if (this.form.fileId) {
              let fileIds = this.form.fileId.split(',')
              FileApi.getFileList(fileIds).then(res => {
                if (res.data) {
                  this.fileList = res.data
                }
              })
            }
          }
        })
      }
    })
  },
  methods: {
    onCancel() {
      this.$router.back()
    },
    //采购申请选择事件
    handleApplyChange(val) {
      for (let i = 0; i < this.applyList.length; i++) {
        if (val === this.applyList[i].id) {
          /*
           * @任务编号:1506 || 测量范围问题解决
           * @开发人员:张龙
           * @日期:2020-04-07
           * @任务类型:修改代码
           */
          this.form.deviceName = this.applyList[i].deviceName
          this.form.specification = this.applyList[i].specification
          this.form.step = this.applyList[i].step
          this.form.measureMin = this.applyList[i].measureMin
          this.form.measureMax = this.applyList[i].measureMax
          this.form.measureUnit = this.applyList[i].measureUnit
        }
      }
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //this.form.verificationFrequency = moment(this.form.verificationFrequency).format('MM')
          //this.form.enableTime = moment(this.form.enableTime).format('YYYY-MM-DD')
          //this.form.latestVerifyTime = moment(this.form.latestVerifyTime).format('YYYY-MM-DD')
          //this.form.expireTime = moment(this.form.expireTime).format('YYYY-MM-DD')

          if (this.form.id) {
            Api.editMeasureBook(this.form).then(res => {
              this.$message.success('修改成功')
              this.$router.push({ name: 'MeasureBook' })
            })
          } else {
            Api.addMeasureBook(this.form).then(res => {
              this.$message.success('新增成功')
              this.$router.push({ name: 'MeasureBook' })
            })
          }
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
