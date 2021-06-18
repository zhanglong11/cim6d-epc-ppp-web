<template>
  <div class="container real-time">
    <el-row :gutter="20">
      <el-col :md="4">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>监控视频</span>
          </div>
          <ul class="type-list">
            <li v-for="item in videoList" :key="item.id" :class="{ active: item.active }" @click="playVideo(item)">
              <span>•</span>
              <span class="title" v-text="item.deviceName" />
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :md="20">
        <el-card class="box-card" style="position: fixed; width: calc(100% - 210px - 16.67%)">
          <div slot="header" class="clearfix video-header">
            <span class="video-title">{{ activeItem.deviceName }}</span>
            <el-button
              v-if="computedList.length > 1"
              type="primary"
              @click="() => $fullscreen.toggle($el.querySelector('.video-list'))"
              >全屏</el-button
            >
          </div>
          <!-- 轮播列表 start -->
          <el-row type="flex" class="video-list">
            <el-col v-for="video in computedList" :key="video.id" class="video-wrap" :span="computedVideoSpan">
              <Video v-if="video.videoUrl" :url="video.videoUrl" />
              <div v-else class="empty"></div>
            </el-col>
          </el-row>

          <!-- 轮播列表 end -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Video from './components/Video'
import Api from './api/work-bench'
export default {
  // import引入的组件需要注入到对象中才能使用
  name: 'EquipmentMonitoringRealTimeList',
  components: { Video },
  data() {
    // 这里存放数据
    return {
      videoList: [],
      activeItem: {},
      activeUrl: null,
      timer: null,
      mode: 1 // 1,4,6,9,12,
    }
  },
  computed: {
    computedList() {
      let list = this.videoList.filter(e => e.active)
      if ([3, 5].includes(list.length)) {
        list.push({ placeholder: true })
      } else if ([7, 8].includes(list.length)) {
        list.push(...new Array(9 - list.length).fill('').map(e => ({ placeholder: true })))
      } else if ([10, 11].includes(list.length)) {
        list.push(...new Array(12 - list.length).fill('').map(e => ({ placeholder: true })))
      }
      return list
    },
    computedVideoSpan() {
      return (
        {
          1: 24,
          2: 12,
          4: 12,
          6: 8,
          9: 8,
          12: 6
        }[this.computedList.length] || 6
      )
    }
  },
  created() {
    this.refresh()
  },
  destroyed() {
    this.clearTouch()
  },
  methods: {
    async refresh() {
      let params = {
        projectId: localStorage.getItem('projectId'),
        page: 1,
        rows: 1000
      }
      let res = await Api.getMonitorList(params)
      let videoList = res.data.records || []
      videoList.forEach(e => {
        e.active = false
        e.videoUrl = ''
      })
      this.videoList = videoList
      if (videoList.length) {
        this.playVideo(videoList[0])
      }
    },
    playVideo(item) {
      if (this.videoList.filter(e => e.active).length === 12 && !item.active) {
        this.$message.warning('最多同时播放12个视频')
        return false
      }
      if (item.active === true) {
        item.active = false
      } else {
        item.active = true
        this.getVideoUrl(item)
        this.clearTouch()
        this.timer = setInterval(() => {
          this.touch()
        }, 10000)
      }
    },
    async getVideoUrl(item) {
      if (!item.placeholder) {
        const res = await Api.getVideoUrl({ channel: item.channel, deviceNum: item.deviceNum })
        item.videoUrl = res.data?.WS_FLV
      }
    },
    async touch() {
      this.videoList
        .filter(e => e.active)
        .forEach(e => {
          Api.touch({ channel: e.channel, deviceNum: e.deviceNum })
        })
    },
    clearTouch() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>
<style lang="less" scoped>
//@import url(); 引入公共css类
@import url('~@/styles/color.less');
.real-time {
  padding: 0 !important;
  background: none !important;
}
.type-list {
  min-height: 720px;
  li {
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20%;
    border-bottom: 1px @line solid;
    cursor: pointer;
    transition: all 0.3s;
    .title {
      margin-left: 5px;
      font-size: 14px;
    }
    &:hover,
    &.active {
      background: @main-color;
      color: #fff;
    }
  }
}
.video-header {
  display: flex;
  align-items: center;
  .video-name {
    margin-left: 20px;
    font-size: 14px;
    color: @main-sub-color;
  }
  .video-time {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: @sub-base-color;
  }
  .icons {
    font-size: 20px;
    color: @sub-base-color;
    .icon {
      margin-left: 10px;
      cursor: pointer;
      &.active {
        color: @main-color;
      }
    }
  }
}
.big-video {
  margin-bottom: 20px;
  .big-video-img {
    width: 100%;
    height: 590px;
  }
}
.video-list {
  flex-wrap: wrap;
  justify-content: stretch;
}
.video-wrap {
  height: 100%;
  background-color: #000;
  .empty {
    height: 0;
    padding-top: 56.25%;
  }
}
</style>
