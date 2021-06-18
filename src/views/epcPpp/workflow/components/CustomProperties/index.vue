<template>
  <div>
    <div class="modal-panel">
      <div class="modal-mask" :class="{ open: modalParams.show }" @click="closeModal()"></div>
      <div class="modal-con" :class="{ open: modalParams.show }">
        <!-- 头部 start -->
        <div class="modal-header">
          <!-- <span>属性面板</span> -->

          <el-tabs v-model="modalParams.activeName" type="card" @tab-click="changeActive">
            <el-tab-pane label="常规" name="0"></el-tab-pane>
            <el-tab-pane v-if="type === 'bpmn:UserTask'" label="设置审批人" name="1"></el-tab-pane>
            <!-- <el-tab-pane label="表单操作权限" name="2"></el-tab-pane>
            <el-tab-pane label="业务回调" name="3"></el-tab-pane> -->
          </el-tabs>
          <span class="close el-icon-close" @click="closeModal()"></span>
        </div>
        <!-- 头部 end -->
        <!-- 主体部分 start -->
        <div class="modal-body">
          <el-form ref="formRef">
            <!-- 常规 start -->
            <div v-show="modalParams.activeName === '0'">
              <el-form-item label="模型名称">
                <el-input v-model="modelName"></el-input>
              </el-form-item>
              <el-form-item label="编号">
                <el-input v-model="modalParams.formData.id" disabled></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="modalParams.formData.name" :disabled="type === 'bpmn:SequenceFlow'"></el-input>
              </el-form-item>
              <el-form-item v-if="type === 'bpmn:UserTask'" label="关联表单">
                <SelectForm v-model="form.formKey" @input="formKey => updateProperties({ formKey })"></SelectForm>
                <el-button size="mini" class="el-icon-setting" @click="showFormModal()"></el-button>
              </el-form-item>
              <el-form-item v-if="type === 'bpmn:SequenceFlow'" label="条件">
                <el-radio v-model="form.flow" label="0" @change="changeFlow">无</el-radio>
                <el-radio v-model="form.flow" label="1" @change="changeFlow">通过</el-radio>
                <el-radio v-model="form.flow" label="2" @change="changeFlow">驳回</el-radio>
              </el-form-item>
            </div>
            <!-- 常规 end -->
            <!-- 设置审批人 start -->
            <div v-show="modalParams.activeName === '1'">
              <el-form-item label="">
                <el-radio v-model="modalParams.formData.assignee" label="1">指定成员</el-radio>
                <el-radio v-model="modalParams.formData.assignee" label="2">指定角色</el-radio>
                <!-- <el-radio v-model="modalParams.formData.assignee" label="3">发起人自选</el-radio> -->
                <!-- 指定成员 start -->
                <div v-show="modalParams.formData.assignee === '1'" class="add-member">
                  <el-button size="medium" type="primary" icon="el-icon-plus" @click="addMember">添加成员</el-button>
                  <span class="add-member-desc">不能超过{{ modalParams.formData.maxUser }}人</span>
                  <div class="tags">
                    <el-tag
                      v-for="(item, i) in modalParams.formData.selectUser"
                      :key="item.id"
                      size="small"
                      closable
                      @close="deleteUser(i)"
                      >{{ item.name }}</el-tag
                    >
                    <el-button
                      v-if="modalParams.formData.selectUser.length > 0"
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="deleteAllUser"
                      >清空</el-button
                    >
                  </div>
                </div>
                <!-- 指定成员 end -->
                <!-- 指定成员 start -->
                <div v-show="modalParams.formData.assignee === '2'" class="add-member">
                  <el-button size="medium" type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button>
                  <span class="add-member-desc">不能超过{{ modalParams.formData.maxRole }}个角色</span>
                  <div class="tags">
                    <el-tag
                      v-for="(item, i) in modalParams.formData.selectRole"
                      :key="item.id"
                      size="small"
                      closable
                      @close="deleteRole(i)"
                      >{{ item.name }}</el-tag
                    >
                    <el-button
                      v-if="modalParams.formData.selectRole.length > 0"
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="deleteAllRole"
                      >清空</el-button
                    >
                  </div>
                </div>
                <!-- 指定成员 end -->
              </el-form-item>
              <el-form-item label="多人审批时采用的审批方式">
                <template v-if="modalParams.formData.assignee === '1'">
                  <el-radio v-model="modalParams.formData.approvalMethod" size="medium" class="block" label="1"
                    >依次审批</el-radio
                  >
                  <el-radio v-model="modalParams.formData.approvalMethod" size="medium" class="block" label="2"
                    >会签（须所有审批人同意）</el-radio
                  >
                </template>
                <el-radio v-model="modalParams.formData.approvalMethod" size="medium" class="block" label="3"
                  >或签（一名审批人同意或拒绝即可）</el-radio
                >
              </el-form-item>
              <el-form-item v-if="modalParams.formData.assignee === '2'" label="审批人为空时">
                <!-- <el-radio v-model="modalParams.formData.autoApproval" size="medium" class="block" label="4"
                  >自动通过</el-radio
                > -->
                <el-radio v-model="modalParams.formData.autoApproval" size="medium" class="block" label="5"
                  >自动转交管理员</el-radio
                >
              </el-form-item>
            </div>
            <!-- 设置审批人 end -->
            <!-- 表单操作权限 start -->
            <div v-show="modalParams.activeName === '2'">
              <table class="table">
                <tr>
                  <th>表单字段</th>
                  <th>
                    <el-radio v-model="modalParams.formData.formStatus" label="1" @change="changeFormStatus"
                      >可编辑</el-radio
                    >
                  </th>
                  <th>
                    <el-radio v-model="modalParams.formData.formStatus" label="2" @change="changeFormStatus"
                      >只读</el-radio
                    >
                  </th>
                  <th>
                    <el-radio v-model="modalParams.formData.formStatus" label="3" @change="changeFormStatus"
                      >隐藏</el-radio
                    >
                  </th>
                </tr>
                <tr v-for="(item, i) in tableForm" :key="i">
                  <td>{{ item.name }}</td>
                  <td>
                    <el-radio v-model="item.options.status" label="1" @change="changeFormItemStatus(item, $event)"
                      >可编辑</el-radio
                    >
                  </td>
                  <td>
                    <el-radio v-model="item.options.status" label="2" @change="changeFormItemStatus(item, $event)"
                      >只读</el-radio
                    >
                  </td>
                  <td>
                    <el-radio v-model="item.options.status" label="3" @change="changeFormItemStatus(item, $event)"
                      >隐藏</el-radio
                    >
                  </td>
                </tr>
              </table>
            </div>
            <!-- 表单操作权限 end -->
            <!-- 业务回调 start -->
            <div v-show="modalParams.activeName === '3'">
              <div class="tags business">
                <span>已选择：</span>
                <el-tag v-for="item in modalParams.formData.businessCallback" :key="item.id" size="small" closable>{{
                  item.name
                }}</el-tag>
                <el-button
                  v-if="modalParams.formData.businessCallback.length > 0"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  >清空</el-button
                >
              </div>
              <el-input placeholder="请输入">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <el-tree
                show-checkbox
                default-expand-all
                :data="modalParams.formData.businessTree"
                check-on-click-node
                class="el-tree"
              ></el-tree>
            </div>
            <!-- 业务回调 end -->
          </el-form>
        </div>
        <!-- 主体部分 end -->
        <!-- 底部操作栏 start -->
        <div class="modal-footer">
          <el-button size="medium" @click="closeModal()">取消</el-button>
          <el-button size="medium" type="primary" @click="saveModalData()">保存</el-button>
        </div>
        <!-- 底部操作栏 end -->
      </div>
    </div>
    <!-- 添加成员组件 start -->
    <SelectUser
      ref="selectUserRef"
      v-model="modalParams.formData.selectUser"
      :max="modalParams.formData.maxUser"
      @change="changeUser"
    ></SelectUser>
    <!-- 添加成员组件 start -->
    <!-- 添加角色组件 start -->
    <SelectRole
      ref="selectRoleRef"
      v-model="modalParams.formData.selectRole"
      :max="modalParams.formData.maxRole"
      @change="changeRole"
    ></SelectRole>
    <!-- 添加角色组件 end -->
    <!-- <div v-show="element" class="custom-properties">
      <div class="wrap">
        <el-form label-width="68px" label-position="left">
          <el-form-item v-if="type === 'bpmn:SequenceFlow'" label="条件">
            <el-radio v-model="form.flow" label="0" @change="changeFlow">无</el-radio>
            <el-radio v-model="form.flow" label="1" @change="changeFlow">通过</el-radio>
            <el-radio v-model="form.flow" label="2" @change="changeFlow">驳回</el-radio>
          </el-form-item>
          <el-form-item v-if="type === 'bpmn:UserTask'" label="审批人">
            <SelectUser2
              v-model="form.candidateUsers"
              :multiple="true"
              @input="candidateUsers => updateProperties({ candidateUsers: candidateUsers.join(',') })"
            ></SelectUser2>
          </el-form-item>
          <el-form-item v-if="type === 'bpmn:UserTask'" label="审批角色">
            <SelectRole2
              v-model="form.candidateGroups"
              @input="candidateGroups => updateProperties({ candidateGroups: candidateGroups.join(',') })"
            ></SelectRole2>
          </el-form-item>
          <el-form-item v-if="type === 'bpmn:StartEvent' || _.includes(type, 'Task')" label="关联表单">
            <SelectForm v-model="form.formKey" @input="formKey => updateProperties({ formKey })"></SelectForm>
            <el-button size="mini" class="el-icon-setting" @click="showFormModal()"></el-button>
          </el-form-item>
        </el-form>
      </div>
    </div> -->
    <el-dialog top="10vh" title="表单授权" width="50%" append-to-body :visible.sync="modalStatus">
      <table class="table">
        <tr>
          <th>表单字段</th>
          <th>
            <el-radio v-model="modalParams.formData.formStatus" label="1" @change="changeFormStatus">可编辑</el-radio>
          </th>
          <th>
            <el-radio v-model="modalParams.formData.formStatus" label="2" @change="changeFormStatus">只读</el-radio>
          </th>
          <th>
            <el-radio v-model="modalParams.formData.formStatus" label="3" @change="changeFormStatus">隐藏</el-radio>
          </th>
        </tr>
        <tr v-for="(item, i) in tableForm" :key="i">
          <td>{{ item.name }}</td>
          <td>
            <el-radio v-model="item.options.status" label="1" @change="changeFormItemStatus(item, $event)"
              >可编辑</el-radio
            >
          </td>
          <td>
            <el-radio v-model="item.options.status" label="2" @change="changeFormItemStatus(item, $event)"
              >只读</el-radio
            >
          </td>
          <td>
            <el-radio v-model="item.options.status" label="3" @change="changeFormItemStatus(item, $event)"
              >隐藏</el-radio
            >
          </td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modalStatus = false">取 消</el-button>
        <el-button type="primary" @click="saveModal()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectForm from '../SelectForm'
