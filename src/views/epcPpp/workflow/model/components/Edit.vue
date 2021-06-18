<template>
  <el-dialog
    width="500px"
    top="10vh"
    :title="isNew ? '新增模型' : '编辑模型'"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="模型分组" prop="categoryId">
        <el-select v-model.trim="form.categoryId">
          <template v-for="type in categoryList">
            <el-option
              v-if="type.id || type.id === categoryId"
              :key="type.id"
              :value="type.id"
              :label="type.name"
            ></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <!-- <el-form-item label="自定义表单">
        <el-checkbox v-model="form.checked">支持</el-checkbox>
      </el-form-item> -->
      <!-- <el-form-item v-if="form.isSingleForm" label="关联表单" prop="associatedForm">
        <el-select v-model="form.associatedForm">
          <el-option v-for="item in formList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" />
      </el-form-item> -->
    </el-form>
    <footer slot="footer">
      <el-button size="mini" @click="$emit('update:visible', false)">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">{{ isNew ? '创建' : '保存' }}</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { workFlowApi } from '../../api/workflow-api'
import { workflow } from '@/utils/axios'
// import SelectProcessCategory from '../../components/SelectProcessCategory'
export default {
  name: 'Edit',
  components: {},
  props: ['id', 'visible', 'categoryId', 'categoryList'],
  data() {
    return {
      form: {
        name: '',
        categoryId: '',
        description: '测试',
        projectId: localStorage.getItem('projectId'),
        isSingleForm: true, // 是否是单表单
        checked: false, // 自定义表单
        associatedForm: '' // 关联表单
      },
      formList: [], // 关联表单
      rules: {
        name: { required: true, message: '请输入模型名称' },
        categoryId: { required: true, message: '请选择模型分组' },
        associatedForm: { required: true, message: '请选择关联表单' }
      },
      modelCategory: []
    }
  },
  computed: {
    isNew() {
      return !this.id
    }
  },
  watch: {
    async visible(val) {
      if (this.id && val) await this.refresh()
      this.$nextTick(() => {
        if (!val) {
          this.$refs.form.resetFields()
        } else {
          this.$refs.form.clearValidate()
        }
      })
    },
    categoryId(val) {
      this.form.categoryId = val
    }
  },
  created() {
    this.id && this.refresh()
    this.queryFormList()
  },
  methods: {
    // 获取模型详情
    async refresh() {
      let result = await workFlowApi.getModel(this.id)
      let datas = result.data
      this.form = Object.assign({}, datas, { categoryId: this.categoryId })
    },
    // 获取自定义表单列表
    async queryFormList() {
      let params = {
        page: 1,
        rows: 100
      }
      let result = await workFlowApi.queryFormList(params)
      let datas = result.data.records || []
      this.formList = datas
    },
    // 提交
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.axios.workflow.post(this.isNew ? 'activiti/model/create' : 'activiti/model/save', this.form).then(() => {
            this.$message.success(this.isNew ? '新建成功' : '修改成功')
            this.$parent.init()
            this.$emit('update:visible', false)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
