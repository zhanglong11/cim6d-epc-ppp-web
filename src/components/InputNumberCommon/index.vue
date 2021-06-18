<template>
  <!--  <el-input-number-->
  <!--    :value="value"-->
  <!--    :disabled="disabled"-->
  <!--    :controls="false"-->
  <!--    style="width:100%"-->
  <!--    @change="val => $emit('input', val)"-->
  <!--  />-->
  <el-input :value="value" :disabled="disabled" @change="changeValue" @input="getVal" />
</template>

<script>
export default {
  name: 'InputNumberCommon',
  components: {},
  props: {
    value: {},
    disabled: {
      type: Boolean,
      default: false
    },
    max: {
      type: [String, Number]
    }
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {},
    changeValue(e) {
      this.$emit('change', _.isFinite(e - 0) ? _.round(e, 2) - 0 : null)
      this.$emit('input', _.isFinite(e - 0) ? _.round(e, 2) - 0 : null)
    },
    getVal(e) {
      if (e.includes('.') && _.endsWith(e, '.')) {
        this.$emit('input', e)
        return
      }
      if (e > this.max) {
        this.$emit('input', this.max)
        return
      }
      this.$emit('input', _.isFinite(e - 0) ? e - 0 : null)
    }
  }
}
</script>

<style scoped lang="less"></style>
