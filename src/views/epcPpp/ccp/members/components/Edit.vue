<template>
  <el-dialog :title="form.id ? '修改党员信息' : '新增党员'" :visible="visible" width="600px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="选择人员">
        <SelectUser
          v-model="form.partyMemberId"
          value-format="id"
          :name.sync="form.partyMemberName"
          :multiple="false"
          @change="handleUserChange"
        ></SelectUser>
      </el-form-item>
      <el-form-item label="党员姓名" prop="partyMemberName">
        <el-input v-model="form.partyMemberName" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex" disabled>
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="form.mobile" disabled></el-input>
      </el-form-item>
      <el-form-item label="所属单位及部门" prop="partyMemberCompanyName">
        <el-input
          :value="(form.partyMemberCompanyName || '') + ' —— ' + (form.partyMemberDepartmentName || '')"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="入党日期" prop="joinPartyTime">
        <el-date-picker v-model="form.joinPartyTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="党内职务" prop="partyPosition">
        <el-input v-model="form.partyPosition"></el-input>
      </el-form-item>
      <el-form-item label="党员照片" prop="partyMemberImageIds">
        <div class="avatar-wrap">
          <el-avatar :key="form.partyMemberImageIds" :size="80" :src="$getPreviewUrlById(form.partyMemberImageIds)" />
          <i id="pick-avatar" class="el-icon-edit-outline" />
        </div>
        <avatar-cropper
          trigger="#pick-avatar"
          :upload-headers="{ 'x-access-token': $store.state.user.token }"
          :upload-url="axios.file.defaults.baseURL + '/file/commonFile/upload'"
          :output-options="{ width: 200, height: 200 }"
          @uploaded="res => $set(form, 'partyMemberImageIds', res.data)"
        />
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">保存</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import globalApi from '@/api'
import AvatarCropper from 'vue-avatar-cropper'
import api from '../../api'

export default {
  name: 'Edit',
  // import引入的组件需要注入到对象中才能使用
  components: { AvatarCropper },
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
      form: {},
      // 表单验证规则
      rules: {
        partyMemberName: [{ required: true, message: '必填' }],
        sex: [{ required: true, message: '必填' }],
        joinPartyTime: [{ required: true, message: '必填' }],
        partyMemberDepartmentName: [{ required: true, message: '必填' }],
        partyMemberImageIds: [{ required: true, message: '必填' }]
      }
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
      this.$refs.form.clearValidate()
    },
    // 选人改变后
    handleUserChange(node) {
      this.$set(this.form, 'partyMemberDepartmentId', node.organId)
      this.$set(this.form, 'partyMemberDepartmentName', node.organName)
      globalApi.getUserById(node.id).then(res => {
        this.$set(this.form, 'sex', res.data.sex)
        this.$set(this.form, 'mobile', res.data.mobile)
        this.$set(this.form, 'partyMemberCompanyName', res.data.companyName)
        this.$set(this.form, 'partyMemberCompanyId', res.data.companyId)
      })
    },
    //提交
    async submit() {
      await this.$refs.form.validate()
      if (this.form.id) {
        await api.updateCcpMember(this.form)
      } else {
        await api.addCcpMember(this.form)
      }

      this.$message.success('成功')
      this.close()
      this.$parent.refresh()
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
