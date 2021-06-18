<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" :rules="rules" label-width="220px" class="form-con">
      <el-form-item label="需建设单位协调的问题" prop="problemSaveList">
        <div class="tableWrapper">
          <vxe-table ref="table" auto-resize :data="form.problemSaveList" :edit-config="{ trigger: 'click' }">
            <vxe-table-column type="seq" title="序号" width="60" />
            <vxe-table-column
              title="问题描述"
              field="problemDesc"
              :edit-render="{
                name: '$input',
                props: { type: 'text' }
              }"
            >
            </vxe-table-column>
            <vxe-table-column title="操作" field="opt" width="100">
              <template #default="{ row }">
                <el-button type="text" @click="handleDelete(row)">删除</el-button>
              </template>
            </vxe-table-column>
          </vxe-table>
          <div class="add" @click="handleAdd"><i class="el-icon-plus"></i>新增</div>
        </div>
      </el-form-item>
      <el-form-item label="月报大事件" prop="monthMajorEvent">
        <el-input v-model="form.monthMajorEvent" type="textarea" rows="4" class="form-input" />
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
      projectId: localStorage.getItem('projectId'),
      form: { problemSaveList: [] },
      rules: { problemSaveList: [{ required: true, message: '不能为空' }] }
    }
  },
  // 生命周期 - 挂载完成
  created() {
    console.log(this.form)
  },
  // 方法集合
  methods: {
    //点击添加
    handleAdd() {
      let obj = { problemDesc: '', projectId: this.projectId, constructionMonthReportId: this.form.id }
      this.form.problemSaveList.push(obj)
    },
    //点击删除
    handleDelete(row) {
      this.form.problemSaveList = [...this.form.problemSaveList.filter(item => item._XID !== row._XID)]
    }
  }
}
</script>

<style scoped lang="less">
.form-input {
  width: 500px;
}
.tableWrapper {
  width: 1000px;
  border: 1px #999 solid;
  padding: 10px;
}
.add {
  margin: 10px 20px;
  text-align: center;
  border: 1px #999999 dashed;
  &:hover {
    cursor: pointer;
  }
}
</style>
