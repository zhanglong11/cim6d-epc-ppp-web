<template>
  <div class="no-padding">
    <div class="main">
      <div class="left">
        <div class="left-top">
          <div class="banner">
            <a @click="showActive(readvertisingMapDTO)"><img :src="readvertisingMapDTO.imageUrl" alt="" /></a>
          </div>
          <ul class="overview">
            <li>
              <h6>党员数量</h6>
              <p>
                <span>{{ partyMemberNum }}</span>
                名
              </p>
            </li>
            <li>
              <h6>党建活动</h6>
              <p>
                <span>{{ partyActivityNum }}</span>
                次
              </p>
            </li>
            <li>
              <h6>党建新闻</h6>
              <p>
                <span>{{ partyNewsNum }}</span>
                条
              </p>
            </li>
            <li>
              <h6>党建资料</h6>
              <p>
                <span>{{ partyDocumentNum }}</span>
                篇
              </p>
            </li>
          </ul>
        </div>
        <el-card class="left-bottom">
          <header slot="header">
            <span>活动预告</span>
            <el-button type="text" style="float: right" @click="$router.push('/ccp/activity')">更多>></el-button>
          </header>
          <ul class="activiti-notice">
            <li v-for="item in activityPreviewList" :key="item.id">
              <a
                @click="
                  () => {
                    activeActiviti = item
                    activitiViewDialogVisible = true
                  }
                "
              >
                <h2>{{ item.title }}</h2>
              </a>
              <p>
                <span>活动时间：</span><span class="date">{{ item.startTime }} - {{ item.endTime }}</span>
              </p>
              <p>
                <span>活动地点：</span><span>{{ item.address }}</span>
              </p>
              <p>
                <span>参与人员：</span><span>{{ item.participantNames }}</span>
              </p>
            </li>
          </ul>
        </el-card>
      </div>
      <div class="right">
        <router-link class="title" to="" @click.native="showActive(headlineDTO)">{{ headlineDTO.title }}</router-link>
        <p class="description">
          {{ headlineDTO.briefIntroduction }}
        </p>
        <el-card>
          <header slot="header">
            <span>党建活动回顾</span>
            <el-button type="text" style="float: right" @click="$router.push('/ccp/activity')">更多>></el-button>
          </header>
          <ul class="news-list">
            <li v-for="item in activityReviewList" :key="item.id">
              <h3>
                <a @click="showActive(item)">{{ item.title }}</a>
              </h3>
              <p>{{ item.createTime | ymdhm }}</p>
            </li>
          </ul>
        </el-card>
        <el-card>
          <header slot="header">
            <span>党建要闻</span>
            <el-button type="text" style="float: right" @click="$router.push('/ccp/news')">更多>></el-button>
          </header>
          <ul class="news-list">
            <li v-for="news in newsList" :key="news.Id">
              <h3>
                <router-link :to="'/ccp/news/detail/' + news.id"> {{ news.title }}</router-link>
              </h3>
              <p>{{ news.createTime | ymdhm }}</p>
            </li>
          </ul>
        </el-card>
      </div>
    </div>
    <ActivitiDetail :id="activeActiviti.id" :visible.sync="activitiViewDialogVisible"></ActivitiDetail>
  </div>
</template>

<script>
import api from '../api'
import ActivitiDetail from '../activiti/components/Detail'
export default {
  name: 'CcpHome',
  // import引入的组件需要注入到对象中才能使用
  components: { ActivitiDetail },
  filters: {
    ymdhm(val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  data() {
    // 这里存放数据
    return {
      // 党建要闻
      newsList: [],
      // 活动预告
      activityPreviewList: [],
      // 活动回顾
      activityReviewList: [],
      // 头条信息
      headlineDTO: {},
      // 宣传图数据
      readvertisingMapDTO: {},
      //党建活动数量
      partyActivityNum: '',
      //党建资料数量
      partyDocumentNum: '',
      //党员数量
      partyMemberNum: '',
      //党建新闻数量
      partyNewsNum: '',
      // 党建活动弹窗
      activitiViewDialogVisible: false,
      // 查看的党建活动
      activeActiviti: {}
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {
    this.refresh()
  },
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  // 方法集合
  methods: {
    // 刷新主要数据,一般表格页面为刷新列表，详情页面为刷新详情
    refresh() {
      return api
        .getHome({
          activityPreviewLimit: 4,
          activityReviewLimit: 8,
          newsLimit: 8,
          projectId: localStorage.getItem('projectId')
        })
        .then(res => {
          this.newsList = res.data.newsList
          this.activityPreviewList = res.data.activityPreviewList
          this.activityReviewList = res.data.activityReviewList
          let headlineDTO = res.data.headlineDTO || {}
          let readvertisingMapDTO = res.data.readvertisingMapDTO || {}
          headlineDTO.id = headlineDTO.targetId
          readvertisingMapDTO.id = readvertisingMapDTO.targetId
          this.headlineDTO = headlineDTO
          this.readvertisingMapDTO = readvertisingMapDTO
          this.partyActivityNum = res.data.partyActivityNum
          this.partyDocumentNum = res.data.partyDocumentNum
          this.partyMemberNum = res.data.partyMemberNum
          this.partyNewsNum = res.data.partyNewsNum
        })
    },
    // 显示活动
    showActive(item) {
      this.activeActiviti = item
      if (item.module === 2) {
        this.$router.push({
          name: 'EpcPppCcpNewsDetail',
          params: {
            id: item.id
          }
        })
        return
      }
      this.activitiViewDialogVisible = true
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/color.less';
.main {
  display: flex;
  .left {
    flex: 0 0 700px;
    .left-top {
      background-color: #fff;
      font-size: 0;
      .overview {
        display: flex;
        margin: 0 0 20px;
        li {
          font-size: 14px;
          width: 25%;
          &:not(:last-child) {
            border-right: 1px solid #ccc;
          }
          padding: 15px;
          text-align: center;
          p > span {
            font-size: 28px;
            font-weight: bold;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .activiti-notice {
    li {
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      border: 1px solid #ccc;
      padding: 10px;
      h2 {
        font-weight: bold;
      }
      p {
        span:first-child {
          font-weight: normal;
          font-size: 14px;
        }
        span {
          font-weight: bold;
        }
        .date {
          color: #f00;
        }
      }
    }
  }
  .right {
    flex: 1;
    overflow: hidden;
    background-color: #fff;
    margin-left: 20px;
    padding: 15px;
    > .title {
      font-size: 28px;
      margin-left: 5px;
      margin-bottom: 10px;
      font-weight: bold;
    }
    > .description {
      margin-left: 5px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .el-card + .el-card {
      margin-top: 20px;
    }
  }
  .news-list {
    li {
      display: flex;
      justify-content: space-between;
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      h3 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p {
        flex-shrink: 0;
        width: 200px;
        text-align: right;
      }
    }
  }
}
</style>
