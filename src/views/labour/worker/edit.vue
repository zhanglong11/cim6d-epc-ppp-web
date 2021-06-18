<template>
  <!--
/**
任务名称：2845/【智慧工地2.0-前端】劳务管理》工人信息》列表、新增、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-2日
任务类型：1、全新代码
**/
-->
  <div style="background-color: unset; width: 1130px; margin: 0 auto">
    <el-card>
      <div slot="header" class="card-header">
        <span>{{ $route.meta.title }}</span>
      </div>
      <el-form ref="form" :disabled="$route.meta.type === 'view'" :model="form" :rules="rules" label-width="140px">
        <div v-show="step === 1" class="formStep">
          <el-form-item label="人员姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="政治面貌">
            <SelectArg v-model="form.politicsStatus" arg-group="politicsStatus"></SelectArg>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCardNum">
            <el-input v-model="form.idCardNum"></el-input>
          </el-form-item>
          <el-form-item label="婚姻状态">
            <SelectArg v-model="form.maritalStatus" arg-group="maritalStatus"></SelectArg>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.gender" disabled>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最高学历">
            <SelectArg v-model="form.highestEducation" arg-group="educationBackground"></SelectArg>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-date-picker v-model="form.birthDate" disabled value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="毕业院校">
            <el-input v-model="form.graduateSchool" placeholder="请输入最高毕业院校（没有可不填）"></el-input>
          </el-form-item>
          <el-form-item label="民族">
            <SelectNation v-model="form.nation"></SelectNation>
          </el-form-item>
          <el-form-item label="紧急联系人">
            <el-input v-model="form.emergencyContactor"></el-input>
          </el-form-item>
          <el-form-item label="籍贯">
            <el-input v-model="form.nativePlace"></el-input>
          </el-form-item>
          <el-form-item label="联系人电话" prop="emergencyContactMobile">
            <el-input v-model="form.emergencyContactMobile"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item prop="headImage" label="头像照片">
            <div class="avatar-wrap">
              <el-avatar :size="80" :src="form.headImage" />
              <i id="pick-avatar" class="el-icon-edit-outline" />
            </div>
            <avatar-cropper
              trigger="#pick-avatar"
              :upload-headers="{ 'x-access-token': $store.state.user.token }"
              :upload-url="axios.file.defaults.baseURL + '/file/commonFile/uploadImage'"
              :output-options="{ width: 200, height: 200 }"
              @uploaded="res => (form.headImage = res.data)"
            />
          </el-form-item>
          <el-form-item style="width: 100%" label="身份证正/反面">
            <Upload
              v-model="form.idCardFileId"
              multiple
              style="width: 50%"
              accept=".bpm,.png,.jpg"
              isOnlyButton
            ></Upload>
          </el-form-item>
          <el-form-item style="width: 100%" label="资质证件">
            <Upload
              v-model="form.certificateFileId"
              multiple
              style="width: 50%"
              accept=".bpm,.png,.jpg"
              isOnlyButton
            ></Upload>
          </el-form-item>
          <el-form-item label="备注信息" style="width: 100%">
            <el-input v-model="form.baseRemark" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
          </el-form-item>
        </div>
        <div v-show="step === 2" class="formStep">
          <!-- <el-form-item label="人员卡号">
            <el-input v-model="form.todo"></el-input>
          </el-form-item>-->
          <el-form-item label="在职状态">
            <SelectArg v-model="form.jobStatus" arg-group="jobStatus"></SelectArg>
          </el-form-item>
          <el-form-item label="所属企业">
            <SelectCompany v-model="form.labourCompanyId" @input="handlegroup"></SelectCompany>
          </el-form-item>
          <el-form-item label="用工性质">
            <SelectArg v-model="form.staffKind" arg-group="workerProperty"></SelectArg>
          </el-form-item>
          <el-form-item label="所属班组">
            <SelectGroup
              v-model="form.groupId"
              :labourCompanyId="form.labourCompanyId"
              :disabled="!form.labourCompanyId"
              @input="handleval"
            ></SelectGroup>
          </el-form-item>
          <el-form-item label="身份">
            <SelectArg v-model="form.workDuty" arg-group="identity"></SelectArg>
          </el-form-item>
          <el-form-item label="人员工种">
            <SelectArg v-model="form.workType" arg-group="workType"></SelectArg>
          </el-form-item>
          <el-form-item label="作业类别">
            <SelectArg v-model="form.jobClass" arg-group="workCategory"></SelectArg>
          </el-form-item>
          <el-form-item label="考勤类别">
            <SelectArg v-model="form.attendRuleId" arg-group="attendCategory"></SelectArg>
          </el-form-item>
          <!-- <el-form-item label="APP权限">
            <SelectArg v-model="form.appPermission" arg-group="appRole"></SelectArg>
          </el-form-item>-->
          <el-form-item label="合同编号">
            <el-input v-model="form.labourContractNum"></el-input>
          </el-form-item>
          <el-form-item label="所属职位">
            <SelectArg v-model="form.position" arg-group="position"></SelectArg>
          </el-form-item>
          <el-form-item style="width: 100%" label="合同文件">
            <Upload
              v-model="form.labourContractFileId"
              multiple
              style="width: 50%"
              accept=".docx,.pdf,.bmp,.png,.jpg"
              isOnlyButton
            ></Upload>
          </el-form-item>
          <el-form-item label="备注信息" style="width: 100%">
            <el-input v-model="form.workRemark" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <div class="footer-divide">
      <el-button size="medium" @click="$router.back()">取消</el-button>
      <el-button v-if="step === 1" size="medium" type="primary" @click="next">下一步</el-button>
      <el-button v-else size="medium" type="primary" @click="step = 1">上一步</el-button>
      <el-button v-if="step === 2" size="medium" type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
    </div>
  </div>
