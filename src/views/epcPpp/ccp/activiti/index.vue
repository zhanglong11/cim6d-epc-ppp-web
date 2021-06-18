<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="是否推荐到宣传图">
          <el-select v-model="filterForm.isRecommendReadvertisingMap" style="width: 100px">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐到头条">
          <el-select v-model="filterForm.isRecommendHeadline" style="width: 100px">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="filterForm.status" style="width: 100px">
            <el-option label="未开始" :value="1"></el-option>
            <el-option label="进行中" :value="2"></el-option>
            <el-option label="已结束" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filterForm.search"
            style="width: 300px"
            placeholder="活动标题/活动参与人/活动地点/活动创建人"
            suffix-icon="el-icon-search"
            @keyup.enter.native="refresh"
          />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="refresh">搜索</el-button>
            <el-button icon="el-icon-reset" @click="reset">重置</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="活动时间">
          <DateRange
            :start-time.sync="filterForm.activityStartTime"
            :end-time.sync="filterForm.activityEndTime"
          ></DateRange>
        </el-form-item>
        <el-form-item label="活动创建时间">
          <DateRange
            :start-time.sync="filterForm.createStartTime"
            :end-time.sync="filterForm.createEndTime"
          ></DateRange>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button v-if="$hasPower('EpcPppCcpActivitiAdd')" type="primary" icon="el-icon-plus" @click="add"
            >新建活动</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm" size="medium">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="title" title="活动名称"></vxe-table-column>
      <vxe-table-column field="startTime" title="活动开始时间"></vxe-table-column>
      <vxe-table-column field="endTime" title="活动结束时间"></vxe-table-column>
      <vxe-table-column field="address" title="活动地点"></vxe-table-column>
      <vxe-table-column field="participantNames" title="活动参与人"></vxe-table-column>
      <vxe-table-column
        field="status"
        title="活动状态"
        :formatter="({ cellValue }) => ['', '未开始', '进行中', '已结束'][cellValue]"
      ></vxe-table-column>
      <vxe-table-column field="todo" title="是否推荐到宣传图">
        <template #default="{ row }">
          <el-button v-if="row.isRecommendReadvertisingMap" type="text" disabled>已推荐</el-button>
          <el-button
            v-else
            type="text"
            :disabled="!row.imageId"
            :title="row.imageId ? '' : '必须设置了宣传图才能推荐到首页'"
            @click="handleRecommend(row.id, 1)"
            >推荐</el-button
          >
          <el-button v-if="row.isRecommendReadvertisingMap" type="text" @click="handleCancelRecommend(row.id, 1)"
            >取消</el-button
          >
        </template>
      </vxe-table-column>
      <vxe-table-column field="todo" title="是否推荐到头条">
        <template #default="{ row }">
          <el-button v-if="row.isRecommendHeadline" type="text" disabled>已推荐</el-button>
          <el-button v-else type="text" @click="handleRecommend(row.id, 2)">推荐</el-button>
          <el-button v-if="row.isRecommendHeadline" type="text" @click="handleCancelRecommend(row.id, 2)"
            >取消</el-button
          >
        </template>
      </vxe-table-column>
      <vxe-table-column field="creatorName" title="活动创建人"></vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"></vxe-table-column>
      <vxe-table-column title="操作" width="180px" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="view(row)">查看</el-button>
          <el-button
            v-if="row.creator === $store.state.user.id && $hasPower('EpcPppCcpActivitiEdit') && row.status < 3"
            type="text"
            @click="edit(row)"
            >修改</el-button
          >
          <el-button
            v-if="
              row.creator === $store.state.user.id &&
              $hasPower('EpcPppCcpActivitiRemove') &&
              row.startTime > moment().format('YYYY-MM-DD HH:mm:ss')
            "
            type="text"
            @click="remove([row])"
            >删除</el-button
          >
          <el-button v-if="row.status === 3" type="text" @click="handleResultEdit(row)">活动成果</el-button>
        </template>
      </vxe-table-column>
    </Grid>
    <Detail :id="activeRow.id" :visible.sync="viewDialogVisible"></Detail>
    <Edit :visible.sync="editDialogVisible" :data="activeRow"></Edit>
    <Result manage :visible.sync="resultEditDialogVisible" :data="activeRow"></Result>
  </div>
</template>

<script>
import Detail from './components/Detail'
import Edit from './components/Edit'
import Result from './components/Result'
import api from '../api'
export default {
  name: 'CcpActiviti',
  components: { Detail, Edit, Result },
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request: api.getCcpActiviti,
      // 当前活动行的数据
      activeRow: {},
      // 查看弹窗是否显示
      viewDialogVisible: false,
      // 编辑弹窗是否显示
      editDialogVisible: false,
      // 活动成果弹窗是否显示
      resultEditDialogVisible: false
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {
      this.$refs.table.refresh()
    },
    remove(list) {
      this.$remove(
        idList => {
          return api.removeCcpActivitiById(idList.join(','))
        },
        list,
        null,
        null,
        '确定要删除活动'
      ).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    },
    // 新增活动
    add() {
      this.editDialogVisible = true
    },
    // 编辑活动
    edit(row) {
      this.activeRow = _.cloneDeep(row)
      this.editDialogVisible = true
    },
    // 查看
    view(row) {
      this.activeRow = _.cloneDeep(row)
      this.viewDialogVisible = true
    },
    // 活动成果
    handleResultEdit(row) {
      this.activeRow = _.cloneDeep(row)
      this.resultEditDialogVisible = true
    },
    /**
     * 推荐
     * @param id
     * @param {Number} type  1 宣传图 2 头条
     */
    async handleRecommend(id, type) {
      await api.addActivitiRecommend(id, type)
      this.refresh()
    },
    /**
     * 取消推荐
     * @param id
     * @param {Number} type  1 宣传图 2 头条
     */
    async handleCancelRecommend(id, type) {
      await api.cancelActivitiRecommend(id, type)
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
