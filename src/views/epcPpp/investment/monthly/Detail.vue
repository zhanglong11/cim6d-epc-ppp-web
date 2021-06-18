<template>
  <div class="indexWrapper">
    <div class="divWrapper">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>基本信息</strong>
        </div>
        <el-row>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">项目名称:</div>
              <div class="lrCellValue">{{ form.name }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">报告月份:</div>
              <div class="lrCellValue">{{ form.reportDate }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">报告期:</div>
              <div class="lrCellValue">{{ form.reportStartDate }}~{{ form.reportEndDate }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">编制:</div>
              <div class="lrCellValue">{{ form.authorName }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">合作方（政府方）:</div>
              <div class="lrCellValue">{{ form.partner }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">总包单位:</div>
              <div class="lrCellValue">{{ form.mainContractorCompany }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">项目公司设计情况:</div>
              <div class="lrCellValue">{{ form.designSituation }}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">项目概况:</div>
              <div class="lrCellValue">{{ form.projectSituation }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>投资项目要点</strong>
        </div>
        <el-row>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">合同形式:</div>
              <div class="lrCellValue">{{ form.projectContractForm }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">签署日期:</div>
              <div class="lrCellValue">{{ form.projectSignDate }}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">回报机制（构成、支付）:</div>
              <div class="lrCellValue">{{ form.projectReportingStandards }}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">合同期限及内容:</div>
              <div class="lrCellValue">{{ form.projectContractDeadline }}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">主要违约罚则:</div>
              <div class="lrCellValue">{{ form.projectMainBreachPenalty }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>总包合同要点</strong>
        </div>
        <el-row>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">合同形式:</div>
              <div class="lrCellValue">{{ form.contractorContractForm }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">签署日期:</div>
              <div class="lrCellValue">{{ form.contractorSignDate }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">施工让利:</div>
              <div class="lrCellValue">{{ form.contractorConstructionBenefits }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">工程款支付方式:</div>
              <div class="lrCellValue">{{ form.contractorPayMoneyType }}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">履约担保（额度、方式）:</div>
              <div class="lrCellValue">{{ form.contractorPerformanceGuarantee }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>工期</strong>
        </div>
        <el-row>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">合同工期:</div>
              <div class="lrCellValue">{{ form.contractDuration }}</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">实际开工日期:</div>
              <div class="lrCellValue">{{ form.actualStartDate }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>本年度经营目标情况</strong>
        </div>
        <el-row>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">产值目标:</div>
              <div class="lrCellValue">{{ form.productValueTarget }}万元</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">产值完成情况:</div>
              <div class="lrCellValue">{{ form.productValueFinishSituation }}万元</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">产值完成比例:</div>
              <div class="lrCellValue">{{ form.productValueFinishPercentage }}%</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">投资回报目标:</div>
              <div class="lrCellValue">{{ form.investmentReturnTarget }}万元</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">投资回报完成情况:</div>
              <div class="lrCellValue">{{ form.investmentReturnFinishSituation }}万元</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">投资回报完成比例:</div>
              <div class="lrCellValue">{{ form.investmentReturnFinishPercentage }}%</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">回款目标:</div>
              <div class="lrCellValue">{{ form.returnedMoneyTarget }}万元</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">回款完成情况:</div>
              <div class="lrCellValue">{{ form.returnedMoneyFinishSituation }}万元</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="lrCellInfo">
              <div class="lrCellLabel">回款完成比例:</div>
              <div class="lrCellValue">{{ form.returnedMoneyFinishPercentage }}%</div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="lrCellInfo">
              <div class="lrCellLabel">重要情况说明:</div>
              <div class="lrCellValue">{{ form.basicImportantExplanation }}</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <strong>附件信息</strong>
          <!--          <el-button v-if="isEdit" type="primary" style="margin-left: 10px;" @click="addFile">上传文件</el-button>-->
        </div>
        <VXTable ref="fileTable" :pageShow="false" :tableData="accessoryList">
          <vxe-table-column title="附件名称" field="name"></vxe-table-column>
          <vxe-table-column title="上传时间" field="uploadTime"></vxe-table-column>
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
                <!--                <Download :fileId="row.accessoryId" :fileName="row.fileName" />-->
                <!--                      <el-button type="text" @click="removeFile(row)">-->
                <!--                        删除-->
                <!--                      </el-button>-->
              </template>
              <template v-else>
                <span>暂无附件</span>
              </template>
              <!--                    <template v-if="!row.accessoryId">-->
              <!--                      <el-button type="text" @click="addFile(row)">-->
              <!--                        上传附件文件-->
              <!--                      </el-button>-->
              <!--                    </template>-->
              <!--                    <el-button type="text" @click="addModelFile(row)"> 更换模板 </el-button>-->
              <!--                    <el-button type="danger" @click="removeModelFile(row)">-->
              <!--                      删除附件-->
              <!--                    </el-button>-->
            </template>
          </vxe-table-column>
        </VXTable>
      </el-card>
    </div>
    <!--    <template v-if="isCheck">-->
    <!--      <CheckCard :id="id" ref="checkCard"></CheckCard>-->
    <!--    </template>-->
    <div class="footerButton">
      <el-button @click="handleCancel">返回</el-button>
    </div>
  </div>
</template>
<script>
import Api from '../api'
import Download from '../components/Download'
import fileApi from '@/api/file'
import contentDisposition from 'content-disposition'
import axios from '@/utils/axios'
export default {
  name: 'Detail',
  // components: {
  //   Download
  // },
  data() {
    return {
      id: null,
      url: '',
      form: {},
      accessoryList: []
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    async getDetail() {
      this.id = this.$route.params.id
      let res = await Api.getMonthlyDetails(this.id)
      this.form = res.data || {}
      this.accessoryList = res.data.accessoryList
    },
    handleCancel() {
      this.$router.back()
    },
    //文件下载
    uploadFile(id) {
      this.url = ` ${axios.file.defaults.baseURL}/noToken/file/commonFile/download/${id}`
    },
    async downloadFile(row) {
      let { templateId } = row
      const res = await fileApi.downloadFileById(templateId)
      const a = document.createElement('a')
      let type = res.headers['content-disposition'].split('.')[1].replace(/\"/g, '')
      let name = `${row.name}.${type}`
      a.href = URL.createObjectURL(res.data)
      a.download =
        _.get(this.file, 'fileName', name) ||
        contentDisposition.parse(res.headers['content-disposition']).parameters.filename
      a.click()
      // saveAs(res.data, row.name)
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
    width: 400px;
    padding: 10px;
    text-align: right;
  }
}
.divWrapper {
  padding: 20px 0;
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
      color: #333;
      margin-right: 10px;
    }
    .lrCellValue {
      color: #999;
      flex: 1;
    }
  }
}

.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
