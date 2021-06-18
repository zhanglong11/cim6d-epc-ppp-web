<template>
  <el-dialog :title="form.id ? '修改活动' : '新建活动'" :visible="visible" width="600px" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="活动内容" prop="content">
        <el-input v-model="form.content" type="textarea" autosize></el-input>
      </el-form-item>
      <el-form-item label="活动地点" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" prop="time">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动参与人" prop="participantIds">
        <SelectUser
          :id.sync="form.participantIds"
          :value="form.participantIds ? form.participantIds.split(',').map(id => ({ id })) : []"
          :name.sync="form.participantNames"
        ></SelectUser>
      </el-form-item>
      <el-form-item label="上传宣传图" prop="imageId">
        <ImageCrop :fileId="form.imageId" @change="e => (form.imageId = e)" />
      </el-form-item>
      <el-form-item label="是否推荐到宣传图" prop="isRecommendReadvertisingMap">
        <el-radio-group v-model="form.isRecommendReadvertisingMap">
          <el-radio :label="1">推荐</el-radio>
          <el-radio :label="0">不推荐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否推荐到头条" prop="isRecommendHeadline">
        <el-radio-group v-model="form.isRecommendHeadline">
          <el-radio :label="1">推荐</el-radio>
          <el-radio :label="0">不推荐</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <footer slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button v-promise-btn type="primary" @click="submit">提交</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import api from '@/views/epcPpp/ccp/api'
import ImageCrop from '@/components/ImageCrop'

export default {
  name: 'Edit',
  // import引入的组件需要注入到对象中才能使用
  components: {
    ImageCrop
  },
  props: {
    // 弹窗是否显示
    visible: {
      default: false,
      type: Boolean
    },
    data: {
      default() {
        return {}
      },
      type: Object
    }
  },
  data() {
    // 这里存放数据
    return {
      // 表单数据
      form: {
        time: [],
        isRecommendReadvertisingMap: 0,
        isRecommendHeadline: 0
      },
      // 表单验证规则
      rules: {
        title: [{ required: true, message: '必填' }],
        content: [{ required: true, message: '必填' }],
        time: [{ required: true, message: '必填' }],
        address: [{ required: true, message: '必填' }],
        participant: [{ required: true, message: '必填' }]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        this.data.time = this.data.startTime
          ? [
              moment(this.data.startTime).format('YYYY-MM-DD HH:mm:ss'),
              moment(this.data.endTime).format('YYYY-MM-DD HH:mm:ss')
            ]
          : []
        this.form = _.cloneDeep({ isRecommendReadvertisingMap: 0, isRecommendHeadline: 0, ...this.data })
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {},
    // 关闭弹窗
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.clearValidate()
      this.form = { time: [] }
    },
    //提交
    async submit() {
      await this.$refs.form.validate()
      let form = {
        address: '',
        content: '',
        endTime: '',
        imageId: '',
        isAllPerson: 0,
        isRecommendHeadline: 0,
        isRecommendReadvertisingMap: 0,
        participantIds: '',
        participantNames: '',
        projectId: localStorage.getItem('projectId'),
        startTime: '',
        title: '',
        ...this.form
      }
      if (form.time) {
        form.startTime = form.time[0]
        form.endTime = form.time[1]
      }
      delete form.time
      if (this.form.id) {
        await api.updateCcpActiviti(form)
      } else {
        await api.addCcpActiviti(form)
      }
      this.$message.success('成功')
      this.close()
      this.$parent.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
</style>
