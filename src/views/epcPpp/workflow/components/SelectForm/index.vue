<template>
  <el-select :value="value" clearable placeholder="请选择" @change="val => $emit('input', val)">
    <el-option-group v-for="group in list" :key="group.categoryId" :label="group.categoryName">
      <el-option v-for="item in group.children" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  name: 'SelectForm',
  props: {
    value: [String, Number]
  },
  computed: {
    list() {
      return this.$store.state.workflow.formList
    }
  }
}
</script>
