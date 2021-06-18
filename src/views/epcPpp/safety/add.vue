<template>
  <div class="container no-padding is-footer fixedHeight">
    <div class="innerContainer white">
      <div class="formWrapper">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px" class="form-con">
          <el-form-item label="问题部位" prop="locationName">
            <el-input v-model="form.locationName" class="inputStyle" disabled placeholder="请选择问题部位">
              <template slot="append"><span class="btn" @click="handleSelect">选择</span></template>
            </el-input>
          </el-form-item>
          <!--<el-form-item label="工程类别" prop="engineeringCategory">
            <el-select v-model="form.engineeringCategory" class="inputStyle" clearable placeholder="工程类型">
              <el-option v-for="item in engineeringTypeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="问题类型" prop="issueType">
            <el-select v-model="form.issueType" class="inputStyle" clearable placeholder="问题类型">
              <el-option
                v-for="item in safetyQuestionTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="现场照片" prop="imageIds">
            <Upload v-model="form.imageIds" listType="picture-card" class="form-input" isOnlyButton multiple>
              <div slot="btn">
                <el-button size="mini"
                  ><i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px"></i>上传照片</el-button
                >
              </div>
            </Upload>
          </el-form-item>
          <el-form-item label="问题描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              class="inputStyle"
              placeholder="问题描述"
              :autosize="{ minRows: 4, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="整改要求" prop="rectificationRequirement">
            <el-input
              v-model="form.rectificationRequirement"
              type="textarea"
              class="inputStyle"
              placeholder="整改要求"
              :autosize="{ minRows: 4, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="责任人" prop="pushPersonId">
            <SelectUser
              :id.sync="form.pushPersonId"
              :multiple="false"
              :clearable="false"
              :value="form.pushPersonId ? { id: form.pushPersonId, label: form.pushPersonName } : null"
              :name.sync="form.pushPersonName"
              class="inputStyle"
            >
            </SelectUser>
          </el-form-item>
          <el-form-item label="整改期限" prop="rectificationDate">
            <el-date-picker
              v-model="form.rectificationDate"
              type="date"
              placeholder="请选择截止日期"
              class="inputStyle"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="form.locationId" class="bimContainer">
        <BimShow
          ref="BIMRef"
          idSelect="progress"
          type="2d"
          isAddAnchor
          :isLoadAll="false"
          anchorType="safe"
          class="bim-box-progress"
          @changeAnchor="changeAnchor"
        />
      </div>
    </div>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-promise-btn type="primary" size="lg" @click="handleSubmit">保存</el-button>
    </div>
    <SelectPositionModal
      :visible.sync="selectPositionVisible"
      :defaultId="form.locationId"
      @submit="handleSelectPositionSubmit"
    ></SelectPositionModal>
  </div>
</template>

<script>
import Api from './api'
import SelectPositionModal from '../quality/components/SelectPositionModal'
import BimShow from '../home/components/bimShow'
export default {
  name: 'SafetyQuestionAdd',
  components: {
    SelectPositionModal,
    BimShow
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      id: this.$route.query.id || '',
      selectPositionVisible: false, //选择位置可见性
      form: {},
      formRules: {
        locationName: [{ required: true, message: '请选择问题部位', trigger: 'blur' }],
        issueType: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
        description: [{ required: true, message: '请输入问题描述', trigger: 'blur' }],
        pushPersonId: [{ required: true, message: '请选择责任人', trigger: 'change' }],
        rectificationDate: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
      }
    }
  },
  computed: {
    //工程类型
    engineeringTypeList() {
      return (
        this.$getArgList('epcPPPEngineeringType') || [
          { value: 1, label: '混凝土工程' },
          { value: 2, label: '模板工程' },
          { value: 3, label: '钢筋工程' },
          { value: 4, label: '砌体工程' },
          { value: 5, label: '防水工程1' }
        ]
      )
    },
    //问题类型
    safetyQuestionTypeList() {
      return this.$getArgList('epcPPPSafetyIssueType') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.form = { ...res.data }
    },
    //选择位置
    handleSelect() {
      this.selectPositionVisible = true
    },
    //选择位置确定
    handleSelectPositionSubmit(data) {
      this.form.locationName = data.initLabel || data.label
      this.form.locationId = data.id
      this.form.viewId = data.viewId
      this.form.modelId = data.modelId
      this.selectPositionVisible = false
      this.$nextTick(() => {
        this.$refs.BIMRef.bimInit(
          [
            {
              id: data.modelId,
              viewId: data.viewId,
              name: data.label
            }
          ],
          true
        )
      })
    },
    // 获取添加的点位构件ID集合和坐标集合
    changeAnchor({ componentIds, componentPos }) {
      this.form.componentIds = componentIds
      this.form.componentPos = componentPos
    },
    //点击保存
    async handleSubmit() {
      if (!this.form.locationId) {
        this.$message.error('请选择问题部位！')
        return
      }
      if (!this.form.componentIds || this.form.componentIds.length === 0) {
        this.$message.error('请添加问题构件！')
        return
      }
      await this.$refs['formRef'].validate()
      let res = ''
      if (this.id) {
        res = await Api.update({
          ...this.form,
          projectId: this.projectId
        })
      } else {
        res = await Api.add({
          ...this.form,
          projectId: this.projectId
        })
      }
      this.$message.success('保存成功')
      this.goBack()
    },
    // 返回
    goBack() {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.formWrapper {
  width: 60%;
  background-color: #fff;
  .inputStyle {
    width: 400px;
  }
  .btn {
    cursor: pointer;
  }
}
.bimContainer {
  height: 800px;
}
/deep/ .el-upload--picture-card {
  background-color: #fbfdff;
  border: none;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 148px;
  height: 50px;
  line-height: 50px;
  vertical-align: top;
  display: block;
}
</style>
