/**
 * 甘特图数据转为后端自定义的数据结构
 * @param ganttData
 * @returns {{taskList: *, taskLinkList: *}}
 */
export function ganttData2customData(ganttData) {
  const taskList = ganttData.data.map(e => ({
    planStartDate: moment(e.start_date).format('YYYY-MM-DD HH:mm:ss'),
    planEndDate: moment(e.end_date).format('YYYY-MM-DD HH:mm:ss'),
    planDuration: e.duration,
    taskName: e.text,
    taskUniqueId: e.id,
    progress: e.progress,
    parentTaskUniqueId: e.parent
  }))
  const taskLinkList = ganttData.links.map(e => ({
    sourceId: e.source,
    targetId: e.target,
    linkType: e.type
  }))
  return {
    taskList,
    taskLinkList
  }
}

/**
 * 后端自定义的数据转为甘特图数据结构
 * @param customData
 * @returns {{data: [], links: []}}
 */
export function customData2ganttData(customData) {
  let ganttData = {
    data: [],
    links: []
  }
  ganttData.data = customData.baseList.map(e => ({
    ...e,
    start_date: e.planStartDate,
    end_date: e.planEndDate,
    duration: e.planDuration,
    text: e.taskName,
    id: e.taskUniqueId,
    progress: e.progress,
    parent: e.parentTaskUniqueId || '0'
  }))
  ganttData.links = customData.linkList.map(e => ({
    source: e.sourceId,
    target: e.targetId,
    type: '0'
  }))
  return ganttData
}
