<template>
  <!--
/**
任务名称：2846/【【智慧工地2.0-前端】劳务管理》安全培训》列表、新建、编辑、详情切图及功能开发
开发人员：李建敏
日期：2020-4月-1日
任务类型：1、全新代码
**/
-->
  <div style="background-color: unset; width: 1130px; margin: 0 auto" @click="handleCloseSelectUser">
    <el-card>
      <div slot="header" class="card-header">
        <span>{{ $route.meta.title }}</span>
      </div>
      <el-form
        ref="form"
        :disabled="$route.meta.type === 'view'"
        :model="form"
        style="width: 650px; margin-left: 50px"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="培训主题" prop="trainingTheme">
          <el-input v-model="form.trainingTheme"></el-input>
        </el-form-item>
        <el-form-item label="培训机构">
          <el-input v-model="form.trainingOrgan"></el-input>
        </el-form-item>
        <el-form-item label="培训讲师">
          <el-input v-model="form.lecturer"></el-input>
        </el-form-item>
        <el-form-item label="培训类型" prop="trainingType">
          <SelectList v-model="form.trainingType" :self-list="trainType" :has-all-option="false" />
        </el-form-item>
        <el-form-item label="培训地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="培训时间">
          <el-date-picker
            v-model="form.trainingTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:MM:SS"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="培训课时">
          <InputNumber v-model="form.trainingHour"></InputNumber>
        </el-form-item>
        <el-form-item label="培训内容" prop="trainingContent">
          <el-input v-model="form.trainingContent" type="textarea" :autosize="{ minRows: 8 }"></el-input>
        </el-form-item>
        <!-- <el-form-item label="参与培训的人员">
          <SelectWorker
            ref="totalEmployee"
            :value="form.totalEmployee ? form.totalEmployee.split(',') : []"
            value-format="id"
            :show-check-all="true"
            @load="totalEmployeeReady = true"
            @input="arr => (form.totalEmployee = arr.join(','))"
          ></SelectWorker>
          <el-button v-if="totalEmployeeReady" class="checkAll" type="text" @click="handleClickAll('totalEmployee')"
            >全选</el-button
          >
        </el-form-item>

        <el-form-item label="合格人员">
          <SelectWorker
            ref="qualifiedEmployee"
            :value="form.qualifiedEmployee ? form.qualifiedEmployee.split(',') : []"
            value-format="id"
            :canChooseUserIds="form.totalEmployee"
            @load="qualifiedEmployeeReady = true"
            @input="arr => (form.qualifiedEmployee = arr.join(','))"
          ></SelectWorker>
          <el-button
            v-if="qualifiedEmployeeReady"
            class="checkAll"
            type="text"
            @click="handleClickAll('qualifiedEmployee')"
            >全选</el-button
          >
        </el-form-item>
        <el-form-item label="不合格人员">
          <SelectWorker
            ref="unqualifiedEmployee"
            :value="form.unqualifiedEmployee ? form.unqualifiedEmployee.split(',') : []"
            value-format="id"
            :canChooseUserIds="form.totalEmployee"
            @load="unqualifiedEmployeeReady = true"
            @input="arr => (form.unqualifiedEmployee = arr.join(','))"
          ></SelectWorker>
          <el-button
            v-if="unqualifiedEmployeeReady"
            class="checkAll"
            type="text"
            @click="handleClickAll('unqualifiedEmployee')"
            >全选</el-button
          >
        </el-form-item> -->
        <el-form-item label="参与培训的人员">
          <SelectWorker
            ref="totalEmployee"
            guid="totalEmployee"
            :value.sync="form.totalEmployee"
            :disabled="$route.meta.type === 'view'"
            @close-other="handleCloseSelectUser"
          ></SelectWorker>
        </el-form-item>

        <el-form-item label="合格人员">
          <SelectWorker
            ref="qualifiedEmployee"
            guid="qualifiedEmployee"
            :value.sync="form.qualifiedEmployee"
            :disabled="$route.meta.type === 'view'"
            :canChooseUserIds="form.totalEmployee"
            @close-other="handleCloseSelectUser"
          ></SelectWorker>
        </el-form-item>
        <el-form-item label="不合格人员">
          <SelectWorker
            ref="unqualifiedEmployee"
            guid="unqualifiedEmployee"
            :value.sync="form.unqualifiedEmployee"
            :disabled="$route.meta.type === 'view'"
            :canChooseUserIds="form.totalEmployee"
            @close-other="handleCloseSelectUser"
          ></SelectWorker>
        </el-form-item>
      </el-form>
    </el-card>
    <div v-if="$route.meta.type !== 'view'" class="footer-divide">
      <el-button size="medium" @click="$router.back()">取消</el-button>
      <el-button size="medium" type="primary" @click="submit">{{ id ? '保存' : '创建' }}</el-button>
    </div>
    <div v-else class="footer-divide">
      <el-button size="medium" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
import SelectWorker from '../components/SelectWorker'
import trainType from './lib/trainType'
export default {
  name: 'Safety',
  components: { SelectWorker },
  data() {
    return {
      form: {
        projectId: localStorage.getItem('projectId'),
        totalEmployee: ''
      },
      trainType,
      // totalEmployeeCheckAll: false,
      // totalEmployeeReady: false,
      // qualifiedEmployeeCheckAll: false,
      // qualifiedEmployeeReady: false,
      // unqualifiedEmployeeCheckAll: false,
      // unqualifiedEmployeeReady: false,
      rules: {
        trainingTheme: [{ required: true, message: '必填' }],
        trainingContent: [{ required: true, message: '必填' }]
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  created() {
    if (this.id) {
      this.axios.labourSafety.get('training/get/' + this.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    handleClickAll(key) {
      let treeData = this.$refs[key].$refs.tree.options
      let labourList = []
      _.forEach(treeData, e => labourList.push(...e.children))

      if (this[key + 'CheckAll']) {
        this.form[key] = ''
      } else {
        this.form[key] = _.map(labourList, 'id').join(',')
      }
      this[key + 'CheckAll'] = !this[key + 'CheckAll']
    },
    async submit() {
      await this.$refs.form.validate()
      this.axios.labourSafety.post('training/' + (this.id ? 'update' : 'add'), this.form).then(res => {
        this.$message.success(this.id ? '编辑成功' : '新建成功')
        this.$router.back()
      })
    },
    addType() {
      this.$prompt('请输入类型名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.{2}/,
        inputErrorMessage: '最小长度2'
      }).then(({ value }) => {
        this.getCompanyTypeList()
      })
    },
    // 点击关闭所有selectuser弹窗
    handleCloseSelectUser(key) {
      if (key) {
        let list = ['totalEmployee', 'qualifiedEmployee', 'unqualifiedEmployee']
        _.forEach(list, item => {
          if (item !== key) this.$refs[item].close()
        })
      } else {
        this.$refs.totalEmployee.close()
        this.$refs.qualifiedEmployee.close()
        this.$refs.unqualifiedEmployee.close()
      }
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
.el-card {
  overflow: visible;
}
.el-form-item {
  position: relative;
  .checkAll {
    position: absolute;
    left: 100%;
    top: 0;
  }
}
</style>
