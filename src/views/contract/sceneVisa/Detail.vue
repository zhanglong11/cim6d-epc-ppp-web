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
          <span>{{ headData.accessName }}</span>
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
        <el-col :span="6">
          <div class="infoCellLabel">现场签证编号</div>
          <div class="infoCellValue">{{ headData.accessNumber }}</div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">部位</div>
          <div class="infoCellValue">{{ headData.place }}</div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">日期</div>
          <div class="infoCellValue">{{ headData.accessDate }}</div>
        </el-col>
        <el-col :span="6">
          <div class="infoCellLabel">状态</div>
          <div class="infoCellValue">
            {{
              headData.status !== null && headData.status !== undefined
                ? sceneVisaStatus.filter(item => item.value === headData.status)[0].label
                : ''
            }}
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">变更原因</div>
            <div class="lrCellValue">{{ headData.accessReason }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">内容摘要</div>
            <div class="lrCellValue">{{ headData.content }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">备注</div>
            <div class="lrCellValue">{{ headData.remark }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row style="margin: 10px 0">
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建人</div>
            <div class="lrCellValue">{{ headData.creatorName }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lrCellInfo">
            <div class="lrCellLabel">创建时间</div>
            <div class="lrCellValue">{{ headData.createTime }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="divWrapper tabContainerOuter">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="现场签证详情" name="first"
          ><VisaDetail ref="detail" :siteAccessId="id" :changeTableData="changeTableData"></VisaDetail
        ></el-tab-pane>
        <el-tab-pane label="现场签证附件" name="second"><VisaAnnex :fileUrl="fileUrl"></VisaAnnex></el-tab-pane>
      </el-tabs>
    </div>
    <template v-if="isCheck">
      <CheckCard :id="id" ref="checkCard"></CheckCard>
    </template>
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
import VisaAnnex from './components/VisaAnnex'
import VisaDetail from './components/VisaDetail'
import Api from '@/api/contract/sceneVisa'
import sceneVisaStatus from '@/lib/basicStatus'
import FileApi from '@/api/file'
export default {
  name: 'Detail',
  components: {
    VisaAnnex,
    VisaDetail
  },
  data() {
    return {
      sceneVisaStatus,
      headData: {},
      activeName: 'first',
      fileUrl: {
        visa: [],
        other: []
      },
      siteAccessId: '',
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
    let { id, isCheck } = this.$route.params
    this.id = id
    this.siteAccessId = id
    this.isCheck = isCheck
    this.getDetail(id)
  },
  methods: {
    getDetail(id) {
      Api.getSceneVisaById(id).then(res => {
        if (res.code === 200) {
          this.headData = res.data
          this.changeTableData[0].afterDuration = res.data.afterDuration
          this.changeTableData[0].beforeDuration = res.data.beforeDuration
          this.changeTableData[0].changeDuration = res.data.changeDuration
          let visa = res.data.stieAccessFileIds.split(',')
          let other = res.data.otherFileIds.split(',')
          if (visa.length > 0) {
            FileApi.getFileList(visa).then(res => {
              if (res.data) {
                this.fileUrl.visa = res.data
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
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
    /**
    任务名称：BUG1418 合同管理-现场签证：查看页面信息显示布局混乱
    开发人员：崔洛宜
    日期：2020-03-31
    BUG类型：测试人员发现的研发自测未通过引起的BUG
    **/
    /*height: 40px;*/
    .lrCellLabel {
      width: 70px;
      color: #cccccc;
      margin-right: 10px;
    }
    .lrCellValue {
      flex: 1;
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