</template>

<script>
import SelectGroup from '../components/SelectGroup'
import SelectCompany from '../components/SelectCompany'
import SelectNation from '../components/SelectNation'
import AvatarCropper from 'vue-avatar-cropper'

import regular from '@/utils/regular'
export default {
  name: 'Edit',
  components: {
    SelectGroup,
    SelectCompany,
    SelectNation,
    AvatarCropper
  },
  data() {
    return {
      form: {
        gender: 0,
        projectId: localStorage.getItem('projectId'),
        headImage: null
      },
      rules: {
        name: [{ required: true, message: '必填' }],
        idCardNum: [
          { required: true, message: '必填' },
          { pattern: regular.idCardNo, message: '身份证号不合法' }
        ],
        labourCompanyId: [{ required: true, message: '请选择企业' }],
        mobile: [{ pattern: regular.phone, message: '手机号不合法' }],
        emergencyContactMobile: [{ pattern: regular.phone, message: '手机号不合法' }]
      },
      companyTypeList: [],
      step: 1
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  watch: {
    step: {
      immediate: true,
      handler(val) {
        const actionText = this.id ? '编辑' : '新增'
        if (val === 1) {
          this.$route.meta.title = actionText + ' - 基本信息（1/2）'
        } else {
          this.$route.meta.title = actionText + ' - 工作信息（2/2）'
        }
      }
    },
    'form.idCardNum'(val) {
      this.$refs.form.validateField('idCardNum', err => {
        if (err || !val) return false
        this.form.gender = '13579'.includes(_.nth(val, -2)) ? 1 : 2
        this.form.birthDate = moment(val.slice(6, 14), 'YYYYMMDD').format('YYYY-MM-DD 00:00:00')
      })
    }
  },
  created() {
    if (this.id) {
      this.axios.labour.get('employee/get/' + this.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    handlegroup(val) {
      if (this.id) {
        if (val && this.form.groupId) {
          this.form.labourCompanyId = val
          this.form.groupId = ''
        }
      } else {
        if (val && this.form.groupId) {
          this.form.labourCompanyId = val
          this.form.groupId = ''
        }
      }
    },
    handleval(val) {
      this.form.groupId = val
    },
    async submit() {
      await this.$refs.form.validate()
      this.axios.labour.post('employee/' + (this.id ? 'update' : 'add'), this.form).then(res => {
        this.$message.success(this.id ? '编辑成功' : '新建成功')
        this.$router.back()
      })
    },
    async next() {
      await this.$refs.form.validate()
      this.step = 2
    }
  }
}
</script>

<style scoped lang="less">
.add-button {
  position: absolute;
  left: 100%;
  width: 50px;
  display: block;
  top: 0;
  margin-left: 15px;
}
.formStep {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 50%;
  }
}

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
