<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: f6235cbfaf3bf5ceedf8e41bae54f2fb51cae4d1
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，计量器具采购计划审核 搜索的时间组件添加时分秒，审核和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <!-- 流程图 start -->
    <ViewFlow :id="$route.params.id" />
    <!-- 流程图 end -->
    <div class="detail-a">
      <div class="detail-a-head">
        <div>审核{{ data.deviceName }}</div>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>规格型号</span>
            <span>{{ data.specification }}</span>
          </div>
          <div>
            <span>测量范围</span>
            <span>{{ data.measureMin }}~{{ data.measureMax }} {{ data.measureUnit }}</span>
          </div>
          <div>
            <span>精度等级</span>
            <span>{{ data.step }}</span>
          </div>
          <div>
            <span>计划状态</span>
            <span v-if="data.status === 0">草稿</span>
            <span v-else-if="data.status === 1">待审核</span>
            <span v-else-if="data.status === 2">已通过</span>
            <span v-else-if="data.status === 3">已驳回</span>
          </div>
        </div>
        <div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="remark">
            <span>计划备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="audit-a">
      <!-- <div class="audit-a-head">审核结果</div>
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
import Api from '@/api/science/audit/measurePurchase'
export default {
  name: 'AuditMeasurePurchase',
  data() {
    return {
      data: {
        id: '',
        deviceName: '',
        measureMin: '',
        measureMax: '',
        measureUnit: '',
        specification: '',
        step: '',
        remark: ''
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
      Api.getMeasurePurchaseDetailAuditResult(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleCancel() {
      this.$router.push({ name: 'MeasurePurchaseAudit' })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.auditStatus = this.form.auditStatus ? true : false
          this.form.id = this.data.id
          Api.submitMeasurePurchaseAudit(this.form).then(res => {
            this.$message.success('待审核：提交成功')
            this.$router.push({ name: 'MeasurePurchaseAudit' })
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
