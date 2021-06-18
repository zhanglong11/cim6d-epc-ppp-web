<template>
  <div class="container no-padding is-footer fixedHeight">
    <div class="innerContainer white">
      <!--流程图-->
      <!--<ViewFlow :id="id"></ViewFlow>-->
      <!--流程图-->
      <div class="infoWrapper">
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">投资概算名称：</div>
              <div class="lrCellValue">{{ info.name }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">概算金额(万元)：</div>
              <div class="lrCellValue">{{ info.money }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">投资估算名称：</div>
              <div class="lrCellValue">{{ info.preName }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">估算金额(万元)：</div>
              <div class="lrCellValue">{{ info.preMoney }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">比值：</div>
              <div class="lrCellValue">{{ info.ratio }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">备注：</div>
              <div class="lrCellValue">{{ info.remark }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col>
            <div class="lrCellInfo">
              <div class="lrCellLabel">附件：</div>
              <div class="lrCellValue">
                <vxe-table ref="table" auto-resize :data="tableData">
                  <vxe-table-column type="seq" title="序号" width="60" />
                  <vxe-table-column title="附件名称" field="fileName"> </vxe-table-column>
                  <vxe-table-column title="创建时间" field="createTime"> </vxe-table-column>
                  <vxe-table-column title="创建人" field="creatorName"> </vxe-table-column>
                  <vxe-table-column title="操作" field="startWorkSum">
                    <template #default="{ row }">
                      <!--<PreviewByFileId :file-id="row.id" isDownload></PreviewByFileId>-->
                      <Preview :file="{ fileUrl: row.fileUrl, id: row.id }"></Preview>
                      <Download :file="{ name: row.fileName, id: row.id }"></Download>
                    </template>
                  </vxe-table-column>
                </vxe-table>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">创建人：</div>
              <div class="lrCellValue">{{ info.creatorName }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">创建时间：</div>
              <div class="lrCellValue">{{ info.createTime }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!--审核-->
    <template v-if="isCheck">
      <!-- <CheckCard :id="id" ref="checkCard"></CheckCard>-->
    </template>
    <!--审核-->
    <div class="footer-btn">
      <el-button v-if="!isCheck" @click="goBack()">返回</el-button>
      <template v-else>
        <el-button @click="goBack()">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import Api from '../api'
import api from '@/api/file'
export default {
  name: 'EstimateDetail',
  components: {},
  data() {
    return {
      id: this.$route.params.id || '',
      isCheck: this.$route.params.isCheck || this.$route.query.isCheck || false,
      info: {},
      tableData: []
    }
  },
  computed: {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    // 获取详情
    async getDetail() {
      let res = await Api.getEstimateDetail(this.id)
      this.info = res.data
      let arr = res.data.fileIds ? res.data.fileIds.split(',') : []
      if (!arr.length) return
      let fileRes = await api.getFileList(arr)
      this.tableData = fileRes.data || []
    },
    // 返回
    goBack() {
      this.$router.back()
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.innerContainer {
  padding: 40px 20px;
}
.infoWrapper {
  padding: 10px 40px;
  max-width: 60%;
}
.rowLine {
  margin-bottom: 10px;
}
.lrCellInfo {
  display: flex;
  align-items: flex-start;
  padding: 2px 10px 2px 0;
  min-height: 30px;
  font-size: 16px;
  .lrCellLabel {
    color: #cccccc;
    margin-right: 10px;
    min-width: 120px;
    text-align: right;
  }
  .lrCellValue {
    flex: 1;
  }
}
.bimContainer {
  height: 800px;
}
</style>
