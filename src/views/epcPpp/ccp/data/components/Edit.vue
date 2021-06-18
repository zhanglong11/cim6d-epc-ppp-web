<template>
  <el-dialog :title="form.id ? '修改党员信息' : '新增党员'" :visible="visible" width="600px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="资料名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="上传文件" prop="fileId">
        <Upload v-model="form.fileId" :fileType.sync="form.fileType" is-only-button></Upload>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" autosize></el-input>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">提交</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '../../api'
export default {
  name: 'Edit',
  // import引入的组件需要注入到对象中才能使用
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
      form: {},
      // 表单验证规则
      rules: {
        name: [{ required: true, message: '必填' }],
        fileId: [{ required: true, message: '必填' }]
      }
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
    },
    // 提交
    async submit() {
      await this.$refs.form.validate()
      await api.addCcpData(this.form)
      this.$message.success('成功')
      this.$parent.refresh()
      this.close()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.avatar-wrap {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  #pick-avatar {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    height: 25px;
    color: #fff;
    text-align: center;
    line-height: 25px;
  }
}
</style>
