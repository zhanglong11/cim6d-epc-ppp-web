<template>
  <span>
    <a class="btn" @click="visible = true">
      <slot>{{ buttonContent }}</slot>
    </a>
    <el-dialog
      v-if="visible"
      title="预览"
      append-to-body
      width="1000px"
      top="10vh"
      destroy-on-close
      :visible="visible"
      @close="visible = false"
    >
      <img v-if="type === 'img'" class="preview-image" :src="fileUrl" alt="" />
      <video v-if="type === 'video'" autoplay class="preview-video" width="100%" controls :src="fileUrl" alt="" />
      <iframe
        v-if="type === 'office' || type === 'pdfTxt'"
        ref="iframe"
        :src="fileUrl"
        width="100%"
        style="height: calc(100vh - 120px)"
      ></iframe>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">确定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
const imgReg = /(.*)\.(jpg|png|jepg|gif|webp|jpeg)$/
const videoReg = /(.*)\.(mp4|mkv|ogg|webm)$/
const officeReg = /(.*)\.(doc|xls|xlsx|docx|ppt|pptx)$/
const pdfTxtReg = /(.*)\.(pdf|txt)$/
import Api from '@/api/file'
export default {
  name: 'PreviewUrl',
  props: {
    fileUrl: {
      type: String,
      required: true
    },
    buttonContent: {
      type: String,
      default: '预览'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    type() {
      if (!this.fileUrl) return 'other'
      if (imgReg.test(this.fileUrl)) {
        return 'img'
      } else if (videoReg.test(this.fileUrl)) {
        return 'video'
      } else if (officeReg.test(this.fileUrl)) {
        return 'office'
      } else if (pdfTxtReg.test(this.fileUrl)) {
        return 'pdfTxt'
      } else {
        return 'other'
      }
    }
  },
  watch: {},
  created() {}
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
/*.btn {
  font-size: 13px;
  &:after {
    display: inline-block;
    width: 0px;
    height: 10px;
    content: '';
    border: 1px #409eff solid;
    margin: 0 3px;
  }
}*/
/deep/ .el-dialog__header {
  border-bottom: 1px #eeeeee solid;
}
</style>
