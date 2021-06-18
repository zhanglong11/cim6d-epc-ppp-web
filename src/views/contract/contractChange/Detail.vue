<template>
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
          <span>{{ headData.name }}</span>
        </h6>
      </div>
      <div class="status-box">
        <el-button-group>
          <!--<el-button @click="() => {}">合同清单分解</el-button>
          <el-button @click="() => {}">合同计量与支付</el-button>
          <el-button @click="() => {}">合同变更</el-button>-->
        </el-button-group>
      </div>
    </div>
    <div class="divWrapper">
      <el-row>
        <el-col :span="5">
          <div class="infoCellLabel">变更编号</div>
          <div class="infoCellValue">{{ headData.changeCode }}</div>
        </el-col>
        <el-col :span="5">
          <div class="infoCellLabel">专业名称</div>
          <div class="infoCellValue">{{ headData.specialName }}</div>
        </el-col>
        <el-col :span="5">
          <div class="infoCellLabel">提出单位</div>
          <div class="infoCellValue">{{ headData.changeSubmitCompany }}</div>
        </el-col>
        <el-col :span="5">
          <div class="infoCellLabel">变更类型</div>
          <div class="infoCellValue">
            {{
              headData.changeType !== null && headData.changeType !== undefined
                ? contractChangeType.filter(item => item.value === headData.changeType)[0].label
                : ''
            }}
          </div>
        </el-col>

        <el-col :span="4">
          <div class="infoCellLabel">状态</div>
          <div class="infoCellValue">
            {{
              headData.status !== null && headData.status !== undefined
                ? contractChangeStatus.filter(item => item.value === headData.status)[0].label
                : ''
            }}
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="5">
          <div class="lrCellInfo">
            <div class="lrCellLabel">变更原因</div>
            <div class="lrCellValue">{{ headData.changeReason }}</div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建人</div>
            <div class="lrCellValue">{{ headData.creatorName }}</div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="lrCellInfo">
            <div class="lrCellLabel">备注</div>
            <div class="lrCellValue">{{ headData.remark }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="5">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建时间</div>
            <div class="lrCellValue">{{ headData.createTime }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="divWrapper tabContainerOuter">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="合同变更附件" name="first"
          ><ContractChangeAnnex :fileUrl="fileUrl"></ContractChangeAnnex
        ></el-tab-pane>
      </el-tabs>
    </div>
    <!-- 审核组件 start -->
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
    <!-- 审核组件 end -->
    <div class="footerButton">
      <el-button v-if="!isCheck" @click="handleCancel">返回</el-button>
      <template v-else>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </div>
  </div>
</template>
<script>
import ContractChangeAnnex from './components/ContractChangeAnnex'
import Api from '@/api/contract/contractChange'
import contractChangeType from '@/lib/contractChangeType'
import contractChangeStatus from '@/lib/basicStatus'
import FileApi from '@/api/file'
export default {
  name: 'Detail',
  components: {
    ContractChangeAnnex
  },
  data() {
    return {
      contractChangeType,
      contractChangeStatus,
      headData: {},
      activeName: 'first',
      tableData: [],
      total: 50,
      pageSize: 10,
      currentPage: 1,
      fileUrl: {
        change: [],
        other: []
      }
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
      Api.getContractChangeById(id).then(res => {
        if (res.code === 200) {
          this.headData = res.data
          let change = res.data.changeOrdersFileIds.split(',')
          let other = res.data.otherOrdersFileIds.split(',')
          if (change.length > 0) {
            FileApi.getFileList(change).then(res => {
              if (res.data) {
                this.fileUrl.change = res.data
              }
            })
          }
          if (other.length > 0) {
            FileApi.getFileList(other).then(res => {
              if (res.data) {
                this.fileUrl.other = res.data
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
    handleSubmit() {
      this.$refs.checkCard.audit()
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
  height: 500px !important;
  overflow: auto;
}
.footerButton {
  margin-top: 15px;
  text-align: right;
  margin-right: 100px;
}
</style>
