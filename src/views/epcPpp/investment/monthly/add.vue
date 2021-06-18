<template>
  <div id="scrollContainer" ref="scrollContainer" class="outerContainer indexWrapper">
    <el-form ref="baseInfoForm" :model="form" :rules="formRule">
      <div>
        <div class="header">
          <h6 class="title">项目基本情况</h6>
        </div>
        <br />
        <el-row>
          <el-col :span="22">
            <div class="formWrapper">
              <!--              <el-form-item label="项目名称" label-width="160px" prop="name">-->
              <!--                <el-input v-model="form.name" placeholder="请输入" class="inputStyle"> </el-input>-->
              <!--              </el-form-item>-->
              <el-form-item label="报告月份" label-width="160px" prop="reportDate">
                <el-date-picker
                  v-model="form.reportDate"
                  type="month"
                  value-format="yyyy-MM"
                  placeholder="选择月"
                  style="width: 28.4%"
                  @change="changeMonth"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="报告期" label-width="160px" prop="reportStartDate">
                <!--                <DateRange :startTime.sync="form.reportStartDate" :endTime.sync="form.reportEndDate" />-->
                <el-date-picker
                  v-model="reportDateTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="请选择"
                  end-placeholder="请选择"
                  style="width: 300px"
                  value-format="yyyy-MM-dd"
                  @change="handleReportVal"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="编制" label-width="160px" prop="authorId" style="margin-right: 20px">
                <SelectUser
                  :id.sync="form.authorId"
                  :value="form.initAuthorId"
                  :name.sync="form.authorName"
                  :append-to-body="true"
                />
              </el-form-item>
              <el-form-item label="合作方（政府方）" label-width="160px" prop="partner">
                <el-input v-model="form.partner" placeholder="请输入" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="项目公司设立情况" label-width="160px" prop="designSituation">
                <el-input
                  v-model="form.designSituation"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="总包单位" label-width="160px" prop="mainContractorCompany">
                <el-input v-model="form.mainContractorCompany" placeholder="请输入" class="inputStyle"> </el-input>
              </el-form-item>
              <el-form-item label="项目概况" label-width="160px" prop="projectSituation">
                <el-input
                  v-model="form.projectSituation"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="请输入"
                  class="inputStyle"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="投资项目要点" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="合同形式" label-width="150px" prop="projectContractForm">
                    <el-input v-model="form.projectContractForm" placeholder="请输入" class="inputStyle"> </el-input>
                  </el-form-item>
                  <el-form-item label="签署日期" label-width="150px" prop="projectSignDate">
                    <el-date-picker
                      v-model="form.projectSignDate"
                      type="date"
                      placeholder="请选择签署日期"
                      class="inputStyle"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="合同期限及内容" label-width="150px" prop="projectContractDeadline">
                    <el-input
                      v-model="form.projectContractDeadline"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="回报机制（构成、支付）" label-width="150px" prop="projectReportingStandards">
                    <el-input
                      v-model="form.projectReportingStandards"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="主要违约罚则" label-width="150px" prop="projectMainBreachPenalty">
                    <el-input
                      v-model="form.projectMainBreachPenalty"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="总包合同要点" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="合同形式" label-width="150px" prop="contractorContractForm">
                    <el-input v-model="form.contractorContractForm" placeholder="请输入" class="inputStyle"> </el-input>
                  </el-form-item>
                  <el-form-item label="签署日期" label-width="150px" prop="contractorSignDate">
                    <el-date-picker
                      v-model="form.contractorSignDate"
                      type="date"
                      placeholder="请选择签署日期"
                      class="inputStyle"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="施工让利" label-width="150px" prop="contractorConstructionBenefits">
                    <el-input
                      v-model="form.contractorConstructionBenefits"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="工程款支付方式" label-width="150px" prop="contractorPayMoneyType">
                    <el-input
                      v-model="form.contractorPayMoneyType"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="履约担保（额度、方式）"
                    label-width="150px"
                    prop="contractorPerformanceGuarantee"
                  >
                    <el-input
                      v-model="form.contractorPerformanceGuarantee"
                      placeholder="请输入"
                      class="inputStyle"
                      type="textarea"
                      :autosize="{ minRows: 3, maxRows: 6 }"
                    >
                    </el-input>
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="工期" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="合同工期" label-width="150px" prop="contractDuration">
                    <el-input v-model.number="form.contractDuration" placeholder="请输入" class="inputStyle">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="实际开工日期" label-width="150px" prop="actualStartDate">
                    <el-date-picker
                      v-model="form.actualStartDate"
                      type="date"
                      placeholder="请选择实际开工日期"
                      class="inputStyle"
                      value-format="yyyy-MM-dd"
                      style="width: 100%"
                    ></el-date-picker>
                    <!--                    <el-input v-model="form.actualStartDate" placeholder="请输入" class="inputStyle"> </el-input>-->
                  </el-form-item>
                </div>
              </el-form-item>

              <el-form-item label="本年度经营目标情况" label-width="160px">
                <div style="border: 1px solid #dcdfe6; padding: 10px 20px; border-radius: 4px">
                  <el-form-item label="产值目标" label-width="150px" prop="productValueTarget">
                    <el-input
                      v-model.number="form.productValueTarget"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @change="handleRroductValue"
                    ></el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="产值完成情况" label-width="150px" prop="productValueFinishSituation">
                    <el-input
                      v-model.number="form.productValueFinishSituation"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @input="handleRroductValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="产值完成比例" label-width="150px" prop="productValueFinishPercentage">
                    <el-input
                      v-model.number="form.productValueFinishPercentage"
                      class="inputStyle"
                      style="width: 80%"
                      disabled
                      @input="handleRroductValue"
                    >
                    </el-input>
                    %
                  </el-form-item>
                  <el-form-item label="投资回报目标" label-width="150px" prop="investmentReturnTarget">
                    <el-input
                      v-model.number="form.investmentReturnTarget"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @input="handleInvestmentValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="投资回报完成情况" label-width="150px" prop="investmentReturnFinishSituation">
                    <el-input
                      v-model.number="form.investmentReturnFinishSituation"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @input="handleInvestmentValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="投资回报完成比例" label-width="150px" prop="investmentReturnFinishPercentage">
                    <el-input
                      v-model.number="form.investmentReturnFinishPercentage"
                      class="inputStyle"
                      style="width: 80%"
                      disabled
                      @change="handleInvestmentValue"
                    >
                    </el-input>
                    %
                  </el-form-item>
                  <el-form-item label="回款目标" label-width="150px" prop="returnedMoneyTarget">
                    <el-input
                      v-model.number="form.returnedMoneyTarget"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @input="handleReturnedMoneyValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="回款完成情况" label-width="150px" prop="returnedMoneyFinishSituation">
                    <el-input
                      v-model.number="form.returnedMoneyFinishSituation"
                      placeholder="请输入"
                      class="inputStyle"
                      style="width: 80%"
                      @input="handleReturnedMoneyValue"
                    >
                    </el-input>
                    万元
                  </el-form-item>
                  <el-form-item label="回款完成比例" label-width="150px" prop="returnedMoneyFinishPercentage">
                    <el-input
                      v-model.number="form.returnedMoneyFinishPercentage"
                      class="inputStyle"
                      style="width: 80%"
                      disabled
                      @change="handleReturnedMoneyValue"
                    >
                    </el-input>
                    %
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="重要情况说明" label-width="150px" prop="basicImportantExplanation">
                <el-input
                  v-model="form.basicImportantExplanation"
                  placeholder="请输入"
                  class="inputStyle"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                >
                </el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-card class="box-card" shadow="never">
              <div class="fileContainer">
                <div slot="header">
                  <strong>月报附件</strong>
                  <el-button type="primary" style="margin-left: 10px" @click="addModelFile">新增附件</el-button>
                </div>
                <br />
                <VXTable ref="fileTable" :pageShow="false" :tableData="accessoryList">
                  <vxe-table-column title="附件名称" field="name"></vxe-table-column>
                  <vxe-table-column
                    title="上传时间"
                    field="uploadTime"
                    :formatter="['toDateString', 'yyyy-MM-dd']"
                  ></vxe-table-column>
                  <vxe-table-column title="上传人" field="uploadPerson"></vxe-table-column>
                  <vxe-table-column title="附件模板" field="templateName">
                    <template #default="{ row }">
                      <el-button type="text" @click="downloadFile(row)"> 模板下载 </el-button>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column title="操作">
                    <template #default="{ row }">
                      <template v-if="row.accessoryId">
                        <PreviewByFileId :fileId="row.accessoryId" />
                        <a :href="url" download @click="uploadFile(row.accessoryId)">下载</a>
                        <el-button type="text" @click="removeFile(row)"> 删除 </el-button>
                      </template>
                      <template v-if="!row.accessoryId">
                        <el-button type="text" @click="addFile(row)"> 上传附件文件 </el-button>
                      </template>
                      <el-button type="text" @click="addModelFile(row)"> 更换模板 </el-button>
                      <el-button type="danger" @click="removeModelFile(row)"> 删除附件 </el-button>
                    </template>
                  </vxe-table-column>
                </VXTable>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="footerButton">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <!--        <el-button type="primary" @click="handleSave(1)">提交本页</el-button>-->
      </div>
    </el-form>
    <!--    上传模板-->
    <UploadDialog
      v-if="uploadVisible"
      :visible.sync="uploadVisible"
      :row="modelFileVal"
      :multiple="false"
      @getFile="getModelFile"
    />
    <!--上传附件-->
    <UploadFileDialog
      v-if="uploadFileVisible"
      :rowId="rowFileId"
      :visible.sync="uploadFileVisible"
      :multiple="false"
      @getFile="getFile"
    />
  </div>