import SelectUser from './SelectUser'
import SelectRole from './SelectRole'

export default {
  name: 'CustomProperties',
  components: { SelectRole, SelectUser, SelectForm },
  props: ['modeler'],
  data() {
    return {
      modalStatus: false,
      fieldsForm: {
        name: '请假表',
        id: 999,
        a: [],
        b: [],
        c: true,
        d: false,
        fields: [
          {
            label: '请假原因',
            id: 1,
            a: [],
            b: [],
            c: true,
            d: false
          },
          {
            label: '请假具体原因',
            id: 2,
            a: [],
            b: [],
            c: true,
            d: false
          },
          {
            label: '请假时间',
            id: 3,
            a: [],
            b: [],
            c: true,
            d: false
          },
          {
            label: '备注',
            id: 4,
            a: [],
            b: [],
            c: true,
            d: false
          }
        ]
      },
      tableForm: [],
      element: {},
      form: {},
      updateNameFirst: true,
      parentList: [],
      parentListIds: [],
      modelName: this.$route.query.name || '', // 模型名字
      // 模态框属性
      modalParams: {
        show: false,
        activeName: '0',
        formData: {
          id: '',
          name: '',
          assignee: '1',
          approvalMethod: '3',
          formStatus: '1', // 表单权限
          autoApproval: '5', // 自动审批
          selectUser: [], // 选择的用户
          maxUser: 20, // 最多选择几个用户
          selectRole: [], // 选择的角色
          maxRole: 20, // 最多选择几个角色
          businessCallback: [
            {
              id: 1,
              name: '功能名称1'
            },
            {
              id: 2,
              name: '功能名称2'
            }
          ], // 业务回调
          businessTree: [
            {
              id: 1,
              label: 'CIM6D-智慧施工',
              disabled: true,
              children: [
                {
                  id: 2,
                  label: '成本管理',
                  disabled: true,
                  children: [
                    {
                      id: 5,
                      label: '功能名称1'
                    },
                    {
                      id: 6,
                      label: '功能名称2'
                    }
                  ]
                },
                {
                  id: 3,
                  label: '质量管理',
                  disabled: true,
                  children: [
                    {
                      id: 7,
                      label: '功能名称3'
                    },
                    {
                      id: 8,
                      label: '功能名称4'
                    }
                  ]
                },
                {
                  id: 4,
                  label: '合同管理',
                  disabled: true,
                  children: [
                    {
                      id: 9,
                      label: '功能名称5'
                    },
                    {
                      id: 10,
                      label: '功能名称6'
                    }
                  ]
                }
              ]
            }
          ] // 业务回调树
        }
      },
      taskConfigList: [],
      flowConfigList: [] // 模型-连线配置
    }
  },
  computed: {
    type() {
      return _.get(this.element, 'type')
    },
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    // 用户列表
    roleList() {
      let roleList = this.$store.state.workflow.roleList
      let list = []
      let ids = []
      const arrayEach = array => {
        array.map(item => {
          item.id = item.targetId || item.id
          item.newId = item.parentId + '_' + (item.targetId || item.id)
          if (!ids.includes(item.id)) {
            ids.push(item.id)
            list.push(item)
          }
          if (item.children) {
            arrayEach(item.children)
          }
        })
      }
      arrayEach(roleList)
      return list
    }
  },
  watch: {
    'form.name'(val) {
      if (this.updateNameFirst) {
        // 防止改变node触发箭头name 更新事件
        this.updateNameFirst = false
        return false
      }
      if (this.form.$type === 'bpmn:SequenceFlow') {
        if (_.trim(val) === '同意') {
          const newCondition = this.modeler._moddle.create('bpmn:FormalExpression', {
            body: '${passCount==total}'
          })
          this.updateProperties({
            conditionExpression: newCondition
          })
        } else if (_.trim(val) === '拒绝') {
          const newCondition = this.modeler._moddle.create('bpmn:FormalExpression', {
            body: '${rejectCount>0}'
          })
          this.updateProperties({
            conditionExpression: newCondition
          })
        }
      }
    },
    'form.formKey'(val) {
      // this.showFormModal()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      // console.log(111, this.$parent.modeler)
      this.modeler.on('selection.changed', e => {
        this.updateNameFirst = true
        const element = e.newSelection[0]
        if (!element) {
          this.element = null
          return false
        }
        this.element = element
        let form = {
          ...element.businessObject,
          ...element.businessObject.$attrs
        }
        //form.assignee = _.compact((form.assignee || '').split(',') || [])
        form.candidateUsers = _.compact((form.candidateUsers || '').split(',') || [])
        form.candidateGroups = _.compact((form.candidateGroups || '').split(',') || [])
        // if (!form.assignee) {
        //   form.assignee = '1'
        // }
        // 读取流程审核/驳回线
        let condition = '0'
        if (this.type === 'bpmn:SequenceFlow') {
          if (!element.businessObject.conditionExpression) {
            form.flow = '0'
            condition = '0'
          } else {
            if (element.businessObject.name === '通过') {
              form.flow = '1'
              condition = '1'
            } else {
              form.flow = '2'
              condition = '2'
            }
          }
          let activitiId = element.id || ''
          let activitiIdList = _.map(this.flowConfigList, 'activitiId')
          let index = activitiIdList.indexOf(activitiId)
          if (index < 0) {
            this.flowConfigList.push({
              activitiId,
              condition,
              modelId: this.$route.params.id,
              projectId: this.projectId
            })
          }
          // console.log(111, activitiId, activitiIdList, this.flowConfigList)
        }
        this.form = form
        // console.log(111, this, form)

        this.openModal()
      })
      this.modeler.on('element.changed', e => {
        const { element } = e
        if (!element) return
        if (element.id === this.form.id) {
          this.form.name = element.businessObject.name
          this.form = { ...this.form }
        }
      })
      setTimeout(() => {
        this.initTaskConfigList()
      }, 500)
    },
    // 模型-任务配置
    initTaskConfigList() {
      let parentModeler = this.$parent.modeler._definitions.rootElements[0]
      let flowElements = parentModeler.flowElements
      let parentTaskConfigList = this.$parent.taskConfigList
      let taskConfigList = []
      if (parentTaskConfigList.length > 0) {
        this.taskConfigList = parentTaskConfigList
        // console.log(333, this.taskConfigList)
        return
      }
      flowElements.map(item => {
        if (item.$type === 'bpmn:UserTask') {
          taskConfigList.push({
            taskDefinitionKey: item.id,
            auditMode: 3,
            modelId: this.$route.params.id,
            projdecId: this.projectId,
            roleIds: '',
            type: 1,
            userIds: ''
          })
        }
      })
      // console.log(222, parentTaskConfigList, taskConfigList)
      this.taskConfigList = taskConfigList
    },
    // 选项卡切换
    changeActive(e) {
      let activeName = e.index
      if (activeName === '2') {
        const template = this.$parent.$refs['dragFormRef'].getJSON()
        let tableForm = template.list || []
        this.tableForm = tableForm
      }
    },
    // 打开属性面板
    openModal() {
      if (!this.type) {
        return
      }
      this.$nextTick(() => {
        this.modalParams.activeName = '0'
        this.modalParams.show = true
        this.modalParams.formData.name = this.element.businessObject.name
        this.modalParams.formData.id = this.element.id
        let taskDefinitionKey = _.find(this.taskConfigList, { taskDefinitionKey: this.element.id })
        this.modalParams.formData.assignee = taskDefinitionKey ? taskDefinitionKey.type + '' : '1'
        let candidateUsers = taskDefinitionKey ? taskDefinitionKey.userIds.split(',') : this.form.candidateUsers
        let candidateGroups = taskDefinitionKey ? taskDefinitionKey.roleIds.split(',') : this.form.candidateGroups
        let selectUser = this.roleList.filter(e => candidateUsers.includes(e.id))
        let selectRole = this.roleList.filter(e => candidateGroups.includes(e.id))
        this.modalParams.formData.selectUser = selectUser
        this.modalParams.formData.selectRole = selectRole
        this.modalParams.formData.approvalMethod = taskDefinitionKey
          ? taskDefinitionKey.type === '2'
            ? '3'
            : taskDefinitionKey.auditMode + ''
          : '3'
        // console.log('打开属性面板', taskDefinitionKey, this.modalParams.formData)
      })
    },
    // 关闭属性面板
    closeModal() {
      this.modalParams.show = false
    },
    // 保存属性面板数据
    saveModalData() {
      if (!this.modelName) {
        this.$message.error('请输入模型名称')
        return
      }
      let parentModeler = this.$parent.modeler._definitions.rootElements[0]
      parentModeler.name = this.modelName
      let name = this.modalParams.formData.name
      let candidateUsers = _.map(this.modalParams.formData.selectUser, 'id')
      let candidateGroups = _.map(this.modalParams.formData.selectRole, 'id')
      if (this.type === 'bpmn:UserTask' && this.modalParams.formData.assignee === '1' && candidateUsers.length === 0) {
        this.$message.error('请添加成员')
        return
      }
      if (this.type === 'bpmn:UserTask' && this.modalParams.formData.assignee === '2' && candidateGroups.length === 0) {
        this.$message.error('请添加角色')
        return
      }
      // 更新名称
      if (this.type !== 'bpmn:SequenceFlow') {
        this.updateProperties({ name })
      }
      let taskConfig = {
        taskDefinitionKey: this.modalParams.formData.id,
        auditMode:
          this.modalParams.formData.assignee === '2'
            ? this.modalParams.formData.autoApproval
            : this.modalParams.formData.approvalMethod,
        modelId: this.$route.params.id,
        projdecId: this.projectId,
        roleIds: this.modalParams.formData.assignee === '2' ? candidateGroups.join(',') : '',
        type: this.modalParams.formData.assignee,
        userIds: this.modalParams.formData.assignee === '1' ? candidateUsers.join(',') : ''
      }
      let taskIds = _.map(this.taskConfigList, 'taskDefinitionKey')
      let index = taskIds.indexOf(taskConfig.taskDefinitionKey)
      if (index < 0) {
        this.taskConfigList.push(taskConfig)
      } else {
        this.taskConfigList[index] = Object.assign({}, taskConfig)
      }
      // console.log('保存属性面板数据', this.modalParams, taskConfig, this.taskConfigList)
      this.$parent.taskConfigList = this.taskConfigList
      this.$parent.flowConfigList = this.flowConfigList
      // console.log('保存属性面板数据', name, candidateUsers, candidateGroups)
      this.modalParams.show = false
    },
    // 编辑表单权限
    changeFormStatus(status) {
      this.modalParams.formData.formStatus = status
      this.tableForm.map(item => {
        item.options.status = status
        item.options.hidden = status === '3'
        item.options.disabled = status === '2'
      })
    },
    // 改变表单字段权限
    changeFormItemStatus(item, status) {
      item.options.hidden = status === '3'
      item.options.disabled = status === '2'
      let statusList = _.map(this.tableForm, 'options.status')
      this.modalParams.formData.formStatus = statusList[statusList.length - 1]
      // console.log('改变表单字段权限', this.tableForm, statusList)
    },
    // 添加成员
    addMember() {
      this.$refs.selectUserRef.modalStatus = true
    },
    // 选择用户
    changeUser(array) {
      this.modalParams.formData.selectUser = array
    },
    // 删除用户
    deleteUser(i) {
      this.modalParams.formData.selectUser.splice(i, 1)
    },
    // 清除用户
    deleteAllUser() {
      this.modalParams.formData.selectUser = []
    },
    // 添加角色
    addRole() {
      this.$refs.selectRoleRef.modalStatus = true
    },
    // 选择角色
    changeRole(array) {
      this.modalParams.formData.selectRole = array
    },
    // 删除角色
    deleteRole(i) {
      this.modalParams.formData.selectRole.splice(i, 1)
    },
    // 清除角色
    deleteAllRole() {
      this.modalParams.formData.selectRole = []
    },
    // 改变值
    changeFlow(e) {
      let body = ''
      let name = ''
      let conditionExpression = ''
      let activitiIdList = _.map(this.flowConfigList, 'activitiId')
      let index = activitiIdList.indexOf(this.form.id)
      this.flowConfigList[index].condition = e
      switch (e) {
        case '0':
          name = ''
          body = ''
          break
        case '1':
          name = '通过'
          body = '${flag==1}'
          break
        case '2':
          name = '驳回'
          body = '${flag==2}'
          break
      }
      this.form.name = name
      this.element.name = name
      this.modalParams.formData.name = name
      this.updateProperties(this.element, 'name')
      if (body) {
        let moddle = this.modeler.get('moddle')
        conditionExpression = moddle.create('bpmn:FormalExpression', {
          body
        })
      }
      this.element.conditionExpression = conditionExpression
      this.updateProperties(this.element, {
        conditionExpression
      })
    },
    // 获取父组件控件列表
    getParentList() {
      let parentList = []
      let parentListIds = []
      this.$parent.form.modelFormPermission.map(item => {
        parentList.push(item)
        parentListIds.push(item.activitiId)
      })
      this.parentList = parentList
      this.parentListIds = parentListIds
    },
    // 同步更新流程图
    updateProperties(properties) {
      const modeling = this.modeler.get('modeling')
      modeling.updateProperties(this.element, properties)
    },
    // 显示表单模态框
    showFormModal() {
      this.getParentList()
      if (!this.form.formKey) {
        return
      }
      this.axios.workflow.get(`/custom/form/get/${this.form.formKey}`, {}).then(res => {
        let datas = res.data
        let template = datas.template ? JSON.parse(datas.template) : {}
        let list = template.list || []
        let controls = _.find(this.parentList, { activitiId: this.element.id })
        let controlsList = controls ? controls.controls : []
        list.map((item, i) => {
          let controlsItem = _.find(controlsList, { controlId: item.id })
          // console.log(222, controlsList, controlsItem, item)
          let actionFlag = '1'
          if (controlsItem) {
            actionFlag = controlsItem.actionFlag + 1 + ''
            item.options.status = controlsItem.actionFlag + 1 + ''
            item.options.hidden = controlsItem.actionFlag === 2
            item.options.disabled = controlsItem.actionFlag === 1
          }
          item.options.status = actionFlag
          this.modalParams.formData.formStatus = actionFlag
          item.formId = datas.id
        })
        this.tableForm = list
        this.modalStatus = true
      })
    },
    // 保存表单权限
    saveModal() {
      let newItem = {
        activitiId: this.element.id,
        controls: [],
        formId: '',
        modelId: this.$parent.id,
        projectId: this.projectId
      }
      this.tableForm.map(item => {
        newItem.formId = item.formId
        newItem.controls.push({
          controlId: item.id,
          actionFlag: parseInt(item.options.status) - 1
        })
      })
      this.modalStatus = false
      let index = this.parentListIds.indexOf(newItem.activitiId)
      if (index < 0) {
        this.parentList.push(newItem)
        this.parentListIds.push(this.element.id)
      } else {
        this.parentList[index] = newItem
      }
      this.$parent.form.modelFormPermission = this.parentList
    }
  }
}
</script>

