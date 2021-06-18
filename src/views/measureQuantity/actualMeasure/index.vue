<template>
  <div>
    <div class="search-box">
      <el-form ref="pageQuery" :model="pageQuery" inline>
        <el-form-item label="" prop="search">
          <el-input v-model="pageQuery.search" style="width: 280px" placeholder="测量项/创建人">
            <i slot="suffix" class="el-icon-search" />
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="pageQuery.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="合格" value="1"></el-option>
            <el-option label="不合格" value="0"></el-option>
          </el-select>
          <!--          <SelectList v-model="pageQuery.status" type="standardTypeList" />-->
        </el-form-item>
        <el-form-item label="创建时间" prop="time">
          <DateRange v-model="pageQuery.time" :startTime.sync="pageQuery.beginTime" :endTime.sync="pageQuery.endTime" />
        </el-form-item>
        <template v-if="$hasPower('MeasurePCDetail')">
          <el-form-item label="批注状态">
            <el-select v-model="pageQuery.commentStatus">
              <el-option value="" label="全部"></el-option>
              <el-option :value="1" label="已批注"></el-option>
              <el-option :value="0" label="未批注"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
      <div class="btn-search">
        <el-button type="primary" icon="el-icon-search" @click="getList">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="btn-add">
      <el-button v-if="$hasPower('ActualMeasureAdd')" type="primary" icon="el-icon-plus" @click="toEdit(null)"
        >新建</el-button
      >
    </div>
    <VXTable
      v-loading="tableLoading"
      :tableData="tableData"
      :pageQuery="pageQuery"
      :total="total"
      :columns="tableColumn"
      @getList="getList"
      @pageChange="pageChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import PageMixin from '@/mixins/pageMixin'
import api from '../api/measure'

export default {
  name: 'CheckStandard',
  mixins: [PageMixin],
  data() {
    return {
      pageQuery: {
        status: ''
      },
      request: api.getMeasureRecordList,
      // 表格表头
      tableColumn: [
        { type: 'seq', title: '序号', width: 80 },
        // {
        //   field: 'engineeringName',
        //   title: '分项工程',
        //   minWidth: 100
        // },
        {
          field: 'measureStandardName',
          title: '测量项',
          minWidth: 100
        },
        {
          field: 'measureLocation',
          title: '位置',
          minWidth: 100
        },
        // {
        //   field: 'measureContent',
        //   title: '测量内容',
        //   minWidth: 100
        // },
        {
          field: 'totalPointNum',
          title: '实测点',
          minWidth: 100
        },
        {
          field: 'passNum',
          title: '合格点',
          minWidth: 100
        },
        {
          field: 'failNum',
          title: '不合格点',
          minWidth: 100
        },
        {
          field: 'name',
          title: '合格率',
          slots: {
            default: ({ row }) => {
              return [<span>{this.getPercentFun(row.passNum, row.totalPointNum)}</span>]
            }
          },
          minWidth: 100
        },
        {
          field: 'status',
          title: '状态',
          slots: {
            default: ({ row }) => {
              return [<span>{row.status === 0 ? '不合格' : '合格'}</span>]
            }
          },
          minWidth: 100
        },
        {
          field: 'reiterationStatus',
          title: '是否复测',
          minWidth: 100,
          slots: {
            default: ({ row }) => {
              return [<span>{row.reiterationStatus === 0 ? '否' : '是'}</span>]
            }
          }
        },
        {
          field: 'creatorName',
          title: '创建人',
          minWidth: 100
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 160
        },
        {
          field: 'commentStatus',
          title: '批注状态',
          visible: this.$hasPower('MeasurePCDetail'),
          minWidth: 120,
          slots: {
            default: ({ row }) => {
              return [
                <span class="comment-status" class={row.commentStatus === 1 ? 'active' : ''}>
                  {row.commentStatus ? '已批注' : '未批注'}
                </span>
              ]
            }
          }
        },
        {
          field: '',
          title: '操作',
          width: 200,
          fixed: 'right',
          slots: {
            default: ({ row }) => {
              let btns = []
              if (this.$hasPower('ActualMeasureReMeasure') && row.status === 0) {
                btns.push(
                  <el-button type="text" onClick={() => this.toReMeasure(row.id, row)}>
                    复测
                  </el-button>
                  // <el-button type="text" onClick={() => this.toRecordDetail(row.id)}>
                  //   复测
                  // </el-button>
                )
              }
              if (this.$hasPower('ActualMeasureEdit') && row.reiterationStatus === 0 && row.status === 0) {
                btns.push(
                  <el-button type="text" onClick={() => this.toEdit(row.id)}>
                    编辑
                  </el-button>
                )
              }
              if (this.$hasPower('ActualMeasureDelete') && row.reiterationStatus === 0) {
                btns.push(
                  <el-button type="text" onClick={() => this.remove(row)}>
                    删除
                  </el-button>
                )
              }
              if (this.$hasPower('ActualMeasureDetail') && (row.status === 0 || row.status === 1)) {
                btns.push(
                  <el-button type="text" onClick={() => this.toDetail(row.id)}>
                    查看
                  </el-button>
                )
              }
              return btns
            }
          }
        }
      ]
    }
  },
  methods: {
    toEdit(id) {
      id ? this.$router.push({ path: `actualMeasureEdit/${id}` }) : this.$router.push({ path: `actualMeasureEdit` })
    },
    toDetail(id) {
      this.$router.push({ path: 'actualMeasureDetail/' + id })
    },
    toReMeasure(id) {
      this.$router.push({ path: 'actualMeasureReMeasure/' + id })
    },
    toRecordDetail(id) {
      this.$router.push({ path: 'actualMeasureRecordDetail', query: { id } })
    },
    async remove(row) {
      await this.$tipRemove([row])
      await api.getMeasureRecordDelete(row.id)
      this.$message.success('删除成功')
      this.getList()
    },
    getPercentFun(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0%' : Math.round((num / total) * 10000) / 100.0 + '%'
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
</style>
