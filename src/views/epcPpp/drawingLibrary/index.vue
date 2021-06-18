<template>
  <div class="wrap">
    <el-card class="slide">
      <div slot="header" class="card-header">
        <span>图纸列表</span>
        <el-button type="primary" @click="showAddModel">新增图纸</el-button>
      </div>
      <ul>
        <li
          v-for="item in modelList"
          :key="item.id"
          :class="item.id === activeModelId ? 'active' : ''"
          @click="changeModel(item)"
        >
          <span class="name">{{ item.name }}</span>
          <p>
            <span>{{ item.date }}</span>
            <span>{{ item.person }}</span>
          </p>
        </li>
      </ul>
      <p class="bottom-btn"><el-button type="primary" @click="showChangeDetailDialog">变更记录</el-button></p>
    </el-card>
    <div class="content">
      <div class="model">
        <BIM ref="BIM" idSelect="progress" :autoChangeModel="true" class="bim-box-progress" />
      </div>
      <div class="detail">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="质量问题查看" name="quality"> </el-tab-pane>
          <el-tab-pane label="安全问题查看" name="safe"> </el-tab-pane>
        </el-tabs>
        <div style="padding: 10px; width: 100%">
          <div class="tooltips">
            <el-form ref="pageQuery" :model="filterForm" inline>
              <el-form-item label="查看时间范围">
                <el-radio-group v-model="filterForm.type">
                  <el-radio :label="1">全部</el-radio>
                  <el-radio :label="2">本周</el-radio>
                  <el-radio :label="3">本月</el-radio>
                  <el-radio :label="4">本年</el-radio>
                  <el-radio :label="5">自由设置</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="">
                <DateRange
                  :disabled="filterForm.type !== 5"
                  :startTime.sync="filterForm.beginTime"
                  :endTime.sync="filterForm.endTime"
                />
              </el-form-item>
              <el-form-item>
                <el-button-group>
                  <el-button type="primary" icon="el-icon-search" @click="refresh">查询</el-button>
                  <el-button icon="el-icon-refresh-left" @click="reset">重置</el-button>
                </el-button-group>
              </el-form-item>
            </el-form>
          </div>
          <Grid
            v-if="activeName === 'quality'"
            ref="table"
            max-height="300"
            :request="request"
            :columns="qualityColumn"
            :filter-form.sync="filterForm"
          />
          <Grid
            v-if="activeName === 'safe'"
            ref="table"
            max-height="300"
            :request="request"
            :columns="safeColumn"
            :filter-form.sync="filterForm"
          />
        </div>
      </div>
    </div>
    <AddModelDialog v-if="addModelVisible" :visible.sync="addModelVisible" />
    <ChangeDetailDialog :visible.sync="changeDetailVisible" />
  </div>
</template>

<script>
import AddModelDialog from './components/AddModelDialog'
import ChangeDetailDialog from './components/ChangeDetailDialog'
export default {
  name: 'ModelManage',
  components: { AddModelDialog, ChangeDetailDialog },
  data() {
    return {
      addModelVisible: false,
      changeDetailVisible: false,
      activeModelId: null,
      activeName: 'progress',
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      modelList: [
        {
          id: 1,
          name: '阿里巴巴',
          date: '2019-07-18',
          person: '王晓'
        },
        {
          id: 2,
          name: '京东速递',
          date: '2019-07-18',
          person: '王晓'
        },
        {
          id: 3,
          name: '腾讯荣耀',
          date: '2019-07-18',
          person: '王晓'
        },
        {
          id: 4,
          name: '湖南张家界',
          date: '2019-07-18',
          person: '王晓'
        }
      ],
      request: body => {
        return this.axios.labour.post('group/list', body)
      },
      // 表格表头
      tableColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '进度名称',
          minWidth: 100
        },
        {
          field: 'equipmentCode',
          title: '所属进度文件',
          minWidth: 100
        },
        {
          field: 'equipmentName',
          title: '计划开始时间',
          minWidth: 100
        },
        {
          field: 'models',
          title: '计划结束时间',
          minWidth: 100
        },
        {
          field: 'faultTime',
          title: '实际开始时间',
          minWidth: 100
        },
        {
          field: 'creatorName',
          title: '实际结束时间',
          minWidth: 100
        },
        {
          field: 'createTime',
          title: '任务完成人',
          minWidth: 100
        }
      ],
      qualityColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备维修编号',
          minWidth: 100
        },
        {
          field: 'equipmentCode',
          title: '设备编码',
          minWidth: 100
        },
        {
          field: 'equipmentName',
          title: '设备名称',
          minWidth: 100
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 100
        },
        {
          field: 'faultTime',
          title: '发生时间',
          minWidth: 100
        },
        {
          field: 'creatorName',
          title: '创建人',
          minWidth: 100
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 100
        }
      ],
      safeColumn: [
        { type: 'index', title: '序号', width: 80 },
        {
          field: 'code',
          title: '设备维修编号',
          minWidth: 100
        },
        {
          field: 'equipmentCode',
          title: '设备编码',
          minWidth: 100
        },
        {
          field: 'equipmentName',
          title: '设备名称',
          minWidth: 100
        },
        {
          field: 'models',
          title: '规格型号',
          minWidth: 100
        },
        {
          field: 'faultTime',
          title: '发生时间',
          minWidth: 100
        },
        {
          field: 'creatorName',
          title: '创建人',
          minWidth: 100
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 100
        }
      ]
    }
  },
  watch: {
    activeName(v) {
      this.reset()
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    reset() {
      this.$refs.table.reset()
    },
    showAddModel() {
      this.addModelVisible = true
    },
    showChangeDetailDialog() {
      this.changeDetailVisible = true
    },
    changeModel(model) {
      this.activeModelId = model.id
    }
  }
}
</script>

<style scoped lang="less">
div.wrap {
  display: flex;
  background-color: #f0f2f5;
  padding: 0;
  overflow: hidden;
  .slide {
    flex: 0 0 300px;
    background-color: #fff;
    /deep/ .el-card__body {
      height: 100%;
      padding: 0;
    }
    ul {
      height: calc(100% - 120px);
      overflow: auto;
      li {
        position: relative;
        padding: 10px 20px;
        cursor: pointer;
        &:hover {
          transition: all ease 0.5s;
          background: #f0f0f0;
        }
        &:after {
          position: absolute;
          bottom: -1px;
          padding: 0 10px;
          width: calc(100% - 30px);
          content: '';
          background: #f0f0f0;
          height: 1px;
        }
        &.active {
          transition: all ease 0.4s;
          background: #f0f0f0;
          &:after {
            height: 0;
          }
        }
        p {
          margin-top: 4px;
          font-size: 14px;
          color: #8f8f8f;
          span + span {
            margin-left: 10px;
          }
        }
      }
    }
    .bottom-btn {
      position: sticky;
      bottom: 0;
      padding: 10px;
      text-align: center;
    }
  }
  .content {
    flex: 1;
    margin-left: 20px;
    width: calc(100% - 20px);
    overflow: hidden;
    background-color: #f0f2f5;
    .model {
      height: 500px;
    }
    .detail {
      margin-top: 20px;
      background: #fff;
    }
  }
}
</style>
