<template>
  <div class="container">
    <el-form label-width="140px">
      <el-form-item label="党建要闻标题">
        <div>{{ form.title }}</div>
      </el-form-item>
      <el-form-item label="党建要闻简介">
        <div>{{ form.briefIntroduction }}</div>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="要闻来源">
            <div>{{ form.source }}</div>
          </el-form-item>
          <el-form-item label="是否推荐到宣传图">
            <div>{{ ['不推荐', '推荐'][form.isRecommendReadvertisingMap] }}</div>
          </el-form-item>
          <el-form-item label="是否推荐到头条">
            <div>{{ ['不推荐', '推荐'][form.isRecommendHeadline] }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="上传人">
            <div>{{ form.creatorName }}</div>
          </el-form-item>

          <el-form-item label="上传时间">
            <div>{{ form.createTime }}</div>
          </el-form-item>

          <el-form-item label="阅读人数">
            <div>{{ form.readingNum }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="宣传图">
            <el-image :src="$getPreviewUrlById(form.imageId)"></el-image>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="党建要闻详情">
        <div v-html="form.content"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '../api'
import file from '@/api/file'
export default {
  name: 'Edit',
  // import引入的组件需要注入到对象中才能使用
  components: {},
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
        if (res.data.imageId) {
        }
        this.form = res.data
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
