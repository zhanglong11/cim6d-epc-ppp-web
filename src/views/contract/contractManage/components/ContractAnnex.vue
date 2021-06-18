<template>
  <div>
    <!--
    /**
        任务名称：BUG1282 合同管理-附件缩略图-如果附件是图片，就显示图片；如果是文档，按照下图2中显示文件类型
        开发人员：崔洛宜
        日期：2020-03-24
        BUG类型：测试人员发现的研发自测未通过引起的BUG
        **/
    -->
    <div class="detail-b-file">
      <FileRecord labelName="电子合同：" :fileRecover="fileUrl.ele"></FileRecord>
    </div>
    <div v-if="!canUpload" class="detail-b-file">
      <FileRecord labelName="纸质合同：" :fileRecover="fileUrl.paper"></FileRecord>
    </div>
    <div v-else>
      <el-row>
        <el-col :span="14"
          ><div style="display: flex; margin-top: 15px">
            <span class="itemLabel">纸质合同：</span>
            <FileUploadWithImg
              v-model="paperFileList"
              :fileRecover="paperFileUrlList"
              :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
              @change="handleChange"
            ></FileUploadWithImg>
          </div>
        </el-col>
        <el-col :span="8">
          <FileRecord labelName="" :fileRecover="paperFileUrlList1"></FileRecord>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import FileUploadWithImg from '_c/FileUploadWithImg/index'
import FileApi from '@/api/file'
import Api from '@/api/contract/contractManage'
export default {
  name: 'ContractAnnex',
  components: { FileUploadWithImg },
  props: {
    fileUrl: {
      type: Object,
      default: () => {
        return {
          ele: [],
          paper: []
        }
      }
    },
    canUpload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      paperFileList: [],
      paperFileUrlList: [],
      paperFileUrlList1: []
    }
  },
  created() {},
  methods: {
    async handleChange(data) {
      if (data.length > 0) {
        let res = await FileApi.getFileList(data)
        this.paperFileUrlList1 = [...res.data]
      } else {
        this.paperFileUrlList1 = []
      }
    },
    async handleSubmit(id) {
      if (!this.paperFileList.length) {
        this.$message.error('请上传纸质版文件')
        return
      }
      let res = await Api.uploadPaperContract({ id: id, paperContractFileIds: this.paperFileList.join(',') }).catch(
        r => r
      )
      return res
    }
  }
}
</script>
<style lang="less" scoped>
.rowLine {
  display: flex;
  margin: 20px 0;
  .label {
    width: 100px;
  }
  .fileList {
    flex: 1;
    .imgContainer {
      display: flex;
      .imgWrapper {
        width: 140px;
        height: 140px;
        margin: 10px;
        img {
          width: 100px;
          height: 100px;
          margin: 0 20px;
        }
        .fileName {
          font-size: 12px;
          text-align: center;
          span {
            display: inline-block;
            max-width: 80px;
            text-overflow: ellipsis;
            word-break: normal;
            overflow: hidden;
          }
          a {
            float: right;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
.itemLabel {
  padding-right: 10px;
  color: #c1c1c1;
  width: 80px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  white-space: nowrap;
  text-align: right;
}
</style>
