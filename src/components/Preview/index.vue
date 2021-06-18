<!--
@bug名称: 1183/所有列表页有【附件】的，显示【查看附件】，点击弹出查看附件详情模态框
@开发人员: 董渊海
@修改日期: 2020-03-20
@任务类型: 修改代码，更换预览接口，调试文档在线预览，修改比例(50%)
-->
<template>
  <span>
    <a v-if="type !== 'other'" :class="{ disabled: type === 'other' || !file }" @click="visible = true">
      <slot>预览</slot>
    </a>
    <el-tooltip v-else class="item" effect="dark" content="暂不支持预览" placement="right">
      <a :class="{ disabled: type === 'other' || !file }">
        <slot>预览</slot>
      </a>
    </el-tooltip>
    <el-dialog v-if="file" append-to-body width="1000px" top="30px" destroy-on-close :visible.sync="visible">
      <img v-if="type === 'img'" class="preview-image" :src="file.fileUrl" alt="" />
      <video v-if="type === 'video'" autoplay class="preview-video" width="100%" controls :src="file.fileUrl" alt="" />
      <iframe
        v-if="type === 'office' || type === 'pdfTxt'"
        ref="iframe"
        width="100%"
        style="height: calc(100vh - 120px)"
      ></iframe>
    </el-dialog>
  </span>
</template>

<script>
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp|svg)$/i
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/i
const officeReg = /(.*)\.(doc|xls|xlsx|docx|ppt|pptx)$/i
const pdfTxtReg = /(.*)\.(pdf|txt)$/i
import api from '@/api/file'
import { filePreviewUrl } from '@/utils/axios'
export default {
  name: 'Preview',
  props: {
    file: {
      type: Object, // should be {fileUrl:'',id:'',type:''}
      required: true
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    type() {
      if (!this.file) return 'other'
      if (imgReg.test(this.file.fileUrl)) {
        return 'img'
      } else if (videoReg.test(this.file.fileUrl)) {
        return 'video'
      } else if (officeReg.test(this.file.fileUrl)) {
        return 'office'
      } else if (pdfTxtReg.test(this.file.fileUrl)) {
        return 'pdfTxt'
      } else {
        return 'other'
      }
    }
  },
  watch: {
    visible(val) {
      if (val && this.type === 'pdfTxt') {
        /*this.axios
          .post(
            '/colliery-file/api/file/onlinePreview',
            {},
            { params: { url: this.file.fileUrl }, baseURL: '', responseType: 'arraybuffer', timeout: 20000 }
          )
          .then(res => {
            const blob = new Blob([res.data], { type: 'application/pdf' })
            this.$refs.iframe.src = URL.createObjectURL(blob)
          })*/

        api.downloadFileById(this.file.id).then(res => {
          let blobUrl = window.URL.createObjectURL(res.data)
          this.$refs.iframe.src = blobUrl
          this.$refs.iframe.onload = () => {
            window.URL.revokeObjectURL(blobUrl)
          }
        })

        /*this.axios
          .get(
            `/file/commonFile/download/${this.file.id}`,
            {baseURL: '/cim6d-file-storage', responseType: 'arraybuffer', timeout: 20000}
          )
          .then(res => {
            const blob = new Blob([res.data], { type: 'application/pdf' })
            let blobUrl = window.URL.createObjectURL(blob)
            this.$refs.iframe.src = blobUrl
            this.$refs.iframe.onload = () => {
              window.URL.revokeObjectURL(blobUrl)
            }
          })*/
      } else if (val && this.type === 'office') {
        setTimeout(() => {
          //this.$refs.iframe.src = `https://view.officeapps.live.com/op/view.aspx?src=${this.file.fileUrl}`
          this.$refs.iframe.src = `${filePreviewUrl}/noToken/file/commonFile/onlinePreview/${this.file.id}`
        }, 100)
      }
    }
  }
}
</script>

<style scoped lang="less">
.preview-image {
  display: block;
  margin: 0 auto;
  max-width: 100%;
}
.disabled {
  color: #333;
  cursor: not-allowed;
}
</style>
