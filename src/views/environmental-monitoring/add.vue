<template>
  <div class="container no-padding is-footer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ id ? '修改设备' : '新增设备' }}</span>
      </div>
      <el-form ref="formRef" label-width="150px" class="form-con">
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="设备名称" required>
              <el-input class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="设备编号" required>
              <el-input class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="规格型号">
              <el-input class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="安全证书">
              <el-input class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="生产厂家">
              <el-input class="form-input" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="出厂编号">
              <el-input class="form-input" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="设备种类" required>
              <el-select v-model="formData.region" clearable placeholder="请选择" class="form-input">
                <el-option v-for="item in region" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="所属区域" required>
              <el-select v-model="formData.region" clearable placeholder="请选择" class="form-input">
                <el-option v-for="item in region" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="安装地点" required>
              <el-select v-model="formData.region" clearable placeholder="请选择" class="form-input">
                <el-option v-for="item in region" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="关联设备" required>
              <el-select v-model="formData.region" clearable placeholder="请选择" class="form-input">
                <el-option v-for="item in region" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-button type="primary">关联</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :md="16">
            <el-form-item label="上传">
              <Upload multiple :limit="4" accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.png" is-only-button />
            </el-form-item>
          </el-col>
          <el-col :md="24">
            <el-form-item label="备注">
              <el-input class="form-input" type="textarea" :rows="4" placeholder="请输入备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button type="primary" size="lg" @click="goBack()">保存</el-button>
    </div>
  </div>
</template>

<script>
/*
 * @Author: 耿为刚 创建
 * @Date: 2020-03-28
 * @Last Modified by: gengweigang
 */
import Upload from '@/components/Upload' // 上传组件
export default {
  name: 'EnvironmentalMonitoringAdd',
  components: {
    Upload
  },
  data() {
    // 这里存放数据
    return {
      // 所属区域下拉框数据
      region: [
        {
          value: 1,
          label: '工地'
        },
        {
          value: 2,
          label: '食堂'
        },
        {
          value: 3,
          label: '项目部'
        }
      ],
      id: this.$route.query.id || '',
      formData: {
        region: ''
      }
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  // 方法集合
  methods: {
    // 返回
    goBack() {
      this.$router.push({
        path: '/environmental-monitoring'
      })
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
.form-con {
  padding-right: 15%;
}
.form-input {
  width: 100%;
}
.inline-input {
  width: 30%;
  display: inline-block;
}
</style>
