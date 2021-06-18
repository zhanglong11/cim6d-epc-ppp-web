<template>
  <div>
    <el-button type="primary" icon="el-icon-upload" @click="uploadShow = true">上传图片</el-button>
    <myUpload
      ref="uploadRef"
      v-model="uploadShow"
      field="file"
      :width="width"
      :height="height"
      :url="action"
      noCircle
      :headers="uploadHeaders"
      img-format="png"
      :langExt="langExt"
      @crop-success="cropSuccess"
      @crop-upload-success="cropUploadSuccess"
    ></myUpload>
    <div v-if="imgDataUrl" class="img-data">
      <img :src="imgDataUrl" />
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios'
import myUpload from 'vue-image-crop-upload'
export default {
  components: {
    myUpload
  },
  props: {
    // 剪裁的宽度
    width: {
      type: Number,
      default: 700
    },
    // 剪裁的高度
    height: {
      type: Number,
      default: 460
    },
    // 默认图片id
    fileId: {
      type: String,
      default: ''
    },
    // 上传地址
    action: {
      type: String,
      default: axios.file.defaults.baseURL + '/file/commonFile/upload'
    }
  },
  data() {
    return {
      uploadHeaders: {
        'x-access-token': this.$store.state.user.token,
        smail: '*_~'
      },
      uploadShow: false,
      imgDataUrl: this.fileId
        ? `${axios.file.defaults.baseURL}/noToken/file/commonFile/onlinePreview/${this.fileId}`
        : '',
      langExt: {
        hint: `点击，或拖动图片至此处，建议尺寸${this.width} x ${this.height} px`,
        preview: '预览'
      }
    }
  },
  watch: {
    fileId(val) {
      if (!val) {
        this.imgDataUrl = ''
        return
      }
      this.imgDataUrl = `${axios.file.defaults.baseURL}/noToken/file/commonFile/onlinePreview/${val}`
    }
  },
  mounted() {},
  //方法集合
  methods: {
    // 剪裁成功
    cropSuccess(imgDataUrl, field) {
      this.imgDataUrl = imgDataUrl
    },
    // 上传成功
    cropUploadSuccess(res, field) {
      this.$emit('change', res.data)
      this.uploadShow = false
      this.$refs.uploadRef.step = 1
      this.$message.success('上传成功')
    }
  }
}
</script>
<style lang="less" scoped>
.img-data {
  margin-top: 15px;
  width: 300px;
  border: 1px #ccc dashed;
  padding: 3px;
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}
</style>
