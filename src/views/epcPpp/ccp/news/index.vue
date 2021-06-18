<template>
  <div>
    <div class="tooltips">
      <el-form inline>
        <el-form-item label="是否推荐到宣传图">
          <el-select v-model="filterForm.isRecommendReadvertisingMap" style="width: 100px">
            <el-option label="已推荐" :value="1"></el-option>
            <el-option label="未推荐" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否推荐到头条">
          <el-select v-model="filterForm.isRecommendHeadline" style="width: 100px">
            <el-option label="已推荐" :value="1"></el-option>
            <el-option label="未推荐" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传时间">
          <DateRange
            :start-time.sync="filterForm.createStartTime"
            :end-time.sync="filterForm.createEndTime"
          ></DateRange>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="filterForm.title"
            style="width: 300px"
            placeholder="党建要闻标题"
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
      <el-button v-if="$hasPower('EpcPppCcpNewsAdd')" type="primary" @click="$router.push('news/add')"
        >新建党建要闻</el-button
      >
    </div>

    <Grid ref="table" :request="request" :filter-form.sync="filterForm" size="medium">
      <vxe-table-column type="seq" title="序号" width="60px"></vxe-table-column>
      <vxe-table-column field="title" title="党建要闻标题" align="left"></vxe-table-column>
      <vxe-table-column field="source" title="要闻来源" width="150"></vxe-table-column>
      <vxe-table-column field="isRecommendReadvertisingMap" title="是否推荐到宣传图" width="150">
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
      <vxe-table-column field="isRecommendHeadline" title="是否推荐到头条" width="150">
        <template #default="{ row }">
          <el-button v-if="row.isRecommendHeadline" type="text" disabled>已推荐</el-button>
          <el-button v-else type="text" @click="handleRecommend(row.id, 2)">推荐</el-button>
          <el-button v-if="row.isRecommendHeadline" type="text" @click="handleCancelRecommend(row.id, 2)"
            >取消</el-button
          >
        </template>
      </vxe-table-column>
      <vxe-table-column field="readingNum" title="阅读人数" width="120"></vxe-table-column>
      <vxe-table-column field="creatorName" title="上传人" width="120"></vxe-table-column>
      <vxe-table-column field="createTime" title="上传时间" width="200"></vxe-table-column>
      <vxe-table-column title="操作" width="180px" fixed="right">
        <template #default="{ row }">
          <el-button type="text" @click="view(row)">查看</el-button>
          <el-button
            v-if="row.creator === $store.state.user.id && $hasPower('EpcPppCcpNewsEdit')"
            type="text"
            @click="edit(row)"
            >修改</el-button
          >
          <el-button
            v-if="row.creator === $store.state.user.id && $hasPower('EpcPppCcpNewsRemove')"
            type="text"
            @click="remove([row])"
            >删除</el-button
          >
        </template>
      </vxe-table-column>
    </Grid>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'CcpMembers',
  components: {},
  data() {
    return {
      filterForm: {
        projectId: localStorage.getItem('projectId')
      },
      request(body) {
        return api.getCcpNews(body)
      }
    }
  },
  // 生命周期 - 实例创建完成，可访问data、computed、watch、methods上的方法和数据，未挂载到DOM，不能访问到属性，属性内容为空数组
  created() {},
  // 生命周期 - 实例挂载到DOM上，此时可以通过DOM API获取到DOM节点，属性可以访问
  mounted() {},
  methods: {
    // 刷新
    refresh() {
      this.$refs.table.refresh()
    },
    // 删除
    remove(list) {
      this.$remove(
        idList => {
          return api.removeCcpNewsById(idList.join(','))
        },
        list,
        null,
        null,
        '确定要删除要闻'
      ).then(res => this.refresh())
    },
    reset() {
      this.$refs.table.reset()
    },
    // 新增要闻
    add() {
      this.activeRow = {}
      this.editDialogVisible = true
    },
    // 编辑要闻
    edit(row) {
      this.$router.push('news/' + row.id)
    },
    // 查看
    view(row) {
      this.$router.push('news/detail/' + row.id)
    },
    /**
     * 推荐
     * @param id
     * @param {Number} type  1 宣传图 2 头条
     */
    async handleRecommend(id, type) {
      await api.addNewsRecommend(id, type)
      this.refresh()
    },
    /**
     * 取消推荐
     * @param id
     * @param {Number} type  1 宣传图 2 头条
     */
    async handleCancelRecommend(id, type) {
      await api.cancelNewsRecommend(id, type)
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less"></style>
