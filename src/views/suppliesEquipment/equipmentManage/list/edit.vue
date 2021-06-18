<template>
  <div class="container no-padding" :class="{ inDialog, isFooter: !inDialog }">
    <component :is="inDialog ? 'div' : 'el-card'" class="box-card">
      <el-row :gutter="15">
        <el-col :span="inDialog ? 22 : 10">
          <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="form-con">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="form.name" class="form-input" />
            </el-form-item>

            <el-form-item label="规格型号" prop="models">
              <el-input v-model="form.models" class="form-input" />
            </el-form-item>

            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" class="form-input" />
            </el-form-item>

            <el-form-item label="设备类别" prop="type">
              <SelectList v-model="form.type" :self-list="equipmentType" :has-all-option="false" />
            </el-form-item>

            <el-form-item label="设备来源" prop="source">
              <SelectList v-model="form.source" :self-list="sourceList" :has-all-option="false" />
            </el-form-item>

            <el-form-item label="设备位置" prop="location">
              <el-input v-model="form.location" class="form-input" />
            </el-form-item>

            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" class="form-input" />
            </el-form-item>

            <el-form-item label="供应商" prop="supplier">
              <el-input v-model="form.supplier" class="form-input" />
            </el-form-item>

            <el-form-item label="生产厂家" prop="manufacturer">
              <el-input v-model="form.manufacturer" class="form-input" />
            </el-form-item>

            <el-form-item label="使用人" prop="user">
              <SelectUser
                :id.sync="form.user"
                :value="form.user ? { id: form.user, label: form.userName } : null"
                :name.sync="form.userName"
                :mobile.sync="form.userPhone"
                :multiple="false"
                @change="getUser"
              />
              <!--              <SelectUser :id.sync="form.user"  :multiple="false" :mobile.sync="form.userPhone" />-->
            </el-form-item>
            <el-form-item label="使用联系电话" prop="userPhone">
              <el-input v-model="form.userPhone" class="form-input" disabled />
            </el-form-item>

            <el-form-item label="责任人" prop="principal">
              <SelectUser
                :id.sync="form.principal"
                :value="form.principal ? { id: form.principal, label: form.principalName } : null"
                :name.sync="form.principalName"
                :multiple="false"
              />
            </el-form-item>

            <el-form-item label="使用人身份证号" prop="userIdentityCard">
              <el-input v-model="form.userIdentityCard" class="form-input" disabled />
            </el-form-item>

            <el-form-item label="特种设备使用证号" prop="specialEquipmentCode">
              <el-input v-model="form.specialEquipmentCode" class="form-input" />
            </el-form-item>

            <el-form-item label="车牌号" prop="plateNumber">
              <el-input v-model="form.plateNumber" class="form-input" />
            </el-form-item>

            <el-form-item label="附件" prop="fileIds">
              <FileEdit v-model="form.fileIds" />
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </component>
    <div v-if="!inDialog" class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button size="lg" type="primary" @click="submit(null)">保存</el-button>
    </div>
  </div>
</template>

<script>
import Api from '@/api/supplies/equipment/list'
import sourceList from './lib/sourceList'
import equipmentStatus from './lib/equipmentStatus'
import equipmentType from './lib/equipmentType'
export default {
  name: 'Edit',
  props: {
    //是否在弹窗中，用于其它地方弹窗新建设备
    inDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null,
      form: {},
      sourceList,
      equipmentStatus,
      equipmentType,
      rules: {
        name: [{ required: true, message: '必填' }],
        models: [{ required: true, message: '必填' }],
        unit: [{ required: true, message: '必填' }],
        type: [{ required: true, message: '必填' }],
        source: [{ required: true, message: '必填' }],
        location: [{ required: true, message: '必填' }],
        supplier: [{ required: true, message: '必填' }],
        manufacturer: [{ required: true, message: '必填' }]
      }
    }
  },
  created() {
    let id = null
    if (!this.inDialog) {
      id = this.$route.params.id
    }
    if (!_.isNil(id)) {
      this.id = id
      this.refresh()
    }
  },
  methods: {
    async refresh() {
      const res = await Api.detail(this.id)
      this.form = res.data
    },
    async submit() {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      if (!this.inDialog) {
        _.isNil(this.id) ? await Api.add(form) : await Api.update({ ...form, ...{ id: this.id } })
        this.$message.success('操作成功')
        this.goBack()
      } else {
        const { data: id } = await Api.add(form)
        const { data: equipment } = await Api.detail(id)
        this.$emit('close')
        this.$message.success('创建设备成功')
        this.$emit('success', equipment)
      }
    },
    async getUser(user) {
      const res = await this.axios.get(`/cim6d/system/user/get/${user.id}`)
      this.form = {
        ...this.form,
        ...{
          userIdentityCard: res.data.identityCardNumber
        }
      }
    },
    goBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin';
.inDialog {
  max-height: calc(100vh - 230px);
  overflow-y: auto;
  overflow-x: hidden;
  @include scroll(5px);
}
</style>
