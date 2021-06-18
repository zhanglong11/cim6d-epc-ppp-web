<template>
  <div class="outerWrapper indexWrapper">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>现场签证基本信息</span>
      </div>
      <div class="formWrapper">
        <el-form ref="baseInfoForm" :model="baseInfo" :rules="baseInfoRule">
          <el-form-item label="选择合同" label-width="120px" prop="contractName">
            <el-input v-model="baseInfo.contractName" placeholder="请选择合同" class="inputStyle" disabled> </el-input>
            <a @click="handleSelectContract">选择合同</a>
          </el-form-item>
          <el-form-item label="现场签证编号" label-width="120px" prop="accessNumber" style="margin-right: 20px">
            <el-input v-model="baseInfo.accessNumber" placeholder="请输入签证编号" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="现场签证名称" label-width="120px" prop="accessName" style="margin-right: 20px">
            <el-input v-model="baseInfo.accessName" placeholder="请输入签证名称" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="部位" label-width="120px" prop="place" style="margin-right: 20px">
            <el-input v-model="baseInfo.place" placeholder="请输入部位" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="签证原因" label-width="120px" prop="accessReason">
            <el-input v-model="baseInfo.accessReason" placeholder="请选择签证原因" class="inputStyle" disabled>
            </el-input>
            <a @click="handleSelectChange">选择变更</a>
          </el-form-item>
          <el-form-item label="内容摘要" label-width="120px" prop="content" style="margin-right: 20px">
            <el-input v-model="baseInfo.content" placeholder="请输入内容摘要" class="inputStyle"> </el-input>
          </el-form-item>
          <el-form-item label="日期" label-width="120px" prop="accessDate" style="margin-right: 20px">
            <el-date-picker
              v-model="baseInfo.accessDate"
              type="date"
              placeholder="请选择日期"
              class="inputStyle"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注" label-width="120px" prop="remark" style="margin-right: 20px">
            <el-input
              v-model="baseInfo.remark"
              type="textarea"
              class="inputStyle"
              placeholder="备注"
              :autosize="{ minRows: 4, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人 " label-width="120px" prop="creator" style="margin-right: 20px">
            <el-input v-model="baseInfo.creatorName" class="inputStyle" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>签证详情</span>
        <el-button style="float: right" plain @click="handleSelectList">选择清单</el-button>
      </div>
      <div>
        <vxe-table
          ref="xTable"
          border
          :data="tableData"
          :edit-config="{ trigger: 'manual', mode: 'row', autoClear: false }"
          auto-resize
          show-footer
          :footer-method="footerMethod"
        >
          <vxe-table-column type="seq" width="60"></vxe-table-column>
          <!--
           /**
           任务名称：BUG1450 合同管理-新增现场签证：签证详情部分，选择清单后，点击编辑按钮，字段”项目编号“/'项目名称"/”计量单位“可以编辑，不合理
           开发人员：崔洛宜
           日期：2020-03-31
           BUG类型：测试人员发现的研发自测未通过引起的BUG
           **/
          -->
          <vxe-table-column
            field="itemCode"
            title="项目编码"
            :edit-render="{ name: '$input', props: { type: 'text', disabled: !isAddList } }"
          />
          <vxe-table-column
            field="itemName"
            title="项目名称"
            :edit-render="{ name: '$input', props: { type: 'text', disabled: !isAddList } }"
          />
          <vxe-table-column
            field="unit"
            title="计量单位"
            :edit-render="{ name: '$input', props: { type: 'text', disabled: !isAddList } }"
          />
          <vxe-table-column title="变更前">
            <vxe-table-column field="beforeQuantity" title="数量"></vxe-table-column>
            <vxe-table-column field="beforeUnitPrice" title="单价"></vxe-table-column>
            <vxe-table-column field="beforeMoney" title="金额(元)"></vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="变更后">
            <vxe-table-column
              field="afterQuantity"
              title="数量"
              :edit-render="{
                name: '$input',
                props: { type: 'number' },
                events: { input: updateFoot, change: updateFoot }
              }"
            ></vxe-table-column>
            <vxe-table-column
              field="afterUnitPrice"
              title="单价"
              :edit-render="{
                name: '$input',
                props: { type: 'number' },
                events: { input: updateFoot, change: updateFoot }
              }"
            ></vxe-table-column>
            <!--
              /**
               任务名称：BUG#1394 合同管理-现场签证-新建-签证类型-详情见下图
               开发人员：崔洛宜
               日期：2020-03-30
               BUG类型：测试人员发现的研发自测未通过引起的BUG
               **/
            -->
            <vxe-table-column field="afterMoney" title="金额(元)">
              <template slot-scope="{ row }">
                <span>{{ Number(Number(row.afterQuantity) * Number(row.afterUnitPrice)) | toFixed2 }}</span>
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="变更增减量">
            <vxe-table-column field="changeQuantity" title="数量">
              <template slot-scope="{ row }">
                <span>{{ Number(Number(row.afterQuantity) - Number(row.beforeQuantity)) | toFixed2 }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="changeUnitPrice" title="单价">
              <template slot-scope="{ row }">
                <span>{{ Number(Number(row.afterUnitPrice) - Number(row.beforeUnitPrice)) | toFixed2 }}</span>
              </template>
            </vxe-table-column>
            <!--
              /**
               任务名称：BUG#1394 合同管理-现场签证-新建-签证类型-详情见下图
               开发人员：崔洛宜
               日期：2020-03-30
               BUG类型：测试人员发现的研发自测未通过引起的BUG
               **/
            -->
            <vxe-table-column field="changeMoney" title="金额(元)">
              <template slot-scope="{ row }">
                <span>{{
                  Number(
                    Number(row.afterQuantity) * Number(row.afterUnitPrice) -
                      Number(row.beforeQuantity) * Number(row.beforeUnitPrice)
                  ) | toFixed2
                }}</span>
              </template>
            </vxe-table-column>
          </vxe-table-column>
          <vxe-table-column title="操作" width="150px">
            <template slot-scope="{ row, $rowIndex }">
              <template v-if="$refs.xTable.isActiveByRow(row)">
                <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
                <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
              </template>
              <template v-else>
                <vxe-button @click="editRowEvent(row)">编辑</vxe-button>
                <vxe-button @click="handleDelete(row, $rowIndex)">删除</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </vxe-table>
        <div class="addWrapper" @click="handleAdd"><i class="el-icon-plus"></i>添加</div>
        <div style="margin-top: 20px; width: 400px">
          <vxe-table
            ref="changeTable"
            border
            :data="changeTableData"
            auto-resize
            :edit-config="{ trigger: 'click', mode: 'cell' }"
          >
            <vxe-table-column field="beforeDuration" title="变更前工期" />
            <!--
             /**
              任务名称：BUG#1394 合同管理-现场签证-新建-签证类型-详情见下图
              开发人员：崔洛宜
              日期：2020-03-30
              BUG类型：测试人员发现的研发自测未通过引起的BUG
              **/
           -->
            <vxe-table-column
              field="changeDuration"
              title="增减工期"
              :edit-render="{
                name: '$input',
                props: { type: 'number' }
              }"
            />
            <vxe-table-column field="afterDuration" title="现工期">
              <template slot-scope="{ row }">
                {{ Number(row.beforeDuration) + Number(row.changeDuration) }}
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </el-card>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>现场签证附件信息</span>
        <el-button type="text" style="float: right; padding: 3px 0"></el-button>
      </div>
      <div>
        <el-row type="flex" justify="space-between">
          <el-form ref="docForm" :model="docForm" style="width: 100%">
            <el-col :span="14">
              <el-form-item label="电子合同" label-width="120px" prop="eleFile" style="margin-right: 20px">
                <FileUploadWithImg
                  v-model="docForm.eleFileList"
                  :fileRecover="eleFileUrlList"
                  :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
                  @change="handleChange"
                ></FileUploadWithImg>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!--
                   /**
                   任务名称：BUG1495 合同管理->编辑->上传附件时,文件列表没变
                   开发人员：崔洛宜
                   日期：2020-04-03
                   BUG类型：自测BUG
                   **/
               -->
              <div v-if="isEdit" class="detail-b-file">
                <FileRecord labelName="" :fileRecover="eleFileUrlList1"></FileRecord>
              </div>
            </el-col>
            <el-col :span="14">
              <el-form-item label="纸质合同" label-width="120px" prop="paperFile" style="margin-right: 20px">
                <FileUploadWithImg
                  v-model="docForm.paperFileList"
                  :fileRecover="paperFileUrlList"
                  :accept="['rar', 'zip', 'doc', 'docx', 'pdf', 'jpg', 'png']"
                  @change="handleChange2"
                ></FileUploadWithImg>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!--
                  /**
                  任务名称：BUG1495 合同管理->编辑->上传附件时,文件列表没变
                  开发人员：崔洛宜
                  日期：2020-04-03
                  BUG类型：自测BUG
                  **/
              -->
              <div v-if="isEdit" class="detail-b-file">
                <FileRecord labelName="" :fileRecover="paperFileUrlList1"></FileRecord>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-card>
    <div class="footerButton">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
    </div>
    <ContractDialog
      v-if="contractSelectVisible"
      :visible="contractSelectVisible"
      @close="contractSelectVisible = false"
      @submit="handleEmit"
    ></ContractDialog>
    <ChangeDialog
      v-if="changeSelectVisible"
      :visible="changeSelectVisible"
      @close="changeSelectVisible = false"
      @submit="handleChangeEmit"
    ></ChangeDialog>
    <ListDialog
      v-if="listSelectVisible"
      :visible="listSelectVisible"
      :contractId="baseInfo.contractId"
      @close="listSelectVisible = false"
      @submit="handleListEmit"
    ></ListDialog>
  </div>
