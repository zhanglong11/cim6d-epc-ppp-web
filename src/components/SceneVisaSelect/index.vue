<!--
    /**
   任务名称：TASK#2827 3月6号注释
   开发人员：崔洛宜
   日期：2020-03-31
   任务类型：注释(添加现场签证组件,新页面)
   **/
-->
<template>
  <el-select :value="value" :disabled="disabled" :clearable="clearable" @change="handleChange">
    <template v-if="hasAll">
      <el-option :value="null" label="全部"> </el-option>
    </template>
    <el-option v-for="item in list" :key="item.id" :label="item.accessName" :value="item.id"> </el-option>
  </el-select>
</template>

<script>
import Api from '@/api/contract/sceneVisa'
export default {
  name: 'SceneVisaSelect',
  props: {
    hasAll: {
      type: Boolean,
      default: true
    },
    value: [String, Number],
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    /**
bug名称：1299/进度管理-施工进度计划变更-新建-选择现场签证-只可选择审核通过的现场签证
开发人员：李建敏
日期：2020-3月-26日
任务类型：2、移动代码 (4行)
**/
    status: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      list: []
    }
  },
  created() {
    /**
bug名称：1299/进度管理-施工进度计划变更-新建-选择现场签证-只可选择审核通过的现场签证
开发人员：李建敏
日期：2020-3月-26日
任务类型：2、移动代码 (4行)
**/
    Api.getSceneVisaList({ projectId: this.projectId }).then(res => {
      if (this.status) {
        this.list = res.data.records.filter(e => e.status === 2)
      } else {
        this.list = res.data.records
      }
    })
  },
  methods: {
    /**
bug名称：bug#1209,1211,1212,1213,1214,1215,1216,1217,1218,1219,1220
开发人员：李建敏
日期：2020-3月-23日
任务类型：2、修改代码（2行）
**/

    handleChange(val) {
      let obj = this.list.find(item => {
        return item.id === val
      })
      this.$emit('input', val)
      this.$emit('creator', obj.creator)
      this.$emit('creatorName', obj.creatorName)
      this.$emit('createTime', obj.createTime)
      this.$emit('contractId', obj.contractId)
      this.$emit('accessNumber', obj.accessNumber)
      this.$emit('accessName', obj.accessName)
    }
  }
}
</script>
<style lang="less" scoped>
.vue-treeselect {
  display: inline-block;
  width: 215px;
  font-size: unset;
}
</style>
