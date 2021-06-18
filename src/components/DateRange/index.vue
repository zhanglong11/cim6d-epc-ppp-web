<template>
  <el-date-picker
    v-model="value"
    :disabled="disabled"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    type="daterange"
    style="width: 280px"
    :clearable="clearable"
    @input="change"
  />
</template>

<script>
export default {
  name: 'DateRange',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    startPlaceholder: {
      default: '开始日期'
    },
    endPlaceholder: {
      default: '结束日期'
    },
    startTime: {
      default: null
    },
    endTime: {
      default: null
    },
    disabled: {
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    valueFormat: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: null
    }
  },
  computed: {
    timeArray() {
      if (this.startTime) {
        return [this.startTime, this.endTime]
      } else {
        return []
      }
    }
  },
  watch: {
    timeArray(val, oldVal) {
      if (!_.eq(val, oldVal)) {
        this.value = val
      }
    }
  },
  methods: {
    change(val) {
      this.$emit('update:startTime', val ? moment(val[0]).format('YYYY-MM-DD 00:00:00') : null)
      this.$emit('update:endTime', val ? moment(val[1]).format('YYYY-MM-DD 23:59:59') : null)
    }
  }
}
</script>

<style scoped></style>
