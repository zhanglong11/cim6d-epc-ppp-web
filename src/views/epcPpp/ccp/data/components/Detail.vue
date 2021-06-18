<template>
  <el-dialog title="查看党员详情" :visible="visible" width="600px" @close="close">
    <el-avatar :size="100"></el-avatar>
    <ul>
      <li><span>党员姓名: </span><span>伟浩宁</span></li>
      <li><span>性别: </span><span>男</span></li>
      <li><span>手机号码: </span><span>15677777777</span></li>
      <li><span>入党时间: </span><span>20021111</span></li>
      <li><span>所属单位及部门: </span><span>建星设计公司 设计部</span></li>
      <li><span>党内职务: </span><span>建星设计公司党支部书记</span></li>
      <li><span>参与活动次数: </span><span>23</span></li>
    </ul>
    <footer slot="footer">
      <el-button @click="close">我知道了</el-button>
    </footer>
  </el-dialog>
</template>

<script>
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
    data: {
      default() {
        return {}
      },
      type: Object
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
    data: {
      immediate: true,
      handler() {
        this.form = this.data
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
/deep/ .el-dialog__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
ul {
  margin-top: 15px;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  li {
    width: 45%;
    margin-top: 15px;
  }
}
</style>