</template>
<script>
import ContractDialog from '../contractMeasurementPayment/componnets/ContractDialog'
import ChangeDialog from './components/ChangeDialog'
import ListDialog from './components/ListDialog'
import Api from '@/api/contract/sceneVisa'
import FileUploadWithImg from '_c/FileUploadWithImg/index'
import FileApi from '@/api/file'
export default {
  name: 'SceneVisaAdd',
  components: { ContractDialog, ChangeDialog, ListDialog, FileUploadWithImg },
  data() {
    return {
      projectId: localStorage.getItem('projectId'),
      /**
       任务名称：BUG1450 合同管理-新增现场签证：签证详情部分，选择清单后，点击编辑按钮，字段”项目编号“/'项目名称"/”计量单位“可以编辑，不合理
       开发人员：崔洛宜
       日期：2020-03-31
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      isAddList: false,
      eleFileUrlList: [],
      eleFileUrlList1: [],
      paperFileUrlList: [],
      paperFileUrlList1: [],
      docForm: { eleFileList: [], paperFileList: [] },
      contractSelectVisible: false,
      changeSelectVisible: false,
      listSelectVisible: false,
      baseInfo: {
        contractName: '',
        contractId: '',
        accessNumber: '',
        accessName: '',
        place: '',
        accessReason: '',
        accessReasonId: '',
        content: '',
        accessDate: '',
        remark: '',
        creatorName: ''
      },
      baseInfoRule: {
        contractName: [{ required: true, message: '请选择合同', trigger: 'blur' }],
        accessNumber: [{ required: true, message: '请输入签证编号', trigger: 'blur' }],
        accessName: [{ required: true, message: '请输入签证名称', trigger: 'blur' }],
        place: [{ required: true, message: '请输入部位名称', trigger: 'blur' }],
        //accessReason: [{ required: true, message: '请选择签证原因', trigger: 'blur' }],
        accessDate: [{ required: true, message: '请选择签证日期', trigger: 'change' }]
      },
      tableData: [],
      changeTableData: [
        {
          afterDuration: 0,
          beforeDuration: 0,
          changeDuration: 0
        }
      ]
    }
  },
  created() {
    let { id, isEdit } = this.$route.query
    this.isEdit = isEdit
    if (isEdit) {
      Api.getSceneVisaById(id).then(res => {
        if (res.code === 200) {
          this.baseInfo = res.data
          this.refresh(id)
          this.changeTableData[0].afterDuration = res.data.afterDuration
          this.changeTableData[0].beforeDuration = res.data.beforeDuration
          this.changeTableData[0].changeDuration = res.data.changeDuration
          this.docForm = {
            eleFileList: res.data.stieAccessFileIds.split(','),
            paperFileList: res.data.otherFileIds.split(',')
          }
          if (this.docForm.eleFileList.length > 0) {
            FileApi.getFileList(this.docForm.eleFileList).then(res => {
              if (res.data) {
                this.eleFileUrlList = res.data
                this.eleFileUrlList1 = res.data
              }
            })
          }
          if (this.docForm.paperFileList.length > 0) {
            FileApi.getFileList(this.docForm.paperFileList).then(res => {
              if (res.data) {
                this.paperFileUrlList = res.data
                this.paperFileUrlList1 = res.data
              }
            })
          }
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    }
    this.baseInfo.creatorName = this.$store.getters.name || 'admin'
  },
  methods: {
    async refresh(id) {
      let res = await Api.getSceneVisaDetailList({ siteAccessId: id })
      this.tableData = res.data.records
    },
    handleSelectContract() {
      this.contractSelectVisible = true
    },
    handleSelectChange() {
      this.changeSelectVisible = true
    },
    async handleSelectList() {
      /**
       任务名称：BUG1461 合同管理-合同管理-新增现场签证：在没有选择合同的情况下，点击”选择清单“弹出提示信息，提示信息带有代码字段，不合理
       开发人员：崔洛宜
       日期：2020-04-02
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      if (!this.baseInfo.contractName) {
        this.$message.error('请先选择一个合同')
        return false
      }
      let activeRow = await this.$refs.xTable.getActiveRecord()
      if (activeRow) {
        this.$message.error('请先保存数据')
        return false
      }
      this.listSelectVisible = true
    },
    /**
     任务名称：BUG1495 合同管理->编辑->上传附件时,文件列表没变
     开发人员：崔洛宜
     日期：2020-04-03
     BUG类型：自测BUG
     **/
    async handleChange(data) {
      if (data.length > 0) {
        let res = await FileApi.getFileList(data)
        this.eleFileUrlList1 = [...res.data]
      } else {
        this.eleFileUrlList1 = []
      }
    },
    async handleChange2(data) {
      if (data.length > 0) {
        let res = await FileApi.getFileList(data)
        this.paperFileUrlList1 = [...res.data]
      } else {
        this.paperFileUrlList1 = []
      }
    },
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 0) {
            return '合计'
          }
          if (['changeMoney'].includes(column.property)) {
            let total = 0
            data.map(item => {
              total += this.toFixed2(
                Number(
                  Number(item.afterQuantity) * Number(item.afterUnitPrice) -
                    Number(item.beforeQuantity) * Number(item.beforeUnitPrice)
                )
              )
            })
            return total.toFixed(2)
          }
          return null
        })
      ]
    },
    async selectBeforeDate(id) {
      let res = await Api.selectBeforeDate(id)
      console.log(res)
      this.changeTableData[0].beforeDuration = res.data
    },
    handleEmit(row) {
      this.baseInfo.contractName = row.name
      this.baseInfo.contractId = row.id
      this.contractSelectVisible = false
      this.selectBeforeDate(row.id)
    },
    handleChangeEmit(row) {
      this.baseInfo.accessReason = row.changeReason
      this.baseInfo.accessReasonId = row.id
      this.changeSelectVisible = false
    },
    async handleListEmit(data) {
      /**
       任务名称：BUG1450 合同管理-新增现场签证：签证详情部分，选择清单后，点击编辑按钮，字段”项目编号“/'项目名称"/”计量单位“可以编辑，不合理
       开发人员：崔洛宜
       日期：2020-03-31
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      console.log(data)
      let records = data.map(item => {
        item.add = false
        item.id = ''
        item.beforeQuantity = Number(item.quantity)
        item.beforeUnitPrice = Number(item.comprehensiveUnitPrice)
        item.afterQuantity = Number(item.updateQuantity)
        item.afterUnitPrice = Number(item.updateUnitPrice)
        item.beforeMoney = this.toFixed2(Number(Number(item.beforeQuantity) * Number(item.beforeUnitPrice)))
        item.afterMoney = this.toFixed2(Number(Number(item.afterQuantity) * Number(item.afterUnitPrice)))
        /**
           任务名称：BUG#1394 合同管理-现场签证-新建-签证类型-详情见下图
           开发人员：崔洛宜
           日期：2020-03-30
           BUG类型：测试人员发现的研发自测未通过引起的BUG
           **/
        item.changeMoney = this.toFixed2(Number(Number(item.afterMoney) - Number(item.beforeMoney)))
        return item
      })
      let { rows } = await this.$refs.xTable.insertAt(records, -1)
      this.isAddList = false
      await this.$refs.xTable.setActiveRow(rows[0])
      /*this.changeTableData = []*/
      this.listSelectVisible = false
    },
    afterQuantityChangeEvent({ row }, e) {
      row.afterMoney = Number(row.afterUnitPrice * e.target.value).toFixed(2)
    },
    afterUnitPriceChangeEvent({ row }, e) {
      row.afterMoney = Number(row.afterQuantity * e.target.value).toFixed(2)
    },

    /*    changeDurationChangeEvent({ row }, e) {
      console.log(e)
      row.afterDuration = Number(row.beforeDuration) + Number(e.target.value)
    },
    changeDurationChangeEvent1({ row }, e) {
      console.log(e)
      row.afterDuration = Number(row.beforeDuration) + Number(e.target.value)
    },*/
    editRowEvent(row) {
      console.log(row)
      /**
       任务名称：BUG1450 合同管理-新增现场签证：签证详情部分，选择清单后，点击编辑按钮，字段”项目编号“/'项目名称"/”计量单位“可以编辑，不合理
       开发人员：崔洛宜
       日期：2020-03-31
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      if (row.add) {
        this.isAddList = true
      } else {
        this.isAddList = false
      }
      this.$refs.xTable.setActiveRow(row)
    },
    saveRowEvent(row) {
      this.$refs.xTable.clearActived().then(() => {
        this.saveData(row)
        this.$message.success('保存成功')
      })
    },
    async saveData(row) {
      let res = null
      if (row.id) {
        res = await Api.updateSceneVisaDetailById(row)
      } else {
        res = await Api.addSceneVisaDetail(row)
        row.id = res.data
      }
    },
    async handleDelete(row, rowIndex) {
      if (row.id) {
        await Api.deleteSceneVisaDetailById(row.id)
      }
      this.$refs.xTable.remove(row)
      this.$message.success('删除成功')
    },
    cancelRowEvent(row) {
      const xTable = this.$refs.xTable
      xTable.clearActived().then(() => {
        // 还原行数据
        xTable.revertData(row)
      })
    },
    async handleAdd() {
      /**
       任务名称：BUG1450 合同管理-新增现场签证：签证详情部分，选择清单后，点击编辑按钮，字段”项目编号“/'项目名称"/”计量单位“可以编辑，不合理
       开发人员：崔洛宜
       日期：2020-03-31
       BUG类型：测试人员发现的研发自测未通过引起的BUG
       **/
      let activeRow = await this.$refs.xTable.getActiveRecord()
      if (activeRow) {
        this.$message.error('请先保存数据')
        return
      }
      let record = {
        add: true,
        itemCode: '',
        itemName: '',
        unit: '',
        beforeQuantity: 0,
        beforeUnitPrice: 0,
        beforeMoney: 0,
        afterQuantity: 0,
        afterUnitPrice: 0,
        afterMoney: 0
      }
      let { row: newRow } = await this.$refs.xTable.insertAt(record, -1)
      this.isAddList = true
      await this.$refs.xTable.setActiveRow(newRow)
      /*this.tableData.push({
        add: true,
        itemCode: '',
        itemName: '',
        unit: '',
        beforeQuantity: 0,
        beforeUnitPrice: 0,
        beforeMoney: 0,
        afterQuantity: 0,
        afterUnitPrice: 0,
        afterMoney: 0
      })*/
    },
    handleCancel() {
      this.$router.back()
    },
    handleSave() {
      this.$refs.baseInfoForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateSceneVisaById({
              ...this.baseInfo,
              beforeDuration: this.changeTableData[0].beforeDuration,
              changeDuration: this.changeTableData[0].changeDuration,
              afterDuration: this.changeTableData[0].beforeDuration - 0 + (this.changeTableData[0].changeDuration - 0),
              detailList: this.tableData,
              projectId: this.projectId,
              stieAccessFileIds: this.docForm.eleFileList.join(','),
              otherFileIds: this.docForm.paperFileList.join(','),
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addSceneVisa({
              ...this.baseInfo,
              beforeDuration: this.changeTableData[0].beforeDuration,
              changeDuration: this.changeTableData[0].changeDuration,
              afterDuration: this.changeTableData[0].beforeDuration - 0 + (this.changeTableData[0].changeDuration - 0),
              detailList: this.tableData,
              projectId: this.projectId,
              stieAccessFileIds: this.docForm.eleFileList.join(','),
              otherFileIds: this.docForm.paperFileList.join(','),
              status: 0
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          this.$message.error('请正确填写')
          return false
        }
      })
    },
    handleSubmit() {
      this.$refs.baseInfoForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            Api.updateSceneVisaById({
              ...this.baseInfo,
              beforeDuration: this.changeTableData[0].beforeDuration,
              changeDuration: this.changeTableData[0].changeDuration,
              afterDuration: this.changeTableData[0].beforeDuration - 0 + (this.changeTableData[0].changeDuration - 0),
              detailList: this.tableData,
              projectId: this.projectId,
              stieAccessFileIds: this.docForm.eleFileList.join(','),
              otherFileIds: this.docForm.paperFileList.join(','),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          } else {
            Api.addSceneVisa({
              ...this.baseInfo,
              beforeDuration: this.changeTableData[0].beforeDuration,
              changeDuration: this.changeTableData[0].changeDuration,
              afterDuration: this.changeTableData[0].beforeDuration - 0 + (this.changeTableData[0].changeDuration - 0),
              detailList: this.tableData,
              projectId: this.projectId,
              stieAccessFileIds: this.docForm.eleFileList.join(','),
              otherFileIds: this.docForm.paperFileList.join(','),
              status: 1
            }).then(res => {
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.$router.back()
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        } else {
          console.log('请正确填写')
          return false
        }
      })
    },
    async updateFoot() {
      await this.$refs.xTable.updateFooter()
    }
  }
}
</script>
<style lang="less" scoped>
.inputStyle {
  width: 500px;
}
.formWrapper {
  width: 1200px;
  margin: 0 auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
.addWrapper {
  height: 40px;
  line-height: 40px;
  margin: 10px 50px;
  border: 1px #585858 dashed;
  text-align: center;
}
/deep/ .el-upload {
  text-align: left !important;
}
.imgContainer {
  display: flex;
  .imgWrapper {
    width: 140px;
    height: 140px;
    margin: 10px;
    img {
      width: 100px;
      height: 100px;
      margin: 0 20px;
    }
    .fileName {
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
