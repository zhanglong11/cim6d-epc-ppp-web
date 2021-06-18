<template>
  <el-dialog title="请选择" :visible.sync="modalStatus" width="640px" @close="closeModal()">
    <el-alert title="温馨提示：甲方或乙方选择后不可变更" type="success"></el-alert>
    <el-radio-group v-model="modalPartyType" class="contract-radio">
      <el-radio :label="1">
        <img v-if="modalPartyType === 1" src="~@/assets/images/party-a.png" class="contract-user" />
        <img v-else src="~@/assets/images/party-a-o.png" class="contract-user" />
        <b>我是甲方</b></el-radio
      >
      <el-radio :label="2">
        <img v-if="modalPartyType === 2" src="~@/assets/images/party-b.png" class="contract-user" />
        <img v-else src="~@/assets/images/party-b-o.png" class="contract-user" />
        <b>我是乙方</b></el-radio
      >
    </el-radio-group>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModal()">取 消</el-button>
      <el-button type="primary" @click="save()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 模态框状态
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    //这里存放数据
    return {
      modalStatus: false, // 新建合同模态框
      modalPartyType: 1 // 新建合同类型 1甲方 2乙方
    }
  },
  watch: {
    value(val) {
      this.modalStatus = val
    }
  },
  //方法集合
  methods: {
    // 关闭模态框
    closeModal() {
      this.$parent.modalStatus = false
    },
    // 确定
    save() {
      this.$emit('change', this.modalPartyType)
    }
  }
}
</script>
<style lang="less" scoped>
.contract-radio {
  display: flex;
  align-items: center;
  justify-content: center;
  .el-radio {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /deep/.el-radio__input {
      display: none;
    }
    /deep/.el-radio__label {
      padding: 0;
      text-align: center;
    }
  }
  .contract-user {
    margin: 20px;
    width: 150px;
    height: auto;
    display: block;
    transition: all 0.4s;
  }
}
</style>
