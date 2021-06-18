<template>
  <div class="container real-time">
    <div style="display: flex">
      <aside style="width: 250px; margin-right: 20px">
        <el-card class="box-card" header="监控视频">
          <ul class="type-list">
            <li
              v-for="item in videoList"
              :key="item.id"
              :class="{ active: playingList.slice(0, mode).includes(item) }"
              @click="playVideo(item)"
            >
              <span>•</span>
              <span class="title" v-text="item.deviceName" />
            </li>
          </ul>
        </el-card>
      </aside>
      <div class="main-content">
        <el-card class="box-card" style="position: fixed; width: calc(100% - 210px - 16.67%)">
          <div slot="header" class="clearfix video-header">
            <span class="video-title">{{ activeItem.deviceName }}</span>
            <el-radio-group v-model="mode">
              <el-radio-button :label="1">单个</el-radio-button>
              <el-radio-button :label="4">四宫格</el-radio-button>
              <el-radio-button :label="6">六宫格</el-radio-button>
              <el-radio-button :label="9">九宫格</el-radio-button>
              <el-radio-button :label="12">十二宫格</el-radio-button>
            </el-radio-group>
            <el-button
              style="margin-left: 30px"
              type="primary"
              @click="() => $fullscreen.toggle($el.querySelector('.video-list'))"
              >全屏</el-button
            >
          </div>
          <!-- 轮播列表 start -->
          <el-row type="flex" class="video-list">
            <el-col
              v-for="(item, index) in playingList.slice(0, mode)"
              :key="item.id + '-' + index"
              class="video-wrap"
              :span="computedVideoSpan"
            >
              <Video v-if="_.get(item, 'videoUrl')" :url="item.videoUrl" />
              <div v-else class="empty">
                <div>
                  <img src="@/assets/images/offline.png" alt="" />
                  <p>离线中</p>
                </div>
              </div>
              <p v-if="item" class="name">{{ item.deviceName }}</p>
            </el-col>
            <template v-if="mode - playingList.length > 0">
              <el-col
                v-for="index in mode - playingList.length"
                :key="'empty-' + index"
                class="video-wrap"
                :span="computedVideoSpan"
              >
                <div class="empty">
                  <p>无</p>
                </div>
              </el-col>
            </template>
          </el-row>

          <!-- 轮播列表 end -->
        </el-card>
      </div>
    </div>
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
      // 实际并不止是在播放的视频，比如从九宫格，切换为四宫格，这个数组里的视频并不会减少，播放的时候会取前四个
      playingList: [],
      videoList: [],
      activeItem: {},
      activeUrl: null,
      timer: null,
      // 1,4,6,9,12
      mode: 4,
      // 最后一个被替换视频的位置，切换宫格数会重置为 0
      lastReplacedIndex: 0
    }
  },
  computed: {
    computedVideoSpan() {
      return { 1: 24, 4: 12, 6: 8, 9: 8, 12: 6 }[this.mode]
    }
  },
  watch: {
    mode() {
      this.lastReplacedIndex = 0
      const isFull = this.mode <= this.playingList.length
      const spareVideoList = _.differenceBy(this.videoList, this.playingList, 'id')
      if (!isFull && spareVideoList.length > 0) {
        spareVideoList.slice(0, this.mode - this.playingList.length).forEach(video => {
          this.playVideo(video)
        })
      }
    }
  },
  created() {
    this.refresh()
    this.timer = setInterval(() => {
      this.touch()
    }, 10000)
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
        e.videoUrl = ''
      })
      this.videoList = videoList
      if (videoList.length && this.playingList.length === 0) {
        await this.$nextTick()
        videoList.forEach((item, index) => {
          if (index < this.mode) {
            this.playVideo(item)
          }
        })
      }
    },
    /**
     * 播放视频，自动往列表后面添加，如果列表满了，就从第一个开始轮流替换
     * @param item
     * @returns {Promise<void>}
     */
    async playVideo(item) {
      if (this.playingList.includes(item)) {
        this.playingList.splice(_.findIndex(this.playingList, item), 1)
      } else {
        if (this.playingList.length < this.mode) {
          this.playingList.push(item)
        } else {
          this.playingList.splice(this.lastReplacedIndex, 1, item)
          if (this.lastReplacedIndex < this.mode - 1) {
            this.lastReplacedIndex++
          } else {
            this.lastReplacedIndex = 0
          }
        }
        await this.getVideoUrl(item)
      }
    },
    async getVideoUrl(item) {
      const res = await Api.getVideoUrl({ channel: item.channel, deviceNum: item.deviceNum })
      item.videoUrl = res.data?.WS_FLV
    },
    async touch() {
      if (!this.playingList.length) return false
      this.playingList.slice(0, this.mode).forEach(e => {
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
  margin: 0 -10px;
  li {
    padding: 0 10px;
    height: 50px;
    display: flex;
    align-items: center;
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
  border: 2px solid #5cdbd3;
  flex-wrap: wrap;
  justify-content: stretch;
  &.fullscreen {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
}
.video-wrap {
  border: 2px solid #5cdbd3cc;
  background-color: #000;
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  /deep/ .xgplayer {
    width: 100%;
    height: 100%;
  }
  .name {
    position: absolute;
    top: 0;
    right: 10px;
    color: #eee;
    z-index: 1000;
    display: block;
    width: 100%;
    text-align: right;
    font-size: 14px;
    line-height: 28px;
  }
  .empty {
    height: 0;
    padding-top: 56.25%;
    position: relative;
    width: 100%;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        height: 40px;
        margin-right: 15px;
      }
      position: absolute;
      width: 100%;
      text-align: center;
      color: #f00;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    > p {
      position: absolute;
      width: 100%;
      text-align: center;
      color: #eee;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
