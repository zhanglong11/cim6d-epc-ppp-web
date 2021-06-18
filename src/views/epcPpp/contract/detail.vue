<template>
  <div style="max-width: 1200px">
    <div class="desc">
      <el-row :gutter="4">
        <el-col :span="24">
          <span class="desc-label">合同编号:</span>
          <span>{{ form.code }}</span>
        </el-col>
        <el-col :span="24">
          <span class="desc-label">合同名称:</span>
          <span>{{ form.name }}</span>
        </el-col>
        <el-col :span="24">
          <span class="desc-label">甲方:</span>
          <span>{{ form.firstPartyName }}</span>
        </el-col>
        <el-col :span="24">
          <span class="desc-label">乙方:</span>
          <span>{{ form.secondPartyName }}</span>
        </el-col>
        <el-col :span="24">
          <span class="desc-label">签订时间:</span>
          <span>{{ form.signDate | ymd }}</span>
        </el-col>
        <el-col :span="24">
          <div class="desc-table">
            <h3>附件信息</h3>
            <div class="tab" style="padding-left: 20px">
              <el-table
                :data="tableData"
                border
                :header-cell-style="{ textAlign: 'center', background: '#fff' }"
                :cell-style="{ 'text-align': 'center' }"
                style="width: 90%"
              >
                <el-table-column prop="fileName" label="附件名称" width="180"> </el-table-column>
                <el-table-column prop="createTime" label="上传时间" width="180"> </el-table-column>
                <el-table-column prop="creatorName" label="创建人"> </el-table-column>
                <el-table-column label="操作" min-width="120px">
                  <template #default="{ row }">
                    <PreviewByFileIds :fileId="row.id"></PreviewByFileIds>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <span class="desc-label">创建人:</span>
          <span>{{ form.creatorName }}</span>
        </el-col>
        <el-col :span="24">
          <span class="desc-label">创建时间:</span>
          <span>{{ form.createTime }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="foot" style="border: 1px solid #000; padding: 10px; margin-top: 10px; overflow: hidden">
      <div style="float: right">
        <el-button type="info" size="large" @click="$router.back()">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { contractApi } from './api/contract'
import PreviewByFileIds from './components/index'
import Api from '@/api/file'
export default {
  name: 'Detail',
  components: { PreviewByFileIds },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      form: {},
      tableData: [],
      fileIds: '',
      fileName: ''
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    async getDetail() {
      this.id = this.$route.params.id
      let res = await contractApi.getdetailCcpContract(this.id)
      this.form = res.data || {}
      this.fileIds = res.data.fileIds
      let arr = this.fileIds ? this.fileIds.split(',') : []
      if (!arr.length) return
      const dataList = await Api.getFileList(arr)
      this.tableData = dataList.data
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/color.less';
.el-form {
  max-width: 1000px;
}
.desc-table {
  border: 1px solid #ccc;
  border-top: 1px solid #fff;
  padding: 20px 0;
}
.desc-table h3 {
  font-size: 18px;
  font-weight: blod;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-left: 20px;
  padding-bottom: 10px;
}
.el-table-column {
  text-align: center;
}
.dec-p h3 {
  margin: 40px;
}
.desc {
  font-size: 14px;
  border: 1px solid #000;
  padding: 10px;
}
.desc-label {
  color: #999;
  width: 65px;
  text-align: left;
  margin-right: 20px;
  display: inline-block;
}
.desc-label span {
  text-align: left;
}
.el-col {
  padding-top: 10px;
}
.el-table td,
.el-table th,
.el-table th.is-leaf,
.el-table--border,
.el-table--group {
  border-color: black;
}
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
}
/deep/.el-table td,
/deep/.el-table th.is-leaf {
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
}
</style>
