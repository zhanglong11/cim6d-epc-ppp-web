<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 195b48c9bfb82c8020f63d38cf3a755de4e65793
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具检定/校准审核 搜索的时间组件添加时分秒，审核和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="$route.params.id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.measureDeviceName }}</div>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>规格型号</span>
            <span>{{ data.measureDeviceSimple.specification }}</span>
          </div>
          <div>
            <span>测量范围</span>
            <span
              >{{ data.measureDeviceSimple.measureMin }} ~ {{ data.measureDeviceSimple.measureMax }}
              {{ data.measureDeviceSimple.measureUnit }}</span
            >
          </div>
          <div>
            <span>精度等级</span>
            <span>{{ data.measureDeviceSimple.step }}</span>
          </div>
          <div>
            <span>设备状态</span>
            <span v-if="data.measureDeviceSimple.deviceStatus === 0">停用</span>
            <span v-else-if="data.measureDeviceSimple.deviceStatus === 1">在用</span>
            <span v-else-if="data.measureDeviceSimple.deviceStatus === 2">封存</span>
            <span v-else-if="data.measureDeviceSimple.deviceStatus === 3">报废</span>
          </div>
          <div>
            <span>状态</span>
            <span v-if="data.status === 0">检定待审核</span>
            <span v-else-if="data.status === 1">检定已通过</span>
            <span v-else-if="data.status === 2">检定已驳回</span>
          </div>
          <div>
            <span>出厂编号</span>
            <span>{{ data.measureDeviceSimple.manufactureNum }}</span>
          </div>
          <div>
            <span>制造厂商</span>
            <span>{{ data.measureDeviceSimple.manufacturer }}</span>
          </div>
          <div>
            <span>检定时间</span>
            <span>{{ data.verifyTime }}</span>
          </div>
        </div>
        <div>
          <div>
            <span>检定周期(天)</span>
            <span>{{ data.verifyFrequency }}</span>
          </div>
          <div>
            <span>有效期至</span>
            <span>{{ data.expireTime }}</span>
          </div>
          <div>
            <span>检定结论</span>
            <span v-if="data.verifyResult === 0">不合格</span>
            <span v-else-if="data.verifyResult === 1">合格</span>
          </div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="accessory">
            <div>附件</div>
            <div>
              <FileList :ids="data.fileId" />
            </div>
          </div>
          <div class="remark">
            <span>备注</span>
            <span>{{ data.measureDeviceSimple.remark }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="audit-a">
      <!--<div class="audit-a-head">审核结果</div>
      <el-form ref="form" class="audit-a-form" :model="form" :rules="formRules" label-positon="left" label-width="96px">
        <div style="display: flex;">
          <div style="flex: 1">
            <el-form-item label="审核结果" prop="auditStatus">
              <el-radio-group v-model="form.auditStatus">
                <el-radio :label="1">已通过</el-radio>
                <el-radio :label="0">已驳回</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核意见" prop="auditOpinion">
              <el-input v-model="form.auditOpinion" type="textarea" :rows="2" placeholder="请输入审核意见"></el-input>
            </el-form-item>
          </div>
          <div style="flex: 1">
            <el-form-item label="文件上传">
              <FileUpload @input="setFileId" />
            </el-form-item>
          </div>
        </div>
      </el-form>-->
      <CheckCard :id="$route.params.id" ref="checkCard" @emit="changeAudit"></CheckCard>
    </div>

    <div class="detail-c">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/audit/measureCheck'
export default {
  name: 'AuditMeasureCheck',
  data() {
    return {
      data: {
        id: '',
        measureDeviceName: '',
        status: '',
        verifyTime: '',
        verifyFrequency: '',
        expireTime: '',
        creatorName: '',
        createTime: '',
        fileId: '',
        measureDeviceSimple: {
          specification: '',
          measureMin: '',
          measureMax: '',
          measureUnit: '',
          step: '',
          manufactureNum: '',
          manufacturer: '',
          deviceStatus: '',
          remark: ''
        }
      },
      form: {
        auditStatus: '',
        auditOpinion: '',
        auditFileId: null
      },
      formRules: {
        auditStatus: [{ required: true, message: '请选择审核结果' }]
      }
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getMeasureCheckDetail(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleCancel() {
      this.$router.push({ name: 'MeasureCheckAudit' })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.auditStatus = this.form.auditStatus ? true : false
          this.form.id = this.data.id
          Api.submitMeasureCheckAudit(this.form).then(res => {
            this.$message.success('检定待审核：提交成功')
            this.$router.push({ name: 'MeasureCheckAudit' })
          })
        }
      })
    },
    setFileId(fileIds) {
      //console.log(fileIds)
      this.form.auditFileId = fileIds.join(',') ? fileIds.join(',') : null
    }
  }
}
</script>

<style scoped lang="less"></style>
