<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 2e45398b36093b41f2949e4952b109f2141c86bb
@代码提交修改日期: 2020-03-05
@任务类型: 修改代码，图纸会审 时间组件，添加时分秒；补充上传文件功能
@补加代码注释日期: 2020-04-11

@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 787aae6116d5f7f5207cddf651b714dcf0608259
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，图纸会审 新增图纸会审界面和图纸会审详情界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.name }}详情</div>
        <!--bug号：1176、修改人：董渊海、修改时间：2020-03-20-->
        <!--<el-button type="primary" @click="handleEdit">编辑</el-button>-->
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>会议类型</span>
            <span v-if="data.meetingType === 1">图纸预审</span>
            <span v-else-if="data.meetingType === 2">图纸会审</span>
          </div>
          <div>
            <span>会议地点</span>
            <span>{{ data.meetingLocation }}</span>
          </div>
          <div>
            <span>会议时间</span>
            <span>{{ data.meetingTime }}</span>
          </div>
          <div>
            <span>主持人</span>
            <span>{{ data.presiderName }}</span>
          </div>
          <div>
            <span>记录人</span>
            <span>{{ data.recorderName }}</span>
          </div>
        </div>
        <div>
          <div>
            <span>创建人</span>
            <span>{{ data.creatorName }}</span>
          </div>
          <div>
            <span>创建时间</span>
            <span>{{ data.createTime }}</span>
          </div>
          <div class="remark">
            <span>会议备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-b">
      <div class="detail-b-head">会审附件</div>
      <div class="detail-b-file">
        <FileRecord labelName="电子版记录" :fileRecover="electronicFileList"></FileRecord>
      </div>
      <div class="detail-b-file">
        <FileRecord labelName="纸质版记录" :fileRecover="printFileList"></FileRecord>
      </div>
      <div class="detail-b-file">
        <FileRecord labelName="其他" :fileRecover="otherFileList"></FileRecord>
      </div>
    </div>

    <div class="detail-c">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/drawReview'
import FileApi from '@/api/file'
export default {
  name: 'DrawReviewDetail',
  data() {
    return {
      electronicFileList: [],
      printFileList: [],
      otherFileList: [],
      data: {
        id: '',
        name: '',
        meetingType: '',
        meetingTime: '',
        meetingLocation: '',
        presiderName: '',
        recorderName: '',
        remark: ''
      }
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getDrawReviewDetail(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
          if (this.data.electronicFileId) {
            let fileIds = this.data.electronicFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.electronicFileList = res.data
              }
            })
          }
          if (this.data.printFileId) {
            let fileIds = this.data.printFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.printFileList = res.data
              }
            })
          }
          if (this.data.otherFileId) {
            let fileIds = this.data.otherFileId.split(',')
            FileApi.getFileList(fileIds).then(res => {
              if (res.data) {
                this.otherFileList = res.data
              }
            })
          }
        }
      })
    }
  },
  methods: {
    handleEdit() {
      this.$router.push({ name: 'DrawReviewEdit', params: { id: this.data.id } })
    },
    handleBack() {
      this.$router.push({ name: 'DrawReview' })
    }
  }
}
</script>

<style scoped lang="less"></style>
