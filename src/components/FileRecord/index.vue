<!--
@bug名称: 1181/下载附件-下载的文件名是乱码
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，文件记录组件，文件下载方法修改，修改比例(10%)

@bug名称: 1176/文档类型的附件缩略图没有显示出来
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，文件记录组件，添加文档类型的附件缩略图，并引用iconfont库，修改比例(65%)
 -->
<template>
  <div class="file-record">
    <div v-if="labelName" class="file-label">{{ labelName }}</div>
    <div class="file-list">
      <div class="file-content">
        <span v-if="fileList.length === 0" style="font-size: 14px">暂无记录</span>
        <div v-for="(item, index) in fileList" :key="index" class="file-item">
          <div>
            <img v-if="imgReg.test(item.type)" :src="item.url" />
            <div v-else class="file-doc">
              <svg v-if="docReg.test(item.type)" class="icon" aria-hidden="true">
                <use xlink:href="#iconword-ext"></use>
              </svg>
              <svg v-else-if="xlsReg.test(item.type)" class="icon" aria-hidden="true">
                <use xlink:href="#iconexcel-ext"></use>
              </svg>
              <svg v-else-if="pptReg.test(item.type)" class="icon" aria-hidden="true">
                <use xlink:href="#iconppt-ext"></use>
              </svg>
              <svg v-else-if="pdfReg.test(item.type)" class="icon" aria-hidden="true">
                <use xlink:href="#iconpdf-ext"></use>
              </svg>
              <svg v-else-if="txtReg.test(item.type)" class="icon" aria-hidden="true">
                <use xlink:href="#icontxt-ext"></use>
              </svg>
              <div v-else class="other">其他格式</div>
            </div>
            <div class="masking"></div>
            <span>
              <i v-if="imgReg.test(item.type)" class="el-icon-zoom-in" @click="handlePreview(item)"></i>
              <i class="el-icon-download" @click="handleDownload(item)"></i>
            </span>
          </div>
          <div :title="item.name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <el-dialog
      :visible="visible"
      append-to-body
      @close="
        () => {
          visible = false
        }
      "
    >
      <div
        style="
          background: #e5e5e5;
          text-align: center;
          font-size: 0;
          border: solid 1px #d5d5d5;
          display: flex;
          min-height: 400px;
          align-items: center;
          justify-content: center;
        "
      >
        <img :src="imgUrl" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/file'
export default {
  name: 'FileRecord',
  props: {
    labelName: String,
    fileRecover: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      imgUrl: '',
      fileList: [],
      imgReg: /(jpg|png|jepg|gif|webp)/,
      docReg: /(doc|docx)/,
      xlsReg: /(xls|xlsx)/,
      pptReg: /(ppt|pptx)/,
      pdfReg: /pdf/,
      txtReg: /txt/
    }
  },
  watch: {
    /*fileRecover(val) {
      console.log('$$$$$$$$$$$$')
      console.log(val)
      for (let i = 0; i < val.length; i++) {
        let fileObj = {
          id: val[i].id,
          name: val[i].fileName,
          url: val[i].fileUrl,
          type: val[i].fileNameSuffix
        }
        this.fileList.push(fileObj)
      }
    }*/
    /**
     任务名称：BUG#1412 合同管理-合同管理：编辑合同信息时，删除上传的文件，文件名称删除了，上传的文件仍然存在，再次上传新的文件上传不了
     开发人员：崔洛宜
     日期：2020-03-31
     BUG类型：测试人员发现的研发自测未通过引起的BUG
     **/
    fileRecover: {
      immediate: true,
      handler: function (val) {
        this.fileList = []
        for (let i = 0; i < val.length; i++) {
          let fileObj = {
            id: val[i].id,
            name: val[i].fileName,
            url: val[i].fileUrl,
            type: val[i].fileNameSuffix
          }
          this.fileList.push({ ...fileObj })
        }
      }
    }
  },
  methods: {
    handlePreview(item) {
      this.visible = true
      this.imgUrl = item.url
    },
    handleDownload(item) {
      //console.log(item)
      /*const a = document.createElement('a')
      a.href = item.url
      a.download = item.name
      a.click()*/
      api.downloadFileById(item.id).then(res => {
        //console.log(res)
        let blobUrl = window.URL.createObjectURL(res.data)
        const aElement = document.createElement('a')
        aElement.href = blobUrl
        aElement.download = item.name
        aElement.click()
        window.URL.revokeObjectURL(blobUrl)
      })
    }
  }
}
</script>

<style scoped lang="less">
/**
    任务名称：2868/添加3月注释
    开发人员：李建敏
    日期：2020-3月-4日
    任务类型：2、复制修改代码 （5行）
    **/
.file-record {
  //margin: 10px 0px;
  display: flex;
  .file-label {
    padding-right: 10px;
    color: #c1c1c1;
    font-size: 14px;
    flex: 80px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: normal;
    white-space: nowrap;
    text-align: right;
  }
  .file-list {
    flex: 1;
    .file-content {
      display: flex;
      flex-wrap: wrap;
      .file-item {
        width: 100px;
        height: 120px;
        margin: 5px;

        > div:nth-child(1) {
          border: dashed 1px #c1c1c1;
          height: 100px;
          width: 100px;
          padding: 6px;
          position: relative;

          > img {
            background: #e5e5e5;
            width: 86px;
            height: 86px;
            position: absolute;
          }
          > div.file-doc {
            position: absolute;
            width: 86px;
            height: 86px;

            .icon {
              width: 86px;
              height: 86px;
            }

            .other {
              color: #666666;
              font-size: 14px;
              text-align: center;
              line-height: 84px;
              border: solid 1px #e5e5e5;
            }
          }
          > div.masking {
            position: absolute;
            width: 86px;
            height: 86px;
            background: #000;
            opacity: 0.5;
            display: none;
          }
          > span {
            display: none;
            position: absolute;
            top: 50%;
            margin-top: -10px;
            width: 86px;
            text-align: center;
            > i {
              font-size: 18px;
              cursor: pointer;
              margin: 0px 5px;
              color: #fff;
            }
          }
        }
        > div:nth-child(1):hover {
          > div.masking {
            display: block;
          }
          > span {
            display: block;
          }
        }

        > div:nth-child(2) {
          font-size: 14px;
          color: #666;
          overflow: hidden;
          text-overflow: ellipsis;
          word-wrap: normal;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
