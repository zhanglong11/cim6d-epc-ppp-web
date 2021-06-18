<template>
  <div class="main development">
    <img src="@/assets/images/development.png" />
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
  align-items: flex-end;
  justify-content: center;
  img {
    max-width: 100%;
  }
}
</style>
