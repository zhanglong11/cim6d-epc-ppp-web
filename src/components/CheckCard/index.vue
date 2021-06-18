<template>
  <div style="padding: 20px 0px">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>审核</span>
        <el-button type="text" style="float: right; padding: 3px 0"></el-button>
      </div>
      <!-- 加载自定义表单 start -->
      <fm-generate-form ref="generateFormRef" class="fm-generate-form" :data="jsonData" style="width: 70%" />
      <!-- 加载自定义表单 end -->
    </el-card>
  </div>
</template>

<script>
import FileUploadWithImg from '@/components/FileUploadWithImg'
import FileApi from '@/api/file'
import { workBenchApi } from '@/api/work-bench'
import { workFlowApi } from '@/views/workflow/api/workflow-api'
export default {
  name: 'CheckCard',
  //components: { FileUploadWithImg },
  props: {
    // targetId
    id: {
      type: [Number, String],
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    receiptNumber: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      jsonData: {}
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name
    }
  },
  mounted() {
    this.getTaskForm()
  },
  methods: {
    // 获取任务表单
    async getTaskForm() {
      if (!this.id) {
        return
      }
      let result = await workFlowApi.getTaskForm(this.id)
      let datas = result.data
      if (!datas) {
        return
      }
      this.jsonData = JSON.parse(datas.template)
      this.getFormData()
    },
    // 判断表单数据
    async getFormData() {
      let models = await this.$refs.generateFormRef.models
      // 自动填充审批人
      if (models.auditPerson === '') {
        this.$refs.generateFormRef.setData({
          auditPerson: this.userName
        })
      }
      // 自动填充收货数量
      if (models.receiptNumber === '') {
        this.$refs.generateFormRef.setData({
          receiptNumber: this.receiptNumber
        })
      }
    },
    // 审批 验证表单-异步获取表单数据
    async audit() {
      let formData = await this.$refs.generateFormRef.getData()
      this.auditSuccess(formData)
    },
    // 动态表单审批流程
    async auditSuccess(formData) {
      if (!this.id) {
        return
      }
      await workBenchApi.completeTask(this.id, formData)
      this.$message.success('审核成功')
      this.$store.commit('approvalCompleted')
    }
  }
}
</script>
<style lang="less" scoped>
.checkWrapper {
  display: flex;
  .checkForm {
    flex: 1;
    .inputStyle {
      width: 500px;
    }
  }
  .checkUpload {
    flex: 1;
  }
}
/deep/ .el-upload {
  text-align: left !important;
}
.fm-generate-form {
  /deep/ .el-form-item {
    .el-form-item__label::after {
      content: unset;
    }
  }
}
</style>
