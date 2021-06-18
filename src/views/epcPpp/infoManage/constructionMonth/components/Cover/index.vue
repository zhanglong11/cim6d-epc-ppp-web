<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="form-con">
      <el-form-item label="月报期号" prop="issueNumber">
        <el-input v-model="form.issueNumber" class="form-input" />
      </el-form-item>

      <!--<el-form-item label="报告期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          class="form-input"
        />
      </el-form-item>-->
      <el-form-item label="报告期" prop="date">
        <el-date-picker v-model="form.date" type="month" value-format="yyyy-MM" class="form-input" />
      </el-form-item>
      <el-form-item label="项目公司" prop="companyName">
        <el-input v-model="projectDetail.companyName" disabled class="form-input" />
      </el-form-item>
      <el-form-item label="工程名称" prop="projectName">
        <el-input v-model="projectDetail.name" disabled class="form-input" />
      </el-form-item>
      <el-form-item label="监理单位" prop="supervisionDeptName">
        <el-input v-model="form.supervisionDeptName" class="form-input" />
      </el-form-item>
      <el-form-item label="施工单位" prop="constructionDeptName">
        <el-input v-model="form.constructionDeptName" class="form-input" />
      </el-form-item>
      <el-form-item label="编制" prop="authorId">
        <SelectUser
          :id.sync="form.authorId"
          :clearable="false"
          :value="form.authorId ? form.authorId.split(',').map(id => ({ id })) : []"
          :name.sync="form.authorName"
          class="form-input"
          append-to-body
        >
        </SelectUser>
      </el-form-item>
      <el-form-item label="附件" prop="fileIds">
        <Upload v-model="form.fileIds" class="form-input" isOnlyButton multiple>
          <div slot="btn">
            <el-button size="mini"
              ><i class="el-icon-upload2" style="font-size: 16px; margin-right: 5px"></i>上传附件</el-button
            >
          </div>
        </Upload>
      </el-form-item>
      <!--<el-form-item label="编制" prop="authorId">
        <SelectUser
          :id.sync="form.authorId"
          :value="form.authorId ? { id: form.authorId, label: authorName } : null"
          :name.sync="form.authorName"
          :append-to-body="true"
          class="form-input"
        />
      </el-form-item>-->
      <el-form-item label="报告日期">
        {{ moment().format('YYYY-MM-DD') }}
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'Cover',
  // import引入的组件
  components: {},
  data() {
    // 这里存放数据
    return {
      projectDetail: JSON.parse(localStorage.getItem('projectDetail')),
      form: {
        constructionDeptId: null,
        constructionDeptName: '',
        supervisionDeptId: null,
        supervisionDeptName: '',
        reportStartDate: null,
        reportEndDate: null,
        date: moment().format('YYYY-MM')
      },
      rules: {
        issueNumber: [{ required: true, message: '必填' }],
        date: [{ required: true, message: '报告期必选' }],
        authorId: [{ required: true, message: '编制必选' }]
      }
    }
  },
  watch: {
    'form.date': {
      immediate: true,
      handler(val) {
        if (val) {
          this.form.reportStartDate = moment(val).startOf('month').format('YYYY-MM-DD 00:00:00')
          this.form.reportEndDate = moment(val).endOf('month').format('YYYY-MM-DD 23:59:59')
        }
      }
    }
  },
  // 生命周期 - 挂载完成
  created() {},
  // 方法集合
  methods: {
    //刷新
    refresh() {}
  }
}
</script>

<style scoped lang="less">
.form-input {
  width: 500px;
}
</style>
