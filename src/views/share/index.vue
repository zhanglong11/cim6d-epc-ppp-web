<!--
 * @Description: 输入提取码，获取文件
 * @Author:
 * @Date: 2020-01-20 17:33:47
 -->
<template>
  <div>
    <div v-if="bgShow" class="bg">
      <div class="form">
        <p class="label">请输入提取码：</p>
        <div class="flex">
          <p>
            <el-input v-model="code" />
          </p>
          <p>
            <el-button type="primary" @click="getFilder(null)">提取文件</el-button>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="table-content">
      <div class="flex">
        <span>当前位置：</span>
        <el-breadcrumb>
          <el-breadcrumb-item v-for="(item, index) in nowLocation" :key="index">
            <span class="point" @click.capture="breadcrumbClick(item, index)">{{ item.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <p class="title">分享文件列表</p>
      <Table
        ref="table"
        v-loading="tableLoading"
        :tableData="tableData"
        :pageQuery="pageQuery"
        :total="total"
        rowId="id"
        :columns="tableColumn"
        @selectionChange="selectionChange"
        @pageChange="pageChange"
      />
    </div>
  </div>
</template>
<script>
import filesize from 'filesize'
import api from '@/api/file'
import PageMixin from '@/mixins/pageMixin'
export default {
  mixins: [PageMixin],
  data() {
    return {
      tableDataAll: [],
      // 当前位置
      nowLocation: [],
      // 当前位置copy，禁止修改
      nowLocationCopy: [],
      code: sessionStorage.getItem('code') ? sessionStorage.getItem('code') : null,
      bgShow: true,
      requestFlag: false,
      // 表格表头
      tableColumn: [
        { type: 'selection', width: 50 },
        {
          prop: 'name',
          label: '文件名称',
          width: 80,
          render: (h, params) => {
            if (params.row.type === 1) {
              return h(
                'el-button',
                {
                  props: {
                    type: 'text'
                  },
                  on: {
                    click: e => {
                      e.stopPropagation()
                      console.log(params.row)
                      this.updateTable(params.row.id, params.row.name, params.row.pid)
                    }
                  }
                },
                params.row.name
              )
            } else {
              return h('div', params.row.name)
            }
          }
        },
        { prop: 'fileTag', label: '标签' },
        {
          prop: 'fileSize',
          label: '大小',
          render: (h, { row }) => {
            if (row.type === 1) {
              return h('div', {}, '-')
            } else {
              return h('div', {}, filesize(row.fileSize * 1024))
            }
          }
        },
        { prop: 'createName', label: '上传人' },
        { prop: 'createTime', label: '上传时间' },
        {
          prop: '',
          label: '操作',
          render: (h, params) => {
            let downLoad = h(
              'el-button',
              {
                props: {
                  type: 'text'
                },
                on: {
                  click: e => {
                    e.stopPropagation()
                    this.downLoad(params.row.id)
                  }
                }
              },
              '下载'
            )
            return h('div', [params.row.type !== 1 ? downLoad : null])
          }
        }
      ]
    }
  },
  methods: {
    // 更新table
    updateTable(id, name, pid, flag) {
      if (flag) {
        this.pid = pid
      } else {
        this.pid = id
      }
      this.getFilder(this.pid)
      this.updateLocation(id, name, pid, flag)
    },
    // 更新位置
    updateLocation(id, name, pid, flag) {
      let copy = JSON.parse(JSON.stringify(this.nowLocationCopy))
      let index = copy.findIndex(item => item.id === id)
      if (flag) {
        this.nowLocation = []
        return
      }
      if (index >= 0) {
        this.nowLocation = copy.slice(0, index + 1)
      } else {
        copy.push({
          id: id,
          name: name,
          pid: pid
        })
        this.nowLocationCopy = copy
        this.nowLocation = copy
      }
    },
    async downLoad(id) {
      let res = await api.download(id)
    },
    pageChange(e) {
      this.pageQuery.page = e
      this.tableData = _.chunk(this.tableDataAll, this.pageQuery.rows)[e - 1]
    },
    breadcrumbClick(e, index) {
      this.updateTable(e.id, e.name, e.pid, true)
    },
    async getFilder(pid) {
      let obj = {
        password: this.code,
        pid: pid ? pid : '0'
      }
      if (!this.code) return this.$message.error('提取码必填')
      let res = await api.selectExternalCollaborationFile(obj)
      if (res.code === 200) {
        // 存储在session中，关闭页面即清除
        sessionStorage.setItem('code', this.code)
        this.tableDataAll = res.data
        this.tableData = _.chunk(res.data, this.pageQuery.rows)[this.pageQuery.page - 1]
        this.bgShow = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.point {
  cursor: pointer;
  color: #409eff;
}
.title {
  text-align: center;
  font-size: 30px;
  padding: 20px;
}
.table-content {
  padding: 64px;
}
.flex {
  display: flex;
  justify-content: space-between;
  p:nth-child(1) {
    width: 70%;
  }
  padding-top: 16px;
  padding-bottom: 20px;
}
.bg {
  width: 100%;
  height: 100%;
  background-color: lightblue;
  position: relative;
}
.form {
  width: 460px;
  position: absolute;
  left: 50%;
  top: 300px;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 5px;
  padding: 30px 18px;
}
.label {
  font-size: 15px;
  padding-bottom: 8px;
}
.code {
  width: 200px;
  border: 1px solid #f2f2f2;
  padding: 8px 10px;
  height: 19px;
  line-height: 19px;
  border-radius: 4px;
}
</style>
