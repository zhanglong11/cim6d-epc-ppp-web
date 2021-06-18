<template>
  <!--
    /**
               任务名称：TASK#2876 修改返回样式
               开发人员：崔洛宜
               日期：2020-04-03
               任务类型：修改返回样式
               **/
  -->
  <div class="indexWrapper">
    <!-- 流程图 start -->
    <ViewFlow :id="id" />
    <!-- 流程图 end -->
    <div class="info">
      <div class="content">
        <h6 class="title">
          <img
            src="http://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&f=JPEG?w=1280&h=853"
            alt="未知错误"
            width="30px"
            height="30px"
            style="border-radius: 50%; vertical-align: middle"
          />
          <span>{{ headData.name }}（{{ headData.code }}）</span>
        </h6>
      </div>
      <div class="status-box">
        <el-button-group>
          <!--
                /**
           任务名称：TASK#2746/合同管理->清单关联
           开发人员：崔洛宜
           日期：2020-03-27
           任务类型：遗漏页面
           **/
          -->
          <!--
        /**
            任务名称：BUG1382/合同管理-总承包合同-查看-报错；合同清单分解-选择清单项目-报错
            开发人员：崔洛宜
            日期：2020-03-30
            BUG类型：测试人员发现的研发自测未通过引起的BUG
            **/
           -->

          <!--          <el-button v-if="[5].includes(headData.type)" @click="$router.push(`/contract/manage/relateOrderList/${id}`)"-->
          <!--            >清单关联(分包)</el-button-->
          <!--          >-->
          <el-button
            v-if="[2].includes(headData.type) && $hasPower('RelateOrderListBuy')"
            :disabled="headData.status != 5"
            @click="$router.push(`/contract/relateOrderListBuy/${id}`)"
            >清单关联(采购)</el-button
          >
          <el-button
            v-if="[4].includes(headData.type) && $hasPower('RelateOrderListBorrow')"
            :disabled="headData.status != 5"
            @click="$router.push(`/contract/relateOrderListBorrow/${id}`)"
            >清单关联(租赁)</el-button
          >
          <!--
               /**
                   任务名称：TASK#2792 3月4号注释
                   开发人员：崔洛宜
                   日期：2020-03-04
                   任务类型：注释
                   **/
          -->
          <el-button v-if="[1].includes(headData.type)" :disabled="headData.status != 5" @click="handleDownload"
            >下载人材机模板</el-button
          >
          <el-button v-if="[1].includes(headData.type) && $hasPower('uploadRCJ')" style="padding: 0; border: none">
            <el-button size="small" :disabled="[2, 5].includes(headData.status)" @click="showTalentDialog"
              >人材机上传</el-button
            >
          </el-button>
          <el-button
            v-if="[1].includes(headData.type) && $hasPower('ContractListDisintegration')"
            :disabled="headData.status != 5"
            @click="handleDisintegrate"
            >合同清单分解</el-button
          >
          <el-button
            v-if="[1, 3, 5].includes(headData.type) && $hasPower('ContractMeasurementPayment')"
            :disabled="headData.status != 5"
            @click="$router.push('/contract/contractMeasurementPayment')"
            >合同计量与支付</el-button
          >
          <el-button
            v-if="[1, 3, 5].includes(headData.type) && $hasPower('ContractChange')"
            :disabled="headData.status != 5"
            @click="$router.push('/contract/contractChange')"
            >合同变更</el-button
          >
        </el-button-group>
        <!--<el-button type="primary" style="margin-left: 20px" @click="() => {}">编辑</el-button>-->
      </div>
    </div>
    <div class="divWrapper">
      <el-row>
        <el-col :span="6">
          <div class="infoCellLabel">合同金额（万元）</div>
          <div class="infoCellValue"><WanSpan :value="headData.amount" /></div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">合同类型</div>
          <div class="infoCellValue">
            {{ headData.type ? contractType.filter(item => item.value === headData.type)[0].label : '' }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">合同状态</div>
          <div class="infoCellValue">
            {{
              headData.status !== null && headData.status !== undefined
                ? contractStatus.filter(item => item.value === headData.status)[0].label
                : ''
            }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">甲方</div>
          <div class="infoCellValue">{{ headData.firstParty }}</div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">签订日期</div>
            <div class="lrCellValue">{{ moment(headData.signDate).format('YYYY-MM-DD') }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方联系人</div>
            <div class="lrCellValue">{{ headData.firstPartyLinkman }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">合同价款形式</div>
            <div class="lrCellValue">{{ $getLabelFromArg('priceForm', headData.priceForm) }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建人</div>
            <div class="lrCellValue">{{ headData.creatorName }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">合同工期</div>
            <div class="lrCellValue">{{ headData.duration }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">甲方联系电话</div>
            <div class="lrCellValue">{{ headData.firstPartyMobile }}</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建时间</div>
            <div class="lrCellValue">{{ headData.createTime }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">开工日期</div>
            <div class="lrCellValue">{{ headData.startDate | ymd }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方</div>
            <div class="lrCellValue">{{ headData.secondParty }}</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">备注</div>
            <div class="lrCellValue">{{ headData.remark }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">竣工日期</div>
            <div class="lrCellValue">{{ headData.endDate | ymd }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方联系人</div>
            <div class="lrCellValue">{{ headData.secondPartyLinkman }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">质保期（月）</div>
            <div class="lrCellValue">{{ headData.guaranteePeriod }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">乙方联系电话</div>
            <div class="lrCellValue">{{ headData.secondPartyMobile }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">工程类型</div>
            <div class="lrCellValue">
              {{
                headData.engineeringType
                  ? engineeringType.filter(item => item.value === headData.engineeringType)[0].label
                  : ''
              }}
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">投资类型</div>
            <div class="lrCellValue">
              {{
                headData.investmentType
                  ? investmentType.filter(item => item.value === headData.investmentType)[0].label
                  : ''
              }}
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="divWrapper tabContainerOuter">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="合同附件" name="first"
          ><ContractAnnex ref="files" :fileUrl="fileUrl" :canUpload="headData.status === 2"></ContractAnnex
        ></el-tab-pane>
        <!--
            /**
                 任务名称：TASK#2790 3月2号注释
                 开发人员：崔洛宜
                 日期：2020-03-02
                 任务类型：注释
                 **/
        -->
        <template v-if="headData.type === 1">
          <el-tab-pane label="建筑工程" name="second" lazy
            ><BuildingProject :contractId="headData.id"></BuildingProject>
          </el-tab-pane>
          <el-tab-pane label="机电设备及安装工程" name="third" lazy>
            <ElectromechanicalEquipmentInstallation :contractId="headData.id"></ElectromechanicalEquipmentInstallation>
          </el-tab-pane>
          <el-tab-pane label="人材机信息(建筑)" name="forth" lazy>
            <PMMDetail :contractId="headData.id" :inventoryCategory="1"></PMMDetail
          ></el-tab-pane>
          <el-tab-pane label="人材机信息(机电)" name="five" lazy>
            <PMMDetail :contractId="headData.id" :inventoryCategory="2"></PMMDetail
          ></el-tab-pane>
        </template>
        <!--
            /**
                 任务名称：TASK#2791 3月3号注释
                 开发人员：崔洛宜
                 日期：2020-03-03
                 任务类型：注释
                 **/
        -->
        <template v-if="[2, 4].indexOf(headData.type) >= 0">
          <el-tab-pane label="合同清单" name="fifth">
            <ContractOrderList :contractId="headData.id"></ContractOrderList
          ></el-tab-pane>
        </template>
        <template v-if="[3, 5].indexOf(headData.type) >= 0">
          <el-tab-pane label="合同清单" name="sixth">
            <SubcontractOrderList :contractId="headData.id"></SubcontractOrderList
          ></el-tab-pane>
        </template>
      </el-tabs>
    </div>

    <!--
        /**
   任务名称：2732/合同管理查看详情修改
   开发人员：崔洛宜
   日期：2020-03-26
   任务类型：修改逻辑
   **/
    -->
    <!--<template v-if="isCheck || [2, 3, 5, 6].includes(headData.status)">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>-->
    <template v-if="isCheck && headData.status !== 2">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleCancel">返回</el-button>
      <el-button
        v-if="headData.status === 2 && $hasPower('ContractEdit')"
        :disabled="!allowClick"
        type="primary"
        @click="handleUploadPaperContract"
        >提交</el-button
      >
      <template v-if="isCheck">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="approval()">确定</el-button>
      </template>
    </div>
    <el-dialog title="选择人材机类型" :visible.sync="visible" width="400px">
      <div style="display: flex; justify-content: space-around">
        <el-upload
          class="upload-demo"
          action="aaa"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-change="handleChange"
          :http-request="params => uploadSectionFile(params, 1)"
          :inventoryCategory="1"
        >
          <el-button size="small">人材机(建筑)</el-button>
        </el-upload>
        <el-upload
          class="upload-demo"
          action="aaa"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :show-file-list="false"
          :on-success="handleSuccess"
          :onPress="handlePress"
          :on-change="handleChange"
          :http-request="params => uploadSectionFile(params, 2)"
          :inventoryCategory="2"
        >
          <el-button size="small">人材机(机电)</el-button>
        </el-upload>
      </div>
      <div style="margin: 20px 30px 10px 30px">
        <el-progress v-if="showPercentage" :percentage="percentage"></el-progress>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ContractAnnex from './components/ContractAnnex'
import BuildingProject from './components/BuildingProject'
import ContractOrderList from './components/ContractOrderList'
import SubcontractOrderList from './components/SubcontractOrderList'
import PMMDetail from './components/PMMDetail'
import ElectromechanicalEquipmentInstallation from './components/ElectromechanicalEquipmentInstallation'
import Api from '@/api/contract/contractManage'
import contractType from '@/lib/contractType'
import investmentType from '@/lib/investmentType'
import contractStatus from '@/lib/contractStatus'
import engineeringType from '@/lib/engineeringType'
import FileApi from '@/api/file'
import WanSpan from '@/views/contract/contractManage/components/WanSpan'
export default {
  name: 'Detail',
  components: {
    ContractAnnex,
    BuildingProject,
    ElectromechanicalEquipmentInstallation,
    WanSpan,
    /**
     任务名称：TASK#2790 3月2号注释
     开发人员：崔洛宜
     日期：2020-03-02
     任务类型：注释
     **/
    ContractOrderList,
    /**
     任务名称：TASK#2791 3月3号注释
     开发人员：崔洛宜
     日期：2020-03-03
     任务类型：注释
     **/
    SubcontractOrderList,
    PMMDetail
  },
  props: {
    inventoryCategory: {}
  },
  data() {
    return {
      visible: false,
      allowClick: true,
      projectId: localStorage.getItem('projectId'),
      investmentType,
      engineeringType,
      contractType,
      contractStatus,
      headData: {},
      activeName: 'first',
      tableData: [],
      total: 50,
      pageSize: 10,
      currentPage: 1,
      fileList: [],
      fileUrl: {
        ele: [],
        paper: []
      },
      showPercentage: false,
      percentage: 0 //上传进度
    }
  },
  created() {
    let { id, isCheck } = this.$route.params
    this.id = id
    this.isCheck = isCheck
    this.getDetail(id)
    this.getTableData()
  },
  methods: {
    getDetail(id) {
      Api.getContractById(id).then(res => {
        if (res.code === 200) {
          this.headData = res.data
          let eleArr = res.data.electronicContractFileIds.split(',')
          let paperArr = res.data.paperContractFileIds.split(',')
          if (eleArr.length > 0) {
            FileApi.getFileList(eleArr).then(res => {
              if (res.data) {
                this.fileUrl.ele = res.data
              }
            })
          }
          if (paperArr.length > 0) {
            FileApi.getFileList(paperArr).then(res => {
              if (res.data) {
                this.fileUrl.paper = res.data
              }
            })
          }
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
      this.tableData = [{ id: 1, name: 1, type: 1, fileName: '分部分项工程和单价措施项目清单与计价表.xlsx' }]
    },
    getTableData() {
      this.tableData = [
        { operator: '张三', operateTime: '2020-02-04 10:00:00', type: '删除', detail: '删除无用' },
        { operator: '张三', operateTime: '2020-02-04 10:00:00', type: '删除', detail: '删除无用' },
        { operator: '张三', operateTime: '2020-02-04 10:00:00', type: '删除', detail: '删除无用' }
      ]
    },
    /**
     任务名称：TASK#2792 3月4号注释
     开发人员：崔洛宜
     日期：2020-03-04
     任务类型：注释
     **/
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleSuccess(res, files, fileList) {},
    /**
     任务名称：TASK#2828 3月7号注释
     开发人员：崔洛宜
     日期：2020-03-31
     任务类型：注释(添加上传函数)
     **/
    uploadSectionFile(params, type) {
      const file = params.file
      const formData = new FormData()
      formData.append('file', file)
      formData.append('contractId', this.id)
      formData.append('projectId', this.projectId)
      formData.append('inventoryCategory', type)
      Api.uploadRCJ(formData).then(res => {
        if (res.code === 200) {
          this.$message.success('上传成功')
          this.visible = false
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    handleChange(file, fileList) {
      console.log(file)
      if (file.status === 'ready') {
        this.showPercentage = true
        this.percentage = 0
      }
      if (file.status === 'success') {
        this.percentage = 100
        this.showPercentage = false
      }
    },
    handlePress(e) {
      this.showPercentage = true
      this.percentage = ((e.loaded / e.total) * 100) | 0
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    //清单分解
    handleDisintegrate() {
      this.$router.push({ name: `ContractListDisintegration`, params: { id: this.id } })
    },
    /**
     任务名称：TASK#2828 3月7号注释
     开发人员：崔洛宜
     日期：2020-03-31
     任务类型：注释(添加下载方法)
     **/
    handleDownload() {
      Api.downloadRCJ({
        contractId: this.contractId
      }).then(res => {
        this.download(res.data)
      })
    },
    download(data) {
      if (!data) {
        return
      }
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' })
      let fileName = '人材机模板.xls'
      if ('download' in document.createElement('a')) {
        // 不是IE浏览器
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      } else {
        // IE 10+
        window.navigator.msSaveBlob(blob, fileName)
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
      this.getTableData()
    },
    handleCancel() {
      this.$router.back()
    },
    //纸质版审核
    async handleUploadPaperContract() {
      this.allowClick = false
      let res = await this.$refs.files.handleSubmit(this.id)
      if (!res) this.allowClick = true
      if (res && res.code && res.code === 200) {
        this.$message.success('提交成功')
        this.$router.back()
      } else {
        this.allowClick = true
      }
    },
    // 审批
    approval() {
      this.$refs.checkCard.audit()
    },
    handleEmitForm(data) {
      console.log(data)
      Api.handleCheck(data).then(res => {
        if (res.code === 200) {
          this.$message.success('审核成功')
          this.$router.back()
        } else {
          this.$message.error('未知错误,请重试')
        }
      })
    },
    showTalentDialog() {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  display: flex;
  background: #fff;
  padding: 10px;

  .title {
    margin: 0;
    padding: 10px;
    font-size: 20px;

    span {
      padding-left: 10px;
    }
  }

  .content {
    flex: 1;
  }

  .status-box {
    width: 600px;
    padding: 10px;
    text-align: right;
  }
}
.divWrapper {
  padding: 20px 50px;
  .infoCellLabel {
    font-size: 14px;
    color: #cccccc;
    height: 30px;
    line-height: 30px;
  }
  .infoCellValue {
    font-size: 16px;
  }
  .lrCellInfo {
    display: flex;
    height: 40px;
    .lrCellLabel {
      color: #cccccc;
      margin-right: 10px;
    }
  }
}
.tabContainerOuter {
  height: 600px !important;
  overflow: auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
.upload-demo {
  display: inline-block;
}
</style>
