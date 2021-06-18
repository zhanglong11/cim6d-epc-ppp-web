## 临港ppp

 
### 一个优雅的弹框样式优化class   

你所要做的就是在el-dialog的class中加上beauty

![image-20201030142127980](http://static.doveaz.xyz/screenshotimage-20201030142127980.png)

![30abe6de-0087-41ca-b43d-04adc4ccbd52](http://static.doveaz.xyz/screenshot30abe6de-0087-41ca-b43d-04adc4ccbd52.gif)



### v-promise-btn指令

使用了 vue-promise-btn 指令，https://stukh.github.io/vue-promise-btn/，几乎跟element的按钮加载状态效果一样

```vue
<el-button v-promise-btn type="primary" @click="save">保存</el-button>
<el-button loading>哈哈</el-button>
```

![image-20200908143728216](http://static.doveaz.xyz/screenshotimage-20200908143728216.png)

默认绑定click事件，对应事件处理器需要返回一个promise才能正确设置加载状态