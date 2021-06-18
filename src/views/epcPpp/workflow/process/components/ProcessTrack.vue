<template>
  <div>
    <img :src="src" alt="" />
  </div>
</template>

<script>
export default {
  name: 'ProcessTrack',
  props: {
    process: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      src: null
    }
  },
  watch: {
    process: {
      immediate: true,
      handler() {
        this.src = ''
        this.axios.workflow
          .get('activiti/process/instance/track/' + this.process.processInstanceId, { responseType: 'blob' })
          .then(res => {
            let imgSrc = window.URL.createObjectURL(res)
            this.src = imgSrc
          })
      }
    }
  }
}
</script>

<style scoped lang="less">
img {
  max-width: 100%;
}
</style>