</template>
<script>
import Api from '../api'
import UploadDialog from '../components/UploadDialog'
import UploadFileDialog from '../components/UploadFileDialog'
import fileApi from '@/api/file'
import contentDisposition from 'content-disposition'
import axios from '@/utils/axios'
export default {
  name: 'InvestmentMonthlyAddEpcPpp',
  components: {
    UploadDialog,
    UploadFileDialog
    // Download
  },
  data() {
    return {
      isSave: true,
      isEdit: false,
      uploadVisible: false,
      uploadFileVisible: false,
      reportDateTime: [],
      fileIds: '',
      url: '',
      rowFileId: '',
      modelFileVal: '',
      accessoryList: [],
      formRule: {
        reportDate: [{ required: true, message: '必填', trigger: 'change' }],
        reportStartDate: [{ required: true, message: '必填', trigger: 'change' }],
        authorId: [{ required: true, message: '必填', trigger: 'change' }],
        partner: [{ required: true, message: '必填', trigger: 'blur' }],
        designSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        mainContractorCompany: [{ required: true, message: '必填', trigger: 'blur' }],
        projectSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        projectContractForm: [{ required: true, message: '必填', trigger: 'blur' }],
        projectSignDate: [{ required: true, message: '必填', trigger: 'blur' }],
        projectContractDeadline: [{ required: true, message: '必填', trigger: 'blur' }],
        projectReportingStandards: [{ required: true, message: '必填', trigger: 'blur' }],
        projectMainBreachPenalty: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorContractForm: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorSignDate: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorConstructionBenefits: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorPayMoneyType: [{ required: true, message: '必填', trigger: 'blur' }],
        contractorPerformanceGuarantee: [{ required: true, message: '必填', trigger: 'blur' }],
        contractDuration: [{ required: true, message: '必填', trigger: 'blur' }],
        actualStartDate: [{ required: true, message: '必填', trigger: 'blur' }],
        productValueTarget: [{ required: true, message: '必填', trigger: 'blur' }],
        productValueFinishSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        // productValueFinishPercentage: [{ required: true, message: '必填', trigger: 'blur' }],
        investmentReturnTarget: [{ required: true, message: '必填', trigger: 'blur' }],
        investmentReturnFinishSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        // investmentReturnFinishPercentage: [{ required: true, message: '必填', trigger: 'blur' }],
        returnedMoneyTarget: [{ required: true, message: '必填', trigger: 'blur' }],
        returnedMoneyFinishSituation: [{ required: true, message: '必填', trigger: 'blur' }],
        // returnedMoneyFinishPercentage: [{ required: true, message: '必填', trigger: 'blur' }],
        basicImportantExplanation: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      form: {
        name: ''
      },
      scrollTop: 0
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    projectName() {
      return this.$store.state.project.projectName
    }
  },
  watch: {
    // accessoryList: {
    //   handler: val => {
    //     return val
    //   },
    //   deep: true
    // }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollEvent, true)
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.scrollEvent, true)
    })
  },
  methods: {
    //监听滑动
    scrollEvent() {
      _.debounce(e => {
        this.scrollTop = document.getElementById('scrollContainer').scrollTop
      }, 300)
    },
    // 初始化
    async init() {
      // this.form.reportDate = moment().format('YYYY-MM-DD hh:mm')
      this.id = this.$route.params.id
      let res = this.id
        ? await Api.getMonthlyDetails(this.id)
        : await Api.getMonthlyRecentDetails({ projectId: this.projectId })
      this.form = res.data || {}
      if (res.data) {
        this.form.authorId = res.data.authorId.split(',')
        this.form.authorName = res.data.authorName.split(',')
        this.accessoryList = res.data.accessoryList
        this.form.initAuthorId = this.form.authorId.map((i, index) => {
          return {
            id: this.form.authorId[index],
            label: this.form.authorName[index]
          }
        })
        this.reportDateTime.push(this.form.reportStartDate, this.form.reportEndDate)
      }
    },
    //获取选中日期的值
    handleReportVal(val) {
      this.form.reportStartDate = val[0] || ''
      this.form.reportEndDate = val[1] || ''
    },
    //改变月份的值
    changeMonth(e) {
      let date = new Date(e)
      let month = (date.getMonth() + 1).toString().padStart(2, '0')
      let year = date.getFullYear()
      let startTime = `${year}-${month}-01 00:00:00`
      let day = new Date(year, month, 0)
      let endTime = `${year}-${month}-${day.getDate()} 00:00:00 `
      this.form.reportStartDate = startTime
      this.form.reportEndDate = endTime
      this.reportDateTime = []
      this.reportDateTime.push(startTime, endTime)
    },
    //上传文件
    addFile(row) {
      console.log('上传', row.templateId)
      this.rowFileId = row.templateId
      if (this.rowFileId) {
        this.uploadFileVisible = true
      } else {
        this.$message.info('还没有模板')
      }
    },
    //上传模板文件
    addModelFile(row) {
      console.log(1, row)
      this.modelFileVal = row
      this.uploadVisible = true
    },
    //删除文件
    removeFile(row) {
      console.log(row.accessoryId)
      let curIndex = _.findIndex(this.accessoryList, item => {
        return item.accessoryId === row.accessoryId
      })
      Object.assign(this.accessoryList[curIndex], {
        accessoryId: '',
        uploadTime: '',
        uploadPerson: '',
        fileName: ''
      })
    },
    //删除附件
    removeModelFile(row) {
      this.$confirm('您确定删除选中的附件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // this.$refs.fileTable.$refs.vxeTable.remove(row)
          this.accessoryList = this.accessoryList.filter(r => r.templateId !== row.templateId)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //获取模板文件信息
    getModelFile(fileIds, name, rowId) {
      document.getElementById('scrollContainer').scrollTo(0, this.scrollTop + 60 || 0)
      if (rowId) {
        let curIndex = _.findIndex(this.accessoryList, item => {
          return item.templateId === rowId
        })
        Object.assign(this.accessoryList[curIndex], {
          ...name,
          templateId: fileIds[0],
          accessoryId: '',
          uploadTime: '',
          uploadPerson: '',
          fileName: ''
        })
      } else {
        let currendData = {
          ...name,
          templateId: fileIds[0],
          accessoryId: '',
          uploadTime: '',
          uploadPerson: '',
          fileName: ''
        }
        this.accessoryList = [...this.accessoryList, currendData]
      }
    },
    //获取模板文件信息
    getFile(id, rowId) {
      fileApi.getFileList(id).then(res => {
        let curIndex = _.findIndex(this.accessoryList, item => {
          return item.templateId === rowId
        })
        Object.assign(this.accessoryList[curIndex], {
          accessoryId: id[0],
          uploadTime: res.data[0].createTime,
          uploadPerson: res.data[0].creatorName,
          fileName: res.data[0].fileName
        })
        console.log('accessoryList', this.accessoryList)
      })
    },
    //文件下载
    uploadFile(id) {
      this.url = ` ${axios.file.defaults.baseURL}/noToken/file/commonFile/download/${id}`
    },
    //下载文件
    async downloadFile(row) {
      let id = row.templateId
      const res = await fileApi.downloadFileById(id)
      const a = document.createElement('a')
      let format = res.headers['content-disposition'].split('.')[1].replace(/\"/g, '')
      let name = `${row.name}.${format}`
      a.href = URL.createObjectURL(res.data)
      a.download =
        _.get(this.file, 'fileName', name) ||
        contentDisposition.parse(res.headers['content-disposition']).parameters.filename
      a.click()
      // saveAs(res.data, row.name)
    },
    //返回上一页
    handleCancel() {
      this.$router.back()
    },
    //产值完成比例
    handleRroductValue(e) {
      this.form.productValueFinishPercentage = this.percentage(
        this.form.productValueFinishSituation,
        this.form.productValueTarget
      )
    },
    //投资回报目标占比
    handleInvestmentValue(e) {
      this.form.investmentReturnFinishPercentage = this.percentage(
        this.form.investmentReturnFinishSituation,
        this.form.investmentReturnTarget
      )
    },
    //回款完成比例
    handleReturnedMoneyValue(e) {
      this.form.returnedMoneyFinishPercentage = this.percentage(
        this.form.returnedMoneyFinishSituation,
        this.form.returnedMoneyTarget
      )
    },
    //计算百分比
    percentage(num, total) {
      if (num === 0 || total === 0) {
        return 0
      }
      return Math.round((num / total) * 10000) / 100.0 || 0 // 小数点后两位百分比
    },
    //保存
    async handleSave() {
      console.log(this.form.reportStartDate)
      await this.$refs.baseInfoForm.validate()
      let monthArr = this.form.reportDate.split('-')
      let name = monthArr[0] + '年' + monthArr[1] + '月份' + '月报'
      let obj = {
        projectId: this.projectId,
        name: name,
        accessoryList: this.accessoryList
      }
      this.loading = true
      this.id ? await Api.getMonthlyUpdate({ ...this.form, ...obj }) : await Api.getMonthlyAdd({ ...this.form, ...obj })
      this.$message.success('保存成功')
      this.loading = false
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.outerContainer {
  padding: 20px;
}
.fileContainer {
  /*position: relative;*/
  /*max-height: 500px;*/
  width: 100%;
  height: 100%;
  overflow: auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
#scrollContainer {
  height: 0;
  overflow: auto;
}
</style>
