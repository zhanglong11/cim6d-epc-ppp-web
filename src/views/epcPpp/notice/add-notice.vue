<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '编辑公告' : '新建公告' }}</span>
      </div>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="150px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="公告标题" prop="title">
              <el-input v-model="formData.title" placeholder="请输入公告标题" class="form-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="公告内容" prop="content">
              <el-input
                v-model="formData.content"
                class="form-input"
                type="textarea"
                :rows="8"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="接收人" required>
              <SelectUser
                :id.sync="selectPerson.personId"
                :value="selectPerson.personId ? selectPerson.list : null"
                :name.sync="selectPerson.personName"
                :multiple="true"
                @input="changeUser"
              ></SelectUser>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="附件" required>
              <Upload v-model="formData.fileIds" multiple></Upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" :loading="isLoading" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { noticeApi } from './api'

export default {
  name: 'AddNoticeEpcPpp',
  components: {},
  data() {
    // 这里存放数据
    return {
      id: this.$route.query.id || '',
      isLoading: false,
      // 选择的接收人
      selectPerson: {
        personId: '',
        personName: '',
        list: []
      },
      formData: {
        title: '',
        // 只新建个人消息
        type: 2,
        companyId: this.$store.state.user.companyId,
        receiverId: this.$store.state.user.id,
        content: '',
        projectId: this.$store.state.project.projectId,
        personList: [],
        fileIds: '' // 附件
      },
      formRules: {
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.getDetailsMessage()
  },
  // 方法集合
  methods: {
    // 获取消息详情
    async getDetailsMessage() {
      if (!this.id) {
        return
      }
      const result = await noticeApi.getDetailsNotice(this.id)
      const datas = result.data
      this.formData = Object.assign({}, datas)
    }, // 选择分配人
    changeUser(e) {
      if (!e) {
        return
      }
      let list = []
      let personList = []
      e.map(item => {
        list.push({
          id: item.id,
          label: item.label
        })
        personList.push({
          personId: item.id,
          personName: item.label
        })
      })
      this.selectPerson.list = list
      this.formData.personList = personList
    },
    // 保存并提交
    save() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.saveSuccess()
        } else {
          this.$message({
            type: 'error',
            message: '请完善表单!'
          })
          return false
        }
      })
    },
    // 保存 - 异步
    async saveSuccess() {
      if (this.formData.personList.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择接收人!'
        })
        return
      }
      try {
        this.isLoading = true
        if (this.id) {
          await noticeApi.updateNotice(this.formData)
        } else {
          await noticeApi.addNotice(this.formData)
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        this.goBack()
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
      }
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.form-con {
  padding-right: 15%;
}

.form-input {
  width: 100%;
}

.inline-input {
  width: 30%;
  display: inline-block;
}
/deep/.el-card {
  overflow: visible;
}
</style>
