<!--
  * @任务编号: 2686 || 播放器组件
  * @开发人员:张龙
  * @日期:2020-03-23
  * @任务类型: 新代码
  -->
<template>
  <div class="video-wrapper">
    <video-player
      ref="videoPlayer"
      class="video-player vjs-custom-skin"
      :options="playerOptions"
      :playsinline="true"
      @play="onPlayerPlay($event)"
      @pause="onPlayerPause($event)"
      @ended="onPlayerEnded($event)"
      @loadeddata="onPlayerLoadeddata($event)"
      @waiting="onPlayerWaiting($event)"
      @playing="onPlayerPlaying($event)"
      @timeupdate="onPlayerTimeupdate($event)"
      @canplay="onPlayerCanplay($event)"
      @canplaythrough="onPlayerCanplaythrough($event)"
      @ready="playerReadied"
      @statechanged="playerStateChanged($event)"
    />
    <p v-if="hasRemove" class="remove" @click="remove">×</p>
  </div>
</template>

<script>
export default {
  name: 'Video',
  props: {
    url: {
      required: true
    },
    id: {},
    hasRemove: {
      default: false
    }
  },
  data() {
    return {
      // videojs options
      playerOptions: {
        fluid: true, //当true时,它将按比例缩放以适应其容器。
        // autoplay: true, //自动播放
        // playbackRates : [ 0.5, 1.0, 1.5, 2.0 ], //可选择的播放速度
        muted: false, // 默认情况下将会消除任何音频。
        language: 'zh-CN',
        sources: [
          {
            type: '',
            src: this.url
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ],
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true, //当前时间和持续时间的分隔符
          durationDisplay: true, //显示持续时间
          remainingTimeDisplay: false, //是否显示剩余时间功能
          fullscreenToggle: true //全屏按钮
        }
      }
    }
  },
  computed: {
    player() {
      if (this.$refs.videoPlayer) {
        return this.$refs.videoPlayer.player
      } else {
        return null
      }
    }
  },
  mounted() {
    // console.log('this is current player instance object', this.player)
    setTimeout(() => {
      console.log('dynamic change options', this.player)
      // change src
      // this.playerOptions.sources[0].src = 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm';
      // change item
      // this.$set(this.playerOptions.sources, 0, {
      //   type: "video/mp4",
      //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
      // })
      // change array
      // this.playerOptions.sources = [{
      //   type: "video/mp4",
      //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
      // }]
      if (this.player) {
        this.player.muted(false)
      }
    }, 5000)
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    onPlayerEnded(player) {
      // console.log('player ended!', player)
    },
    onPlayerLoadeddata(player) {
      // console.log('player Loadeddata!', player)
    },
    onPlayerWaiting(player) {
      // console.log('player Waiting!', player)
    },
    onPlayerPlaying(player) {
      // console.log('player Playing!', player)
    },
    onPlayerTimeupdate(player) {
      // console.log('player Timeupdate!', player.currentTime())
    },
    onPlayerCanplay(player) {
      // console.log('player Canplay!', player)
    },
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },
    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // player is ready
    playerReadied(player) {
      // seek to 10s
      //console.log('example player 1 readied', player)
      player.currentTime(10)
      // console.log('example 01: the player is readied', player)
    },
    remove() {
      this.$emit('remove')
    }
  }
}
</script>

<style scoped lang="less">
.video-wrapper {
  display: flex;
  align-items: flex-end;
  > div {
    flex: 1;
  }
  .remove {
    flex: 0 0 40px;
    width: 40px;
    font-size: 40px;
    text-align: center;
    color: red;
    cursor: pointer;
  }
}
</style>
