<template>
  <el-dialog title="查看党员详情" :visible="visible" width="600px" @close="close">
    <el-avatar
      :key="form.partyMemberImageIds"
      :size="100"
      :src="$getPreviewUrlById(form.partyMemberImageIds)"
    ></el-avatar>
    <ul>
      <li>
        <span>党员姓名: </span><span>{{ form.partyMemberName }}</span>
      </li>
      <li>
        <span>性别: </span><span>{{ ['男', '女'][form.sex - 1] }}</span>
      </li>
      <li>
        <span>手机号码: </span><span>{{ form.mobile }}</span>
      </li>
      <li>
        <span>入党日期: </span><span>{{ form.joinPartyTime | ymd }}</span>
      </li>
      <li style="width: 100%">
        <span>所属单位及部门: </span
        ><span>{{ form.partyMemberCompanyName + ' —— ' + form.partyMemberDepartmentName }}</span>
      </li>
      <li>
        <span>党内职务: </span><span>{{ form.partyPosition }}</span>
      </li>
    </ul>
    <footer slot="footer">
      <el-button @click="close">我知道了</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/views/epcPpp/ccp/api'

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
        if (this.id) {
          this.form = await api.getCcpMemberById(this.id).then(res => res.data)
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
