export default {
  data() {
    return {
      // table分页查询参数
      pageQuery: {
        page: 1,
        rows: 10
      },
      total: 0,
      // 请求方法，在api文件封装
      request: null,
      tableLoading: false,
      tableData: [],
      //是否一进来就请求
      requestFlag: true,
      // 多选数组
      selectedList: [],
      // 单选
      radioRow: {},
      // 默认封装的table
      tableType: 'ele',
      // 不要草稿状态
      noDraft: false
    }
  },
  watch: {
    // pageQuery: {
    //   handler: 'getList',
    //   deep: true
    // }
  },
  created() {
    this.initPageQuery = _.cloneDeep(this.pageQuery)
  },
  mounted() {
    //有些页面不希望一进去就直接请求数据，设置requestFlag为false，则为手动触发
    if (this.requestFlag) {
      this.getList()
    }
  },
  methods: {
    selectionChange(selections) {
      //暂时关闭跨页多选
      this.selectedList = selections
      // if (this.selectedList.length > 0) {
      //   let copy = this.selectedList.filter(item => item.page !== this.pageQuery.page)
      //   copy.push(...selections)
      //   this.selectedList = copy
      // } else {
      //   this.selectedList = selections
      // }
    },
    // 清空选中状态
    setAllSelection() {
      this.selectedList = []
      /*
       * @任务编号:重置报错问题解决
       * @开发人员:张龙
       * @日期:2020-03-18
       * @任务类型: 修改代码
       */
      // 申豪强 2020-03-19 解决自测小bug
      if (this.$refs.table) {
        this.$refs.table.setAllSelection(false) || this.$refs.table.$refs.vxeTable.setAllSelection(false)
      }
    },
    radioChange(row) {
      this.radioRow = row
    },
    /*
     * @任务编号:bug 1328||日期重置问题解决
     * @开发人员:张龙
     * @日期:2020-03-27
     * @任务类型: 修改代码
     */
    async reset() {
      this.setAllSelection()
      this.pageQuery = _.cloneDeep(this.initPageQuery)
      await this.$nextTick()
      this.search()
    },
    // 查询
    search() {
      this.pageQuery.page = 1
      this.getList()
    },
    // 页码切换
    pageChange(page) {
      this.pageQuery.page = page
      this.getList()
    },
    // 每页条数切换
    sizeChange(size) {
      this.pageQuery.rows = size
      this.getList()
    },
    // 获取列表数据
    getList() {
      if (!this.request || typeof this.request !== 'function') {
        this.$message.error('请传递请求函数')
        return
      }
      this.tableLoading = true
      this.request(this.pageQuery)
        .then(res => {
          // 基于接口统一处理
          this.tableLoading = false
          let copy = res.data.list ? res.data.list : res.data.records ? res.data.records : []
          this.tableData = this.noDraft ? copy.filter(item => item.status !== 0) : copy
          //每个数据新增页码标志：便于对比
          this.tableData.forEach(e => {
            e.page = this.pageQuery.page
          })
          this.total = res.data.total ? res.data.total : 0
          // 选中本页之前选中的数据
          let selectedListCopy = this.selectedList.filter(item => item.page === this.pageQuery.page)
          for (let item of selectedListCopy) {
            // 暂时不要跨页选中
            // this.$refs.table.setSelection(item, true, item.id)
          }
        })
        .catch(error => {
          this.tableLoading = false
        })
    }
  }
}
