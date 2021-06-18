<template>
  <div class="is-footer">
    <el-form label-width="140px">
      <el-form-item label="党建要闻标题" required><el-input v-model="form.title"></el-input></el-form-item>
      <el-form-item label="党建要闻简介">
        <el-input v-model="form.briefIntroduction" type="textarea" autosize></el-input>
      </el-form-item>
      <el-form-item label="缩略图">
        <ImageCrop :fileId="form.imageId" @change="e => (form.imageId = e)" />
      </el-form-item>
      <el-form-item label="要闻来源"><el-input v-model="form.source"></el-input></el-form-item>
      <el-form-item label="是否推荐到宣传图">
        <el-radio-group v-model="form.isRecommendReadvertisingMap">
          <el-radio :label="1">推荐</el-radio>
          <el-radio :label="0">不推荐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否推荐到头条">
        <el-radio-group v-model="form.isRecommendHeadline">
          <el-radio :label="1">推荐</el-radio>
          <el-radio :label="0">不推荐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="党建要闻详情" required>
        <Editor v-model="form.content"></Editor>
      </el-form-item>
    </el-form>
    <div class="footer-btn">
      <el-button v-promise-btn size="large" type="primary" @click="submit">保存</el-button>
      <el-button size="large" @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script>
import api from '../api'
import Editor from './components/Editor'
import ImageCrop from '@/components/ImageCrop'
export default {
  name: 'Edit',
  // import引入的组件需要注入到对象中才能使用
  components: { Editor, ImageCrop },
  data() {
    // 这里存放数据
    return {
      form: {
        projectId: localStorage.getItem('projectId'),
        isRecommendReadvertisingMap: 0,
        isRecommendHeadline: 0
      },
      id: this.$route.params.id
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    if (this.id) {
      this.refresh()
    }
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      return api.getCcpNewsById(this.id).then(res => {
        this.form = res.data
      })
    },
    // 提交
    submit() {
      return api.saveCcpNews(this.form).then(res => {
        this.$message.success('成功')
        this.$router.back()
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.el-form {
  max-width: 1200px;
}
</style>