<style scoped lang="less">
@import url('./tree.less');
.el-tree {
  margin-top: 15px;
}
.modal-panel {
  position: relative;
  top: 0;
  right: 0;
  z-index: 1001;
  // display: none;
  .block {
    display: block;
  }
  .modal-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    transition: all 0.4s;
    opacity: 0;
    visibility: hidden;
    &.open {
      opacity: 1;
      visibility: visible;
    }
  }
  .modal-con {
    position: fixed;
    width: 550px;
    height: 100%;
    top: 0;
    right: -600px;
    background: #fff;
    display: flex;
    flex-direction: column;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s;
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      // height: 50px;
      // border-bottom: 1px #f5f5f5 solid;
      .el-tabs {
        flex: 1;
        /deep/.el-tabs__header {
          margin: 0;
          .el-tabs__item {
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            &.is-active {
              padding: 0 30px;
            }
          }
        }
      }
      .close {
        position: absolute;
        right: 15px;
        cursor: pointer;
        transition: all 0.4s;
        font-size: 20px;
        color: #ccc;
        &:hover {
          transform: rotate(360deg);
        }
      }
    }
    .modal-body {
      flex: 1;
      margin: 15px 20px;
      /deep/.el-form-item {
        border-bottom: 1px #eee solid;
        margin-bottom: 15px;
        padding-bottom: 15px;
        .el-form-item__label {
          float: none;
        }
      }
      .add-member {
        margin-top: 15px;
      }
      .add-member-desc {
        margin-left: 15px;
        font-size: 14px;
        color: #ccc;
      }
      .tags {
        margin-top: 10px;
        .el-tag {
          margin-right: 10px;
          /deep/.el-tag__close {
            transition: all 0.4s;
          }
        }
        &.business {
          margin: 0 0 15px;
        }
      }
    }
    .modal-footer {
      padding: 0 15px;
      border-top: 1px #f5f5f5 solid;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: 60px;
    }
    &.open {
      opacity: 1;
      visibility: visible;
      right: 0;
    }
  }
}
.table {
  width: 100%;
  font-size: 13px;
  tr {
    th {
      background: #f8f8f9;
      color: #909399;
      font-weight: bold;
      /deep/.el-radio__label {
        font-weight: bold;
        color: #909399;
      }
    }
    th,
    td {
      padding: 10px 0;
      border-bottom: 1px solid #ebeef5;
      text-align: center;
    }
  }
}
// 旧的样式
.wrap {
  background-color: rgba(248, 248, 248, 0.71);
  height: 100%;
  .el-form {
    * {
      font-size: 13px;
    }
    padding: 15px 15px 0;
    .el-form-item {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      /deep/ .el-form-item__label::after {
        content: unset;
      }
    }
  }
  /deep/ .el-dialog {
    .el-table {
      margin-bottom: 20px;
    }
    h2 {
      font-size: 18px;
      margin-bottom: 10px;
    }
  }
}
</style>
<style>
.vue-treeselect__portal-target {
  z-index: 300000 !important;
  height: 300px;
  color: #666;
}
</style>
