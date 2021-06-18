<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="form-con">
      <el-form-item label="本月形象进度" prop="thisMonthImageProgress">
        <el-input v-model="form.thisMonthImageProgress" type="textarea" rows="4" class="form-input" />
      </el-form-item>

      <el-form-item label="现场照片" prop="sceneImageId">
        <Upload v-model="form.sceneImageId" listType="picture-card" class="form-input" isOnlyButton multiple>
          <div slot="btn">
            <el-button size="mini"
              ><i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px"></i>上传照片</el-button
            >
          </div>
        </Upload>
      </el-form-item>
      <el-form-item label="下月工作计划" prop="nextMonthWorkPlan">
        <el-input v-model="form.nextMonthWorkPlan" type="textarea" rows="4" class="form-input" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import Api from '@/views/epcPpp/infoManage/constructionMonth/api'

export default {
  name: 'ProjectProgress',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      form: {},
      rules: {
        thisMonthImageProgress: [{ required: true, message: '本月形象进度必填' }],
        sceneImageId: [{ required: true, message: '现场照片必填' }],
        nextMonthWorkPlan: [{ required: true, message: '下月工作计划必填必填' }]
      }
    }
  },
  watch: {
    'form.reportStartDate': {
      immediate: true,
      handler(newVal, oldVal) {
        if (!oldVal) {
          if (this.form.nextMonthWorkPlan) {
            return
          }
        }
        let start = moment(this.form.reportStartDate)
          .startOf('month')
          .subtract('month', -1)
          .format('YYYY-MM-DD 00:00:00')
        let end = moment(this.form.reportStartDate).endOf('month').subtract('month', -1).format('YYYY-MM-DD 23:59:59')
        this.getPlanSchedule(start, end)
      }
    }
  },
  // 生命周期 - 挂载完成
  mounted() {
    /* setTimeout(() => {
      let start = moment(this.form.reportStartDate).startOf('month').subtract('month', -1).format('YYYY-MM-DD 00:00:00')
      let end = moment(this.form.reportStartDate).startOf('month').subtract('month', -1).format('YYYY-MM-DD 23:59:59')
      this.getSchedule(start, end)
    }, 500)*/
  },
  // 方法集合
  methods: {
    async getSchedule(startDate, endDate) {
      let res = await Api.getScheduleList({ startDate, endDate }).then(res => res.data.baseList || [])
      let strArr = ''
      res.forEach((item, index) => {
        strArr += `${index + 1},${item.synthesisTaskName}\n`
      })
      this.form.nextMonthWorkPlan = strArr
    },
    //获取计划
    async getPlanSchedule(startDate, endDate) {
      let res = await Api.getScheduleList({ startDate, endDate, dateType: 1, page: 1, rows: 9999 }).then(
        res => res.data.records || []
      )
      let strArr = ''
      res.forEach((item, index) => {
        strArr += `${index + 1},${item.synthesisTaskName}\n`
      })
      this.form.nextMonthWorkPlan = strArr
    }
  }
}
</script>

<style scoped lang="less">
.form-input {
  width: 500px;
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
