<template>
  <el-dialog title="查看活动详情" :visible="visible" width="600px" @close="close">
    <img :src="$getPreviewUrlById(form.imageId)" alt="" />
    <ul>
      <li>
        <span>活动标题: </span><span>{{ form.title }}</span>
      </li>
      <li>
        <span>活动内容: </span><span>{{ form.content }}</span>
      </li>
      <li>
        <span>活动地点: </span><span>{{ form.address }}</span>
      </li>
      <li>
        <span>活动时间: </span><span>{{ form.startTime }} - {{ form.endTime }}</span>
      </li>
      <li>
        <span>活动参与人: </span><span>{{ form.participantNames }}</span>
      </li>
      <li>
        <span>是否推荐到宣传图: </span><span> {{ ['不推荐', '推荐'][form.isRecommendReadvertisingMap] }}</span>
      </li>
      <li>
        <span>是否推荐到头条: </span><span>{{ ['不推荐', '推荐'][form.isRecommendHeadline] }}</span>
      </li>
    </ul>
    <footer slot="footer">
      <el-button @click="close">我知道了</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '../../api'
export default {
  name: 'Detail',
  // import引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    id: {
      default: null,
      type: String
    }
  },
  data() {
    // 这里存放数据
    return {
      // 表单数据
      form: {}
    }
  },
  watch: {
    visible(val) {
      if (val) this.refresh()
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      api.getCcpActivitiById(this.id).then(res => {
        this.form = res.data
      })
    },
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
img {
  width: 600px;
  max-width: unset;
  margin: 0 -20px;
}
ul {
  margin-top: 15px;
  li {
    margin-top: 15px;
    display: flex;
    font-size: 15px;
    span:first-child {
      width: 140px;
      color: #999;
    }
    span:last-child {
      color: #000;
      flex: 1;
    }
  }
}
</style>
