<template>
  <div class="container no-padding is-footer fixedHeight">
    <div class="innerContainer white">
      <div class="infoWrapper">
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">问题部位</div>
              <div class="lrCellValue">{{ info.locationName }}</div>
            </div>
          </el-col>
          <!--<el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">工程类别</div>
              <div class="lrCellValue">{{ $getLabel(engineeringTypeList, info.engineeringCategory) }}</div>
            </div>
          </el-col>-->
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">问题类型</div>
              <div class="lrCellValue">{{ $getLabel(safetyQuestionTypeList, info.issueType) }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">现场照片</div>
              <div class="lrCellValue"><FileList :ids="info.imageIds"></FileList></div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">问题描述</div>
              <div class="lrCellValue">{{ info.description }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">整改要求</div>
              <div class="lrCellValue">{{ info.rectificationRequirement }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">发现人</div>
              <div class="lrCellValue">{{ info.discoveryPersonName }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">发现时间</div>
              <div class="lrCellValue">{{ info.discoveryDate | ymd }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">取消人</div>
              <div class="lrCellValue">{{ info.cancelPersonName }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">取消时间</div>
              <div class="lrCellValue">{{ info.cancelDate | ymd }}</div>
            </div>
          </el-col>
        </el-row>
        <el-row class="rowLine">
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">责任人</div>
              <div class="lrCellValue">{{ info.pushPersonName }}</div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="lrCellInfo">
              <div class="lrCellLabel">整改期限</div>
              <div class="lrCellValue">{{ info.rectificationDate | ymd }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <div v-if="info.locationId" class="bimContainer">
          <BimShow
            ref="BIMRef"
            idSelect="progress"
            type="2d"
            :isLoadAll="false"
            class="bim-box-progress"
            :anchorData="anchorData"
            anchorType="safe"
          />
        </div>
      </div>
    </div>
    <div class="footer-btn">
      <el-button size="lg" @click="goBack()">返回</el-button>
      <el-button v-if="isCancel" type="primary" size="lg" @click="cancel()">整改</el-button>
    </div>
  </div>
</template>

<script>
import Api from './api'
import BimShow from '../home/components/bimShow'
export default {
  name: 'SafetyQuestionDetail',
  components: {
    BimShow
  },
  data() {
    return {
      id: this.$route.params.id || '',
      isCancel: this.$route.query.isCancel || false,
      fileList: [],
      fileUrlList: [],
      info: {},
      anchorData: [] // 锚点回显数据
    }
  },
  computed: {
    //工程类型
    engineeringTypeList() {
      return (
        this.$getArgList('epcPPPEngineeringType') || [
          { value: 1, label: '混凝土工程' },
          { value: 2, label: '模板工程' },
          { value: 3, label: '钢筋工程' },
          { value: 4, label: '砌体工程' },
          { value: 5, label: '防水工程1' }
        ]
      )
    },
    //问题类型
    safetyQuestionTypeList() {
      return this.$getArgList('epcPPPSafetyIssueType') || []
    }
  },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  created() {
    if (this.id) {
      this.getDetail()
    }
  },
  // 方法集合
  methods: {
    //获取详情
    async getDetail() {
      let res = await Api.getDetail(this.id)
      let datas = res.data
      this.info = datas
      this.bimInit()
    },
    // 初始化bim数据
    bimInit() {
      let guidArray = []
      if (!this.info.componentIds) {
        return
      }
      this.info.componentIds.map((e, i) => {
        // 数据异常处理
        if (!this.info.componentPos || this.info.componentPos.length !== this.info.componentIds.length) {
          return
        }
        let posList = this.info.componentPos[i].split('-')
        let pos = {
          x: posList[0],
          y: posList[1],
          z: posList[2]
        }
        // 锚点回显数据格式处理
        guidArray.push({
          guid: e,
          pos,
          status: this.info.status
        })
      })
      this.anchorData = guidArray
      console.log(1111, this.info)
      this.$nextTick(() => {
        this.$refs.BIMRef.bimInit(
          [
            {
              id: this.info.modelId,
              viewId: this.info.viewId,
              name: this.info.locationName
            }
          ],
          true
        )
      })
    },
    // 返回
    goBack() {
      this.$router.back()
    },
    //整改操作
    async cancel() {
      await Api.cancel(this.id)
      this.$message({
        type: 'success',
        message: '整改成功!'
      })
      this.goBack()
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common.less');
.innerContainer {
  padding: 40px 20px;
}
.infoWrapper {
  padding: 10px 40px;
  max-width: 60%;
}
.rowLine {
  margin-bottom: 10px;
}
.lrCellInfo {
  display: flex;
  align-items: flex-start;
  padding: 2px 10px 2px 0;
  min-height: 30px;
  font-size: 16px;
  .lrCellLabel {
    color: #cccccc;
    margin-right: 10px;
    min-width: 100px;
    text-align: right;
  }
  .lrCellValue {
    flex: 1;
  }
}
.bimContainer {
  height: 800px;
}
</style>
