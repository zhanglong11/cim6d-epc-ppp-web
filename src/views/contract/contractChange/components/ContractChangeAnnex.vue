<template>
  <div>
    <!--
                /**
                  任务名称：BUG1287 合同管理-附件缩略图-如果附件是图片，就显示图片；如果是文档，按照下图2中显示文件类型
                  开发人员：崔洛宜
                  日期：2020-03-24
                  BUG类型：测试人员发现的研发自测未通过引起的BUG
                  **/
              -->
    <!--<div class="rowLine">
      <div class="label">设计变更单/工程洽商记录：</div>
      <div class="fileList">
        <div class="imgContainer">
          <template v-for="(item, index) of fileUrl.change">
            <div :key="index" class="imgWrapper">
              <img :src="item.fileUrl" alt="未知错误" width="100px" height="100px" />
              <div class="fileName">
                <span style="display: inline-block;max-width: 80px">{{ item.fileName }}</span>
                <a @click="() => {}">下载</a>
              </div>
            </div>
          </template>
          <template v-if="fileUrl.change.length === 0">无附件</template>
        </div>
      </div>
    </div>
    <div class="rowLine">
      <div class="label">其他：</div>
      <div class="fileList">
        <div class="imgContainer">
          <template v-for="(item, index) of fileUrl.other">
            <div :key="index" class="imgWrapper">
              <img :src="item.fileUrl" alt="未知错误" width="100px" height="100px" />
              <div class="fileName">
                <span style="display: inline-block;max-width: 80px">{{ item.fileName }}</span>
                <a @click="() => {}">下载</a>
              </div>
            </div>
          </template>
          <template v-if="fileUrl.other.length === 0">无附件</template>
        </div>
      </div>
    </div>-->
    <div class="detail-b-file">
      <FileRecord labelName="设计变更单/工程洽商记录：" :fileRecover="fileUrl.change"></FileRecord>
    </div>
    <div class="detail-b-file">
      <FileRecord labelName="其他：" :fileRecover="fileUrl.other"></FileRecord>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ContractChangeAnnex',
  props: {
    fileUrl: {
      type: Object,
      default: () => {
        return {
          change: [],
          other: []
        }
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.rowLine {
  display: flex;
  margin: 20px 0;
  .label {
    width: 100px;
    text-align: right;
  }
  .fileList {
    flex: 1;
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
          span {
            display: inline-block;
            max-width: 80px;
            text-overflow: ellipsis;
            word-break: normal;
            overflow: hidden;
          }
          a {
            float: right;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>
