<template>
  <div class="container no-padding is-footer">
    <ViewFlow :id="id" />
    <el-form ref="form" label-width="150px">
      <el-card header="基本信息">
        <el-form-item label="期号">
          <div v-text="form.issue"></div>
        </el-form-item>
        <el-form-item label="确认单月份">
          <div v-text="form.confirmMonth"></div>
        </el-form-item>
        <el-form-item label="确认期">
          <div>{{ form.confirmStartDate }} ~ {{ form.confirmEndDate }}</div>
        </el-form-item>
      </el-card>
      <el-card header="工程建设费用">
        <el-form-item label="工程建设费用">
          <div>{{ form.constructionCostSaveDTO.constructionCost || 0 }} 元</div>
        </el-form-item>
        <el-form-item label="附件">
          <FileTable :ids="form.constructionCostSaveDTO.fileIds"></FileTable>
        </el-form-item>
      </el-card>
    </el-form>
    <CheckCard v-if="isCheck" :id="id" ref="checkCard"></CheckCard>
    <div class="footer-btn">
      <el-button v-if="!isCheck" @click="handleCancel">返回</el-button>
      <template v-else>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import { getConfirmDetail, saveConfirm, submitConfirm } from '../../api/confirmation'

export default {
  name: 'Detail',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.params.id,
      isCheck: !!this.$route.query.isCheck,
      form: {
        constructionCostSaveDTO: {}
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      if (this.id) {
        getConfirmDetail(this.id).then(res => {
          this.form = res.data
        })
      }
    },
    handleCancel() {
      this.$router.back()
    },
    handleSubmit() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-card + .el-card {
  margin-top: 15px;
}
</style>
