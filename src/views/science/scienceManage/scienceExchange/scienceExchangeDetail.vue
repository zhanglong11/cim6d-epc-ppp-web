<!--
@任务名称：【补：3月1日~3月18日的代码提交注释】
@开发人员: 董渊海
@git提交编号: 28115153c02bc15ba3d221102af81d02aca94dff
@代码提交修改日期: 2020-03-06
@任务类型: 修改代码，技术交底 搜索和新增的时间组件添加时分秒，新增和详情的界面样式重新调整
@补加代码注释日期: 2020-04-11
-->
<template>
  <div class="right-panel">
    <div class="detail-a">
      <div class="detail-a-head">
        <div>{{ data.name }}详情</div>
      </div>
      <div class="detail-a-des">
        <div>
          <div>
            <span>交底类型</span>
            <span v-if="data.disclosureType === 1">一级交底</span>
            <span v-else-if="data.disclosureType === 2">二级交底</span>
            <span v-else-if="data.disclosureType === 3">三级交底</span>
          </div>
          <div>
            <span>交底形式</span>
            <span v-if="data.disclosureForm === 1">书面交底</span>
            <span v-else-if="data.disclosureForm === 2">会议交底</span>
            <span v-else-if="data.disclosureForm === 3">样板模型交底</span>
            <span v-else-if="data.disclosureForm === 4">挂牌交底</span>
          </div>
          <div>
            <span>交底人</span>
            <span>{{ data.disclosurerName }}</span>
          </div>
          <div>
            <span>交底时间</span>
            <span>{{ data.disclosureTime }}</span>
          </div>
        </div>
        <div>
          <div>
            <span>接收人</span>
            <span>{{ data.accepterName }}</span>
          </div>
          <div>
            <span>交底部位</span>
            <span>{{ data.disclosurePosotion }}</span>
          </div>
          <div>
            <span>交底内容</span>
            <span>{{ data.content }}</span>
          </div>
          <div class="accessory">
            <div>附件</div>
            <div>
              <FileList :ids="data.fileId" />
            </div>
          </div>
          <div class="remark">
            <span>交底备注</span>
            <span>{{ data.remark }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-c">
      <el-button @click="handleBack">返回</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/science/scienceManage/scienceExchange'
export default {
  name: 'ScienceExchangeDetail',
  data() {
    return {
      data: {
        id: '',
        name: '',
        disclosureType: '',
        disclosureForm: '',
        disclosurerName: '',
        disclosureTime: '',
        accepterName: '',
        disclosurePosotion: '',
        content: '',
        remark: ''
      }
    }
  },
  mounted() {
    let id = this.$route.params.id ? this.$route.params.id : ''
    if (id) {
      Api.getScienceExchangeDetail(id).then(res => {
        let data = res.data
        if (data) {
          this.data = data
        }
      })
    }
  },
  methods: {
    handleEdit() {
      this.$router.push({ name: 'ScienceExchangeEdit', params: { id: this.data.id } })
    },
    handleBack() {
      this.$router.push({ name: 'ScienceExchange' })
    }
  }
}
</script>

<style scoped lang="less"></style>
