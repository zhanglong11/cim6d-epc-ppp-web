<!--
 * @Description: 项目讨论区
 * @Author:
 * @Date: 2020-01-15 09:13:42
 -->
<template>
  <div class="drawer">
    <p class="drawer-title">项目讨论区</p>
    <div class="drawer-body">
      <ul>
        <li v-for="(item, index) in commentList" :key="item.id" class="clearfix">
          <div>
            <img :src="item.headImage || '/img/default-user.png' + '?imageView2/1/w/80/h/80'" alt class="headImg" />
            <span class="sourceName">{{ item.creatorName }}：</span>
            <span class="time-before">{{ item.commentTimeText }}</span>
            <span
              v-if="item.children && item.children.length > 0"
              class="float-right primary-color"
              @click="hideComment(item, index)"
              >收起评论</span
            >
            <span class="float-right primary-color padding-right" @click="reply(item)">回复</span>
            <span v-if="item.children && item.children.length === 0" class="comment-content">{{ item.content }}</span>
            <p v-else class="comment-content" style="padding-left: 41px">{{ item.content }}</p>
          </div>
          <div v-if="!item.hideComment">
            <div v-for="childrenItem in item.children" :key="childrenItem.id" class="comment-children clearfix">
              <img
                :src="childrenItem.headImage || '/img/default-user.png' + '?imageView2/1/w/80/h/80'"
                alt
                class="headImg"
              />
              <span class="sourceName">{{ childrenItem.creatorName }}</span>
              回复
              <span class="sourceName">{{ childrenItem.replierName }}：</span>
              <span class="time-before">{{ item.commentTimeText }}</span>
              <span class="float-right primary-color padding-right" @click="reply(childrenItem)">回复</span>

              <div class="comment-children-conetnt">{{ childrenItem.content }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="drawer-footer">
      <div class="drawer-footer-content">
        <el-input v-model="content" type="textarea" show-word-limit :placeholder="placeholder" :rows="5"></el-input>
      </div>
      <div class="drawer-footer-btn">
        <el-button type="primary" @click="submit">发表</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api/comment/index'
export default {
  data() {
    return {
      content: '',
      placeholder: '',
      commentList: [],
      pageQuery: {
        projectId: this.$store.state.project.projectId,
        page: 0,
        rows: 20
      },
      replayForm: {
        content: '',
        projectId: this.$store.state.project.projectId,
        replierId: '',
        replierName: '',
        replyId: ''
      }
    }
  },
  mounted() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      if (!this.pageQuery.projectId) {
        return
      }
      let res = await api.getCommentList(this.pageQuery)
      this.commentList = res.data.records ? res.data.records : []
    },
    clearForm() {
      this.content = ''
      this.placeholder = ''
    },
    hideComment(item, index) {
      item.hideComment = !item.hideComment
      this.$set(this.commentList, index, item)
    },
    reply(item) {
      this.replayForm.replierId = item.id
      this.replayForm.replierName = item.creatorName
      this.replayForm.replyId = item.replyId
      this.placeholder = '回复 ' + item.creatorName + '：'
    },
    async submit() {
      let obj = {}

      if (this.replayForm.replierId) {
        //代表回复
        obj = JSON.parse(JSON.stringify(this.replayForm))
        obj.content = this.content
      } else {
        //代表新增
        obj = {
          content: this.content,
          projectId: localStorage.getItem('projectId')
        }
      }
      if (!this.content) return this.$message.error('请填写讨论内容')
      let res = await api.addComment(obj)
      this.getCommentList()
      this.content = ''
      // this.replayForm=this.content
    }
  }
}
</script>
<style lang="less" scoped>
.padding-right {
  margin-right: 4px;
}
.drawer {
  height: 100%;
  padding: 4px 6px;
  &-title {
    text-align: center;
    font-size: 26px;
    padding-bottom: 6px;
  }

  &-body {
    .time-before {
      font-size: 12px;
      color: lightgray;
    }
    .headImg {
      height: 30px;
      width: 30px;
      vertical-align: middle;
      border-radius: 50%;
      margin-left: 6px;
      margin-right: 4px;
    }
    .sourceName {
      color: rgb(46, 46, 46);
      font-weight: 800;
      font-size: 14px;
    }
    .comment-content {
      font-size: 14px;
      padding-top: 6px;
      padding-bottom: 6px;
    }
    .comment-children {
      padding-left: 36px;
      &-conetnt {
        padding-left: 45px;
        padding-top: 6px;
        padding-bottom: 6px;
        font-size: 13px;
      }
    }
    .float-right {
      display: none;
      float: right;
      cursor: pointer;
      font-size: 13px;
      padding-top: 4px;
    }
    .primary-color {
      color: rgb(24, 144, 255);
    }
    ul {
      max-height: 670px;
      overflow-y: scroll;
      padding: 8px 4px;
      border-radius: 5px;
      padding-bottom: 220px;
      li {
        padding-top: 6px;
        padding-bottom: 6px;
        border-bottom: 1px dashed #dcdfe6;
        &:hover .float-right {
          display: block;
        }
      }
    }
  }
  &-footer {
    width: 97%;
    position: fixed;
    bottom: 0;
    padding: 15px 5px 0;
    border-radius: 4px;
    background: rgb(247, 248, 255);
    &-content {
      width: 100%;
      padding-bottom: 10px;
    }
    &-btn {
      padding-bottom: 10px;
      text-align: right;
    }
  }
}
</style>
