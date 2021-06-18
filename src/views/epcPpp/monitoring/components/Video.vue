<!--
  * @任务编号: 2686 || 播放器组件
  * @开发人员:张龙
  * @日期:2020-03-23
  * @任务类型: 新代码
  -->
<template>
  <div :id="id"></div>
</template>

<script>
import 'xgplayer'
import Xgplayer from 'xgplayer-flv.js'
export default {
  name: 'Video',
  props: {
    url: {
      required: true
    }
  },
  data() {
    return {
      id: 'video-' + _.uniqueId()
    }
  },
  mounted() {
    new Xgplayer({
      id: this.id,
      isLive: true,
      playsinline: true,
      autoplay: true,
      volume: 0,
      fluid: true,
      url: this.url,
      flvOptionalConfig: {
        enableWorker: false
      }
    })
  },
  methods: {
    remove() {
      this.$emit('remove')
    }
  }
}
</script>

<style scoped lang="less"></style>
