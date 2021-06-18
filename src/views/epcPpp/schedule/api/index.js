import { schedule } from '@/utils/axios'
export default {
  getScheduleYearAnalyzeTable() {
    return Promise.resolve({
      data: [
        {
          name: 'hhh'
        }
      ]
    })
  },

  //导入进度文件
  importScheduleFile(formData) {
    return schedule.post('plan/import', formData)
  },
  //进度文件列表
  getSchedulePlanList(body) {
    return schedule.post('plan/list', body)
  },
  //删除进度文件
  removeSchedulePlanById(id) {
    return schedule.get('plan/delete/' + id)
  },
  // 进度管理-查询进度任务列表 @author yangjiaqi
  getScheduleTaskList(body) {
    return schedule.post('task/list', body)
  },
  // 进度管理-查询进度任务列表 @author yangjiaqi
  getScheduleTaskById(id) {
    return schedule.get('task/get/' + id)
  },

  //进度管理-提交进度文件 @author yangjiaqi
  submitSchedulePlan(data) {
    return schedule.post('plan/submit', { ...data, projectId: localStorage.getItem('projectId') })
  },
  //进度分析列表
  getScheduleAnalyzeList(data) {
    return schedule.post('task/analysis/list', { ...data, projectId: localStorage.getItem('projectId') })
  },
  // 进度周期分析查询
  getPeriodAnalyze(data) {
    return schedule.post('task/cycle/list', { ...data, projectId: localStorage.getItem('projectId') })
  },
  //进度管理-进度周期分析查询(按单位分组) @author yangjiaqi
  getCompanyPeriodAnalyze(data) {
    return schedule.post('task/company/cycle/list', { ...data, projectId: localStorage.getItem('projectId') })
  },
  //进度管理-进度年度分析查询 @author yangjiaqi
  getYearCompareAnalyze(data) {
    return schedule.post('task/year/list', { ...data, projectId: localStorage.getItem('projectId') })
  },

  // 获取任务关联的构件
  getTaskBindBimById(id) {
    return schedule.get('bim/get/' + id)
  }, // 进度关联模型
  scheduleTaskBindBim(body) {
    return schedule.post('bim/bind', body)
  },
  // 进度取消关联模型
  scheduleTaskUnBindBim(taskId) {
    return schedule.get('bim/unBind/' + taskId)
  }
}
