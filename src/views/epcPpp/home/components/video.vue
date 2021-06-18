<template>
  <div class="home-video">
    <el-card class="tree">
      <h2>施工现场摄像头列表</h2>
      <div class="device-list">
        <ul>
          <li
            v-for="(item, i) in deviceList"
            :key="i"
            :class="{ active: item.id === activeItem.id }"
            @click="playVideo(item)"
          >
            {{ item.deviceName }}
          </li>
        </ul>
      </div>
    </el-card>
    <div class="video-play">
      <el-card class="box-card">
        <!-- 轮播列表 start -->
        <template>
          <div class="video-player big-video-img vjs-custom-skin">
            <Video v-if="activeUrl" :url="activeUrl" :fluid="false" autoplay />
            <p v-else class="no-data">暂无视频</p>
          </div>
        </template>
        <!-- 轮播列表 end -->
      </el-card>
    </div>
    <el-card class="device-name">
      <p class="name">监控设备设备所在位置：</p>
      <p>{{ activeItem.deviceName }}</p>
    </el-card>
  </div>
</template>

<script>
import Video from '../../monitoring/components/Video'
import Api from '../../monitoring/api/work-bench'
import { homeApi } from '../api'

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {
    Video
  },
  data() {
    //这里存放数据
    return {
      deviceList: [], // 施工现场摄像头列表
      activeItem: {},
      activeUrl: null,
      timer: null
    }
  },
  //监听属性 类似于data概念
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  destroyed() {
    this.clearTouch()
  },
  mounted() {
    this.queryDeviceList()
  },
  //方法集合
  methods: {
    // 施工现场摄像头列表
    async queryDeviceList() {
      let params = {
        page: 1,
        projectId: this.projectId,
        rows: 1000,
        homeFlag: 1
      }
      let result = await homeApi.queryDeviceList(params)
      let datas = result.data
      let videoList = datas.records || []
      this.deviceList = videoList
      if (!videoList.length) {
        return
      }
      this.playVideo(videoList[0])
    },
    // 播放视频
    playVideo(item) {
      this.activeUrl = ''
      this.activeItem = item
      this.getVideoUrl(item)
      this.clearTouch()
      this.timer = setInterval(() => {
        this.touch()
      }, 10000)
    },
    // 获取视频地址
    async getVideoUrl(item) {
      const result = await Api.getVideoUrl({ channel: item.channel, deviceNum: item.deviceNum })
      let datas = result.data
      this.activeUrl = datas ? datas.WS_FLV : ''
    },
    // 播放
    async touch() {
      await Api.touch({ channel: this.activeItem.channel, deviceNum: this.activeItem.deviceNum })
    },
    // 清除定时器
    clearTouch() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>
<style lang="less" scoped>
@import url('~@/styles/common');

.home-video {
  margin-bottom: 15px;
  display: flex;
  height: 600px;
  .tree {
    width: 360px;
    height: 100%;
    h2 {
      margin-bottom: 15px;
      padding-bottom: 15px;
      font-size: 18px;
      border-bottom: 1px #ddd solid;
    }
    .device-list {
      height: 480px;
      overflow-x: auto;
      .scrollbar;
    }
    ul {
      li {
        height: 50px;
        display: flex;
        align-items: center;
        padding-left: 20%;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;
        transition: all 0.3s;
        &::before {
          content: '•';
          margin-right: 5px;
        }
        &.active {
          background: #409eff;
          color: #fff;
        }
      }
    }
  }
  .video-play {
    flex: 1;
    margin: 0 15px;
    .video-player {
      height: 558px;
      overflow: hidden;
    }
    /deep/.video-js {
      width: 100%;
      height: 558px;
    }
  }
  .device-name {
    padding: 0 20px;
    height: 600px;
    /deep/.el-card__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .name {
      color: #999;
    }
  }
}
.no-data {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999;
}
</style>
