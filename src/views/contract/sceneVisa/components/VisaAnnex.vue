<template>
  <div>
    <div class="detail-b-file" style="min-height: 50px">
      <FileRecord labelName="现场签证单：" :fileRecover="fileUrl.visa"></FileRecord>
      <!--      -->
      <!--      <div class="fileList">-->
      <!--        <div class="imgContainer">-->
      <!--          <template v-for="(item, index) of fileUrl.visa">-->
      <!--            <FileRecord labelName="电子合同：" :fileRecover="fileUrl.ele"></FileRecord>-->
      <!--&lt;!&ndash;            <div :key="index" class="imgWrapper">&ndash;&gt;-->
      <!--&lt;!&ndash;              <img :src="item.fileUrl" alt="" width="100px" height="100px" />&ndash;&gt;-->
      <!--&lt;!&ndash;              <div class="fileName">&ndash;&gt;-->
      <!--&lt;!&ndash;                <span style="display: inline-block;max-width: 80px">{{ item.fileName }}</span>&ndash;&gt;-->
      <!--&lt;!&ndash;                <a @click="() => {}">下载</a>&ndash;&gt;-->
      <!--&lt;!&ndash;              </div>&ndash;&gt;-->
      <!--&lt;!&ndash;            </div>&ndash;&gt;-->
      <!--          </template>-->
      <!--          <template v-if="fileUrl.visa.length === 0">无附件</template>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div class="detail-b-file" style="min-height: 50px">
      <FileRecord labelName="其他：" :fileRecover="fileUrl.other"></FileRecord>
      <!--      <div class="label">其他：</div>-->
      <!--      <div class="fileList">-->
      <!--        <div class="imgContainer">-->
      <!--          <template v-for="(item, index) of fileUrl.other">-->
      <!--            <div :key="index" class="imgWrapper">-->
      <!--              <img :src="item.fileUrl" alt="" width="100px" height="100px" />-->
      <!--              <div class="fileName">-->
      <!--                <span style="display: inline-block;max-width: 80px">{{ item.fileName }}</span>-->
      <!--                <a @click="() => {}">下载</a>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </template>-->
      <!--          <template v-if="fileUrl.other.length === 0">无附件</template>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
  </div>
</template>
<script>
export default {
  name: 'VisaAnnex',
  props: {
    fileUrl: {
      type: Object,
      default: () => {
        return {
          visa: [],
          other: []
        }
      }
    }
  },
  data() {
    return {}
  },
  created() {
    console.log(this.fileUrl)
  },
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
