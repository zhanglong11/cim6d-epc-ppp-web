<template>
  <el-dialog
    width="400px"
    :modal="true"
    top="10vh"
    title="请选择"
    append-to-body
    :visible="visible"
    @close="cancelDialog"
    @opened="handleDialogOpened"
  >
    <el-alert
      v-if="alertVisible"
      title="修改指标项会影响已添加的测点明细"
      type="warning"
      style="margin-bottom: 15px"
    ></el-alert>
    <el-checkbox-group v-model="values" @change="change">
      <!--        <el-checkbox v-for="e in options" :key="e.id" :value="e.id" :label="e.processName"></el-checkbox>-->
      <el-checkbox v-for="e in options" :key="e.id" style="display: block" :value="e.id" :label="e.name"></el-checkbox>
      <!--      <el-checkbox label="线下主题活动" name="type" style="display: block"></el-checkbox>-->
      <!--      <el-checkbox label="单纯品牌曝光" name="type" style="display: block"></el-checkbox>-->
    </el-checkbox-group>
    <footer slot="footer">
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import Api from '@/views/measureQuantity/api/measure'

export default {
  name: 'SelectMeasure',
  props: {
    // value: {
    //   type: String,
    //   default: ''
    // },
    measureId: {
      type: String,
      default: ''
    },
    visible: {}
  },
  data() {
    return {
      id: '',
      options: [],
      values: [],
      list: [],
      checkedVal: [],
      alertVisible: false
    }
  },
  // computed: {
  //   options() {
  //     return this.$store.state.design.processTemplateList
  //   }
  // },
  watch: {
    visible() {
      this.getStandardMeasureList(this.measureId)
    }
  },
  created() {},
  methods: {
    /*测量指标-列表*/
    async getStandardMeasureList(id) {
      let res = await Api.getStandardMeasureList({
        standardLibraryId: id
      })
      if (res.code === 200) {
        let cloneData = res.data.map(item => {
          return {
            name: item.measureIndex,
            id: item.id
          }
        })
        this.options = cloneData || []
        this.list = res.data || []
      }
    },
    handleDialogOpened() {
      if (this.checkedVal.length) {
        this.alertVisible = true
      }
    },
    cancelDialog() {
      this.$emit('update:visible', false)
    },
    submit() {
      this.$emit('getTarget', { list: this.options, value: this.values, checked: this.checkedVal })
      this.$emit('update:visible', false)
    },
    change(val) {
      this.checkedVal = []
      val.forEach(res => {
        //这个数据就是我们要在这搜索全部的数据
        let index = this.list.find(item => {
          //定义一个index,index接收我们找到的全部数据
          return item.measureIndex === res
          //当我们里面循环的值和我们要找的值相等的时候返回
        })
        //当找到这个值之后
        if (index) {
          this.checkedVal.push(index)
        }
      })
      this.values = val
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped lang="less"></style>
