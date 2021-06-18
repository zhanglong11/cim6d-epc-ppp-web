<template>
  <div class="main development">
    <img src="@/assets/images/development.svg" />
  </div>
</template>

<script>
export default {
  data() {
    //这里存放数据
    return {}
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合
  methods: {}
}
</script>
<style lang="less" scoped>
.development {
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 500px;
  }
}
</style>
