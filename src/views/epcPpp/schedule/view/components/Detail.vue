<template>
  <el-dialog title="查看" :visible="visible" width="800px" @close="close">
    <ul>
      <li v-for="record in form.recordList" :key="record.createTime">
        <h3>{{ ['延期解决方案', '延后所有关联进度', '提前所有关联进度'][record.type] }}</h3>
        <p>
          <span>发布时间:</span><span>{{ record.createTime }}</span>
        </p>

        <p v-if="record.type === 0">
          <span>详细内容:</span><span>{{ record.changeReason || record.program }}</span>
        </p>
        <p v-if="record.type === 1">
          <span>延长时长:</span><span>{{ record.changeDays }} 天</span>
        </p>
        <p v-if="record.type === 1">
          <span>延后原因:</span><span>{{ record.changeReason }}</span>
        </p>
        <p v-if="record.type === 2">
          <span>提前时长:</span><span>{{ record.changeDays }} 天</span>
        </p>
        <p v-if="record.type === 2">
          <span>提前原因:</span><span>{{ record.changeReason }}</span>
        </p>
      </li>
    </ul>
    <footer slot="footer">
      <el-button @click="close">我知道了</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/views/epcPpp/schedule/api'

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
    taskId: {
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
    async visible(val) {
      if (val) {
        if (this.taskId) {
          this.form = await api.getScheduleTaskById(this.taskId).then(res => res.data)
        } else {
          this.form = {}
        }
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
ul {
  li {
    margin-bottom: 10px;
    h3 {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 16px;
    }
    p {
      margin-bottom: 10px;
    }
    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>
